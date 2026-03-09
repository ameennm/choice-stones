import { useState, useEffect, useMemo } from 'react'
import { getImagesArray } from '../lib/utils'
import { Plus, Search, Edit, Trash2, Image, X, Upload, Save, Loader } from 'lucide-react'
import { categories } from '../data/products'

function AdminProducts() {
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [showModal, setShowModal] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [isUploading, setIsUploading] = useState(false)
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
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                const res = await fetch('/api/delete-product', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id })
                });
                if (!res.ok) throw new Error('Delete failed');
                setStatusMsg('✅ Product deleted successfully');
                fetchProducts();
            } catch (err) {
                alert('Delete failed: ' + err.message);
            }
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
            const res = await fetch('/api/update-product', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingProduct)
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Failed to update');
            }

            setStatusMsg('✅ Product updated successfully!');
            setShowModal(false);
            fetchProducts(); // Refresh list
        } catch (error) {
            console.error('Error saving product:', error)
            setStatusMsg('❌ Failed to save: ' + error.message)
            alert('Failed to save: ' + error.message);
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
                            const images = getImagesArray(product.images);
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
                                        <span className={`status - badge ${product.inStock ? 'success' : 'danger'} `}>
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

            {/* Edit/Add Modal */}
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
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Product Name</label>
                                    <input
                                        type="text"
                                        value={editingProduct.name}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select
                                        value={editingProduct.category}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Price (₹)</label>
                                    <input
                                        type="number"
                                        value={editingProduct.price}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Unit</label>
                                    <input
                                        type="text"
                                        value={editingProduct.unit}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value })}
                                    />
                                </div>
                                <div className="form-group full-width" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <input
                                        type="checkbox"
                                        id="inStock"
                                        checked={editingProduct.inStock}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                                    />
                                    <label htmlFor="inStock" style={{ margin: 0 }}>In Stock</label>
                                </div>
                                <div className="form-group full-width">
                                    <label>Description</label>
                                    <textarea
                                        value={editingProduct.description}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                                        rows="3"
                                    />
                                </div>

                                {/* Image Management */}
                                <div className="form-group full-width">
                                    <label style={{ display: 'block', marginBottom: '10px' }}>Product Images</label>
                                    <div className="admin-image-grid">
                                        {getImagesArray(editingProduct.images).map((img, idx) => (
                                            <div key={idx} className="admin-image-item">
                                                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                <div className="admin-image-actions">
                                                    <button
                                                        onClick={() => {
                                                            const current = getImagesArray(editingProduct.images);
                                                            const updated = current.filter((_, i) => i !== idx);
                                                            setEditingProduct({ ...editingProduct, images: updated });
                                                        }}
                                                        className="admin-image-btn primary"
                                                        title="Remove from product"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            if (confirm('Permanently delete this image file from the server? THIS CANNOT BE UNDONE.')) {
                                                                try {
                                                                    const res = await fetch('/api/delete-image', {
                                                                        method: 'POST',
                                                                        headers: { 'Content-Type': 'application/json' },
                                                                        body: JSON.stringify({ url: img })
                                                                    });
                                                                    const data = await res.json();
                                                                    if (!res.ok) throw new Error(data.message || 'Delete failed');

                                                                    const current = getImagesArray(editingProduct.images);
                                                                    const updated = current.filter((_, i) => i !== idx);
                                                                    setEditingProduct({ ...editingProduct, images: updated });
                                                                    setStatusMsg(data.message || '🗑️ Image removed from product');
                                                                } catch (err) {
                                                                    alert('Delete failed: ' + err.message);
                                                                }
                                                            }
                                                        }}
                                                        className="admin-image-btn danger"
                                                        title="Delete file permanently"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ marginTop: '10px' }}>
                                        <label className="btn btn-secondary btn-sm" style={{ cursor: isUploading ? 'not-allowed' : 'pointer', opacity: isUploading ? 0.7 : 1, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                            {isUploading ? <Loader className="spin" size={16} /> : <Upload size={16} />}
                                            {isUploading ? 'Uploading...' : 'Upload & Add Image'}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={async (e) => {
                                                    const file = e.target.files[0];
                                                    if (!file) return;
                                                    setIsUploading(true);
                                                    try {
                                                        const reader = new FileReader();
                                                        reader.readAsDataURL(file);
                                                        reader.onload = async () => {
                                                            const base64Data = reader.result.split(',')[1];
                                                            const res = await fetch('/api/upload-image', {
                                                                method: 'POST',
                                                                headers: { 'Content-Type': 'application/json' },
                                                                body: JSON.stringify({ name: file.name, base64Data })
                                                            });
                                                            if (!res.ok) throw new Error('Upload failed');
                                                            const data = await res.json();
                                                            const current = getImagesArray(editingProduct.images);
                                                            setEditingProduct({ ...editingProduct, images: [...current, data.url] });
                                                            setIsUploading(false);
                                                        };
                                                    } catch (err) {
                                                        console.error(err);
                                                        alert('Upload failed: ' + err.message);
                                                        setIsUploading(false);
                                                    }
                                                }}
                                                style={{ display: 'none' }}
                                                disabled={isUploading}
                                            />
                                        </label>
                                    </div>
                                    <p style={{ fontSize: '11px', color: '#888', marginTop: '10px' }}>
                                        Note: New uploads will save to the unassigned folder.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={handleSave}>
                                <Save size={18} /> Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminProducts
