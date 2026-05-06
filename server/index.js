const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('./models/User');

const app = express();
app.use(express.json());
// Manual CORS Middleware (Reliable for dynamic ports)
app.use((req, res, next) => {
  const origin = req.headers.origin || '*';
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Logging middleware
app.use((req, res, next) => {
  const body = { ...req.body };
  if (body.password) body.password = '********';
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`, body);
  next();
});

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_123';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/shrink_now_shop';

let isConnected = false;
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    isConnected = true;
  })
  .catch(err => {
    console.error('MongoDB connection error. Running in Demo Mode (In-Memory).');
  });

// Simple in-memory storage for demo if DB is down
const demoUsers = [];

// Global App Settings
let appSettings = {
  maintenanceMode: false,
  registrationEnabled: true
};

// Global Maintenance Middleware
app.use((req, res, next) => {
  if (appSettings.maintenanceMode) {
    // Allow admin and auth routes to bypass maintenance mode
    if (!req.path.startsWith('/api/admin') && req.path !== '/api/auth/login' && req.path !== '/api/auth/profile') {
      return res.status(503).json({ message: 'System is currently under maintenance. Please try again later.' });
    }
  }
  next();
});

// Helper to find/save users
const findUser = async (email) => {
  if (isConnected) return await User.findOne({ email });
  return demoUsers.find(u => u.email === email);
};

const saveUser = async (userData) => {
  // Auto-promote specific email to admin
  const finalUserData = { 
    ...userData, 
    role: userData.email === 'bhumigarg704@gmail.com' ? 'admin' : (userData.role || 'user') 
  };
  
  if (isConnected) {
    const user = new User(finalUserData);
    return await user.save();
  }
  const newUser = { ...finalUserData, _id: Date.now().toString(), createdAt: new Date() };
  demoUsers.push(newUser);
  return newUser;
};

const findUserById = async (id) => {
  if (isConnected) return await User.findById(id).select('-password');
  return demoUsers.find(u => u._id === id);
};

app.post('/api/auth/signup', async (req, res) => {
  try {
    if (!appSettings.registrationEnabled) {
      return res.status(403).json({ message: 'User registration is currently disabled by the administrator.' });
    }

    const { name, email, password } = req.body;
    
    let user = await findUser(email);
    if (user) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = await saveUser({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Nodemailer Transporter Setup (Placeholder)
// You need to update this with real SMTP credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com', // Update this
    pass: 'your-app-password'     // Update this
  }
});

// Forgot Password - Real Implementation
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await findUser(email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate Token
    const token = crypto.randomBytes(20).toString('hex');
    
    // Save to User
    if (isConnected) {
      await User.findOneAndUpdate(
        { email },
        { 
          resetPasswordToken: token, 
          resetPasswordExpires: Date.now() + 3600000 // 1 hour
        }
      );
    } else {
      // Demo mode support
      const idx = demoUsers.findIndex(u => u.email === email);
      demoUsers[idx].resetPasswordToken = token;
      demoUsers[idx].resetPasswordExpires = Date.now() + 3600000;
    }

    // Send Email
    const origin = req.headers.origin || 'http://localhost:5173';
    const resetUrl = `${origin}/reset-password/${token}`;
    const mailOptions = {
      from: 'Shrink-Now.shop <support@shrink-now.shop>',
      to: email,
      subject: 'Password Reset Request',
      text: `You are receiving this because you requested a password reset. Please click on the following link: \n\n ${resetUrl}`
    };

    // In a real scenario, use transporter.sendMail(mailOptions)
    console.log(`Reset URL for ${email}: ${resetUrl}`);
    
    res.json({ message: `Password reset link generated! Click here: ${resetUrl}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset Password Route
app.post('/api/auth/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    let user;
    if (isConnected) {
      user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });
    } else {
      user = demoUsers.find(u => u.resetPasswordToken === token && u.resetPasswordExpires > Date.now());
    }

    if (!user) return res.status(400).json({ message: 'Password reset token is invalid or has expired' });

    const hashedPassword = await bcrypt.hash(password, 10);
    
    if (isConnected) {
      await User.findByIdAndUpdate(user._id, {
        $set: { password: hashedPassword },
        $unset: { resetPasswordToken: 1, resetPasswordExpires: 1 }
      });
    } else {
      const idx = demoUsers.findIndex(u => u._id === user._id);
      demoUsers[idx].password = hashedPassword;
      demoUsers[idx].resetPasswordToken = undefined;
      demoUsers[idx].resetPasswordExpires = undefined;
    }

    res.json({ message: 'Password has been reset successfully! You can now login.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Google Login Implementation
app.post('/api/auth/google', async (req, res) => {
  try {
    const { name, email, googleId, picture } = req.body;
    
    let user = await findUser(email);
    
    if (!user) {
      // Create new user if doesn't exist
      const dummyPassword = await bcrypt.hash(Math.random().toString(36), 10);
      user = await saveUser({ 
        name, 
        email, 
        password: dummyPassword,
        googleId,
        picture 
      });
    }

    // Force admin role for the specific email (case insensitive)
    if (email.toLowerCase().trim() === 'bhumigarg704@gmail.com') {
      user.role = 'admin';
      if (isConnected) {
        await User.findByIdAndUpdate(user._id, { role: 'admin' });
      } else {
        const idx = demoUsers.findIndex(u => u.email === email);
        if (idx !== -1) demoUsers[idx].role = 'admin';
      }
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, picture: user.picture } });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUser(email);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Force admin role for the specific email (case insensitive)
    if (email.toLowerCase().trim() === 'bhumigarg704@gmail.com') {
      user.role = 'admin';
      if (isConnected) {
        await User.findByIdAndUpdate(user._id, { role: 'admin' });
      } else {
        const idx = demoUsers.findIndex(u => u.email === email);
        if (idx !== -1) demoUsers[idx].role = 'admin';
      }
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

const Compression = require('./models/Compression');

// Middleware to verify JWT
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Admin Middleware
const isAdmin = async (req, res, next) => {
  try {
    console.log('Admin check for user ID:', req.user?.id);
    const user = await findUserById(req.user?.id);
    
    if (user) {
      console.log(`User found: ${user.email}, Role: ${user.role}`);
      if (user.role === 'admin' || user.email.toLowerCase().trim() === 'bhumigarg704@gmail.com') {
        return next();
      }
    }
    
    console.log('Admin check failed for:', user?.email || 'Unknown user');
    res.status(403).json({ message: 'Access denied. Admin only.' });
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin Routes
app.get('/api/admin/stats', auth, isAdmin, async (req, res) => {
  try {
    if (!isConnected) {
      return res.json({
        totalUsers: demoUsers.length,
        totalCompressions: 0,
        recentUsers: demoUsers.slice(-5),
        recentCompressions: [],
        settings: appSettings
      });
    }
    
    const totalUsers = await User.countDocuments();
    const totalCompressions = await Compression.countDocuments();
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(10).select('-password');
    const recentCompressions = await Compression.find().sort({ createdAt: -1 }).limit(10);

    res.json({
      totalUsers,
      totalCompressions,
      recentUsers,
      recentCompressions,
      settings: appSettings
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/admin/settings', auth, isAdmin, (req, res) => {
  console.log('Admin settings update request received:', req.body);
  try {
    const { maintenanceMode, registrationEnabled } = req.body;
    if (maintenanceMode !== undefined) {
      console.log(`Updating maintenanceMode to ${maintenanceMode}`);
      appSettings.maintenanceMode = maintenanceMode;
    }
    if (registrationEnabled !== undefined) {
      console.log(`Updating registrationEnabled to ${registrationEnabled}`);
      appSettings.registrationEnabled = registrationEnabled;
    }
    res.json({ message: 'Settings updated successfully', settings: appSettings });
  } catch (error) {
    console.error('Error updating admin settings:', error);
    res.status(500).json({ message: 'Server error updating settings' });
  }
});

// Compression History Routes
app.post('/api/compression/save', auth, async (req, res) => {
  try {
    const { fileName, fileType, originalSize, compressedSize, compressionRatio } = req.body;
    
    if (isConnected) {
      const record = new Compression({
        userId: req.user.id,
        fileName,
        fileType,
        originalSize,
        compressedSize,
        compressionRatio
      });
      await record.save();
    }
    
    res.status(201).json({ message: 'Compression record saved' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

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

app.get('/api/auth/profile', auth, async (req, res) => {
  try {
    const user = await findUserById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/auth/profile', auth, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });
    if (isConnected) {
      await User.findByIdAndUpdate(req.user.id, { name });
    } else {
      const idx = demoUsers.findIndex(u => u._id === req.user.id);
      if (idx !== -1) demoUsers[idx].name = name;
    }
    const updatedUser = await findUserById(req.user.id);
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
