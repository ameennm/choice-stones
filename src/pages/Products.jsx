import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Filter, X, Grid3X3, List } from 'lucide-react'
import { products, categories } from '../data/products'
import ProductCard from '../components/ProductCard'
import './Products.css'

function Products() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [filteredProducts, setFilteredProducts] = useState(products)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all')
    const [sortBy, setSortBy] = useState('featured')
    const [showFilters, setShowFilters] = useState(false)
    const [viewMode, setViewMode] = useState('grid')

    useEffect(() => {
        let result = [...products]

        // Filter by category
        if (selectedCategory !== 'all') {
            result = result.filter(p => p.category === selectedCategory)
        }

        // Filter by search term
        if (searchTerm) {
            const term = searchTerm.toLowerCase()
            result = result.filter(p =>
                p.name.toLowerCase().includes(term) ||
                p.description.toLowerCase().includes(term) ||
                p.category.toLowerCase().includes(term)
            )
        }

        // Sort
        switch (sortBy) {
            case 'price-low':
                result.sort((a, b) => a.price - b.price)
                break
            case 'price-high':
                result.sort((a, b) => b.price - a.price)
                break
            case 'rating':
                result.sort((a, b) => b.rating - a.rating)
                break
            case 'featured':
            default:
                result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        }

        setFilteredProducts(result)
    }, [searchTerm, selectedCategory, sortBy])

    useEffect(() => {
        const category = searchParams.get('category')
        if (category) {
            setSelectedCategory(category)
        }
    }, [searchParams])

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
        setSortBy('featured')
        setSearchParams({})
    }

    return (
        <div className="products-page">
            {/* Page Header */}
            <section className="page-header">
                <div className="container">
                    <h1>Our Products</h1>
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

                            <select
                                className="sort-select"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="featured">Featured</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Top Rated</option>
                            </select>

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
                        <span>Showing {filteredProducts.length} of {products.length} products</span>
                        {selectedCategory !== 'all' && (
                            <span className="active-filter">
                                Category: {categories.find(c => c.id === selectedCategory)?.name}
                                <button onClick={() => handleCategoryChange('all')}>
                                    <X size={14} />
                                </button>
                            </span>
                        )}
                    </div>

                    {/* Products Grid */}
                    {filteredProducts.length > 0 ? (
                        <div className={`products-grid ${viewMode}`}>
                            {filteredProducts.map((product, index) => (
                                <ProductCard key={product.id} product={product} index={index} />
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
