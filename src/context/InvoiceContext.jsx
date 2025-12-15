import { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';

const InvoiceContext = createContext();

export const useInvoice = () => {
    const context = useContext(InvoiceContext);
    if (!context) {
        throw new Error('useInvoice must be used within InvoiceProvider');
    }
    return context;
};



export const InvoiceProvider = ({ children }) => {
    const [invoices, setInvoices] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    // Helper to fetch all user data
    const fetchUserData = async () => {
        setLoading(true);
        try {
            const [inv, cli] = await Promise.all([
                apiFetch('/invoices'),
                apiFetch('/clients'),
            ]);
            setInvoices(inv.map(i => ({ ...i, id: i._id })));
            setClients(cli.map(c => ({ ...c, id: c._id })));
        } catch (e) {
            setInvoices([]);
            setClients([]);
        } finally {
            setLoading(false);
        }
    };

    // Load on mount
    useEffect(() => { fetchUserData(); }, []);

    // Expose a reset method for logout
    const resetAll = () => {
        setInvoices([]);
        setClients([]);
    };

    // CRUD: Invoices
    const addInvoice = async (invoice) => {
        const newInvoice = await apiFetch('/invoices', {
            method: 'POST',
            body: JSON.stringify(invoice),
        });
        await fetchUserData();
        const mapped = { ...newInvoice, id: newInvoice._id };
        return mapped;
    };
    const updateInvoice = async (id, updatedInvoice) => {
        const updated = await apiFetch(`/invoices/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updatedInvoice),
        });
        const mapped = { ...updated, id: updated._id };
        setInvoices(invoices.map(inv => inv.id === id ? mapped : inv));
    };
    const deleteInvoice = async (id) => {
        await apiFetch(`/invoices/${id}`, { method: 'DELETE' });
        setInvoices(invoices.filter(inv => inv.id !== id));
    };

    // CRUD: Clients
    const addClient = async (client) => {
        const newClient = await apiFetch('/clients', {
            method: 'POST',
            body: JSON.stringify(client),
        });
        await fetchUserData();
        const mapped = { ...newClient, id: newClient._id };
        return mapped;
    };
    const updateClient = async (id, updatedClient) => {
        const updated = await apiFetch(`/clients/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updatedClient),
        });
        const mapped = { ...updated, id: updated._id };
        setClients(clients.map(client => client.id === id ? mapped : client));
    };
    const deleteClient = async (id) => {
        await apiFetch(`/clients/${id}`, { method: 'DELETE' });
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
        fetchUserData,
        resetAll,
        loading,
    };

    return (
        <InvoiceContext.Provider value={value}>
            {children}
        </InvoiceContext.Provider>
    );
};

