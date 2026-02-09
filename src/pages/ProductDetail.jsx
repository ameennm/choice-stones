import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
    Star, ShoppingBag, Truck, Shield, Award, Phone,
    ChevronRight, Minus, Plus, Heart, Share2, Check,
    ChevronLeft
} from 'lucide-react'
import { products } from '../data/products'
import ProductCard from '../components/ProductCard'
import './ProductDetail.css'

function ProductDetail() {
    const { id } = useParams()
    const product = products.find(p => p.id === id)
    const [quantity, setQuantity] = useState(product?.minOrder || 100)
    const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || '')
    const [selectedFinish, setSelectedFinish] = useState(product?.finish[0] || '')
    const [selectedThickness, setSelectedThickness] = useState(product?.thickness[0] || '')
    const [activeTab, setActiveTab] = useState('description')
    const [selectedImage, setSelectedImage] = useState(0)

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
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 3)

    const totalPrice = quantity * product.price

    const nextImage = () => {
        setSelectedImage((prev) => (prev + 1) % product.images.length)
    }

    const prevImage = () => {
        setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length)
    }

    return (
        <div className="product-detail">
            {/* Breadcrumb */}
            <div className="breadcrumb">
                <div className="container">
                    <Link to="/">Home</Link>
                    <ChevronRight size={16} />
                    <Link to="/products">Products</Link>
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
                                <img src={product.images[selectedImage]} alt={product.name} />
                                {product.featured && (
                                    <span className="featured-badge">Featured</span>
                                )}
                                {product.images.length > 1 && (
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
                            {product.images.length > 1 && (
                                <div className="thumbnail-gallery">
                                    {product.images.map((img, index) => (
                                        <button
                                            key={index}
                                            className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                                            onClick={() => setSelectedImage(index)}
                                        >
                                            <img src={img} alt={`${product.name} view ${index + 1}`} />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Details */}
                        <div className="product-details">
                            <span className="product-category">
                                {product.category.replace('-', ' ')}
                            </span>
                            <h1 className="product-title">{product.name}</h1>
                            <p className="product-subtitle">{product.subtitle}</p>

                            {/* Rating */}
                            <div className="product-rating">
                                <div className="stars">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={18}
                                            fill={i < Math.floor(product.rating) ? 'var(--color-primary)' : 'transparent'}
                                            color="var(--color-primary)"
                                        />
                                    ))}
                                </div>
                                <span>{product.rating} ({product.reviews} reviews)</span>
                            </div>

                            {/* Price */}
                            <div className="product-pricing">
                                <div className="price-main">
                                    <span className="currency">₹</span>
                                    <span className="amount">{product.price}</span>
                                    <span className="unit">/{product.unit}</span>
                                </div>
                                <p className="min-order">Minimum order: {product.minOrder} {product.unit}</p>
                            </div>

                            {/* Options */}
                            <div className="product-options">
                                {/* Size */}
                                <div className="option-group">
                                    <label>Size:</label>
                                    <div className="option-buttons">
                                        {product.sizes.map(size => (
                                            <button
                                                key={size}
                                                className={`option-btn ${selectedSize === size ? 'active' : ''}`}
                                                onClick={() => setSelectedSize(size)}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Finish */}
                                <div className="option-group">
                                    <label>Finish:</label>
                                    <div className="option-buttons">
                                        {product.finish.map(finish => (
                                            <button
                                                key={finish}
                                                className={`option-btn ${selectedFinish === finish ? 'active' : ''}`}
                                                onClick={() => setSelectedFinish(finish)}
                                            >
                                                {finish}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Thickness */}
                                <div className="option-group">
                                    <label>Thickness:</label>
                                    <div className="option-buttons">
                                        {product.thickness.map(thick => (
                                            <button
                                                key={thick}
                                                className={`option-btn ${selectedThickness === thick ? 'active' : ''}`}
                                                onClick={() => setSelectedThickness(thick)}
                                            >
                                                {thick}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Quantity */}
                            <div className="quantity-section">
                                <label>Quantity ({product.unit}):</label>
                                <div className="quantity-control">
                                    <button
                                        onClick={() => setQuantity(Math.max(product.minOrder, quantity - 10))}
                                        disabled={quantity <= product.minOrder}
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(product.minOrder, parseInt(e.target.value) || product.minOrder))}
                                        min={product.minOrder}
                                    />
                                    <button onClick={() => setQuantity(quantity + 10)}>
                                        <Plus size={18} />
                                    </button>
                                </div>
                                <div className="total-price">
                                    <span>Total:</span>
                                    <span className="total-amount">₹{totalPrice.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="product-actions">
                                <Link to="/contact" className="btn btn-primary btn-lg">
                                    <Phone size={20} /> Get Quote
                                </Link>
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

            {/* Product Tabs */}
            <section className="product-tabs section">
                <div className="container">
                    <div className="tabs-header">
                        <button
                            className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                            onClick={() => setActiveTab('description')}
                        >
                            Description
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'features' ? 'active' : ''}`}
                            onClick={() => setActiveTab('features')}
                        >
                            Features
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
                            onClick={() => setActiveTab('applications')}
                        >
                            Applications
                        </button>
                    </div>

                    <div className="tabs-content">
                        {activeTab === 'description' && (
                            <div className="tab-panel">
                                <p>{product.description}</p>
                            </div>
                        )}

                        {activeTab === 'features' && (
                            <div className="tab-panel">
                                <ul className="features-list">
                                    {product.features.map((feature, index) => (
                                        <li key={index}>
                                            <Check size={18} />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {activeTab === 'applications' && (
                            <div className="tab-panel">
                                <div className="applications-grid">
                                    {product.applications.map((app, index) => (
                                        <div key={index} className="application-item">
                                            <ShoppingBag size={24} />
                                            <span>{app}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
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
                            {relatedProducts.map((product, index) => (
                                <ProductCard key={product.id} product={product} index={index} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    )
}

export default ProductDetail
