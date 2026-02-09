import { useState } from 'react'
import { Plus, Search, Edit, Trash2, Image, X, Upload, Save } from 'lucide-react'
import { products as initialProducts, categories } from '../data/products'

function AdminProducts() {
    const [products, setProducts] = useState(initialProducts)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [showModal, setShowModal] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [showImageModal, setShowImageModal] = useState(false)
    const [selectedProductForImages, setSelectedProductForImages] = useState(null)

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
            setProducts(products.filter(p => p.id !== id))
        }
    }

    const handleEdit = (product) => {
        setEditingProduct({ ...product })
        setShowModal(true)
    }

    const handleAddNew = () => {
        setEditingProduct({
            id: `product-${Date.now()}`,
            name: '',
            subtitle: '',
            description: '',
            category: categories[0]?.id || '',
            price: 0,
            unit: 'sq.ft',
            minOrder: 100,
            sizes: ['2x2 ft'],
            finish: ['Polished'],
            thickness: ['25mm'],
            features: [],
            applications: [],
            images: [],
            inStock: true,
            featured: false,
            rating: 4.5,
            reviews: 0
        })
        setShowModal(true)
    }

    const handleSave = () => {
        if (products.find(p => p.id === editingProduct.id)) {
            setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p))
        } else {
            setProducts([...products, editingProduct])
        }
        setShowModal(false)
        setEditingProduct(null)
    }

    const openImageManager = (product) => {
        setSelectedProductForImages(product)
        setShowImageModal(true)
    }

    return (
        <div className="admin-products">
            <div className="page-header">
                <div>
                    <h1>Products</h1>
                    <p>Manage your product catalog</p>
                </div>
                <button className="btn btn-primary" onClick={handleAddNew}>
                    <Plus size={20} />
                    Add Product
                </button>
            </div>

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
                            <th>Featured</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(product => (
                            <tr key={product.id}>
                                <td>
                                    <div className="product-cell">
                                        <img src={product.images[0] || '/logo.png'} alt={product.name} />
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
                                    <span className={`status-badge ${product.featured ? 'primary' : 'default'}`}>
                                        {product.featured ? 'Yes' : 'No'}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            className="action-btn"
                                            title="Manage Images"
                                            onClick={() => openImageManager(product)}
                                        >
                                            <Image size={16} />
                                        </button>
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
                        ))}
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
                            <h2>{editingProduct.id.startsWith('product-') ? 'Add New Product' : 'Edit Product'}</h2>
                            <button className="close-btn" onClick={() => setShowModal(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Product Name *</label>
                                    <input
                                        type="text"
                                        value={editingProduct.name}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                        placeholder="Enter product name"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Subtitle</label>
                                    <input
                                        type="text"
                                        value={editingProduct.subtitle}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, subtitle: e.target.value })}
                                        placeholder="Enter subtitle"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Category *</label>
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
                                    <label>Price (₹) *</label>
                                    <input
                                        type="number"
                                        value={editingProduct.price}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Unit *</label>
                                    <input
                                        type="text"
                                        value={editingProduct.unit}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Min Order</label>
                                    <input
                                        type="number"
                                        value={editingProduct.minOrder}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, minOrder: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>Description</label>
                                    <textarea
                                        value={editingProduct.description}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                                        rows="4"
                                        placeholder="Enter product description"
                                    ></textarea>
                                </div>
                                <div className="form-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={editingProduct.inStock}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                                        />
                                        In Stock
                                    </label>
                                </div>
                                <div className="form-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={editingProduct.featured}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                                        />
                                        Featured Product
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={handleSave}>
                                <Save size={18} />
                                Save Product
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Manager Modal */}
            {showImageModal && selectedProductForImages && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>Manage Images - {selectedProductForImages.name}</h2>
                            <button className="close-btn" onClick={() => setShowImageModal(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="image-manager">
                                <div className="current-images">
                                    <h4>Current Images</h4>
                                    <div className="images-grid">
                                        {selectedProductForImages.images.map((img, index) => (
                                            <div key={index} className="image-item">
                                                <img src={img} alt={`Product ${index + 1}`} />
                                                <button className="remove-image">
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        {selectedProductForImages.images.length === 0 && (
                                            <p className="no-images">No images uploaded</p>
                                        )}
                                    </div>
                                </div>
                                <div className="upload-section">
                                    <h4>Upload New Images</h4>
                                    <div className="upload-area">
                                        <Upload size={32} />
                                        <p>Drag and drop images here or click to browse</p>
                                        <input type="file" accept="image/*" multiple />
                                    </div>
                                    <p className="upload-note">
                                        Note: In production, this will connect to Appwrite storage for image uploads.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowImageModal(false)}>
                                Close
                            </button>
                            <button className="btn btn-primary">
                                <Save size={18} />
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminProducts
