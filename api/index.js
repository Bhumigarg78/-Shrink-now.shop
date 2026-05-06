const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// ─── Mongoose Models ──────────────────────────────────────────────────────────

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

// ─── Config ───────────────────────────────────────────────────────────────────

const JWT_SECRET = process.env.JWT_SECRET || 'shrink_now_secret_2026_secure_key';
// Support both MONGO_URI and MONGODB_URI
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || '';

// ─── App Setup ────────────────────────────────────────────────────────────────

const app = express();
app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true
}));

// Request Logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// ─── Database Connection (Serverless cached) ──────────────────────────────────

let isConnected = false;

async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) return true;
  if (!MONGO_URI) {
    console.log('No MONGO_URI set, running in demo mode');
    return false;
  }
  try {
    mongoose.set('bufferCommands', false);
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000,
    });
    isConnected = true;
    console.log('MongoDB connected');
    return true;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    isConnected = false;
    return false;
  }
}

// Connect DB on every request
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// ─── Demo Fallback (Disabled for Serverless) ───────────────────────────────────

async function findUser(email) {
  if (isConnected) return await User.findOne({ email });
  throw new Error("Database not connected. Please configure MONGO_URI in Vercel environment variables.");
}

async function saveUser(userData) {
  if (isConnected) {
    const user = new User(userData);
    return await user.save();
  }
  throw new Error("Database not connected. Please configure MONGO_URI in Vercel environment variables.");
}

async function findUserById(id) {
  if (isConnected) return await User.findById(id).select('-password');
  throw new Error("Database not connected. Please configure MONGO_URI in Vercel environment variables.");
}

// ─── Auth Middleware ──────────────────────────────────────────────────────────

function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// ─── Routes ───────────────────────────────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    db: isConnected ? 'connected' : 'demo-mode',
    mongoUri: MONGO_URI ? 'set' : 'missing',
    env: process.env.NODE_ENV || 'unknown'
  });
});

// Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const existing = await findUser(email);
    if (existing) return res.status(400).json({ message: 'User already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await saveUser({ name, email, password: hashedPassword });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Signup failed: ' + err.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    
    console.log(`Login attempt for: ${email}`);
    const user = await findUser(email);
    
    if (!user) {
      console.log(`User not found: ${email}`);
      const hint = !isConnected ? ' (Server in Demo Mode - DB Not Connected)' : '';
      return res.status(400).json({ message: 'Invalid credentials' + hint });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`Password mismatch for: ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    console.log(`Login successful: ${email}`);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed: ' + err.message });
  }
});

// Google Login
app.post('/api/auth/google', async (req, res) => {
  try {
    const { name, email, googleId, picture } = req.body;
    let user = await findUser(email);
    if (!user) {
      const pw = await bcrypt.hash(Math.random().toString(36), 10);
      user = await saveUser({ name, email, password: pw, googleId, picture });
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, picture: user.picture } });
  } catch (err) {
    res.status(500).json({ message: 'Google login failed: ' + err.message });
  }
});

// Profile
app.get('/api/auth/profile', auth, async (req, res) => {
  try {
    const user = await findUserById(req.user.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Profile
app.put('/api/auth/profile', auth, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });
    if (isConnected) {
      await User.findByIdAndUpdate(req.user.id, { name });
    }
    const updatedUser = await findUserById(req.user.id);
    res.json(updatedUser);
  } catch (err) {
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
    }
    console.log(`Reset URL: ${frontendUrl}/reset-password/${token}`);
    res.json({ message: `Test Mode: Go to ${frontendUrl}/reset-password/${token} to reset` });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset Password
app.post('/api/auth/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const user = isConnected
      ? await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } })
      : null;
    if (!user) return res.status(400).json({ message: 'Token invalid or expired' });
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(user._id, {
      $set: { password: hashedPassword },
      $unset: { resetPasswordToken: 1, resetPasswordExpires: 1 }
    });
    res.json({ message: 'Password reset successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Save Compression
app.post('/api/compression/save', auth, async (req, res) => {
  try {
    const { fileName, fileType, originalSize, compressedSize, compressionRatio } = req.body;
    if (isConnected) {
      await new Compression({ userId: req.user.id, fileName, fileType, originalSize, compressedSize, compressionRatio }).save();
    }
    res.status(201).json({ message: 'Saved' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Compression History
app.get('/api/compression/history', auth, async (req, res) => {
  try {
    if (isConnected) {
      const history = await Compression.find({ userId: req.user.id }).sort({ createdAt: -1 });
      return res.json(history);
    }
    res.json([]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Catch-all for API debugging
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    message: `API Route not found: ${req.originalUrl}`,
    hint: 'Check if the route is defined in api/index.js'
  });
});

// ─── Export for Vercel ────────────────────────────────────────────────────────

module.exports = app;
