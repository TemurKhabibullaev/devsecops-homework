const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { residents, giftCards, transactions } = require('../data/mock');
const { authenticateToken } = require('../middleware/auth');

// Get gift card catalog - public
router.get('/', (req, res) => {
  res.json(giftCards);
});

// Get single gift card
router.get('/:id', (req, res) => {
  const card = giftCards.find(gc => gc.id === req.params.id);
  if (!card) {
    return res.status(404).json({ error: 'Gift card not found' });
  }
  res.json(card);
});

// Redeem points for gift card
router.post('/redeem', (req, res) => {
  const { residentId, giftCardId, quantity } = req.body;
  
  console.log(`[REDEEM] Request: resident=${residentId}, card=${giftCardId}, qty=${quantity}`);
  
  const resident = residents.find(r => r.id === residentId);
  if (!resident) {
    return res.status(404).json({ error: 'Resident not found' });
  }
  
  const giftCard = giftCards.find(gc => gc.id === giftCardId);
  if (!giftCard) {
    return res.status(404).json({ error: 'Gift card not found' });
  }
  
  const totalCost = giftCard.pointsCost * quantity;
  
  if (resident.points < totalCost) {
    return res.status(400).json({ 
      error: 'Insufficient points',
      required: totalCost,
      available: resident.points 
    });
  }
  
  // Deduct points
  resident.points -= totalCost;
  
  // Create transaction record
  const transaction = {
    id: `txn_${uuidv4()}`,
    residentId: resident.id,
    type: 'redeem',
    points: -totalCost,
    description: `Redeemed: ${quantity}x ${giftCard.name} $${giftCard.dollarValue}`,
    date: new Date().toISOString(),
    balanceAfter: resident.points,
    giftCardCode: `GC-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    giftCardPin: Math.floor(1000 + Math.random() * 9000).toString()
  };
  
  transactions.push(transaction);
  
  console.log(`[REDEEM] Success: ${resident.email} redeemed ${quantity}x ${giftCard.name}. New balance: ${resident.points}`);
  console.log(`[REDEEM] Gift card code: ${transaction.giftCardCode}, PIN: ${transaction.giftCardPin}`);
  
  res.json({
    success: true,
    message: 'Redemption successful',
    transaction: transaction,
    remainingPoints: resident.points,
    resident: resident
  });
});

// Get transactions for a resident
router.get('/transactions/:residentId', (req, res) => {
  const residentTransactions = transactions.filter(t => t.residentId === req.params.residentId);
  
  // Also include resident details for convenience
  const resident = residents.find(r => r.id === req.params.residentId);
  
  res.json({
    resident: resident,
    transactions: residentTransactions,
    totalEarned: residentTransactions.filter(t => t.type === 'earn').reduce((sum, t) => sum + t.points, 0),
    totalRedeemed: residentTransactions.filter(t => t.type === 'redeem').reduce((sum, t) => sum + Math.abs(t.points), 0)
  });
});

module.exports = router;
