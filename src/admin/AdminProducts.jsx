import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, Image, X, Upload, Save, Loader } from 'lucide-react'
import { categories } from '../data/products'

function AdminProducts() {
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [showModal, setShowModal] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [statusMsg, setStatusMsg] = useState('')

    // Fetch products from local API (proxied to D1)
    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products')
            const data = await response.json()
            if (data.error) throw new Error(data.error)
            setProducts(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error('Error fetching products:', error)
            setStatusMsg('Error fetching products')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const filteredProducts = products.filter(product => {
        const term = searchTerm.toLowerCase()
        const matchesSearch =
            (product.name || '').toLowerCase().includes(term) ||
            (product.subtitle || '').toLowerCase().includes(term) ||
            (product.description || '').toLowerCase().includes(term)

        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this product? In D1 migration, this will require a manual SQL command or an API update.')) {
            // Note: Currently we don't have a DELETE endpoint in the local proxy, but we can add one if needed.
            // For now, let's keep it as an alert.
            alert('Delete functionality not yet implemented in D1 proxy.');
        }
    }

    const handleEdit = (product) => {
        setEditingProduct({ ...product })
        setShowModal(true)
    }

    const handleAddNew = () => {
        setEditingProduct({
            name: '',
            subtitle: '',
            description: '',
            category: categories[0]?.id || 'paving-stones',
            price: 0,
            unit: 'sq.ft',
            minOrder: 100,
            images: [],
            inStock: true,
            featured: false
        })
        setShowModal(true)
    }

    const handleSave = async () => {
        setStatusMsg('Saving...')
        try {
            // Since we don't have a generic "update product" endpoint yet, 
            // and the user primarily wants to fix IMAGES, let's inform them.
            // We could add an /api/update-product to vite.config.js
            alert('General product editing (text/price) is pending migration to D1 API. Use the Image Mapping tool for image assignments.');
            setShowModal(false);
        } catch (error) {
            console.error('Error saving product:', error)
            setStatusMsg('Failed to save product')
        }
    }

    if (isLoading) return <div className="loading-container"><Loader className="spin" /> Loading products from D1...</div>

    return (
        <div className="admin-products">
            <div className="page-header">
                <div>
                    <h1>Products (D1 Database)</h1>
                    <p>Manage your product catalog</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn btn-secondary" onClick={() => window.location.hash = '/admin/image-mapping'}>
                        <Image size={20} />
                        Master Image Mapping
                    </button>
                    <button className="btn btn-primary" onClick={handleAddNew}>
                        <Plus size={20} />
                        Add Product
                    </button>
                </div>
            </div>

            {statusMsg && <div className="status-banner">{statusMsg}</div>}

            {/* Filters */}
            <div className="filters-bar">
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="all">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            {/* Products Table */}
            <div className="products-table-container">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(product => {
                            const images = typeof product.images === 'string' ? JSON.parse(product.images || '[]') : (product.images || []);
                            return (
                                <tr key={product.id}>
                                    <td>
                                        <div className="product-cell">
                                            <img
                                                src={images.length > 0 ? images[0] : '/logo.png'}
                                                alt={product.name}
                                                onError={(e) => e.target.src = '/logo.png'}
                                            />
                                            <div>
                                                <span className="product-name">{product.name}</span>
                                                <span className="product-subtitle">{product.subtitle}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="category-badge">
                                            {categories.find(c => c.id === product.category)?.name || product.category}
                                        </span>
                                    </td>
                                    <td>₹{product.price}/{product.unit}</td>
                                    <td>
                                        <span className={`status-badge ${product.inStock ? 'success' : 'danger'}`}>
                                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="action-btn"
                                                title="Edit"
                                                onClick={() => handleEdit(product)}
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                className="action-btn danger"
                                                title="Delete"
                                                onClick={() => handleDelete(product.id)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

                {filteredProducts.length === 0 && (
                    <div className="no-results">
                        <p>No products found</p>
                    </div>
                )}
            </div>

            {/* Edit/Add Modal (Simplified for now) */}
            {showModal && editingProduct && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>{editingProduct.id ? 'Edit Product' : 'Add New Product'}</h2>
                            <button className="close-btn" onClick={() => setShowModal(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Product editing is currently read-only in this view during migration.</p>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Product Name</label>
                                    <input type="text" value={editingProduct.name} readOnly />
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <input type="text" value={editingProduct.category} readOnly />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminProducts
