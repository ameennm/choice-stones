import { useState, useEffect } from 'react';
import { companyInfo as defaultInfo } from '../data/products';

export function useSettings() {
    const [settings, setSettings] = useState({
        phone: defaultInfo.phone,
        whatsapp: defaultInfo.social.whatsapp,
        email: defaultInfo.email,
        address: defaultInfo.address
    });
    const [loading, setLoading] = useState(true);

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
                console.warn('Using default settings due to fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    return { settings, loading };
}
