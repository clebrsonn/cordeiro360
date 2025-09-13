const express = require('express');
const db = require('../database');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all routes
router.use(authMiddleware);

// GET all animals
router.get('/', (req, res) => {
  db.all('SELECT * FROM animals ORDER BY name', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Database error.', error: err.message });
    }
    res.json(rows);
  });
});

// POST a new animal
router.post('/', (req, res) => {
  const { name, tag_number, species } = req.body;
  if (!tag_number) {
    return res.status(400).json({ message: 'Tag number is required.' });
  }

  const stmt = db.prepare('INSERT INTO animals (name, tag_number, species) VALUES (?, ?, ?)');
  stmt.run(name, tag_number, species, function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ message: 'Tag number already exists.' });
      }
      return res.status(500).json({ message: 'Failed to add animal.', error: err.message });
    }
    res.status(201).json({ message: 'Animal added successfully.', id: this.lastID });
  });
  stmt.finalize();
});

// PUT (update) an animal
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, tag_number, species } = req.body;
  if (!tag_number) {
    return res.status(400).json({ message: 'Tag number is required.' });
  }

  const stmt = db.prepare('UPDATE animals SET name = ?, tag_number = ?, species = ? WHERE id = ?');
  stmt.run(name, tag_number, species, id, function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(409).json({ message: 'Tag number already exists.' });
      }
      return res.status(500).json({ message: 'Failed to update animal.', error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Animal not found.' });
    }
    res.json({ message: 'Animal updated successfully.' });
  });
  stmt.finalize();
});

// DELETE an animal
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  // ON DELETE CASCADE will handle deleting associated health records
  db.run('DELETE FROM animals WHERE id = ?', id, function(err) {
    if (err) {
      return res.status(500).json({ message: 'Failed to delete animal.', error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Animal not found.' });
    }
    res.json({ message: 'Animal deleted successfully.' });
  });
});

module.exports = router;
