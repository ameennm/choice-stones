import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, CheckCircle } from 'lucide-react'
import { companyInfo } from '../data/products'
import './Contact.css'

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500))

        setIsSubmitting(false)
        setIsSubmitted(true)
        setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
        })
    }

    const contactInfo = [
        {
            icon: <MapPin size={24} />,
            title: 'Visit Us',
            content: companyInfo.address,
            link: '#'
        },
        {
            icon: <Phone size={24} />,
            title: 'Call Us',
            content: companyInfo.phone,
            link: `tel:${companyInfo.phone}`
        },
        {
            icon: <Mail size={24} />,
            title: 'Email Us',
            content: companyInfo.email,
            link: `mailto:${companyInfo.email}`
        },
        {
            icon: <Clock size={24} />,
            title: 'Working Hours',
            content: companyInfo.workingHours,
            link: null
        }
    ]

    return (
        <div className="contact-page">
            {/* Hero Section */}
            <section className="contact-hero">
                <div className="container">
                    <span className="hero-badge">Contact Us</span>
                    <h1>Get in <span className="gold-text">Touch</span></h1>
                    <p>Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="contact-info">
                <div className="container">
                    <div className="info-grid">
                        {contactInfo.map((info, index) => (
                            <div key={index} className="info-card">
                                <div className="info-icon">{info.icon}</div>
                                <h3>{info.title}</h3>
                                {info.link ? (
                                    <a href={info.link}>{info.content}</a>
                                ) : (
                                    <p>{info.content}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form & Map */}
            <section className="contact-main section">
                <div className="container">
                    <div className="contact-grid">
                        {/* Contact Form */}
                        <div className="contact-form-container">
                            <h2>Send us a Message</h2>
                            <p className="form-description">
                                Fill out the form below and our team will get back to you within 24 hours.
                            </p>

                            {isSubmitted ? (
                                <div className="success-message">
                                    <CheckCircle size={48} />
                                    <h3>Message Sent!</h3>
                                    <p>Thank you for contacting us. We'll get back to you soon.</p>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => setIsSubmitted(false)}
                                    >
                                        Send Another Message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="contact-form">
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="name">Full Name *</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="email">Email Address *</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="john@example.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="phone">Phone Number *</label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="+91 98765 43210"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="subject">Subject *</label>
                                            <select
                                                id="subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select a subject</option>
                                                <option value="quote">Request a Quote</option>
                                                <option value="inquiry">Product Inquiry</option>
                                                <option value="support">Technical Support</option>
                                                <option value="partnership">Business Partnership</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="message">Message *</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows="5"
                                            placeholder="Tell us about your project or requirements..."
                                            required
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-lg submit-btn"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <span className="loading">Sending...</span>
                                        ) : (
                                            <>
                                                <Send size={20} />
                                                Send Message
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Quick Contact & WhatsApp */}
                        <div className="quick-contact">
                            <div className="quick-contact-card">
                                <h3>Need Quick Assistance?</h3>
                                <p>Connect with us directly on WhatsApp for instant support and quotes.</p>
                                <a
                                    href={`https://wa.me/${companyInfo.social.whatsapp}?text=Hi, I'm interested in your stone products. Can you help me?`}
                                    className="whatsapp-btn"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <MessageCircle size={24} />
                                    Chat on WhatsApp
                                </a>
                            </div>

                            <div className="map-placeholder">
                                <div className="map-content">
                                    <MapPin size={48} />
                                    <h4>Our Location</h4>
                                    <p>{companyInfo.address}</p>
                                    <a
                                        href="https://maps.google.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-secondary"
                                    >
                                        Get Directions
                                    </a>
                                </div>
                            </div>

                            <div className="faq-preview">
                                <h4>Frequently Asked Questions</h4>
                                <div className="faq-item">
                                    <strong>What is the minimum order quantity?</strong>
                                    <p>Minimum order varies by product, typically starting from 50-100 sq.ft.</p>
                                </div>
                                <div className="faq-item">
                                    <strong>Do you provide samples?</strong>
                                    <p>Yes, we provide samples for a nominal fee which is adjusted in your order.</p>
                                </div>
                                <div className="faq-item">
                                    <strong>What areas do you deliver to?</strong>
                                    <p>We deliver across all major cities in India.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Contact
