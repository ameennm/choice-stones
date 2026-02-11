import { useState, useEffect } from 'react';
import { databases, DATABASE_ID, COLLECTION_ID } from '../lib/appwrite';
import { Query } from 'appwrite';
import { Loader } from 'lucide-react';
import './Wholesale.css';

function Wholesale() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('sq.ft');

    useEffect(() => {
        const fetchWholesaleProducts = async () => {
            try {
                // Fetch products with category 'wholesale'
                // If you haven't added any yet, this will be empty.
                // We will add an Admin page to add them.
                const response = await databases.listDocuments(
                    DATABASE_ID,
                    COLLECTION_ID,
                    [
                        Query.equal('category', 'wholesale'),
                        Query.limit(100)
                    ]
                );

                // If no products found (initial setup), show the default 3 requested
                if (response.documents.length === 0) {
                    // Fallback for demo until admin adds them
                    setProducts([
                        { $id: 'ws1', name: 'Bangalore Stones', unit: 'sq.ft' },
                        { $id: 'ws2', name: 'Tandure Stone', unit: 'sq.ft' },
                        { $id: 'ws3', name: 'Kadappa Stone', unit: 'sq.ft' } // Assumed 3rd
                    ]);
                } else {
                    setProducts(response.documents);
                }
            } catch (error) {
                console.error('Error fetching wholesale products:', error);
                // Fallback
                setProducts([
                    { $id: 'ws1', name: 'Bangalore Stones', unit: 'sq.ft' },
                    { $id: 'ws2', name: 'Tandure Stone', unit: 'sq.ft' },
                    { $id: 'ws3', name: 'Kadappa Stone', unit: 'sq.ft' }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchWholesaleProducts();
    }, []);

    const handleOrder = (e) => {
        e.preventDefault();
        if (!selectedProduct || !quantity) return;

        const product = products.find(p => p.name === selectedProduct);
        const productUnit = product ? product.unit : unit;

        const phoneNumber = '918880999097';
        const message = `Hello, I would like to place a *Wholesale Order*.\n\n` +
            `Product: *${selectedProduct}*\n` +
            `Quantity: *${quantity} ${productUnit}*\n\n` +
            `Please provide a quote.`;

        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    };

    if (loading) return <div className="loading-container"><Loader className="spin" /> Loading...</div>;

    return (
        <div className="wholesale-page section">
            <div className="container">
                <div className="section-header">
                    <span className="section-subtitle">Bulk Orders</span>
                    <h1 className="section-title">Wholesale Inquiry</h1>
                    <p className="section-description">
                        Order premium stones in bulk directly. Select your product and quantity below.
                    </p>
                </div>

                <div className="wholesale-form-container card">
                    <form onSubmit={handleOrder} className="wholesale-form">
                        <div className="form-group">
                            <label>Select Product</label>
                            <select
                                value={selectedProduct}
                                onChange={(e) => {
                                    setSelectedProduct(e.target.value);
                                    const p = products.find(prod => prod.name === e.target.value);
                                    if (p) setUnit(p.unit);
                                }}
                                required
                            >
                                <option value="">-- Choose Stone --</option>
                                {products.map(p => (
                                    <option key={p.$id} value={p.name}>{p.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Requirements ({unit})</label>
                            <input
                                type="number"
                                placeholder={`Enter quantity in ${unit}`}
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                required
                                min="1"
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-lg full-width">
                            Order via WhatsApp
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Wholesale;
