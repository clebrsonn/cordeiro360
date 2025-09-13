import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './LibraryManagementPage.css';

interface Category {
  id: number;
  name: string;
}

interface LibraryItem {
  id: number;
  title: string;
  file_path: string;
  category_name: string;
}

const LibraryManagementPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const [categoryName, setCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [itemFormData, setItemFormData] = useState({ title: '', category_id: '' });
  const [file, setFile] = useState<File | null>(null);

  const fetchAllData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const catPromise = axios.get('http://localhost:3001/api/library/categories', { headers });
      const itemPromise = axios.get('http://localhost:3001/api/library/items', { headers });
      const [catResponse, itemResponse] = await Promise.all([catPromise, itemPromise]);
      setCategories(catResponse.data);
      setItems(itemResponse.data);
    } catch (err) {
      setError('Failed to fetch library data.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const headers = { Authorization: `Bearer ${token}` };
    const url = editingCategory
      ? `http://localhost:3001/api/library/categories/${editingCategory.id}`
      : 'http://localhost:3001/api/library/categories';
    const method = editingCategory ? 'put' : 'post';

    try {
      await axios[method](url, { name: categoryName }, { headers });
      setCategoryName('');
      setEditingCategory(null);
      fetchAllData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save category.');
    }
  };

  const handleEditCategoryClick = (category: Category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
  };

  const handleDeleteCategoryClick = async (id: number) => {
    if (window.confirm('Are you sure? This will not delete items in the category.')) {
      try {
        await axios.delete(`http://localhost:3001/api/library/categories/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        fetchAllData();
      } catch (err) {
        setError('Failed to delete category.');
      }
    }
  };

  const handleItemFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setItemFormData({ ...itemFormData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !itemFormData.title || !itemFormData.category_id) {
      setError('Title, category, and file are required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', itemFormData.title);
    formData.append('category_id', itemFormData.category_id);
    formData.append('file', file);

    try {
      await axios.post('http://localhost:3001/api/library/items', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setItemFormData({ title: '', category_id: '' });
      setFile(null);
      (document.getElementById('file-input') as HTMLInputElement).value = '';
      fetchAllData();
    } catch (err) {
      setError('Failed to upload item.');
    }
  };

  const handleDeleteItemClick = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`http://localhost:3001/api/library/items/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        fetchAllData();
      } catch (err) {
        setError('Failed to delete item.');
      }
    }
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>Manage Library</h1>
      </header>
      <div className="admin-content library-management-grid">
        <div className="category-management">
          <h2>Manage Categories</h2>
          <form onSubmit={handleCategorySubmit} className="form-container">
            <div className="form-group">
              <label>{editingCategory ? 'Edit Category Name' : 'New Category Name'}</label>
              <input type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required />
            </div>
            <div className="form-actions">
              <button type="submit">{editingCategory ? 'Update' : 'Add'}</button>
              {editingCategory && <button type="button" onClick={() => { setEditingCategory(null); setCategoryName(''); }}>Cancel</button>}
            </div>
          </form>
          <ul className="category-list">
            {categories.map(cat => (
              <li key={cat.id} className="category-item">
                <span>{cat.name}</span>
                <div className="category-actions">
                  <button onClick={() => handleEditCategoryClick(cat)}>✏️</button>
                  <button onClick={() => handleDeleteCategoryClick(cat.id)}>🗑️</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="item-management">
          <h2>Upload New Item</h2>
          <form onSubmit={handleItemSubmit} className="upload-form form-container">
            <div className="form-group">
              <label>Title</label>
              <input type="text" name="title" value={itemFormData.title} onChange={handleItemFormChange} required />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select name="category_id" value={itemFormData.category_id} onChange={handleItemFormChange} required>
                <option value="" disabled>Select a category</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>File</label>
              <input type="file" id="file-input" onChange={handleFileChange} required />
            </div>
            <button type="submit">Upload Item</button>
          </form>

          <h2>Library Items</h2>
          {loading && <p>Loading...</p>}
          {error && <p className="error-message">{error}</p>}
          {!loading && !error && (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td><a href={`http://localhost:3001/${item.file_path}`} target="_blank" rel="noopener noreferrer" className="item-link">{item.title}</a></td>
                    <td>{item.category_name || 'N/A'}</td>
                    <td className="actions">
                      <button className="delete-btn" onClick={() => handleDeleteItemClick(item.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default LibraryManagementPage;
