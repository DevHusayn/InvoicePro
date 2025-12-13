import { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import { Building2, Save, DollarSign, Edit, X } from 'lucide-react';
import { CURRENCIES } from '../utils/currency';

const Settings = () => {
    const { companyInfo, updateCompanyInfo } = useSettings();
    const [formData, setFormData] = useState(companyInfo);
    const [isEditing, setIsEditing] = useState(false);
    const [saved, setSaved] = useState(false);

    // Check if this is first time setup (default placeholder values)
    useEffect(() => {
        const isFirstTime = companyInfo.name === 'Your Company Name' ||
            companyInfo.email === 'your@email.com';
        setIsEditing(isFirstTime);
        setFormData(companyInfo);
    }, [companyInfo]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setSaved(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateCompanyInfo(formData);
        setIsEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setFormData(companyInfo);
        setIsEditing(false);
    };

    const getCurrencyName = (code) => {
        const currency = CURRENCIES.find(c => c.code === code);
        return currency ? `${currency.symbol} ${currency.name} (${currency.code})` : code;
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Company Settings</h1>
                    <p className="mt-2 text-gray-600">Configure your company information for invoices</p>
                </div>
                {!isEditing && (
                    <button onClick={handleEdit} className="btn-secondary">
                        <Edit size={18} />
                        Edit
                    </button>
                )}
            </div>

            {saved && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                    <span className="text-green-600 font-medium">
                        ✓ Settings saved successfully!
                    </span>
                </div>
            )}

            <div className="card">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-primary-100 p-3 rounded-lg">
                        <Building2 className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Your Company Info</h2>
                        <p className="text-sm text-gray-600">This appears on all your PDF invoices</p>
                    </div>
                </div>

                {!isEditing ? (
                    // View Mode - Display saved information
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Company Name</p>
                                <p className="text-base font-medium text-gray-900">{companyInfo.name}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Email</p>
                                <p className="text-base font-medium text-gray-900">{companyInfo.email}</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs text-gray-500 uppercase font-medium mb-1">Address</p>
                            <p className="text-base font-medium text-gray-900">{companyInfo.address}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-medium mb-1">Phone</p>
                                <p className="text-base font-medium text-gray-900">{companyInfo.phone}</p>
                            </div>
                            {companyInfo.website && (
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">Website</p>
                                    <p className="text-base font-medium text-primary-600">{companyInfo.website}</p>
                                </div>
                            )}
                        </div>

                        <div className="pt-6 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">Default Currency</p>
                                    <p className="text-base font-medium text-gray-900">{getCurrencyName(companyInfo.defaultCurrency || 'USD')}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">Brand Color</p>
                                    <div
                                        className="w-12 h-12 rounded-lg border-2 border-gray-300 shadow-sm"
                                        style={{ backgroundColor: companyInfo.brandColor || '#0ea5e9' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Edit Mode - Show form
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label className="label">Company Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input-field"
                                    required
                                    placeholder="e.g., Acme Corporation"
                                />
                            </div>

                            <div>
                                <label className="label">Address *</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="input-field resize-none"
                                    rows="2"
                                    required
                                    placeholder="123 Business St, Suite 100, City, State 12345"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="input-field"
                                        required
                                        placeholder="contact@company.com"
                                    />
                                </div>

                                <div>
                                    <label className="label">Phone *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="input-field"
                                        required
                                        placeholder="+1 (555) 123-4567"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="label">Website (Optional)</label>
                                <input
                                    type="url"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="https://www.yourcompany.com"
                                />
                            </div>

                            <div>
                                <label className="label">Default Currency *</label>
                                <select
                                    name="defaultCurrency"
                                    value={formData.defaultCurrency || 'USD'}
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
                                <label className="label">Brand Color *</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        name="brandColor"
                                        value={formData.brandColor || '#0ea5e9'}
                                        onChange={handleChange}
                                        className="h-12 w-20 rounded-lg border border-gray-300 cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        name="brandColor"
                                        value={formData.brandColor || '#0ea5e9'}
                                        onChange={handleChange}
                                        className="input-field flex-1"
                                        pattern="^#[0-9A-Fa-f]{6}$"
                                        placeholder="#0ea5e9"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2 mb-2">This color will be used in your PDF invoice headers</p>

                                {/* Preset Colors */}
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs text-gray-600 font-medium">Quick picks:</span>
                                    {[
                                        { color: '#0ea5e9', name: 'Blue' },
                                        { color: '#8b5cf6', name: 'Purple' },
                                        { color: '#10b981', name: 'Green' },
                                        { color: '#f59e0b', name: 'Orange' },
                                        { color: '#ef4444', name: 'Red' },
                                        { color: '#ec4899', name: 'Pink' },
                                        { color: '#06b6d4', name: 'Cyan' },
                                        { color: '#6366f1', name: 'Indigo' },
                                    ].map(preset => (
                                        <button
                                            key={preset.color}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, brandColor: preset.color })}
                                            className="w-8 h-8 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-all hover:scale-110"
                                            style={{ backgroundColor: preset.color }}
                                            title={preset.name}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center gap-3">
                            <button type="submit" className="btn-primary">
                                <Save size={18} />
                                Save Changes
                            </button>
                            <button type="button" onClick={handleCancel} className="btn-secondary">
                                <X size={18} />
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <DollarSign size={18} />
                        Currency & Branding
                    </h3>
                    <p className="text-sm text-blue-800">Your default currency will be pre-selected when creating invoices. Brand color appears on your PDF invoice headers.</p>
                </div>
            </div>
        </div>
    );
};

export default Settings;
