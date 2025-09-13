import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Overview/Overview.css';
import './Library.css';

interface Category {
  id: number;
  name: string;
}

interface LibraryItem {
  id: number;
  title: string;
  file_path: string;
  category_id: number;
}

interface GroupedItems {
  [key: string]: LibraryItem[];
}

const Library: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const catPromise = axios.get('/api/public/library/categories');
        const itemPromise = axios.get('/api/public/library/items');

        const [catResponse, itemResponse] = await Promise.all([catPromise, itemPromise]);

        setCategories(catResponse.data);
        setItems(itemResponse.data);
      } catch (err) {
        setError('Failed to load library.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const groupedItems = items.reduce((acc, item) => {
    const category = categories.find(c => c.id === item.category_id);
    const categoryName = category ? category.name : 'Uncategorized';
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(item);
    return acc;
  }, {} as GroupedItems);

  return (
    <div className="card library">
      <h2 className="library-title">Biblioteca</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && Object.keys(groupedItems).map(categoryName => (
        <div key={categoryName} className="library-category">
          <h3>{categoryName}</h3>
          <ul className="library-list">
            {groupedItems[categoryName].map(item => (
              <li key={item.id} className="library-item">
                <span className="library-icon">📄</span>
                <a href={`/${item.file_path}`} target="_blank" rel="noopener noreferrer">
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Library;
