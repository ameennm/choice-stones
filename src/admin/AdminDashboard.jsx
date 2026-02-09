import { Package, Tags, TrendingUp, Eye } from 'lucide-react'
import { products, categories } from '../data/products'

function AdminDashboard() {
    const stats = [
        {
            icon: <Package size={24} />,
            label: 'Total Products',
            value: products.length,
            color: '#C9A962'
        },
        {
            icon: <Tags size={24} />,
            label: 'Categories',
            value: categories.length,
            color: '#1ABC9C'
        },
        {
            icon: <TrendingUp size={24} />,
            label: 'Featured',
            value: products.filter(p => p.featured).length,
            color: '#3498DB'
        },
        {
            icon: <Eye size={24} />,
            label: 'In Stock',
            value: products.filter(p => p.inStock).length,
            color: '#9B59B6'
        }
    ]

    return (
        <div className="admin-dashboard">
            <div className="page-header">
                <h1>Dashboard</h1>
                <p>Overview of your store</p>
            </div>

            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-card" style={{ '--accent-color': stat.color }}>
                        <div className="stat-icon">{stat.icon}</div>
                        <div className="stat-info">
                            <span className="stat-value">{stat.value}</span>
                            <span className="stat-label">{stat.label}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <h3>Recent Products</h3>
                    <div className="product-list">
                        {products.slice(0, 5).map(product => (
                            <div key={product.id} className="product-item">
                                <img src={product.images[0]} alt={product.name} />
                                <div className="product-info">
                                    <span className="product-name">{product.name}</span>
                                    <span className="product-price">₹{product.price}/{product.unit}</span>
                                </div>
                                <span className={`status ${product.inStock ? 'in-stock' : 'out-stock'}`}>
                                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="dashboard-card">
                    <h3>Categories Overview</h3>
                    <div className="category-list">
                        {categories.map(category => {
                            const count = products.filter(p => p.category === category.id).length
                            return (
                                <div key={category.id} className="category-item">
                                    <span className="category-name">{category.name}</span>
                                    <span className="category-count">{count} products</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="actions-grid">
                    <button className="action-btn">
                        <Package size={20} />
                        Add New Product
                    </button>
                    <button className="action-btn">
                        <Tags size={20} />
                        Add New Category
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard
