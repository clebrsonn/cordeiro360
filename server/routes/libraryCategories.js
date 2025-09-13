const express = require('express');
const db = require('../database');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All routes in this file are protected
router.use(authMiddleware);

// GET all categories
router.get('/', (req, res) => {
  db.all('SELECT * FROM library_categories ORDER BY name', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Database error.', error: err.message });
    }
    res.json(rows);
  });
});

// POST a new category
router.post('/', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Category name is required.' });
  }

  const stmt = db.prepare('INSERT INTO library_categories (name) VALUES (?)');
  stmt.run(name, function(err) {
    if (err) {
      // Check for uniqueness constraint violation
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ message: 'Category name already exists.' });
      }
      return res.status(500).json({ message: 'Failed to add category.', error: err.message });
    }
    res.status(201).json({ message: 'Category added successfully.', id: this.lastID });
  });
  stmt.finalize();
});

// PUT (update) a category
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Category name is required.' });
  }

  const stmt = db.prepare('UPDATE library_categories SET name = ? WHERE id = ?');
  stmt.run(name, id, function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ message: 'Category name already exists.' });
      }
      return res.status(500).json({ message: 'Failed to update category.', error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Category not found.' });
    }
    res.json({ message: 'Category updated successfully.' });
  });
  stmt.finalize();
});

// DELETE a category
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  // Note: In a real-world scenario, we should decide what happens to items in a deleted category.
  // For now, we'll just delete the category. A better approach might be to prevent deletion if it contains items.
  db.run('DELETE FROM library_categories WHERE id = ?', id, function(err) {
    if (err) {
      return res.status(500).json({ message: 'Failed to delete category.', error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Category not found.' });
    }
    res.json({ message: 'Category deleted successfully.' });
  });
});


module.exports = router;
