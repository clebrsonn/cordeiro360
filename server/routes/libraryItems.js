const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../database');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// --- Multer Configuration ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this 'uploads' directory exists at the root of the server
  },
  filename: (req, file, cb) => {
    // Create a unique filename to avoid overwrites
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// All routes in this file are protected
router.use(authMiddleware);

// --- API Endpoints ---

// GET all library items (optionally filter by category)
router.get('/', (req, res) => {
  const { categoryId } = req.query;
  let sql = `
    SELECT li.id, li.title, li.file_path, li.file_type, lc.name as category_name
    FROM library_items li
    LEFT JOIN library_categories lc ON li.category_id = lc.id
  `;
  const params = [];

  if (categoryId) {
    sql += ' WHERE li.category_id = ?';
    params.push(categoryId);
  }
  sql += ' ORDER BY li.title';

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Database error.', error: err.message });
    }
    res.json(rows);
  });
});

// POST a new library item with file upload
router.post('/', upload.single('file'), (req, res) => {
  const { title, category_id } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'File is required.' });
  }
  if (!title || !category_id) {
    // If validation fails, delete the uploaded file
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Error deleting uploaded file after validation failure:", err);
    });
    return res.status(400).json({ message: 'Title and category are required.' });
  }

  const file_path = req.file.path;
  const file_type = req.file.mimetype;

  const stmt = db.prepare('INSERT INTO library_items (title, category_id, file_path, file_type) VALUES (?, ?, ?, ?)');
  stmt.run(title, category_id, file_path, file_type, function(err) {
    if (err) {
      return res.status(500).json({ message: 'Failed to add library item.', error: err.message });
    }
    res.status(201).json({ message: 'Item added successfully.', id: this.lastID });
  });
  stmt.finalize();
});

// DELETE a library item
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  // First, get the file path from the database
  db.get('SELECT file_path FROM library_items WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Database error on lookup.', error: err.message });
    }
    if (!row) {
      return res.status(404).json({ message: 'Item not found.' });
    }

    const filePath = row.file_path;

    // Second, delete the database entry
    db.run('DELETE FROM library_items WHERE id = ?', id, function(err) {
      if (err) {
        return res.status(500).json({ message: 'Failed to delete item from database.', error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Item not found.' });
      }

      // Third, delete the actual file
      fs.unlink(filePath, (err) => {
        if (err) {
          // Log the error, but don't send a failure response since the DB entry is gone.
          console.error(`Failed to delete file: ${filePath}`, err);
        }
        res.json({ message: 'Item deleted successfully.' });
      });
    });
  });
});

module.exports = router;
