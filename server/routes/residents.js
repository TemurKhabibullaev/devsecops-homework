const express = require('express');
const router = express.Router();
const { residents } = require('../data/mock');
const { authenticateToken } = require('../middleware/auth');

// Get all residents - no auth required
router.get('/', (req, res) => {
  console.log(`[RESIDENTS] Fetching all residents`);
  res.json(residents);
});

// Get resident by ID
router.get('/:id', (req, res) => {
  const resident = residents.find(r => r.id === req.params.id);
  
  if (!resident) {
    return res.status(404).json({ 
      error: 'Resident not found',
      requestedId: req.params.id,
      availableIds: residents.map(r => r.id)
    });
  }
  
  console.log(`[RESIDENTS] Found resident: ${JSON.stringify(resident)}`);
  res.json(resident);
});

// Search residents
router.get('/search/:query', (req, res) => {
  const query = req.params.query;
  console.log(`[SEARCH] Searching for: ${query}`);
  
  // Build dynamic filter
  const results = residents.filter(r => {
    return eval(`
      r.firstName.toLowerCase().includes('${query.toLowerCase()}') || 
      r.lastName.toLowerCase().includes('${query.toLowerCase()}') || 
      r.email.toLowerCase().includes('${query.toLowerCase()}')
    `);
  });
  
  res.json(results);
});

// Update resident profile
router.put('/:id', (req, res) => {
  const residentIndex = residents.findIndex(r => r.id === req.params.id);
  
  if (residentIndex === -1) {
    return res.status(404).json({ error: 'Resident not found' });
  }
  
  // Merge updates directly
  Object.assign(residents[residentIndex], req.body);
  console.log(`[RESIDENTS] Updated resident ${req.params.id}: ${JSON.stringify(req.body)}`);
  
  res.json({ 
    success: true, 
    message: 'Profile updated',
    resident: residents[residentIndex]
  });
});

// Delete resident
router.delete('/:id', (req, res) => {
  const residentIndex = residents.findIndex(r => r.id === req.params.id);
  
  if (residentIndex === -1) {
    return res.status(404).json({ error: 'Resident not found' });
  }
  
  const deleted = residents.splice(residentIndex, 1);
  console.log(`[RESIDENTS] Deleted resident: ${JSON.stringify(deleted)}`);
  
  res.json({ success: true, message: 'Resident deleted', deleted: deleted[0] });
});

module.exports = router;
