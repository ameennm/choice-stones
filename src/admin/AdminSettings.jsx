import { useState, useEffect } from 'react'
import { Save, Loader } from 'lucide-react'
import { databases, DATABASE_ID, COLLECTION_ID } from '../lib/appwrite'
import { companyInfo } from '../data/products'

function AdminSettings() {
    const [settings, setSettings] = useState({
        phone: companyInfo.phone,
        whatsapp: companyInfo.social.whatsapp,
        email: companyInfo.email,
        address: companyInfo.address
    })
    const [loading, setLoading] = useState(true)
    const [docId, setDocId] = useState(null)

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                // Search for a product with category "system_settings"
                const response = await databases.listDocuments(
                    DATABASE_ID,
                    COLLECTION_ID,
                    [
                        // We use a specific query to find our pseudo-settings document
                        // Assuming we name it "System Settings" and category "system_settings"
                        // Since we can't search by ID easily if we didn't set it custom, 
                        // we search by unique category
                        // Note: Querying by category requires an index. If index missing, this fails.
                        // Fallback: We can try to get document by a KNOWN ID if we create it with one.
                        // Let's try to use a deterministic ID "settings_doc"
                    ]
                );

                // Check if we can find it by ID directly (best bet)
                try {
                    const doc = await databases.getDocument(DATABASE_ID, COLLECTION_ID, 'settings_document');
                    if (doc) {
                        const data = JSON.parse(doc.description);
                        setSettings(data);
                        setDocId(doc.$id);
                    }
                } catch (e) {
                    // Not found, use defaults
                    console.log("Settings doc not found, using defaults");
                }
            } catch (error) {
                console.error('Error fetching settings:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchSettings()
    }, [])

    const handleSave = async () => {
        setLoading(true);
        try {
            const payload = {
                name: 'System Settings',
                category: 'system_settings', // Unique category
                description: JSON.stringify(settings),
                price: 0,
                unit: 'settings',
                inStock: false,
                featured: false,
                images: []
            };

            if (docId) {
                await databases.updateDocument(
                    DATABASE_ID,
                    COLLECTION_ID,
                    docId,
                    payload
                );
            } else {
                // Create with specific ID
                await databases.createDocument(
                    DATABASE_ID,
                    COLLECTION_ID,
                    'settings_document',
                    payload
                );
                setDocId('settings_document');
            }
            alert('Settings saved!');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings. ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="admin-settings">
            <div className="page-header">
                <h1>Contact Settings</h1>
            </div>

            <div className="form-grid" style={{ maxWidth: '600px' }}>
                <div className="form-group">
                    <label>Phone Number (Display)</label>
                    <input
                        type="text"
                        value={settings.phone}
                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>WhatsApp Number (Numeric, no +)</label>
                    <input
                        type="text"
                        value={settings.whatsapp}
                        onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    />
                </div>
                <div className="form-group full-width">
                    <label>Address</label>
                    <textarea
                        value={settings.address}
                        onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                        rows="3"
                    />
                </div>

                <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
                    {loading ? <Loader className="spin" size={18} /> : <Save size={18} />}
                    Save Settings
                </button>
            </div>
        </div>
    )
}

export default AdminSettings
