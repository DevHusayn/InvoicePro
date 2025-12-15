import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AlertModal from '../components/AlertModal';

export default function ResetPassword() {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [alert, setAlert] = useState({ open: false, message: '', type: 'error' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirm) {
            setAlert({ open: true, message: 'Passwords do not match.', type: 'error' });
            return;
        }
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=]{8,}$/.test(password)) {
            setAlert({ open: true, message: 'Password must be at least 8 characters, include uppercase, lowercase, and a number.', type: 'error' });
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/api/auth/reset-password/${token}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Error');
            setAlert({ open: true, message: 'Password reset successful! You can now log in.', type: 'success' });
            setTimeout(() => navigate('/auth'), 2000);
        } catch (err) {
            setAlert({ open: true, message: err.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10">
            <AlertModal open={alert.open} message={alert.message} type={alert.type} onClose={() => setAlert({ open: false, message: '', type: 'error' })} />
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                <h1 className="text-2xl font-bold text-center mb-6 text-primary-700">Reset Password</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="label">New Password</label>
                        <input
                            type="password"
                            className="input-field"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            placeholder="Enter new password"
                        />
                    </div>
                    <div>
                        <label className="label">Confirm Password</label>
                        <input
                            type="password"
                            className="input-field"
                            value={confirm}
                            onChange={e => setConfirm(e.target.value)}
                            required
                            placeholder="Confirm new password"
                        />
                    </div>
                    <button type="submit" className="btn-primary w-full mt-2 text-lg py-3" disabled={loading}>
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}
