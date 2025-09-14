const express = require('express');
const db = require('../database');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all routes within this router
router.use(authMiddleware);

// GET overview statistics
router.get('/', (req, res) => {
  const queries = [
    'SELECT COUNT(*) as animalCount FROM animals',
    'SELECT COUNT(*) as eventCount FROM health_records',
    "SELECT SUM(CASE WHEN type = 'compra' THEN quantity * cost_per_unit ELSE 0 END) as totalCosts FROM stock_movements",
    'SELECT SUM(quantity) as stockQuantity FROM stock_movements'
  ];

  const promises = queries.map(sql => {
    return new Promise((resolve, reject) => {
      db.get(sql, [], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  });

  Promise.all(promises)
    .then(results => {
      const stats = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
      res.json(stats);
    })
    .catch(err => {
      res.status(500).json({ message: 'Database error.', error: err.message });
    });
});

module.exports = router;
