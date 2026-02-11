import { useState, useEffect } from 'react';
import { databases, DATABASE_ID, COLLECTION_ID } from '../lib/appwrite';
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
                // Try to get settings document
                // 1. By Query on category (if index exists)
                // 2. By ID directly
                // We used 'settings_document' in AdminSettings, so try that first
                const doc = await databases.getDocument(DATABASE_ID, COLLECTION_ID, 'settings_document').catch(() => null);

                if (doc) {
                    const data = JSON.parse(doc.description);
                    setSettings(prev => ({ ...prev, ...data }));
                } else {
                    // Fallback search if ID fetch fails (e.g. permission issue or different ID strategy)
                    // Here we stick to defaults if direct fetch fails to keep it simple and fast
                }
            } catch (error) {
                // Ignore 404 errors (document not found) as we fallback to defaults
                if (error.code !== 404) {
                    console.warn('Using default settings due to fetch error:', error);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    return { settings, loading };
}
