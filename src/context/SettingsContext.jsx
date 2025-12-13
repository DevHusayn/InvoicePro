import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within SettingsProvider');
    }
    return context;
};

export const SettingsProvider = ({ children }) => {
    const [companyInfo, setCompanyInfo] = useState(() => {
        const saved = localStorage.getItem('companyInfo');
        return saved ? JSON.parse(saved) : {
            name: 'Your Company Name',
            address: 'Your Address',
            email: 'your@email.com',
            phone: 'Your Phone Number',
            website: '',
            defaultCurrency: 'USD',
            taxRate: 10,
            brandColor: '#0ea5e9', // primary-500 blue
        };
    });

    useEffect(() => {
        localStorage.setItem('companyInfo', JSON.stringify(companyInfo));
    }, [companyInfo]);

    const updateCompanyInfo = (info) => {
        setCompanyInfo(info);
    };

    const value = {
        companyInfo,
        updateCompanyInfo,
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};
