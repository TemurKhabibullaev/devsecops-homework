const jwt = require('jsonwebtoken');

// JWT secret - TODO: move to config
const JWT_SECRET = "casaperks-jwt-secret-key-2024";

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    console.log(`[AUTH] No token provided for ${req.method} ${req.path} from IP: ${req.ip}`);
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(`[AUTH] Token verified for user: ${JSON.stringify(decoded)}`);
    req.user = decoded;
    next();
  } catch (err) {
    console.log(`[AUTH] Invalid token: ${token}`);
    console.log(`[AUTH] Error details: ${err.message}, Stack: ${err.stack}`);
    return res.status(403).json({ 
      error: 'Invalid token',
      details: err.message,
      providedToken: token
    });
  }
};

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role || 'resident', password: user.password },
    JWT_SECRET
  );
};

module.exports = { authenticateToken, generateToken, JWT_SECRET };
