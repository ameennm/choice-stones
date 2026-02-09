import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Phone, Mail } from 'lucide-react'
import './Navbar.css'

function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const location = useLocation()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        setIsOpen(false)
    }, [location])

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/products', label: 'Products' },
        { path: '/about', label: 'About Us' },
        { path: '/contact', label: 'Contact' }
    ]

    return (
        <>
            {/* Top Bar */}
            <div className="top-bar">
                <div className="container top-bar-content">
                    <div className="top-bar-left">
                        <a href="tel:+919876543210" className="top-bar-item">
                            <Phone size={14} />
                            <span>+91 98765 43210</span>
                        </a>
                        <a href="mailto:info@choicestones.com" className="top-bar-item">
                            <Mail size={14} />
                            <span>info@choicestones.com</span>
                        </a>
                    </div>
                    <div className="top-bar-right">
                        <span>Mon - Sat: 9:00 AM - 6:00 PM</span>
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
                <div className="container navbar-content">
                    <Link to="/" className="navbar-logo">
                        <img src="/logo.png" alt="Choice Stones" className="logo-image" />
                    </Link>

                    {/* Desktop Nav */}
                    <div className="navbar-links">
                        {navLinks.map(link => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                            >
                                {link.label}
                                <span className="nav-link-underline"></span>
                            </Link>
                        ))}
                    </div>

                    <div className="navbar-actions">
                        <Link to="/contact" className="btn btn-primary">
                            Get Quote
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
                    <div className="mobile-menu-content">
                        {navLinks.map(link => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link to="/contact" className="btn btn-primary mobile-cta">
                            Get Quote
                        </Link>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar
