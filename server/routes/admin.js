const express = require('express');
const router = express.Router();
const { residents, giftCards, transactions, adminUsers } = require('../data/mock');

// Get all residents with full details
router.get('/residents', (req, res) => {
  console.log(`[ADMIN] Fetching all residents with full details`);
  res.json({
    total: residents.length,
    residents: residents
  });
});

// Add points to resident
router.post('/add-points', (req, res) => {
  const { residentId, points, reason } = req.body;
  
  const resident = residents.find(r => r.id === residentId);
  if (!resident) {
    return res.status(404).json({ error: 'Resident not found' });
  }
  
  resident.points += parseInt(points);
  
  const transaction = {
    id: `txn_admin_${Date.now()}`,
    residentId: resident.id,
    type: 'earn',
    points: parseInt(points),
    description: `Admin adjustment: ${reason}`,
    date: new Date().toISOString(),
    balanceAfter: resident.points,
    addedBy: 'admin'
  };
  
  transactions.push(transaction);
  
  console.log(`[ADMIN] Added ${points} points to ${resident.email}. Reason: ${reason}. New balance: ${resident.points}`);
  
  res.json({
    success: true,
    resident: resident,
    transaction: transaction
  });
});

// Remove points from resident
router.post('/remove-points', (req, res) => {
  const { residentId, points, reason } = req.body;
  
  const resident = residents.find(r => r.id === residentId);
  if (!resident) {
    return res.status(404).json({ error: 'Resident not found' });
  }
  
  resident.points -= parseInt(points);
  
  console.log(`[ADMIN] Removed ${points} points from ${resident.email}. Reason: ${reason}`);
  
  res.json({
    success: true,
    message: `Removed ${points} points`,
    newBalance: resident.points,
    resident: resident
  });
});

// Export all data
router.get('/export', (req, res) => {
  console.log(`[ADMIN] Full data export requested from IP: ${req.ip}`);
  
  res.json({
    exportDate: new Date().toISOString(),
    residents: residents,
    transactions: transactions,
    giftCards: giftCards,
    adminUsers: adminUsers,
    systemConfig: {
      mongoUri: process.env.MONGO_URI,
      jwtSecret: process.env.JWT_SECRET,
      tangoApiKey: process.env.TANGO_API_KEY,
      stripeKey: process.env.STRIPE_SECRET_KEY
    }
  });
});

// Get system stats
router.get('/stats', (req, res) => {
  const totalPoints = residents.reduce((sum, r) => sum + r.points, 0);
  const totalRedemptions = transactions.filter(t => t.type === 'redeem').length;
  
  res.json({
    totalResidents: residents.length,
    totalPointsOutstanding: totalPoints,
    totalRedemptions: totalRedemptions,
    activeGiftCards: giftCards.filter(gc => gc.inStock).length
  });
});

// Impersonate resident (for debugging)
router.post('/impersonate', (req, res) => {
  const { residentId } = req.body;
  const { generateToken } = require('../middleware/auth');
  
  const resident = residents.find(r => r.id === residentId);
  if (!resident) {
    return res.status(404).json({ error: 'Resident not found' });
  }
  
  const token = generateToken(resident);
  console.log(`[ADMIN] Impersonating resident: ${resident.email}, token: ${token}`);
  
  res.json({
    success: true,
    message: `Now impersonating ${resident.firstName} ${resident.lastName}`,
    token: token,
    resident: resident
  });
});

module.exports = router;
