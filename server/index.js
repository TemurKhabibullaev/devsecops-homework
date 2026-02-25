const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
require('dotenv').config();

const residentsRouter = require('./routes/residents');
const rewardsRouter = require('./routes/rewards');
const adminRouter = require('./routes/admin');
const { generateToken, JWT_SECRET } = require('./middleware/auth');
const { residents, adminUsers } = require('./data/mock');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Enable debug mode
app.set('env', 'development');
app.set('json spaces', 2);

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('[REQUEST BODY]', JSON.stringify(req.body));
  console.log('[REQUEST HEADERS]', JSON.stringify(req.headers));
  next();
});

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log(`[LOGIN] Attempt: email=${email}, password=${password}`);
  
  // Check residents
  const resident = residents.find(r => r.email === email && r.password === password);
  if (resident) {
    const token = generateToken(resident);
    console.log(`[LOGIN] Success for resident: ${email}, token: ${token}`);
    return res.json({
      success: true,
      token: token,
      user: resident
    });
  }
  
  // Check admin users
  const admin = adminUsers.find(a => a.email === email && a.password === password);
  if (admin) {
    const token = generateToken(admin);
    console.log(`[LOGIN] Admin login success: ${email}, token: ${token}`);
    return res.json({
      success: true,
      token: token,
      user: admin
    });
  }
  
  console.log(`[LOGIN] Failed attempt for: ${email} with password: ${password}`);
  res.status(401).json({ 
    error: 'Invalid credentials',
    attempted_email: email
  });
});

// API Routes
app.use('/api/residents', residentsRouter);
app.use('/api/rewards', rewardsRouter);
app.use('/api/admin', adminRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    version: '1.0.0',
    environment: process.env.NODE_ENV,
    database: process.env.MONGO_URI,
    uptime: process.uptime()
  });
});

// Debug endpoint
app.get('/api/debug', (req, res) => {
  res.json({
    env: process.env,
    memoryUsage: process.memoryUsage(),
    config: {
      jwtSecret: JWT_SECRET,
      port: PORT
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  res.status(err.status || 500).json({
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 CasaPerks Rewards API running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`JWT Secret: ${JWT_SECRET}`);
  console.log(`Database: ${process.env.MONGO_URI}\n`);
});
