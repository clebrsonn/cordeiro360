import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
// We can reuse some styles from other admin pages
import './CutsManagementPage.css';

// --- Interfaces ---
interface Product {
  id: number;
  name: string;
  description: string;
  unit: string;
}

interface StockMovement {
    id: number;
    product_name: string;
    quantity: number;
    movement_date: string;
    type: 'compra' | 'uso' | 'ajuste';
    cost_per_unit: number;
    unit: string;
}

const StockManagementPage: React.FC = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const headers = { Authorization: `Bearer ${token}` };

    // --- State ---
    const [products, setProducts] = useState<Product[]>([]);
    const [movements, setMovements] = useState<StockMovement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- Product Form State ---
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [productFormData, setProductFormData] = useState({ name: '', description: '', unit: '' });

    // --- Movement Form State ---
    const [movementFormData, setMovementFormData] = useState({
        product_id: '',
        quantity: '',
        movement_date: new Date().toISOString().split('T')[0], // Default to today
        type: 'compra',
        cost_per_unit: ''
    });

    // --- Data Fetching ---
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [productsRes, movementsRes] = await Promise.all([
                axios.get('/api/products', { headers }),
                axios.get('/api/stock/movements', { headers })
            ]);
            setProducts(productsRes.data);
            setMovements(movementsRes.data);
        } catch (err) {
            setError('Falha ao carregar dados de estoque.');
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- Handlers for Products ---
    const handleProductFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProductFormData({ ...productFormData, [e.target.name]: e.target.value });
    };

    const handleProductFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const method = editingProduct ? 'put' : 'post';
        const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
        try {
            await axios[method](url, productFormData, { headers });
            setEditingProduct(null);
            setProductFormData({ name: '', description: '', unit: '' });
            fetchData(); // Refresh data
        } catch (err: any) {
            setError(err.response?.data?.message || 'Falha ao salvar produto.');
        }
    };

    const handleEditProductClick = (product: Product) => {
        setEditingProduct(product);
        setProductFormData({ name: product.name, description: product.description, unit: product.unit });
    };

    const handleDeleteProductClick = async (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este produto? Todas as movimentações associadas serão perdidas.')) {
            try {
                await axios.delete(`/api/products/${id}`, { headers });
                fetchData(); // Refresh data
            } catch (err: any) {
                setError(err.response?.data?.message || 'Falha ao excluir produto.');
            }
        }
    };

    // --- Handlers for Movements ---
    const handleMovementFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setMovementFormData({ ...movementFormData, [e.target.name]: e.target.value });
    };

    const handleMovementFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Adjust quantity for 'uso' type
        const quantity = movementFormData.type === 'uso'
            ? -Math.abs(parseFloat(movementFormData.quantity))
            : Math.abs(parseFloat(movementFormData.quantity));

        const dataToSend = { ...movementFormData, quantity };

        try {
            await axios.post('/api/stock/movements', dataToSend, { headers });
            setMovementFormData({
                product_id: '',
                quantity: '',
                movement_date: new Date().toISOString().split('T')[0],
                type: 'compra',
                cost_per_unit: ''
            });
            fetchData(); // Refresh data
        } catch (err: any) {
            setError(err.response?.data?.message || 'Falha ao registrar movimentação.');
        }
    };


    // --- Render ---
    return (
        <div className="admin-page">
            <header className="admin-header">
                <button onClick={() => navigate('/')} className="back-button">← Voltar</button>
                <h1>Gerenciar Estoque e Produtos</h1>
            </header>

            {error && <p className="error-message" style={{ textAlign: 'center' }}>{error}</p>}
            {loading && <p style={{ textAlign: 'center' }}>Carregando dados...</p>}

            <div className="admin-content" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>

                {/* Column 1: Product Management & Movement Form */}
                <div>
                    {/* Product Form */}
                    <div className="form-container">
                        <h3>{editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}</h3>
                        <form onSubmit={handleProductFormSubmit}>
                            <div className="form-group">
                                <label>Nome do Produto</label>
                                <input type="text" name="name" value={productFormData.name} onChange={handleProductFormChange} required />
                            </div>
                            <div className="form-group">
                                <label>Descrição</label>
                                <textarea name="description" value={productFormData.description} onChange={handleProductFormChange}></textarea>
                            </div>
                             <div className="form-group">
                                <label>Unidade (ex: kg, L, un)</label>
                                <input type="text" name="unit" value={productFormData.unit} onChange={handleProductFormChange} required />
                            </div>
                            <div className="form-actions">
                                <button type="submit">{editingProduct ? 'Atualizar' : 'Adicionar'}</button>
                                {editingProduct && <button type="button" onClick={() => { setEditingProduct(null); setProductFormData({ name: '', description: '', unit: '' }); }}>Cancelar</button>}
                            </div>
                        </form>
                    </div>

                    {/* Movement Form */}
                    <div className="form-container" style={{ marginTop: '40px' }}>
                        <h3>Registrar Movimentação de Estoque</h3>
                        <form onSubmit={handleMovementFormSubmit}>
                            <div className="form-group">
                                <label>Produto</label>
                                <select name="product_id" value={movementFormData.product_id} onChange={handleMovementFormChange} required>
                                    <option value="" disabled>Selecione um produto</option>
                                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                             <div className="form-group">
                                <label>Tipo de Movimentação</label>
                                <select name="type" value={movementFormData.type} onChange={handleMovementFormChange} required>
                                    <option value="compra">Compra (Entrada)</option>
                                    <option value="uso">Uso (Saída)</option>
                                    <option value="ajuste">Ajuste</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Quantidade</label>
                                <input type="number" name="quantity" value={movementFormData.quantity} onChange={handleMovementFormChange} required />
                            </div>
                            {movementFormData.type === 'compra' && (
                                <div className="form-group">
                                    <label>Custo por Unidade (R$)</label>
                                    <input type="number" name="cost_per_unit" value={movementFormData.cost_per_unit} onChange={handleMovementFormChange} />
                                </div>
                            )}
                            <div className="form-group">
                                <label>Data da Movimentação</label>
                                <input type="date" name="movement_date" value={movementFormData.movement_date} onChange={handleMovementFormChange} required />
                            </div>
                            <button type="submit">Registrar Movimentação</button>
                        </form>
                    </div>
                </div>

                {/* Column 2: Product List & Movement History */}
                <div>
                    {/* Product List */}
                    <div className="list-container">
                        <h2>Lista de Produtos</h2>
                        <table className="admin-table">
                            <thead>
                                <tr><th>Nome</th><th>Unidade</th><th>Ações</th></tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p.id}>
                                        <td>{p.name}</td>
                                        <td>{p.unit}</td>
                                        <td className="actions">
                                            <button className="edit-btn" onClick={() => handleEditProductClick(p)}>Editar</button>
                                            <button className="delete-btn" onClick={() => handleDeleteProductClick(p.id)}>Excluir</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Movement History */}
                    <div className="list-container" style={{ marginTop: '40px' }}>
                        <h2>Histórico de Movimentações</h2>
                         <table className="admin-table">
                            <thead>
                                <tr><th>Data</th><th>Produto</th><th>Tipo</th><th>Qtd</th><th>Custo/Un</th></tr>
                            </thead>
                            <tbody>
                                {movements.map(m => (
                                    <tr key={m.id}>
                                        <td>{new Date(m.movement_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                                        <td>{m.product_name}</td>
                                        <td>{m.type}</td>
                                        <td style={{ color: m.quantity < 0 ? 'red' : 'green' }}>{m.quantity} {m.unit}</td>
                                        <td>{m.cost_per_unit ? `R$ ${m.cost_per_unit.toFixed(2)}` : 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default StockManagementPage;
