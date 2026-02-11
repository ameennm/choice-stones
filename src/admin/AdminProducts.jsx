import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, Image, X, Upload, Save, Loader } from 'lucide-react'
import { databases, storage, DATABASE_ID, COLLECTION_ID, BUCKET_ID, ID } from '../lib/appwrite'
import { Query } from 'appwrite'
import { categories } from '../data/products'

function AdminProducts() {
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [showModal, setShowModal] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [showImageModal, setShowImageModal] = useState(false)
    const [selectedProductForImages, setSelectedProductForImages] = useState(null)
    const [uploading, setUploading] = useState(false)

    // Fetch products from Appwrite
    const fetchProducts = async () => {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID,
                [
                    Query.orderDesc('$createdAt'),
                    Query.limit(1000)
                ]
            )
            setProducts(response.documents)
        } catch (error) {
            console.error('Error fetching products:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id)
                setProducts(products.filter(p => p.$id !== id))
            } catch (error) {
                console.error('Error deleting product:', error)
                alert('Failed to delete product')
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
            sizes: [], // Handled as array of strings
            finish: [],
            thickness: [],
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

    const handleSave = async () => {
        const payload = {
            name: editingProduct.name,
            subtitle: editingProduct.subtitle,
            description: editingProduct.description,
            category: editingProduct.category,
            price: parseFloat(editingProduct.price) || 0,
            unit: editingProduct.unit,
            minOrder: parseInt(editingProduct.minOrder) || 0,
            inStock: editingProduct.inStock,
            featured: editingProduct.featured,
            images: editingProduct.images
        }

        try {
            if (editingProduct.$id) {
                // Update
                const response = await databases.updateDocument(
                    DATABASE_ID,
                    COLLECTION_ID,
                    editingProduct.$id,
                    payload
                )
                setProducts(products.map(p => p.$id === editingProduct.$id ? response : p))
            } else {
                // Create
                const response = await databases.createDocument(
                    DATABASE_ID,
                    COLLECTION_ID,
                    ID.unique(),
                    payload
                )
                setProducts([...products, response])
            }
            setShowModal(false)
            setEditingProduct(null)
        } catch (error) {
            console.error('Error saving product:', error)
            alert('Failed to save product: ' + error.message)
        }
    }

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
                const response = await storage.createFile(
                    BUCKET_ID,
                    ID.unique(),
                    file
                )

                const fileUrl = storage.getFileView(BUCKET_ID, response.$id).href
                uploadedUrls.push(fileUrl)
            }

            const updatedImages = [...(selectedProductForImages.images || []), ...uploadedUrls]

            // Update product directly
            const updatedProduct = await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                selectedProductForImages.$id,
                { images: updatedImages }
            )

            // Update local state
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

    const handlePebbleUpdate = async () => {
        if (!confirm('This will rename "Kalstone" to "Choice" in Pebble Stones category and add 4 new pebble products. Continue?')) return;
        setIsLoading(true);
        try {
            // 1. Rename existing
            let updateCount = 0;
            const updates = products.filter(p =>
                p.category === 'pebble-stones' && (
                    (p.name && p.name.toLowerCase().includes('kalstone')) ||
                    (p.description && p.description.toLowerCase().includes('kalstone'))
                )
            );

            for (const p of updates) {
                const newName = p.name ? p.name.replace(/Kalstone/gi, 'Choice') : p.name;
                const newDesc = p.description ? p.description.replace(/Kalstone/gi, 'Choice') : p.description;

                await databases.updateDocument(DATABASE_ID, COLLECTION_ID, p.$id, {
                    name: newName,
                    description: newDesc
                });
                updateCount++;
            }

            // 2. Add New Products
            const newItems = [
                { name: "White Polished Pebble", category: "pebble-stones", description: "Premium white polished pebbles for garden and landscaping.", price: 0, unit: "kg", inStock: true, featured: false, images: [] },
                { name: "White Unpolished Pebble", category: "pebble-stones", description: "Natural white unpolished pebbles for rustic garden designs.", price: 0, unit: "kg", inStock: true, featured: false, images: [] },
                { name: "Black Polished Pebble", category: "pebble-stones", description: "Elegant black polished pebbles for sophisticated landscaping.", price: 0, unit: "kg", inStock: true, featured: false, images: [] },
                { name: "Black Unpolished Pebble", category: "pebble-stones", description: "Natural black unpolished pebbles for textured ground cover.", price: 0, unit: "kg", inStock: true, featured: false, images: [] }
            ];

            let addCount = 0;
            for (const item of newItems) {
                // Check if exists (case insensitive)
                const exists = products.some(p => p.name.toLowerCase() === item.name.toLowerCase());
                if (!exists) {
                    await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), item);
                    addCount++;
                }
            }

            alert(`Success! Updated ${updateCount} products. Added ${addCount} new products.`);
            fetchProducts();

        } catch (error) {
            console.error('Update Pebbles Error:', error);
            alert('Error updating pebbles: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    }

    const handleCladdingUpdate = async () => {
        if (!confirm(`This will attempt to add  missing cladding products. Continue?`)) return;
        setIsLoading(true);
        try {
            // Fetch latest to be sure
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID,
                [Query.limit(1000)]
            );
            const currentProducts = response.documents;
            const currentNames = new Set(currentProducts.map(p => p.name.toLowerCase().trim()));

            let addedCount = 0;
            let skippedCount = 0;
            // Import dynamically to avoid top-level issues if file missing, though we just created it.
            const { claddingProductsToAdd } = await import('../data/claddingProducts');

            for (const item of claddingProductsToAdd) {
                const normalizedName = item.name.toLowerCase().trim();

                // Duplicate check REMOVED to force add 142 items as requested by user
                // if (currentNames.has(normalizedName)) {
                //     skippedCount++;
                //     continue;
                // }

                const payload = {
                    name: item.name,
                    category: 'cladding-stones',
                    sizes: item.sizes || [],
                    description: item.description || `Premium ${item.name} product for cladding.`,
                    price: 0,
                    unit: 'sq.ft',
                    inStock: true,
                    featured: false,
                    images: []
                };

                await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), payload);
                currentNames.add(normalizedName);
                addedCount++;
            }

            alert(`Success! Added ${addedCount} products. Skipped ${skippedCount} existing.`);
            fetchProducts();
        } catch (error) {
            console.error('Update Cladding Error:', error);
            alert('Error updating cladding: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) return <div className="loading-container"><Loader className="spin" /> Loading products...</div>

    return (
        <div className="admin-products">
            <div className="page-header">
                <div>
                    <h1>Products</h1>
                    <p>Manage your product catalog</p>
                </div>
                <button className="btn btn-secondary" onClick={handlePebbleUpdate} style={{ marginRight: '10px' }}>
                    <Save size={20} />
                    Update Pebbles
                </button>
                <button className="btn btn-secondary" onClick={handleCladdingUpdate} style={{ marginRight: '10px' }}>
                    <Upload size={20} />
                    Import Cladding
                </button>
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
                            <tr key={product.$id}>
                                <td>
                                    <div className="product-cell">
                                        {/* Show image if exists, else placeholder */}
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
                                            onClick={() => handleDelete(product.$id)}
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
                            <h2>{editingProduct.$id ? 'Edit Product' : 'Add New Product'}</h2>
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
                                        onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
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
                                        onChange={(e) => setEditingProduct({ ...editingProduct, minOrder: e.target.value })}
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
                                    <h4>Current Images ({selectedProductForImages.images?.length || 0}/4)</h4>
                                    <div className="images-grid">
                                        {selectedProductForImages.images?.map((img, index) => (
                                            <div key={index} className="image-item">
                                                <img
                                                    src={img}
                                                    alt={`Product ${index + 1}`}
                                                    onError={(e) => e.target.src = '/logo.png'}
                                                />
                                                <button className="remove-image" onClick={() => removeImage(index)}>
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        {(!selectedProductForImages.images || selectedProductForImages.images.length === 0) && (
                                            <p className="no-images">No images uploaded</p>
                                        )}
                                    </div>
                                </div>
                                <div className="upload-section">
                                    <h4>Upload New Images</h4>
                                    <div className="upload-area">
                                        {uploading ? (
                                            <div className="upload-loading">
                                                <Loader className="spin" /> Uploading to Appwrite Storage...
                                            </div>
                                        ) : (
                                            <>
                                                <Upload size={32} />
                                                <p>Click to browse images</p>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={handleImageUpload}
                                                    disabled={selectedProductForImages.images?.length >= 4}
                                                />
                                            </>
                                        )}
                                    </div>
                                    <p className="upload-note">
                                        Images are securely stored in Appwrite Storage.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowImageModal(false)}>
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
