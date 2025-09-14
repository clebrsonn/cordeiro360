const express = require('express');
const db = require('../database');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all stock routes
router.use(authMiddleware);

// GET all stock movements (history/ledger)
router.get('/movements', (req, res) => {
  const sql = `
    SELECT sm.id, sm.quantity, sm.movement_date, sm.type, sm.cost_per_unit, p.name as product_name, p.unit
    FROM stock_movements sm
    JOIN products p ON sm.product_id = p.id
    ORDER BY sm.movement_date DESC, sm.id DESC
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Database error.', error: err.message });
    }
    res.json(rows);
  });
});

// POST a new stock movement
router.post('/movements', (req, res) => {
  const { product_id, quantity, movement_date, type, cost_per_unit } = req.body;
  if (!product_id || !quantity || !movement_date || !type) {
    return res.status(400).json({ message: 'Product, quantity, date, and type are required.' });
  }
  // Type validation could be added here (e.g., must be 'compra', 'uso', 'ajuste')

  const stmt = db.prepare('INSERT INTO stock_movements (product_id, quantity, movement_date, type, cost_per_unit) VALUES (?, ?, ?, ?, ?)');
  stmt.run(product_id, quantity, movement_date, type, cost_per_unit, function(err) {
    if (err) {
      return res.status(500).json({ message: 'Failed to record stock movement.', error: err.message });
    }
    res.status(201).json({ message: 'Stock movement recorded successfully.', id: this.lastID });
  });
  stmt.finalize();
});

// GET current stock levels for all products
router.get('/', (req, res) => {
    const sql = `
        SELECT p.id, p.name, p.unit, SUM(sm.quantity) as current_stock
        FROM products p
        LEFT JOIN stock_movements sm ON p.id = sm.product_id
        GROUP BY p.id, p.name, p.unit
        ORDER BY p.name
    `;
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Database error.', error: err.message });
        }
        res.json(rows);
    });
});


module.exports = router;
