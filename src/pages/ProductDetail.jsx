import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
    Truck, Shield, Award, Phone,
    ChevronRight, Heart, Share2,
    ChevronLeft, ImageOff, ShoppingCart, Plus, Minus, Loader
} from 'lucide-react'
import useProductStore from '../store/productStore'
import useCartStore from '../store/cartStore'
import ProductCard from '../components/ProductCard'
import './ProductDetail.css'

function ProductDetail() {
    const { id } = useParams()
    const { getProduct, products, fetchProducts, loading } = useProductStore()
    const product = getProduct(id)

    const [selectedImage, setSelectedImage] = useState(0)
    const [imgErrors, setImgErrors] = useState({})
    const [quantity, setQuantity] = useState(1)
    const [addedToCart, setAddedToCart] = useState(false)
    const { addItem } = useCartStore()

    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    // Reset selected image when product changes
    useEffect(() => {
        setSelectedImage(0)
        setImgErrors({})
    }, [id])

    if (loading && !product) {
        return <div className="loading-container"><Loader className="spin" /> Loading product details...</div>
    }

    if (!product) {
        return (
            <div className="product-not-found">
                <div className="container">
                    <h2>Product not found</h2>
                    <Link to="/products" className="btn btn-primary">
                        Back to Products
                    </Link>
                </div>
            </div>
        )
    }

    const relatedProducts = products
        .filter(p => p.category === product.category && p.$id !== product.$id)
        .slice(0, 4)

    // Helper to facilitate category name lookup from store categories would be better, 
    // but for now we iterate over the store's categories
    const { categories } = useProductStore.getState()
    const categoryName = categories.find(c => c.id === product.category)?.name || product.category

    const nextImage = () => {
        if (!product.images || product.images.length === 0) return
        setSelectedImage((prev) => (prev + 1) % product.images.length)
    }

    const prevImage = () => {
        if (!product.images || product.images.length === 0) return
        setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length)
    }

    const handleImgError = (index) => {
        setImgErrors(prev => ({ ...prev, [index]: true }))
    }

    // Adapt legacy labels if needed, or just use generic
    const imageLabels = ['Front View', 'Side View', 'In Project', 'Close-up', 'Detail', 'Texture']

    return (
        <div className="product-detail">
            {/* Breadcrumb */}
            <div className="breadcrumb">
                <div className="container">
                    <Link to="/">Home</Link>
                    <ChevronRight size={16} />
                    <Link to={`/products?category=${product.category}`}>{categoryName}</Link>
                    <ChevronRight size={16} />
                    <span>{product.name}</span>
                </div>
            </div>

            {/* Product Info Section */}
            <section className="product-info section">
                <div className="container">
                    <div className="product-grid">
                        {/* Image Gallery */}
                        <div className="product-gallery">
                            <div className="main-image">
                                {product.images && product.images.length > 0 && !imgErrors[selectedImage] ? (
                                    <img
                                        src={product.images[selectedImage]}
                                        alt={`${product.name} - View ${selectedImage + 1}`}
                                        onError={() => handleImgError(selectedImage)}
                                    />
                                ) : (
                                    <div className="image-placeholder-large">
                                        <ImageOff size={60} />
                                        <p>Image Coming Soon</p>
                                    </div>
                                )}
                                {product.images && product.images.length > 1 && (
                                    <>
                                        <button className="gallery-nav prev" onClick={prevImage}>
                                            <ChevronLeft size={24} />
                                        </button>
                                        <button className="gallery-nav next" onClick={nextImage}>
                                            <ChevronRight size={24} />
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Thumbnail Gallery - Only show if images exist */}
                            {product.images && product.images.length > 1 && (
                                <div className="thumbnail-gallery">
                                    {product.images.map((img, index) => (
                                        <button
                                            key={index}
                                            className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                                            onClick={() => setSelectedImage(index)}
                                        >
                                            {!imgErrors[index] ? (
                                                <img
                                                    src={img}
                                                    alt={`${product.name} - Thumb ${index + 1}`}
                                                    onError={() => handleImgError(index)}
                                                />
                                            ) : (
                                                <div className="thumb-placeholder">
                                                    <ImageOff size={18} />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Details */}
                        <div className="product-details">
                            <span className="product-category-tag">
                                {categoryName}
                            </span>
                            {(product.subtitle || product.subcategory) && (
                                <span className="product-subcategory-tag">
                                    {product.subtitle || product.subcategory}
                                </span>
                            )}
                            <h1 className="product-title">{product.name}</h1>

                            {/* Sizes - Handle both legacy array or string */}
                            {(product.sizes || product.size) && (
                                <div className="product-size-info">
                                    <strong>Available Size:</strong> {
                                        Array.isArray(product.sizes) && product.sizes.length > 0
                                            ? product.sizes.join(', ')
                                            : (product.size || '')
                                    }
                                </div>
                            )}

                            <div className="product-description-block">
                                <p>{product.description}</p>
                            </div>

                            {/* Quantity Selector */}
                            <div className="quantity-selector-section">
                                <label>Quantity:</label>
                                <div className="quantity-selector">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1}
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                        min="1"
                                    />
                                    <button onClick={() => setQuantity(quantity + 1)}>
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="product-actions">
                                <button
                                    className={`btn btn-primary btn-lg ${addedToCart ? 'added' : ''}`}
                                    onClick={() => {
                                        addItem(product, quantity)
                                        setAddedToCart(true)
                                        setTimeout(() => setAddedToCart(false), 2000)
                                    }}
                                >
                                    <ShoppingCart size={20} />
                                    {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
                                </button>
                                <a
                                    href="tel:+916238165933"
                                    className="btn btn-secondary btn-icon-text"
                                    title="Call us"
                                >
                                    <Phone size={20} />
                                </a>
                                <button className="btn-icon">
                                    <Heart size={22} />
                                </button>
                                <button className="btn-icon">
                                    <Share2 size={22} />
                                </button>
                            </div>

                            {/* Trust Badges */}
                            <div className="trust-badges">
                                <div className="badge">
                                    <Truck size={20} />
                                    <span>Pan India Delivery</span>
                                </div>
                                <div className="badge">
                                    <Shield size={20} />
                                    <span>Quality Assured</span>
                                </div>
                                <div className="badge">
                                    <Award size={20} />
                                    <span>Export Grade</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <section className="related-products section">
                    <div className="container">
                        <div className="section-header">
                            <span className="section-subtitle">You May Also Like</span>
                            <h2 className="section-title">Related Products</h2>
                        </div>
                        <div className="products-grid">
                            {relatedProducts.map((rp, index) => (
                                <ProductCard key={rp.$id || rp.id} product={rp} index={index} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    )
}

export default ProductDetail
