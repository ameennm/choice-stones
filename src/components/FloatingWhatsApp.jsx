import { MessageCircle } from 'lucide-react'
import './FloatingWhatsApp.css'

function FloatingWhatsApp() {
    const phoneNumber = '916238165933'
    const message = encodeURIComponent("Hello! I'm interested in Choice Stones products.")
    const url = `https://wa.me/${phoneNumber}?text=${message}`

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="floating-whatsapp-btn"
            aria-label="Chat on WhatsApp"
        >
            <MessageCircle size={40} />
            <span className="whatsapp-tooltip">Chat with No.1 Stone Company</span>
        </a>
    )
}

export default FloatingWhatsApp
