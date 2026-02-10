import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
    Truck, Shield, Award, Phone,
    ChevronRight, Heart, Share2,
    ChevronLeft, ImageOff, ShoppingCart, Plus, Minus
} from 'lucide-react'
import { products, categories } from '../data/products'
import ProductCard from '../components/ProductCard'
import useCartStore from '../store/cartStore'
import './ProductDetail.css'

function ProductDetail() {
    const { id } = useParams()
    const product = products.find(p => p.id === id)
    const [selectedImage, setSelectedImage] = useState(0)
    const [imgErrors, setImgErrors] = useState({})
    const [quantity, setQuantity] = useState(1)
    const [addedToCart, setAddedToCart] = useState(false)
    const { addItem } = useCartStore()

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
        .slice(0, 4)

    const categoryName = categories.find(c => c.id === product.category)?.name || product.category

    const nextImage = () => {
        setSelectedImage((prev) => (prev + 1) % product.images.length)
    }

    const prevImage = () => {
        setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length)
    }

    const handleImgError = (index) => {
        setImgErrors(prev => ({ ...prev, [index]: true }))
    }

    const imageLabels = ['Front View', 'Side View', 'In Project', 'Close-up']

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
                        {/* Image Gallery - 4 slots */}
                        <div className="product-gallery">
                            <div className="main-image">
                                {!imgErrors[selectedImage] ? (
                                    <img
                                        src={product.images[selectedImage]}
                                        alt={`${product.name} - ${imageLabels[selectedImage]}`}
                                        onError={() => handleImgError(selectedImage)}
                                    />
                                ) : (
                                    <div className="image-placeholder-large">
                                        <ImageOff size={60} />
                                        <p>Image Coming Soon</p>
                                        <span>{imageLabels[selectedImage]}</span>
                                    </div>
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
                            {/* 4 Thumbnail Slots */}
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
                                                alt={`${product.name} - ${imageLabels[index]}`}
                                                onError={() => handleImgError(index)}
                                            />
                                        ) : (
                                            <div className="thumb-placeholder">
                                                <ImageOff size={18} />
                                            </div>
                                        )}
                                        <span className="thumb-label">{imageLabels[index]}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Details */}
                        <div className="product-details">
                            <span className="product-category-tag">
                                {categoryName}
                            </span>
                            {product.subcategory && (
                                <span className="product-subcategory-tag">
                                    {product.subcategory}
                                </span>
                            )}
                            <h1 className="product-title">{product.name}</h1>

                            {product.size && (
                                <div className="product-size-info">
                                    <strong>Available Size:</strong> {product.size}
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
                                <ProductCard key={rp.id} product={rp} index={index} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    )
}

export default ProductDetail
