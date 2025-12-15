import { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';

const SettingsContext = createContext();

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within SettingsProvider');
    }
    return context;
};


export const SettingsProvider = ({ children }) => {
    const [businessInfo, setBusinessInfo] = useState({
        name: '', address: '', email: '', phone: '', website: '', defaultCurrency: 'USD', taxRate: 10, brandColor: '#0ea5e9',
    });
    const [loading, setLoading] = useState(true);

    // Load business info from backend on mount
    useEffect(() => {
        async function fetchBusinessInfo() {
            setLoading(true);
            try {
                const info = await apiFetch('/business-info');
                setBusinessInfo(info);
            } catch (e) {
                setBusinessInfo({ name: '', address: '', email: '', phone: '', website: '', defaultCurrency: 'USD', taxRate: 10, brandColor: '#0ea5e9' });
            } finally {
                setLoading(false);
            }
        }
        fetchBusinessInfo();
    }, []);

    const updateBusinessInfo = async (info) => {
        const updated = await apiFetch('/business-info', {
            method: 'PUT',
            body: JSON.stringify(info),
        });
        setBusinessInfo(updated);
    };

    const value = {
        businessInfo,
        updateBusinessInfo,
        setBusinessInfo,
        loading,
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};
