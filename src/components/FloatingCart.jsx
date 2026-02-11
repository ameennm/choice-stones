import { ShoppingCart, X, Plus, Minus, Send } from 'lucide-react'
import { useState } from 'react'
import useCartStore from '../store/cartStore'
import './FloatingCart.css'

function FloatingCart() {
    const [isOpen, setIsOpen] = useState(false)
    const { items, removeItem, updateQuantity, clearCart, getItemCount } = useCartStore()

    const itemCount = getItemCount()

    const sendWhatsAppOrder = () => {
        if (items.length === 0) return

        const phoneNumber = '916238165933' // +91 62381 65933

        let message = '🛒 *New Order from Choice Stones Website*\n\n'

        items.forEach((item, index) => {
            message += `${index + 1}. *${item.name}*\n`
            message += `   Quantity: ${item.quantity}\n`
            if (item.size) message += `   Size: ${item.size}\n`
            if (item.subcategory) message += `   Category: ${item.subcategory}\n`
            message += '\n'
        })

        message += `📦 *Total Items: ${itemCount}*\n\n`
        message += '✨ Please share pricing and availability details.\n'
        message += 'Thank you!'

        const encodedMessage = encodeURIComponent(message)
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`

        window.open(whatsappUrl, '_blank')

        // Optional: Clear cart after sending
        // clearCart()
    }

    // Always show cart button, even if empty, per user request
    // if (itemCount === 0 && !isOpen) {
    //     return null
    // }

    return (
        <>
            {/* Floating Cart Button */}
            <button
                className="floating-cart-btn"
                onClick={() => setIsOpen(!isOpen)}
            >
                <ShoppingCart size={24} />
                {itemCount > 0 && (
                    <span className="cart-badge">{itemCount}</span>
                )}
            </button>

            {/* Cart Sidebar */}
            <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
                <div className="cart-header">
                    <h2>Your Cart</h2>
                    <button className="close-btn" onClick={() => setIsOpen(false)}>
                        <X size={24} />
                    </button>
                </div>

                <div className="cart-content">
                    {items.length === 0 ? (
                        <div className="empty-cart">
                            <ShoppingCart size={60} />
                            <p>Your cart is empty</p>
                        </div>
                    ) : (
                        <>
                            <div className="cart-items">
                                {items.map((item) => (
                                    <div key={item.id} className="cart-item">
                                        <div className="cart-item-image">
                                            <img src={item.images[0]} alt={item.name} />
                                        </div>
                                        <div className="cart-item-details">
                                            <h4>{item.name}</h4>
                                            {item.size && <p className="item-size">Size: {item.size}</p>}
                                            {item.subcategory && <p className="item-cat">{item.subcategory}</p>}

                                            <div className="quantity-controls">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className="quantity">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        <button
                                            className="remove-btn"
                                            onClick={() => removeItem(item.id)}
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="cart-footer">
                                <div className="cart-summary">
                                    <p>Total Items: <strong>{itemCount}</strong></p>
                                </div>
                                <button className="whatsapp-order-btn" onClick={sendWhatsAppOrder}>
                                    <Send size={20} />
                                    Send Order via WhatsApp
                                </button>
                                <button className="clear-cart-btn" onClick={clearCart}>
                                    Clear Cart
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Overlay */}
            {isOpen && <div className="cart-overlay" onClick={() => setIsOpen(false)} />}
        </>
    )
}

export default FloatingCart
