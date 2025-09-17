const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const helmet = require('helmet');

// Import routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const testRoutes = require('./routes/tests');
const logoutRoutes = require('./routes/logout');
const leaderboardRoutes = require('./routes/leaderboard');
const userRoutes = require('./routes/users');
const auditLogsRoutes = require('./routes/auditLogs');
const metaRoutes = require('./routes/meta');
const communityRoutes = require('./routes/community');
const feedbackRoutes = require('./routes/feedback');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
); // Security headers, but allow cross-origin cookies

// ✅ Allowed origins
const allowedOrigins = [
  'https://maxisolutions.netlify.app',  // fixed domain
  'https://maxsolutions.netlify.app',   // keep in case of second deployment
  'https://maxx-2-6gde.onrender.com',   // render server
  'http://localhost:3000',              // local React dev
  'http://localhost:5000',              // local backend (API)
];

// ✅ CORS config
app.use(cors()); // Allow all origins temporarily for debugging

// ✅ Handle preflight
app.options('*', cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure static files with proper CORS headers
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Cross-Origin-Embedder-Policy', 'credentialless');
  next();
}, express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, path) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// Database connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Atlas Connected'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', logoutRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/tests', leaderboardRoutes);
app.use('/api/users', userRoutes);
app.use('/api/audit-logs', auditLogsRoutes);
app.use('/api/meta', metaRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/community', communityRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Max Solutions API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Serve React app for all non-API, non-static routes (for client-side routing)
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '..', 'client', 'build');
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api') && !req.path.startsWith('/uploads')) {
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    } else {
      res.status(404).json({ message: 'Route not found' });
    }
  });
} else {
  app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });
}

// Create default admin if none exists
const User = require('./models/User');
const Test = require('./models/Test');

async function createDefaultAdmin() {
  try {
    const adminExists = await User.findOne({ role: 'admin', email: 'komalp@gmail.com' });
    if (!adminExists) {
      const email = 'komalp@gmail.com';
      const password = process.env.ADMIN_PASSWORD || 'defaultPassword';
      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = new User({
        name: 'Default Admin',
        email,
        rollNo: 'ADMIN001',
        password: hashedPassword,
        passwordHint: 'Contact developer for admin password',
        college: 'Ace Engineering College',
        role: 'admin',
        isActive: true
      });
      await admin.save();
      console.log('🔑 Default admin created');
    }
  } catch (err) {
    console.error('❌ Error creating default admin:', err.message);
  }
}

// Backfill testCode for existing tests
async function backfillTestCodes() {
  try {
    const tests = await Test.find({ $or: [{ testCode: { $exists: false } }, { testCode: null }, { testCode: '' }] });
    if (tests.length > 0) {
      await Promise.all(tests.map(test => {
        const code = crypto.randomBytes(4).toString('hex');
        return Test.updateOne({ _id: test._id }, { $set: { testCode: code } });
      }));
      console.log(`✅ Backfilled testCode for ${tests.length} test(s)`);
    }
  } catch (err) {
    console.error('❌ Error backfilling test codes:', err.message);
  }
}

app.listen(PORT, async () => {
  console.log(`🚀 Max Solutions Server running on port ${PORT}`);
  console.log(`📱 Client URL: ${process.env.CLIENT_URL || 'https://maxisolutions.netlify.app'}`);
  await createDefaultAdmin();
  await backfillTestCodes();
});
