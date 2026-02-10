import { Link } from 'react-router-dom'
import { ArrowRight, ImageOff } from 'lucide-react'
import { useState } from 'react'
import './ProductCard.css'

function ProductCard({ product, index = 0 }) {
    const [imgError, setImgError] = useState(false)

    return (
        <Link
            to={`/products/${product.id}`}
            className="product-card"
            style={{ animationDelay: `${index * 60}ms` }}
        >
            <div className="product-image-container">
                {!imgError ? (
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="product-image"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="product-image-placeholder">
                        <ImageOff size={40} />
                        <span>Image Coming Soon</span>
                    </div>
                )}
                {product.size && (
                    <span className="product-badge">{product.size}</span>
                )}
                <div className="product-overlay">
                    <button className="view-btn">
                        View Details <ArrowRight size={18} />
                    </button>
                </div>
            </div>

            <div className="product-content">
                {product.subcategory && (
                    <span className="product-category">{product.subcategory}</span>
                )}
                <h3 className="product-name">{product.name}</h3>
                <p className="product-subtitle">{product.description?.substring(0, 80)}...</p>
                <div className="product-footer">
                    <span className="view-details-link">
                        View Details <ArrowRight size={14} />
                    </span>
                </div>
            </div>
        </Link>
    )
}

export default ProductCard
