// Utility for API requests with JWT
const API_BASE = 'http://localhost:5000/api';

export function getToken() {
    return localStorage.getItem('token');
}

export async function apiFetch(path, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
    });
    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'API error');
    }
    return res.json();
}
