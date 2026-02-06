import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube, MessageCircle } from 'lucide-react'
import { companyInfo, categories } from '../data/products'
import './Footer.css'

function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="footer">
            {/* Footer CTA Section */}
            <div className="footer-cta">
                <div className="container">
                    <div className="cta-content">
                        <div className="cta-text">
                            <h3>Ready to Transform Your Space?</h3>
                            <p>Get a free consultation and quote for your project today.</p>
                        </div>
                        <Link to="/contact" className="btn btn-primary btn-lg">
                            Get Free Quote
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="footer-main">
                <div className="container">
                    <div className="footer-grid">
                        {/* Company Info */}
                        <div className="footer-section">
                            <img src="/logo.png" alt="Choice Stones" className="footer-logo" />
                            <p className="footer-description">
                                {companyInfo.description}
                            </p>
                            <div className="social-links">
                                <a href={companyInfo.social.facebook} className="social-link" aria-label="Facebook">
                                    <Facebook size={20} />
                                </a>
                                <a href={companyInfo.social.instagram} className="social-link" aria-label="Instagram">
                                    <Instagram size={20} />
                                </a>
                                <a href={companyInfo.social.youtube} className="social-link" aria-label="YouTube">
                                    <Youtube size={20} />
                                </a>
                                <a
                                    href={`https://wa.me/${companyInfo.social.whatsapp}`}
                                    className="social-link whatsapp"
                                    aria-label="WhatsApp"
                                >
                                    <MessageCircle size={20} />
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="footer-section">
                            <h4 className="footer-title">Quick Links</h4>
                            <ul className="footer-links">
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/products">Our Products</Link></li>
                                <li><Link to="/about">About Us</Link></li>
                                <li><Link to="/contact">Contact</Link></li>
                            </ul>
                        </div>

                        {/* Categories */}
                        <div className="footer-section">
                            <h4 className="footer-title">Categories</h4>
                            <ul className="footer-links">
                                {categories.map(cat => (
                                    <li key={cat.id}>
                                        <Link to={`/products?category=${cat.id}`}>{cat.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div className="footer-section">
                            <h4 className="footer-title">Contact Us</h4>
                            <ul className="contact-list">
                                <li>
                                    <MapPin size={18} />
                                    <span>{companyInfo.address}</span>
                                </li>
                                <li>
                                    <Phone size={18} />
                                    <a href={`tel:${companyInfo.phone}`}>{companyInfo.phone}</a>
                                </li>
                                <li>
                                    <Mail size={18} />
                                    <a href={`mailto:${companyInfo.email}`}>{companyInfo.email}</a>
                                </li>
                                <li>
                                    <Clock size={18} />
                                    <span>{companyInfo.workingHours}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="footer-bottom">
                <div className="container">
                    <div className="footer-bottom-content">
                        <p>&copy; {currentYear} Choice Stones. All rights reserved.</p>
                        <div className="footer-bottom-links">
                            <a href="#">Privacy Policy</a>
                            <a href="#">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
