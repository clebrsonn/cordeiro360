const express = require('express');
const db = require('../database');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// GET all cuts (Public)
router.get('/', (req, res) => {
  db.all('SELECT * FROM cuts ORDER BY name', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Database error.', error: err.message });
    }
    res.json(rows);
  });
});

// POST a new cut (Protected)
router.post('/', authMiddleware, (req, res) => {
  const { name, description, nutritional_value } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Cut name is required.' });
  }

  const stmt = db.prepare('INSERT INTO cuts (name, description, nutritional_value) VALUES (?, ?, ?)');
  stmt.run(name, description, nutritional_value, function(err) {
    if (err) {
      return res.status(500).json({ message: 'Failed to add cut.', error: err.message });
    }
    res.status(201).json({ message: 'Cut added successfully.', id: this.lastID });
  });
  stmt.finalize();
});

// PUT (update) a cut (Protected)
router.put('/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const { name, description, nutritional_value } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Cut name is required.' });
  }

  const stmt = db.prepare(`
    UPDATE cuts
    SET name = ?, description = ?, nutritional_value = ?
    WHERE id = ?
  `);
  stmt.run(name, description, nutritional_value, id, function(err) {
    if (err) {
      return res.status(500).json({ message: 'Failed to update cut.', error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Cut not found.' });
    }
    res.json({ message: 'Cut updated successfully.' });
  });
  stmt.finalize();
});

// DELETE a cut (Protected)
router.delete('/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM cuts WHERE id = ?', id, function(err) {
    if (err) {
      return res.status(500).json({ message: 'Failed to delete cut.', error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Cut not found.' });
    }
    res.json({ message: 'Cut deleted successfully.' });
  });
});

module.exports = router;
