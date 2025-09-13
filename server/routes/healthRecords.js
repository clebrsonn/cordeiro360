const express = require('express');
const db = require('../database');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all routes
router.use(authMiddleware);

// GET all records for a specific animal
router.get('/:animal_id', (req, res) => {
  const { animal_id } = req.params;
  db.all(
    'SELECT * FROM health_records WHERE animal_id = ? ORDER BY date DESC',
    [animal_id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: 'Database error.', error: err.message });
      }
      res.json(rows);
    }
  );
});

// POST a new record for an animal
router.post('/:animal_id', (req, res) => {
  const { animal_id } = req.params;
  const { date, status, medications, observations } = req.body;
  if (!date) {
    return res.status(400).json({ message: 'Date is required.' });
  }

  const stmt = db.prepare(`
    INSERT INTO health_records (animal_id, date, status, medications, observations)
    VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(animal_id, date, status, medications, observations, function(err) {
    if (err) {
      return res.status(500).json({ message: 'Failed to add health record.', error: err.message });
    }
    res.status(201).json({ message: 'Health record added successfully.', id: this.lastID });
  });
  stmt.finalize();
});

// PUT (update) a health record
router.put('/:record_id', (req, res) => {
  const { record_id } = req.params;
  const { date, status, medications, observations } = req.body;
  if (!date) {
    return res.status(400).json({ message: 'Date is required.' });
  }

  const stmt = db.prepare(`
    UPDATE health_records
    SET date = ?, status = ?, medications = ?, observations = ?
    WHERE id = ?
  `);
  stmt.run(date, status, medications, observations, record_id, function(err) {
    if (err) {
      return res.status(500).json({ message: 'Failed to update record.', error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Record not found.' });
    }
    res.json({ message: 'Record updated successfully.' });
  });
  stmt.finalize();
});

// DELETE a health record
router.delete('/:record_id', (req, res) => {
  const { record_id } = req.params;
  db.run('DELETE FROM health_records WHERE id = ?', record_id, function(err) {
    if (err) {
      return res.status(500).json({ message: 'Failed to delete record.', error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Record not found.' });
    }
    res.json({ message: 'Record deleted successfully.' });
  });
});

module.exports = router;
