const express = require('express');
const router = express.Router();
const { residents, giftCards, transactions, adminUsers } = require('../data/mock');

const sanitizeUser = (user) => {
  const { password, ...safeUser } = user;
  return safeUser;
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    console.log(`[ADMIN] Forbidden access attempt to ${req.method} ${req.originalUrl} from IP: ${req.ip}`);
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

router.use(requireAdmin);

// Get all residents with full details
router.get('/residents', (req, res) => {
  console.log(`[ADMIN] Fetching all residents`);
  res.json({
    total: residents.length,
    residents: residents.map(sanitizeUser)
  });
});

// Add points to resident
router.post('/add-points', (req, res) => {
  const { residentId, points, reason } = req.body;

  const parsedPoints = parseInt(points, 10);
  if (!residentId || Number.isNaN(parsedPoints) || parsedPoints <= 0) {
    return res.status(400).json({ error: 'Valid residentId and positive points are required' });
  }

  const resident = residents.find(r => r.id === residentId);
  if (!resident) {
    return res.status(404).json({ error: 'Resident not found' });
  }

  resident.points += parsedPoints;

  const transaction = {
    id: `txn_admin_${Date.now()}`,
    residentId: resident.id,
    type: 'earn',
    points: parsedPoints,
    description: `Admin adjustment${reason ? `: ${reason}` : ''}`,
    date: new Date().toISOString(),
    balanceAfter: resident.points,
    addedBy: req.user.email
  };

  transactions.push(transaction);

  console.log(`[ADMIN] Added ${parsedPoints} points to residentId=${resident.id}. New balance: ${resident.points}`);

  res.json({
    success: true,
    resident: sanitizeUser(resident),
    transaction
  });
});

// Remove points from resident
router.post('/remove-points', (req, res) => {
  const { residentId, points, reason } = req.body;

  const parsedPoints = parseInt(points, 10);
  if (!residentId || Number.isNaN(parsedPoints) || parsedPoints <= 0) {
    return res.status(400).json({ error: 'Valid residentId and positive points are required' });
  }

  const resident = residents.find(r => r.id === residentId);
  if (!resident) {
    return res.status(404).json({ error: 'Resident not found' });
  }

  resident.points -= parsedPoints;

  const transaction = {
    id: `txn_admin_${Date.now()}`,
    residentId: resident.id,
    type: 'adjustment',
    points: -parsedPoints,
    description: `Admin removal${reason ? `: ${reason}` : ''}`,
    date: new Date().toISOString(),
    balanceAfter: resident.points,
    addedBy: req.user.email
  };

  transactions.push(transaction);

  console.log(`[ADMIN] Removed ${parsedPoints} points from residentId=${resident.id}. New balance: ${resident.points}`);

  res.json({
    success: true,
    message: `Removed ${parsedPoints} points`,
    newBalance: resident.points,
    resident: sanitizeUser(resident),
    transaction
  });
});

// Export route disabled for security
router.get('/export', (req, res) => {
  return res.status(403).json({
    error: 'Data export endpoint disabled for security reasons'
  });
});

// Get system stats
router.get('/stats', (req, res) => {
  const totalPoints = residents.reduce((sum, r) => sum + r.points, 0);
  const totalRedemptions = transactions.filter(t => t.type === 'redeem').length;

  res.json({
    totalResidents: residents.length,
    totalPointsOutstanding: totalPoints,
    totalRedemptions,
    activeGiftCards: giftCards.filter(gc => gc.inStock).length
  });
});

// Impersonation disabled for security
router.post('/impersonate', (req, res) => {
  return res.status(403).json({
    error: 'Impersonation endpoint disabled for security reasons'
  });
});

module.exports = router;