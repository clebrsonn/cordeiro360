require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./database'); // We will create this file next

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');

app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// Use auth routes
app.use('/api/auth', authRoutes);

// Use cuts routes
const cutsRoutes = require('./routes/cuts');
app.use('/api/cuts', cutsRoutes);

// Use library routes (protected)
const libraryCategoriesRoutes = require('./routes/libraryCategories');
const libraryItemsRoutes = require('./routes/libraryItems');
app.use('/api/library/categories', libraryCategoriesRoutes);
app.use('/api/library/items', libraryItemsRoutes);

// Use public library routes
const publicLibraryRoutes = require('./routes/publicLibrary');
app.use('/api/public/library', publicLibraryRoutes);

// Use Health/Animal routes (protected)
const animalsRoutes = require('./routes/animals');
const healthRecordsRoutes = require('./routes/healthRecords');
app.use('/api/animals', animalsRoutes);
app.use('/api/health-records', healthRecordsRoutes);

// Use Overview routes (protected)
const overviewRoutes = require('./routes/overview');
app.use('/api/overview', overviewRoutes);

// Use Product and Stock routes (protected)
const productRoutes = require('./routes/products');
const stockRoutes = require('./routes/stock');
app.use('/api/products', productRoutes);
app.use('/api/stock', stockRoutes);

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
