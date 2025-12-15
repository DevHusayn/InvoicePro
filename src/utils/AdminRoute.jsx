import { Navigate } from 'react-router-dom';
import { getToken, apiFetch } from '../utils/api';
import { useEffect, useState } from 'react';

export default function AdminRoute({ children }) {
    const [isAdmin, setIsAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkAdmin() {
            try {
                const res = await apiFetch('/auth/admin/users'); // Only admins can access
                setIsAdmin(true);
            } catch {
                setIsAdmin(false);
            } finally {
                setLoading(false);
            }
        }
        if (getToken()) checkAdmin();
        else {
            setIsAdmin(false);
            setLoading(false);
        }
    }, []);

    if (loading) return null;
    if (!isAdmin) return <Navigate to="/" replace />;
    return children;
}
