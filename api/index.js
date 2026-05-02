const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// ─── Mongoose Models (inline for Vercel serverless) ─────────────────────────

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
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

// ─── App Setup ───────────────────────────────────────────────────────────────

const app = express();
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://shrink-now-shop.vercel.app',
    'https://shrink-now.shop',
    'https://www.shrink-now.shop',
    process.env.FRONTEND_URL || ''
  ].filter(Boolean),
  credentials: true
}));

// ─── Database Connection (cached for serverless) ─────────────────────────────

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_123';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/shrink_now_shop';

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(MONGO_URI);
    isConnected = true;
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
  }
};

// Middleware to connect DB before every request
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// ─── In-Memory Demo Fallback ─────────────────────────────────────────────────

const demoUsers = [];

const findUser = async (email) => {
  if (isConnected) return await User.findOne({ email });
  return demoUsers.find(u => u.email === email);
};

const saveUser = async (userData) => {
  if (isConnected) {
    const user = new User(userData);
    return await user.save();
  }
  const newUser = { ...userData, _id: Date.now().toString(), createdAt: new Date() };
  demoUsers.push(newUser);
  return newUser;
};

const findUserById = async (id) => {
  if (isConnected) return await User.findById(id).select('-password');
  return demoUsers.find(u => u._id === id);
};

// ─── Auth Middleware ─────────────────────────────────────────────────────────

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// ─── Routes ──────────────────────────────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: isConnected ? 'connected' : 'demo-mode' });
});

// Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await findUser(email);
    if (user) return res.status(400).json({ message: 'User already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await saveUser({ name, email, password: hashedPassword });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUser(email);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Google Login
app.post('/api/auth/google', async (req, res) => {
  try {
    const { name, email, googleId, picture } = req.body;
    let user = await findUser(email);
    if (!user) {
      const dummyPassword = await bcrypt.hash(Math.random().toString(36), 10);
      user = await saveUser({ name, email, password: dummyPassword, googleId, picture });
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, picture: user.picture } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Profile
app.get('/api/auth/profile', auth, async (req, res) => {
  try {
    const user = await findUserById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Forgot Password
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await findUser(email);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const token = crypto.randomBytes(20).toString('hex');
    const frontendUrl = process.env.FRONTEND_URL || 'https://shrink-now-shop.vercel.app';
    if (isConnected) {
      await User.findOneAndUpdate({ email }, {
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + 3600000
      });
    } else {
      const idx = demoUsers.findIndex(u => u.email === email);
      demoUsers[idx].resetPasswordToken = token;
      demoUsers[idx].resetPasswordExpires = Date.now() + 3600000;
    }
    const resetUrl = `${frontendUrl}/reset-password/${token}`;
    console.log(`Reset URL for ${email}: ${resetUrl}`);
    res.json({ message: 'Password reset link sent to your email! Please check your inbox.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset Password
app.post('/api/auth/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    let user;
    if (isConnected) {
      user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    } else {
      user = demoUsers.find(u => u.resetPasswordToken === token && u.resetPasswordExpires > Date.now());
    }
    if (!user) return res.status(400).json({ message: 'Token is invalid or has expired' });
    const hashedPassword = await bcrypt.hash(password, 10);
    if (isConnected) {
      await User.findByIdAndUpdate(user._id, {
        password: hashedPassword,
        resetPasswordToken: undefined,
        resetPasswordExpires: undefined
      });
    } else {
      const idx = demoUsers.findIndex(u => u._id === user._id);
      demoUsers[idx].password = hashedPassword;
      demoUsers[idx].resetPasswordToken = undefined;
      demoUsers[idx].resetPasswordExpires = undefined;
    }
    res.json({ message: 'Password has been reset successfully! You can now login.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Save Compression Record
app.post('/api/compression/save', auth, async (req, res) => {
  try {
    const { fileName, fileType, originalSize, compressedSize, compressionRatio } = req.body;
    if (isConnected) {
      const record = new Compression({ userId: req.user.id, fileName, fileType, originalSize, compressedSize, compressionRatio });
      await record.save();
    }
    res.status(201).json({ message: 'Compression record saved' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Compression History
app.get('/api/compression/history', auth, async (req, res) => {
  try {
    if (isConnected) {
      const history = await Compression.find({ userId: req.user.id }).sort({ createdAt: -1 });
      return res.json(history);
    }
    res.json([]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── Export for Vercel Serverless ────────────────────────────────────────────

module.exports = app;
