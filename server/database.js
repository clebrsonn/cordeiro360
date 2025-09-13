const sqlite3 = require('sqlite3').verbose();

// Create a new database file. If it does not exist, it will be created.
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )`, (err) => {
      if (err) {
        return console.error('Error creating users table', err.message);
      }
      console.log('Users table created or already exists.');

      // Create cuts table
      db.run(`CREATE TABLE IF NOT EXISTS cuts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        nutritional_value TEXT
      )`, (err) => {
        if (err) {
          return console.error('Error creating cuts table', err.message);
        }
        console.log('Cuts table created or already exists.');

        // Create library_categories table
        db.run(`CREATE TABLE IF NOT EXISTS library_categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE
        )`, (err) => {
          if (err) {
            return console.error('Error creating library_categories table', err.message);
          }
          console.log('Library categories table created or already exists.');

          // Create library_items table
          db.run(`CREATE TABLE IF NOT EXISTS library_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            file_path TEXT NOT NULL,
            file_type TEXT,
            category_id INTEGER,
            FOREIGN KEY (category_id) REFERENCES library_categories(id)
          )`, (err) => {
            if (err) {
              return console.error('Error creating library_items table', err.message);
            }
            console.log('Library items table created or already exists.');

            // Create animals table
            db.run(`CREATE TABLE IF NOT EXISTS animals (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT,
              tag_number TEXT UNIQUE NOT NULL,
              species TEXT
            )`, (err) => {
              if (err) {
                return console.error('Error creating animals table', err.message);
              }
              console.log('Animals table created or already exists.');

              // Create health_records table
              db.run(`CREATE TABLE IF NOT EXISTS health_records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                animal_id INTEGER NOT NULL,
                date TEXT NOT NULL,
                status TEXT,
                medications TEXT,
                observations TEXT,
                FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE
              )`, (err) => {
                if (err) {
                  return console.error('Error creating health_records table', err.message);
                }
                console.log('Health records table created or already exists.');
              });
            });
          });
        });
      });
    });
  }
});

module.exports = db;
