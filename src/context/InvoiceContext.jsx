import { createContext, useContext, useState, useEffect } from 'react';

const InvoiceContext = createContext();

export const useInvoice = () => {
    const context = useContext(InvoiceContext);
    if (!context) {
        throw new Error('useInvoice must be used within InvoiceProvider');
    }
    return context;
};

export const InvoiceProvider = ({ children }) => {
    const [invoices, setInvoices] = useState(() => {
        const saved = localStorage.getItem('invoices');
        return saved ? JSON.parse(saved) : [];
    });

    const [clients, setClients] = useState(() => {
        const saved = localStorage.getItem('clients');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('invoices', JSON.stringify(invoices));
    }, [invoices]);

    useEffect(() => {
        localStorage.setItem('clients', JSON.stringify(clients));
    }, [clients]);

    const addInvoice = (invoice) => {
        const newInvoice = {
            ...invoice,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
        };
        setInvoices([newInvoice, ...invoices]);
        return newInvoice;
    };

    const updateInvoice = (id, updatedInvoice) => {
        setInvoices(invoices.map(inv => inv.id === id ? { ...updatedInvoice, id } : inv));
    };

    const deleteInvoice = (id) => {
        setInvoices(invoices.filter(inv => inv.id !== id));
    };

    const addClient = (client) => {
        const newClient = {
            ...client,
            id: Date.now().toString(),
        };
        setClients([newClient, ...clients]);
        return newClient;
    };

    const updateClient = (id, updatedClient) => {
        setClients(clients.map(client => client.id === id ? { ...updatedClient, id } : client));
    };

    const deleteClient = (id) => {
        setClients(clients.filter(client => client.id !== id));
    };

    const value = {
        invoices,
        clients,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        addClient,
        updateClient,
        deleteClient,
    };

    return (
        <InvoiceContext.Provider value={value}>
            {children}
        </InvoiceContext.Provider>
    );
};
