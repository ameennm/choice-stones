import { useState, useEffect } from 'react'
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
        return product.name.toLowerCase().includes(searchTerm.toLowerCase())
    })

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this wholesale product?')) {
            alert('Delete functionality not yet implemented in Cloudflare proxy.');
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
        alert('Wholesale product editing is pending Cloudflare API migration. Use the Master Image Mapping for images.');
        setShowModal(false);
    }

    // Image logic is same as AdminProducts, can be extracted but for speed copying
    const openImageManager = (product) => {
        setSelectedProductForImages(product)
        setShowImageModal(true)
    }

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files)
        if (!files.length) return
        if (selectedProductForImages.images.length + files.length > 4) {
            alert('Maximum 4 images allowed per product')
            return
        }
        setUploading(true)
        try {
            const uploadedUrls = []
            for (const file of files) {
                const response = await storage.createFile(BUCKET_ID, ID.unique(), file)
                const fileUrl = storage.getFileView(BUCKET_ID, response.$id).href
                uploadedUrls.push(fileUrl)
            }
            const updatedImages = [...(selectedProductForImages.images || []), ...uploadedUrls]
            const updatedProduct = await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                selectedProductForImages.$id,
                { images: updatedImages }
            )
            setSelectedProductForImages(updatedProduct)
            setProducts(products.map(p => p.$id === updatedProduct.$id ? updatedProduct : p))
        } catch (error) {
            console.error('Error uploading images:', error)
            alert('Failed to upload images')
        } finally {
            setUploading(false)
        }
    }

    const removeImage = async (indexToRemove) => {
        if (!confirm('Remove this image?')) return
        const updatedImages = selectedProductForImages.images.filter((_, index) => index !== indexToRemove)
        try {
            const updatedProduct = await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                selectedProductForImages.$id,
                { images: updatedImages }
            )
            setSelectedProductForImages(updatedProduct)
            setProducts(products.map(p => p.$id === updatedProduct.$id ? updatedProduct : p))
        } catch (error) {
            console.error('Error removing image:', error)
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
                                            src={product.images && product.images.length > 0 ? product.images[0] : '/logo.png'}
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
                                    <div className="images-grid">
                                        {selectedProductForImages.images?.map((img, index) => (
                                            <div key={index} className="image-item">
                                                <img src={img} onError={(e) => e.target.src = '/logo.png'} />
                                                <button className="remove-image" onClick={() => removeImage(index)}><X size={16} /></button>
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
