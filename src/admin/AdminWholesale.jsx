import { useState, useEffect } from 'react'
import { getImagesArray } from '../lib/utils'
import { Plus, Search, Edit, Trash2, Image, X, Upload, Save, Loader } from 'lucide-react'

function AdminWholesale() {
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [showImageModal, setShowImageModal] = useState(false)
    const [selectedProductForImages, setSelectedProductForImages] = useState(null)
    const [uploading, setUploading] = useState(false)


    // Fetch wholesale products
    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products')
            const allProducts = await response.json()
            const wsProducts = allProducts.filter(p => p.category === 'wholesale')
            setProducts(wsProducts)
        } catch (error) {
            console.error('Error fetching wholesale products:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const filteredProducts = products.filter(product => {
        return (product.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    })

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this wholesale product?')) {
            try {
                const res = await fetch('/api/delete-product', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id })
                });
                if (!res.ok) throw new Error('Delete failed');
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
            category: 'wholesale',
            price: 0,
            unit: 'sq.ft',
            minOrder: 100,
            sizes: [],
            images: [],
            inStock: true,
            featured: false
        })
        setShowModal(true)
    }

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/update-product', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...editingProduct, category: 'wholesale' })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Failed to update');
            }

            setShowModal(false);
            fetchProducts();
        } catch (error) {
            console.error('Error saving wholesale product:', error);
            alert('Failed to save: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    }

    // Image logic is same as AdminProducts, can be extracted but for speed copying
    const openImageManager = (product) => {
        setSelectedProductForImages({ ...product })
        setShowImageModal(true)
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
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

                const currentImages = getImagesArray(selectedProductForImages.images);
                const updatedImages = [...currentImages, data.url];

                // Update database
                const updateRes = await fetch('/api/update-product', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...selectedProductForImages, images: updatedImages })
                });

                if (!updateRes.ok) throw new Error('Failed to update product images');

                setSelectedProductForImages({ ...selectedProductForImages, images: updatedImages });
                fetchProducts();
                setUploading(false);
            };
        } catch (error) {
            console.error('Error uploading images:', error);
            alert('Failed to upload images: ' + error.message);
            setUploading(false);
        }
    }

    const removeImage = async (indexToRemove) => {
        if (!confirm('Remove this image from this product?')) return
        const currentImages = getImagesArray(selectedProductForImages.images);
        const updatedImages = currentImages.filter((_, index) => index !== indexToRemove)

        try {
            const res = await fetch('/api/update-product', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...selectedProductForImages, images: updatedImages })
            });

            if (!res.ok) throw new Error('Failed to update');

            setSelectedProductForImages({ ...selectedProductForImages, images: updatedImages });
            fetchProducts();
        } catch (error) {
            console.error('Error removing image:', error)
            alert('Failed to remove: ' + error.message);
        }
    }

    if (isLoading) return <div className="loading-container"><Loader className="spin" /> Loading...</div>

    return (
        <div className="admin-products">
            <div className="page-header">
                <div>
                    <h1>Wholesale Products</h1>
                    <p>Manage products available for bulk order</p>
                </div>
                <button className="btn btn-primary" onClick={handleAddNew}>
                    <Plus size={20} />
                    Add Product
                </button>
            </div>

            <div className="filters-bar">
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search wholesale products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="products-table-container">
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Unit</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(product => (
                            <tr key={product.id}>
                                <td>
                                    <div className="product-cell">
                                        <img
                                            src={getImagesArray(product.images)[0] || '/logo.png'}
                                            alt={product.name}
                                            onError={(e) => e.target.src = '/logo.png'}
                                        />
                                        <div>
                                            <span className="product-name">{product.name}</span>
                                            <span className="product-subtitle">{product.subtitle}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>{product.unit}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="action-btn" onClick={() => openImageManager(product)}><Image size={16} /></button>
                                        <button className="action-btn" onClick={() => handleEdit(product)}><Edit size={16} /></button>
                                        <button className="action-btn danger" onClick={() => handleDelete(product.id)}><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredProducts.length === 0 && <div className="no-results"><p>No wholesale products found</p></div>}
            </div>

            {/* Modals are same as AdminProducts mostly, simplified */}
            {showModal && editingProduct && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>{editingProduct.$id ? 'Edit Product' : 'Add Wholesale Product'}</h2>
                            <button className="close-btn" onClick={() => setShowModal(false)}><X size={24} /></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Product Name *</label>
                                    <input type="text" value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Unit *</label>
                                    <input type="text" value={editingProduct.unit} onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value })} />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleSave}><Save size={18} /> Save</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Modal - Copied logic */}
            {showImageModal && selectedProductForImages && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>Manage Images</h2>
                            <button className="close-btn" onClick={() => setShowImageModal(false)}><X size={24} /></button>
                        </div>
                        <div className="modal-body">
                            <div className="image-manager">
                                <div className="current-images">
                                    <div className="admin-image-grid">
                                        {getImagesArray(selectedProductForImages.images).map((img, index) => (
                                            <div key={index} className="admin-image-item">
                                                <img src={img} onError={(e) => e.target.src = '/logo.png'} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }} />
                                                <div className="admin-image-actions">
                                                    <button
                                                        onClick={() => removeImage(index)}
                                                        className="admin-image-btn primary"
                                                        title="Remove from product"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            if (confirm('Permanently delete this image file? THIS CANNOT BE UNDONE.')) {
                                                                try {
                                                                    const res = await fetch('/api/delete-image', {
                                                                        method: 'POST',
                                                                        headers: { 'Content-Type': 'application/json' },
                                                                        body: JSON.stringify({ url: img })
                                                                    });
                                                                    const data = await res.json();
                                                                    if (!res.ok) throw new Error(data.error || 'Delete failed');

                                                                    const updatedImages = getImagesArray(selectedProductForImages.images).filter((_, i) => i !== index);
                                                                    setSelectedProductForImages({ ...selectedProductForImages, images: updatedImages });
                                                                    setProducts(products.map(p => p.id === selectedProductForImages.id ? { ...p, images: updatedImages } : p));
                                                                    alert(data.message || '🗑️ Image removed successfully.');
                                                                } catch (err) {
                                                                    alert('Delete failed: ' + err.message);
                                                                }
                                                            }
                                                        }}
                                                        className="admin-image-btn danger"
                                                        title="Permanent Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="upload-section">
                                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploading || selectedProductForImages.images?.length >= 4} />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowImageModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminWholesale
