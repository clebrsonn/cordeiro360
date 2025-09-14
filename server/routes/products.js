const express = require('express');
const db = require('../database');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all product routes
router.use(authMiddleware);

// GET all products
router.get('/', (req, res) => {
  db.all('SELECT * FROM products ORDER BY name', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Database error.', error: err.message });
    }
    res.json(rows);
  });
});

// POST a new product
router.post('/', (req, res) => {
  const { name, description, unit } = req.body;
  if (!name || !unit) {
    return res.status(400).json({ message: 'Name and unit are required.' });
  }

  const stmt = db.prepare('INSERT INTO products (name, description, unit) VALUES (?, ?, ?)');
  stmt.run(name, description, unit, function(err) {
    if (err) {
      return res.status(500).json({ message: 'Failed to add product.', error: err.message });
    }
    res.status(201).json({ message: 'Product added successfully.', id: this.lastID });
  });
  stmt.finalize();
});

// PUT (update) a product
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, unit } = req.body;
  if (!name || !unit) {
    return res.status(400).json({ message: 'Name and unit are required.' });
  }

  const stmt = db.prepare('UPDATE products SET name = ?, description = ?, unit = ? WHERE id = ?');
  stmt.run(name, description, unit, id, function(err) {
    if (err) {
      return res.status(500).json({ message: 'Failed to update product.', error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.json({ message: 'Product updated successfully.' });
  });
  stmt.finalize();
});

// DELETE a product
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  // We should also check if there are stock movements associated with this product
  // For simplicity now, we rely on ON DELETE CASCADE, but a check could be better.
  db.run('DELETE FROM products WHERE id = ?', id, function(err) {
    if (err) {
      return res.status(500).json({ message: 'Failed to delete product.', error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.json({ message: 'Product deleted successfully.' });
  });
});

module.exports = router;
