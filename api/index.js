const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// ─── Models (Embedded for Vercel) ─────────────────────────────────────────────

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  googleId: { type: String },
  picture: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

const compressionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileName: { type: String, required: true },
  fileType: { type: String, required: true },
  originalSize: { type: Number, required: true },
  compressedSize: { type: Number, required: true },
  compressionRatio: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Compression = mongoose.models.Compression || mongoose.model('Compression', compressionSchema);

// ─── Config ───────────────────────────────────────────────────────────────────

const app = express();
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'shrink_now_secret_2026_secure_key';
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || '';

// Manual CORS Middleware
app.use((req, res, next) => {
  const origin = req.headers.origin || '*';
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// ─── Global Settings ──────────────────────────────────────────────────────────

let appSettings = {
  maintenanceMode: false,
  registrationEnabled: true
};

// ─── Database Connection ──────────────────────────────────────────────────────

let isConnected = false;
async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) return;
  if (!MONGO_URI) return;
  try {
    await mongoose.connect(MONGO_URI);
    isConnected = true;
  } catch (err) {
    console.error('DB Error:', err.message);
  }
}

app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Maintenance Middleware
app.use((req, res, next) => {
  if (appSettings.maintenanceMode) {
    if (!req.path.startsWith('/api/admin') && req.path !== '/api/auth/login' && req.path !== '/api/auth/profile') {
      return res.status(503).json({ message: 'System is currently under maintenance.' });
    }
  }
  next();
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const findUser = async (email) => {
  if (isConnected) return await User.findOne({ email });
  return null;
};

const findUserById = async (id) => {
  if (isConnected) return await User.findById(id).select('-password');
  return null;
};

const saveUser = async (userData) => {
  const finalUserData = { 
    ...userData, 
    role: userData.email === 'bhumigarg704@gmail.com' ? 'admin' : (userData.role || 'user') 
  };
  if (isConnected) {
    const user = new User(finalUserData);
    return await user.save();
  }
  return null;
};

// ─── Auth Middleware ──────────────────────────────────────────────────────────

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await findUserById(req.user?.id);
    if (user && (user.role === 'admin' || user.email.toLowerCase().trim() === 'bhumigarg704@gmail.com')) {
      return next();
    }
    res.status(403).json({ message: 'Access denied. Admin only.' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

// ─── Routes ───────────────────────────────────────────────────────────────────

// Auth
app.post('/api/auth/signup', async (req, res) => {
  try {
    if (!appSettings.registrationEnabled) return res.status(403).json({ message: 'Registration disabled' });
    const { name, email, password } = req.body;
    let user = await findUser(email);
    if (user) return res.status(400).json({ message: 'User exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await saveUser({ name, email, password: hashedPassword });
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUser(email);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    
    // Auto-promote
    if (email.toLowerCase().trim() === 'bhumigarg704@gmail.com' && user.role !== 'admin') {
      user.role = 'admin';
      await User.findByIdAndUpdate(user._id, { role: 'admin' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/auth/google', async (req, res) => {
  try {
    const { name, email, googleId, picture } = req.body;
    let user = await findUser(email);
    if (!user) {
      const pw = await bcrypt.hash(Math.random().toString(36), 10);
      user = await saveUser({ name, email, password: pw, googleId, picture });
    }
    if (email.toLowerCase().trim() === 'bhumigarg704@gmail.com' && user.role !== 'admin') {
      user.role = 'admin';
      await User.findByIdAndUpdate(user._id, { role: 'admin' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, picture: user.picture } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/auth/profile', auth, async (req, res) => {
  const user = await findUserById(req.user.id);
  res.json(user);
});

// Admin
app.get('/api/admin/stats', auth, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCompressions = await Compression.countDocuments();
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(10).select('-password');
    const recentCompressions = await Compression.find().sort({ createdAt: -1 }).limit(10);
    res.json({ totalUsers, totalCompressions, recentUsers, recentCompressions, settings: appSettings });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/admin/settings', auth, isAdmin, (req, res) => {
  const { maintenanceMode, registrationEnabled } = req.body;
  if (maintenanceMode !== undefined) appSettings.maintenanceMode = maintenanceMode;
  if (registrationEnabled !== undefined) appSettings.registrationEnabled = registrationEnabled;
  res.json({ message: 'Settings updated', settings: appSettings });
});

// Compression History
app.post('/api/compression/save', auth, async (req, res) => {
  try {
    const { fileName, fileType, originalSize, compressedSize, compressionRatio } = req.body;
    await new Compression({ userId: req.user.id, fileName, fileType, originalSize, compressedSize, compressionRatio }).save();
    res.status(201).json({ message: 'Saved' });
  } catch {
    res.status(500).json({ message: 'Error saving' });
  }
});

app.get('/api/compression/history', auth, async (req, res) => {
  const history = await Compression.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json(history);
});

// Forgot/Reset Password
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await findUser(email);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const token = crypto.randomBytes(20).toString('hex');
    const origin = req.headers.origin || 'https://shrink-now.shop';
    await User.findOneAndUpdate({ email }, { resetPasswordToken: token, resetPasswordExpires: Date.now() + 3600000 });
    const resetUrl = `${origin}/reset-password/${token}`;
    res.json({ message: `Password reset link generated! Click here: ${resetUrl}` });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(user._id, { $set: { password: hashedPassword }, $unset: { resetPasswordToken: 1, resetPasswordExpires: 1 } });
    res.json({ message: 'Password reset successful' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = app;
