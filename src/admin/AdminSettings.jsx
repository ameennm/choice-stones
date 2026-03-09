import { useState, useEffect } from 'react'
import { Save, Loader } from 'lucide-react'
import { companyInfo } from '../data/products'

function AdminSettings() {
    const [settings, setSettings] = useState({
        phone: companyInfo.phone,
        whatsapp: companyInfo.social.whatsapp,
        wholesale: '918880999097', // Default wholesale
        email: companyInfo.email,
        address: companyInfo.address
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                if (res.ok) {
                    const data = await res.json();
                    if (data && Object.keys(data).length > 0) {
                        setSettings(prev => ({ ...prev, ...data }));
                    }
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
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });

            if (!res.ok) throw new Error('Failed to save');

            alert('Settings saved to Cloudflare!');
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
                    <label>Retail WhatsApp (Numeric, no +)</label>
                    <input
                        type="text"
                        value={settings.whatsapp}
                        onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label>Wholesale WhatsApp (Numeric, no +)</label>
                    <input
                        type="text"
                        value={settings.wholesale}
                        onChange={(e) => setSettings({ ...settings, wholesale: e.target.value })}
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
