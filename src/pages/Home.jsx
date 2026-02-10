import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, Truck, Shield, Award, Star, ChevronLeft, ChevronRight, Phone, Layers, LayoutGrid, Landmark, Sprout, Circle } from 'lucide-react'
import { categories, testimonials, stats, companyInfo } from '../data/products'
import { useState } from 'react'
import './Home.css'

const iconMap = {
    Layers: Layers,
    LayoutGrid: LayoutGrid,
    Landmark: Landmark,
    Sprout: Sprout,
    Circle: Circle,
}

function Home() {
    const [currentTestimonial, setCurrentTestimonial] = useState(0)

    const nextTestimonial = () => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }

    const prevTestimonial = () => {
        setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    }

    return (
        <div className="home">
            {/* Hero Banner */}
            <section className="branding-banner">
                <div className="container">
                    <div className="branding-content">
                        <div className="branding-left">
                            <h1 className="branding-title">
                                Premium <span className="gold-text">Natural Stones</span> & Tiles
                            </h1>
                            <p className="branding-tagline">Quality stones for flooring, cladding & landscaping • Since 2010</p>
                        </div>
                        <div className="branding-right">
                            <div className="branding-stats">
                                {stats.slice(0, 3).map((stat, index) => (
                                    <div key={index} className="branding-stat">
                                        <span className="stat-value">{stat.value}</span>
                                        <span className="stat-label">{stat.label}</span>
                                    </div>
                                ))}
                            </div>
                            <a href={`tel:${companyInfo.phone}`} className="btn btn-primary">
                                <Phone size={18} /> Get Quote
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section - Main Focus */}
            <section className="categories section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-subtitle">Our Collection</span>
                        <h2 className="section-title">Browse Our Categories</h2>
                        <p className="section-description">
                            Explore our wide range of premium natural stones, cladding, pebbles and more
                        </p>
                    </div>
                    <div className="categories-grid">
                        {categories.map((category, index) => {
                            const IconComponent = iconMap[category.icon] || Layers
                            return (
                                <Link
                                    key={category.id}
                                    to={`/products?category=${category.id}`}
                                    className="category-card"
                                    style={{
                                        animationDelay: `${index * 100}ms`,
                                        backgroundImage: `url(${category.image})`
                                    }}
                                >
                                    <div className="category-overlay"></div>
                                    <div className="category-icon-wrap">
                                        <IconComponent size={36} />
                                    </div>
                                    <div className="category-content">
                                        <h3>{category.name}</h3>
                                        <p>{category.description}</p>
                                        <div className="category-meta">
                                            <span className="product-count">{category.productCount}+ Products</span>
                                            <span className="category-link">
                                                Explore <ArrowRight size={16} />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features section">
                <div className="container">
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <Shield size={32} />
                            </div>
                            <h3>Quality Guaranteed</h3>
                            <p>Every stone is carefully selected and quality tested to meet international standards.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <Truck size={32} />
                            </div>
                            <h3>Pan India Delivery</h3>
                            <p>Fast and secure delivery to all major cities across India with proper packaging.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <Award size={32} />
                            </div>
                            <h3>Best Market Prices</h3>
                            <p>Direct sourcing from quarries ensures competitive pricing without compromising quality.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Preview */}
            <section className="about-preview section">
                <div className="container">
                    <div className="about-content-centered">
                        <span className="section-subtitle">About Choice Stones</span>
                        <h2 className="section-title">
                            Your Trusted Partner in Premium Natural Stones
                        </h2>
                        <p>
                            Since 2010, Choice Stones has been at the forefront of providing high-quality
                            natural stones to architects, builders, and homeowners across India. Our commitment
                            to quality and customer satisfaction has made us a preferred choice for premium
                            stone solutions.
                        </p>
                        <ul className="about-features">
                            <li><CheckCircle size={20} /> Direct sourcing from renowned quarries</li>
                            <li><CheckCircle size={20} /> Strict quality control measures</li>
                            <li><CheckCircle size={20} /> Expert consultation services</li>
                            <li><CheckCircle size={20} /> Competitive wholesale pricing</li>
                        </ul>
                        <Link to="/about" className="btn btn-primary">
                            Learn More <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="testimonials section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-subtitle">Testimonials</span>
                        <h2 className="section-title">What Our Clients Say</h2>
                    </div>
                    <div className="testimonials-slider">
                        <button className="slider-btn prev" onClick={prevTestimonial}>
                            <ChevronLeft size={24} />
                        </button>
                        <div className="testimonial-card">
                            <div className="testimonial-stars">
                                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                                    <Star key={i} size={20} fill="var(--color-primary)" color="var(--color-primary)" />
                                ))}
                            </div>
                            <p className="testimonial-content">"{testimonials[currentTestimonial].content}"</p>
                            <div className="testimonial-author">
                                <div className="author-avatar">
                                    {testimonials[currentTestimonial].name.charAt(0)}
                                </div>
                                <div className="author-info">
                                    <h4>{testimonials[currentTestimonial].name}</h4>
                                    <p>{testimonials[currentTestimonial].role}, {testimonials[currentTestimonial].company}</p>
                                </div>
                            </div>
                        </div>
                        <button className="slider-btn next" onClick={nextTestimonial}>
                            <ChevronRight size={24} />
                        </button>
                    </div>
                    <div className="slider-dots">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                className={`dot ${index === currentTestimonial ? 'active' : ''}`}
                                onClick={() => setCurrentTestimonial(index)}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Home
