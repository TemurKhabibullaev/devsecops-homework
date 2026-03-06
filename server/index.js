const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const residentsRouter = require('./routes/residents');
const rewardsRouter = require('./routes/rewards');
const adminRouter = require('./routes/admin');
const { generateToken, authenticateToken } = require('./middleware/auth');
const { residents, adminUsers } = require('./data/mock');

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:3000';

// Middleware
app.use(cors({
  origin: allowedOrigin
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan(isProduction ? 'combined' : 'dev'));

app.set('json spaces', 2);

// Safer request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} from IP: ${req.ip}`);
  next();
});

// Rate limit login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts, please try again later.' }
});

// Helper to remove password from returned user objects
const sanitizeUser = (user) => {
  if (!user) return user;

  if (user.role === 'super_admin' || user.role === 'admin') {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };
  }

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    points: user.points,
    tier: user.tier,
    unitNumber: user.unitNumber,
    propertyId: user.propertyId
  };
};

// Auth routes
app.post('/api/auth/login', loginLimiter, (req, res) => {
  const { email, password } = req.body;

  console.log(`[LOGIN] Attempt for email=${email}`);

  // Check residents
  const resident = residents.find(r => r.email === email && r.password === password);
  if (resident) {
    const token = generateToken(resident);
    console.log(`[LOGIN] Success for resident: ${email}`);
    return res.json({
      success: true,
      token,
      user: sanitizeUser(resident)
    });
  }

  // Check admin users
  const admin = adminUsers.find(a => a.email === email && a.password === password);
  if (admin) {
    const token = generateToken(admin);
    console.log(`[LOGIN] Admin login success: ${email}`);
    return res.json({
      success: true,
      token,
      user: sanitizeUser(admin)
    });
  }

  console.log(`[LOGIN] Failed attempt for email=${email}`);
  res.status(401).json({
    error: 'Invalid credentials'
  });
});

// API Routes
app.use('/api/residents', residentsRouter);
app.use('/api/rewards', rewardsRouter);
app.use('/api/admin', authenticateToken, adminRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    uptime: process.uptime()
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);

  res.status(err.status || 500).json({
    error: isProduction ? 'Internal Server Error' : err.message,
    ...(isProduction ? {} : {
      path: req.path,
      method: req.method,
      timestamp: new Date().toISOString()
    })
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 CasaPerks Rewards API running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}\n`);
});