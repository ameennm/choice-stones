import { Link } from 'react-router-dom'
import { Star, ArrowRight, ShoppingBag } from 'lucide-react'
import './ProductCard.css'

function ProductCard({ product, index = 0 }) {
    return (
        <Link
            to={`/products/${product.id}`}
            className="product-card"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <div className="product-image-container">
                <img
                    src={product.images[0]}
                    alt={product.name}
                    className="product-image"
                />
                {product.featured && (
                    <span className="product-badge">Featured</span>
                )}
                <div className="product-overlay">
                    <button className="view-btn">
                        View Details <ArrowRight size={18} />
                    </button>
                </div>
            </div>

            <div className="product-content">
                <span className="product-category">{product.category.replace('-', ' ')}</span>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-subtitle">{product.subtitle}</p>

                <div className="product-rating">
                    <div className="stars">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={14}
                                fill={i < Math.floor(product.rating) ? 'var(--color-primary)' : 'transparent'}
                                color="var(--color-primary)"
                            />
                        ))}
                    </div>
                    <span className="rating-text">
                        {product.rating} ({product.reviews} reviews)
                    </span>
                </div>

                <div className="product-footer">
                    <div className="product-price">
                        <span className="price-currency">₹</span>
                        <span className="price-value">{product.price}</span>
                        <span className="price-unit">/{product.unit}</span>
                    </div>
                    <div className="product-stock">
                        {product.inStock ? (
                            <span className="in-stock">
                                <ShoppingBag size={14} /> In Stock
                            </span>
                        ) : (
                            <span className="out-stock">Out of Stock</span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default ProductCard
