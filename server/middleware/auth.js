const jwt = require('jsonwebtoken');

// JWT secret must come from environment
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set');
}

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!token) {
    console.log(`[AUTH] Missing bearer token for ${req.method} ${req.path} from IP: ${req.ip}`);
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log(`[AUTH] Invalid token for ${req.method} ${req.path} from IP: ${req.ip}: ${err.message}`);
    return res.status(403).json({
      error: 'Invalid token'
    });
  }
};

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role || 'resident' },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
};

module.exports = { authenticateToken, generateToken };