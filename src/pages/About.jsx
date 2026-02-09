import { CheckCircle, Users, Award, Truck, Target, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import { stats } from '../data/products'
import './About.css'

function About() {
    const values = [
        {
            icon: <Award size={32} />,
            title: 'Quality Excellence',
            description: 'We source only the finest natural stones, ensuring each product meets the highest standards of quality and durability.'
        },
        {
            icon: <Users size={32} />,
            title: 'Customer First',
            description: 'Our clients are at the heart of everything we do. We provide personalized service and expert guidance for every project.'
        },
        {
            icon: <Target size={32} />,
            title: 'Integrity',
            description: 'We believe in transparent pricing, honest communication, and building lasting relationships with our customers.'
        },
        {
            icon: <Truck size={32} />,
            title: 'Reliability',
            description: 'Timely delivery and consistent quality are our promises. We ensure your project stays on schedule.'
        }
    ]

    const milestones = [
        { year: '2010', title: 'Company Founded', description: 'Started as a small stone trading business in Bangalore' },
        { year: '2013', title: 'Warehouse Expansion', description: 'Opened our first large-scale warehouse facility' },
        { year: '2016', title: 'Pan India Reach', description: 'Expanded operations to serve customers across India' },
        { year: '2019', title: 'Export Grade Certification', description: 'Achieved international export quality standards' },
        { year: '2022', title: '500+ Projects', description: 'Completed 500+ successful projects nationwide' },
        { year: '2024', title: 'Digital Transformation', description: 'Launched online platform for seamless ordering' }
    ]

    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="about-hero">
                <div className="container">
                    <div className="about-hero-content">
                        <span className="hero-badge">About Us</span>
                        <h1>Crafting Spaces with <span className="gold-text">Nature's Finest</span></h1>
                        <p>
                            For over 15 years, Choice Stones has been the trusted partner for architects,
                            builders, and homeowners seeking premium natural stones. Our commitment to quality
                            and customer satisfaction sets us apart in the industry.
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="about-stats">
                <div className="container">
                    <div className="stats-grid">
                        {stats.map((stat, index) => (
                            <div key={index} className="stat-card">
                                <span className="stat-value">{stat.value}</span>
                                <span className="stat-label">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="about-story section">
                <div className="container">
                    <div className="story-grid">
                        <div className="story-images">
                            <div className="story-image main">
                                <img src="/products/bangalore-grey-stone.jpeg" alt="Our Stone Collection" />
                            </div>
                            <div className="story-image secondary">
                                <img src="/products/tumbled-exporting-quality.jpeg" alt="Quality Stones" />
                            </div>
                        </div>
                        <div className="story-content">
                            <span className="section-subtitle">Our Story</span>
                            <h2>From Humble Beginnings to Industry Leaders</h2>
                            <p>
                                Choice Stones began in 2010 with a simple vision: to provide the finest natural
                                stones at fair prices. What started as a small trading business in Bangalore has
                                grown into one of the region's most trusted stone suppliers.
                            </p>
                            <p>
                                Our founder's passion for natural stones and commitment to quality laid the
                                foundation for what Choice Stones is today. We have built strong relationships
                                with quarries across India, ensuring we always have access to the best materials.
                            </p>
                            <p>
                                Today, we serve hundreds of clients annually, from individual homeowners to
                                large construction companies, and our stones grace homes, offices, and public
                                spaces across the country.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="mission-vision section">
                <div className="container">
                    <div className="mv-grid">
                        <div className="mv-card">
                            <div className="mv-icon">
                                <Target size={40} />
                            </div>
                            <h3>Our Mission</h3>
                            <p>
                                To provide premium quality natural stones that transform spaces while delivering
                                exceptional value and service to our customers. We aim to make the finest stones
                                accessible to everyone.
                            </p>
                        </div>
                        <div className="mv-card">
                            <div className="mv-icon">
                                <Eye size={40} />
                            </div>
                            <h3>Our Vision</h3>
                            <p>
                                To be India's most trusted natural stone supplier, known for quality, integrity,
                                and innovation. We envision a future where every space is enhanced by the timeless
                                beauty of natural stones.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="values section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-subtitle">What We Stand For</span>
                        <h2 className="section-title">Our Core Values</h2>
                    </div>
                    <div className="values-grid">
                        {values.map((value, index) => (
                            <div key={index} className="value-card">
                                <div className="value-icon">{value.icon}</div>
                                <h3>{value.title}</h3>
                                <p>{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="timeline section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-subtitle">Our Journey</span>
                        <h2 className="section-title">Key Milestones</h2>
                    </div>
                    <div className="timeline-container">
                        {milestones.map((milestone, index) => (
                            <div key={index} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
                                <div className="timeline-content">
                                    <span className="timeline-year">{milestone.year}</span>
                                    <h4>{milestone.title}</h4>
                                    <p>{milestone.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="about-cta section">
                <div className="container">
                    <div className="cta-content">
                        <h2>Ready to Start Your Project?</h2>
                        <p>Let us help you find the perfect stones for your space</p>
                        <div className="cta-buttons">
                            <Link to="/products" className="btn btn-primary btn-lg">
                                Browse Products
                            </Link>
                            <Link to="/contact" className="btn btn-secondary btn-lg">
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default About
