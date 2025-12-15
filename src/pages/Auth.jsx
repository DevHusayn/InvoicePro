
import React, { useState, useEffect } from 'react';
import AlertModal from '../components/AlertModal';
import { useSettings } from '../context/SettingsContext';
import { useInvoice } from '../context/InvoiceContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { CURRENCIES } from '../utils/currency';

const API_URL = 'http://localhost:5000/api/auth';

function Auth() {
    const { setBusinessInfo } = useSettings();
    const { fetchUserData, resetAll } = useInvoice();
    const [isLogin, setIsLogin] = useState(true);
    const initialForm = {
        email: '',
        password: '',
        name: '',
        address: '',
        businessEmail: '',
        phone: '',
        website: '',
        defaultCurrency: 'USD',
        brandColor: '#0ea5e9',
    };
    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [resetModal, setResetModal] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetLoading, setResetLoading] = useState(false);
    const [alert, setAlert] = useState({ open: false, message: '', type: 'error' });
    const navigate = useNavigate();
    const location = useLocation();

    // Reset form fields when Auth page is shown (route changes to /auth), switching login/register, or on logout
    useEffect(() => {
        setForm(initialForm);
    }, [isLogin, location.pathname, location.key]);

    useEffect(() => {
        const resetForm = () => setForm(initialForm);
        window.addEventListener('app-logout', resetForm);
        return () => window.removeEventListener('app-logout', resetForm);
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        // Strong password requirements (only for registration)
        if (!isLogin) {
            const password = form.password;
            const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=]{8,}$/;
            if (!strong.test(password)) {
                setError('Password must be at least 8 characters, include uppercase, lowercase, and a number.');
                return;
            }
        }
        try {
            let body = { email: form.email, password: form.password };
            if (!isLogin) {
                body.businessInfo = {
                    name: form.name,
                    address: form.address,
                    email: form.businessEmail,
                    phone: form.phone,
                    website: form.website,
                    defaultCurrency: form.defaultCurrency,
                    brandColor: form.brandColor,
                };
            }
            const res = await fetch(`${API_URL}/${isLogin ? 'login' : 'register'}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Error');
            localStorage.setItem('token', data.token);
            if (data.user && typeof data.user.isAdmin !== 'undefined') {
                localStorage.setItem('isAdmin', data.user.isAdmin);
            } else {
                localStorage.removeItem('isAdmin');
            }
            // After login or registration, fetch all user data and company info
            await fetchUserData();
            // Always fetch the latest business info after login or registration
            try {
                const res = await fetch('http://localhost:5000/api/business-info', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${data.token}`
                    }
                });
                if (res.ok) {
                    const info = await res.json();
                    setBusinessInfo(info);
                }
            } catch { }
            navigate('/');
        } catch (err) {
            setError(err.message);
            resetAll();
        }
    };

    return (
        <div key={location.key} className="min-h-screen flex items-center justify-center bg-gray-50 py-10">
            <AlertModal open={alert.open} message={alert.message} type={alert.type} onClose={() => setAlert({ open: false, message: '', type: 'error' })} />
            {/* Password Reset Modal */}
            {resetModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h2 className="text-xl font-bold mb-4 text-center">Reset Password</h2>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            setResetLoading(true);
                            try {
                                const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ email: resetEmail }),
                                });
                                const data = await res.json();
                                if (!res.ok) throw new Error(data.message || 'Error');
                                setAlert({ open: true, message: 'If the email exists, a reset link will be sent.', type: 'success' });
                                setResetModal(false);
                            } catch (err) {
                                setAlert({ open: true, message: err.message, type: 'error' });
                            } finally {
                                setResetLoading(false);
                            }
                        }} className="space-y-4">
                            <div>
                                <label className="label">Email Address</label>
                                <input type="email" className="input-field" value={resetEmail} onChange={e => setResetEmail(e.target.value)} required />
                            </div>
                            <div className="flex gap-2 mt-4">
                                <button type="button" className="btn-secondary flex-1" onClick={() => setResetModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary flex-1" disabled={resetLoading}>{resetLoading ? 'Sending...' : 'Send Reset Link'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                <h1 className="text-3xl font-bold text-center mb-2 text-primary-700 tracking-tight">
                    {isLogin ? 'Sign In to InvoicePro' : 'Create Your Account'}
                </h1>
                <p className="text-center text-gray-500 mb-8">
                    {isLogin ? 'Welcome back! Please login to your account.' : 'Register to start managing your invoices professionally.'}
                </p>
                <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
                    <div className="space-y-4">
                        <div>
                            <label className="label">Email Address <span className="text-red-500">*</span></label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="you@email.com"
                                autoComplete="off"
                                required
                            />
                        </div>
                        <div className="relative">
                            <label className="label">Password <span className="text-red-500">*</span></label>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                className="input-field pr-12"
                                placeholder="••••••••"
                                autoComplete="off"
                                required
                            />
                            <button
                                type="button"
                                tabIndex={-1}
                                className="absolute right-3 top-9 transform -translate-y-1/2 text-gray-400 hover:text-primary-600 focus:outline-none"
                                onClick={() => setShowPassword((v) => !v)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575m1.875-2.25A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.403 3.22-1.125 4.575m-1.875 2.25A9.956 9.956 0 0112 21c-2.21 0-4.267-.72-5.925-1.95M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm2.121-2.121A9.956 9.956 0 0121 12c0 5.523-4.477 10-10 10-1.657 0-3.22-.403-4.575-1.125m-2.25-1.875A9.956 9.956 0 013 12c0-5.523 4.477-10 10-10 1.657 0 3.22.403 4.575 1.125" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <div className="flex justify-end mt-1">
                            {isLogin && (
                                <button type="button" className="text-primary-600 hover:underline text-xs font-semibold" onClick={() => setResetModal(true)}>
                                    Forgot Password?
                                </button>
                            )}
                        </div>
                    </div>
                    {!isLogin && (
                        <>
                            <div className="pt-2 pb-1 border-b border-gray-200 mb-2">
                                <h2 className="text-lg font-semibold text-primary-700 mb-1">Company Information</h2>
                                <p className="text-xs text-gray-500 mb-2">This info will appear on your invoices.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Business Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="e.g. Acme Corp"
                                        autoComplete="off"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="label">Business Email <span className="text-red-500">*</span></label>
                                    <input
                                        type="email"
                                        name="companyEmail"
                                        value={form.companyEmail}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="company@email.com"
                                        autoComplete="off"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="label">Phone</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="e.g. +234 801 234 5678"
                                        autoComplete="off"
                                    />
                                </div>
                                <div>
                                    <label className="label">Website</label>
                                    <input
                                        type="text"
                                        name="website"
                                        value={form.website}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="https://yourcompany.com"
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="label">Business Address <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={form.address}
                                        onChange={handleChange}
                                        className="input-field"
                                        placeholder="123 Business St, City, Country"
                                        autoComplete="off"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                <div>
                                    <label className="label">Default Currency <span className="text-red-500">*</span></label>
                                    <select
                                        name="defaultCurrency"
                                        value={form.defaultCurrency}
                                        onChange={handleChange}
                                        className="input-field"
                                        required
                                    >
                                        {CURRENCIES.map(currency => (
                                            <option key={currency.code} value={currency.code}>
                                                {currency.symbol} - {currency.name} ({currency.code})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="label">Brand Color <span className="text-red-500">*</span></label>
                                    <input
                                        type="color"
                                        name="brandColor"
                                        value={form.brandColor}
                                        onChange={handleChange}
                                        className="input-field h-12 w-full p-0 border-none bg-transparent"
                                        style={{ minHeight: '3rem', minWidth: '100%' }}
                                        autoComplete="off"
                                    />
                                </div>
                            </div>
                        </>
                    )}
                    {error && <div className="text-red-600 text-sm text-center mt-2">{error}</div>}
                    <button type="submit" className="btn-primary w-full mt-2 text-lg py-3">
                        {isLogin ? 'Sign In' : 'Register'}
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <span className="text-gray-500 text-sm">
                        {isLogin ? "Don't have an account?" : 'Already have an account?'}
                    </span>
                    <button
                        className="ml-2 text-primary-600 hover:underline text-sm font-semibold"
                        onClick={() => setIsLogin((v) => !v)}
                    >
                        {isLogin ? 'Register' : 'Sign In'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Auth;
