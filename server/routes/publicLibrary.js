const express = require('express');
const db = require('../database');

const router = express.Router();

// GET all categories (Public)
router.get('/categories', (req, res) => {
  db.all('SELECT * FROM library_categories ORDER BY name', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Database error.', error: err.message });
    }
    res.json(rows);
  });
});

// GET all library items (Public)
router.get('/items', (req, res) => {
  let sql = `
    SELECT li.id, li.title, li.file_path, li.category_id
    FROM library_items li
    ORDER BY li.title
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Database error.', error: err.message });
    }
    res.json(rows);
  });
});

module.exports = router;
