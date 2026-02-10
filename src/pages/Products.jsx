import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, Filter, X, Grid3X3, List, ChevronRight, Loader } from 'lucide-react'
import useProductStore from '../store/productStore'
import ProductCard from '../components/ProductCard'
import './Products.css'

function Products() {
    const { products, loading, fetchProducts, categories } = useProductStore()
    const [searchParams, setSearchParams] = useSearchParams()
    const [filteredProducts, setFilteredProducts] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all')
    const [showFilters, setShowFilters] = useState(false)
    const [viewMode, setViewMode] = useState('grid')

    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    useEffect(() => {
        const category = searchParams.get('category')
        if (category) {
            setSelectedCategory(category)
        }
    }, [searchParams])

    useEffect(() => {
        if (loading) return

        let result = [...products]

        if (selectedCategory !== 'all') {
            result = result.filter(p => p.category === selectedCategory)
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase()
            result = result.filter(p =>
                p.name.toLowerCase().includes(term) ||
                (p.description && p.description.toLowerCase().includes(term)) ||
                (p.subtitle && p.subtitle.toLowerCase().includes(term)) ||
                (p.category && p.category.toLowerCase().includes(term))
            )
        }

        setFilteredProducts(result)
    }, [searchTerm, selectedCategory, products, loading])

    const handleCategoryChange = (category) => {
        setSelectedCategory(category)
        if (category === 'all') {
            searchParams.delete('category')
        } else {
            searchParams.set('category', category)
        }
        setSearchParams(searchParams)
    }

    const clearFilters = () => {
        setSearchTerm('')
        setSelectedCategory('all')
        setSearchParams({})
    }

    // Group products by subcategory (stored in subtitle)
    const groupedProducts = filteredProducts.reduce((groups, product) => {
        const key = product.subtitle || 'Products'
        if (!groups[key]) groups[key] = []
        groups[key].push(product)
        return groups
    }, {})

    const currentCategoryName = selectedCategory !== 'all'
        ? categories.find(c => c.id === selectedCategory)?.name
        : 'All Products'

    if (loading && products.length === 0) {
        return <div className="loading-container"><Loader className="spin" /> Loading products...</div>
    }

    return (
        <div className="products-page">
            {/* Page Header */}
            <section className="page-header">
                <div className="container">
                    <div className="page-breadcrumb">
                        <Link to="/">Home</Link>
                        <ChevronRight size={14} />
                        <span>{currentCategoryName}</span>
                    </div>
                    <h1>{currentCategoryName}</h1>
                    <p>Discover our premium collection of natural stones and tiles</p>
                </div>
            </section>

            {/* Products Section */}
            <section className="products-section section">
                <div className="container">
                    {/* Toolbar */}
                    <div className="products-toolbar">
                        <div className="search-box">
                            <Search size={20} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button className="clear-search" onClick={() => setSearchTerm('')}>
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        <div className="toolbar-actions">
                            <button
                                className="filter-toggle"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <Filter size={18} />
                                Filters
                            </button>

                            <div className="view-toggle">
                                <button
                                    className={viewMode === 'grid' ? 'active' : ''}
                                    onClick={() => setViewMode('grid')}
                                >
                                    <Grid3X3 size={18} />
                                </button>
                                <button
                                    className={viewMode === 'list' ? 'active' : ''}
                                    onClick={() => setViewMode('list')}
                                >
                                    <List size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Filters Panel */}
                    <div className={`filters-panel ${showFilters ? 'open' : ''}`}>
                        <div className="filter-group">
                            <h4>Categories</h4>
                            <div className="filter-options">
                                <button
                                    className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                                    onClick={() => handleCategoryChange('all')}
                                >
                                    All Products
                                </button>
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        className={`filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                                        onClick={() => handleCategoryChange(cat.id)}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {(selectedCategory !== 'all' || searchTerm) && (
                            <button className="clear-filters" onClick={clearFilters}>
                                <X size={16} /> Clear All Filters
                            </button>
                        )}
                    </div>

                    {/* Results Info */}
                    <div className="results-info">
                        <span>Showing {filteredProducts.length} products</span>
                        {selectedCategory !== 'all' && (
                            <span className="active-filter">
                                {currentCategoryName}
                                <button onClick={() => handleCategoryChange('all')}>
                                    <X size={14} />
                                </button>
                            </span>
                        )}
                    </div>

                    {/* Products - Grouped by Subcategory */}
                    {filteredProducts.length > 0 ? (
                        <div className="products-grouped">
                            {Object.entries(groupedProducts).map(([subcategory, prods]) => (
                                <div key={subcategory} className="product-group">
                                    {selectedCategory !== 'all' && Object.keys(groupedProducts).length > 1 && (
                                        <h3 className="subcategory-title">{subcategory}</h3>
                                    )}
                                    <div className={`products-grid ${viewMode}`}>
                                        {prods.map((product, index) => (
                                            <ProductCard key={product.$id || product.id} product={product} index={index} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-products">
                            <h3>No products found</h3>
                            <p>Try adjusting your search or filters</p>
                            <button className="btn btn-primary" onClick={clearFilters}>
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

export default Products
