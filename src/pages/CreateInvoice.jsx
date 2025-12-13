import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useInvoice } from '../context/InvoiceContext';
import { useSettings } from '../context/SettingsContext';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { CURRENCIES, formatCurrency } from '../utils/currency';

const CreateInvoice = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { clients, addInvoice, updateInvoice, invoices } = useInvoice();
    const { companyInfo } = useSettings();

    const [formData, setFormData] = useState({
        invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
        clientId: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        dueDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        items: [{ description: '', quantity: 1, rate: 0, amountPaid: 0 }],
        notes: '',
        status: 'pending',
        currency: companyInfo.defaultCurrency || 'USD',
        taxRate: companyInfo.taxRate || 10,
    });

    useEffect(() => {
        if (id) {
            const invoice = invoices.find(inv => inv.id === id);
            if (invoice) {
                setFormData(invoice);
            }
        }
    }, [id, invoices]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;
        setFormData({ ...formData, items: newItems });
    };

    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { description: '', quantity: 1, rate: 0, amountPaid: 0 }],
        });
    };

    const removeItem = (index) => {
        if (formData.items.length > 1) {
            const newItems = formData.items.filter((_, i) => i !== index);
            setFormData({ ...formData, items: newItems });
        }
    };

    const calculateSubtotal = () => {
        return formData.items.reduce((sum, item) => {
            return sum + (Number(item.quantity) * Number(item.rate));
        }, 0);
    };

    const calculateTax = () => {
        const taxRate = Number(formData.taxRate) || 10;
        return calculateSubtotal() * (taxRate / 100);
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateTax();
    };

    const calculateBalance = () => {
        if (formData.status === 'partial-payment') {
            const totalPaid = formData.items.reduce((sum, item) => {
                return sum + (Number(item.amountPaid) || 0);
            }, 0);
            return calculateTotal() - totalPaid;
        }
        return calculateTotal();
    };

    const calculateTotalPaid = () => {
        if (formData.status === 'partial-payment') {
            return formData.items.reduce((sum, item) => {
                return sum + (Number(item.amountPaid) || 0);
            }, 0);
        }
        return 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.clientId) {
            alert('Please select a client');
            return;
        }

        const invoiceData = {
            ...formData,
            subtotal: calculateSubtotal(),
            tax: calculateTax(),
            total: calculateTotal(),
            amountPaid: calculateTotalPaid(),
            balance: calculateBalance(),
        };

        if (id) {
            updateInvoice(id, invoiceData);
        } else {
            addInvoice(invoiceData);
        }

        navigate('/invoices');
    };

    const selectedClient = clients.find(c => c.id === formData.clientId);

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-6">
                <button
                    onClick={() => navigate('/invoices')}
                    className="btn-secondary mb-4"
                >
                    <ArrowLeft size={18} />
                    Back to Invoices
                </button>
                <h1 className="text-3xl font-bold text-gray-900">
                    {id ? 'Edit Invoice' : 'Create New Invoice'}
                </h1>
                <p className="mt-2 text-gray-600">Fill in the details below to generate an invoice</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Invoice Details Card */}
                        <div className="card">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Invoice Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Invoice Number</label>
                                    <input
                                        type="text"
                                        name="invoiceNumber"
                                        value={formData.invoiceNumber}
                                        className="input-field bg-gray-100 cursor-not-allowed"
                                        readOnly
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label className="label">Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="input-field"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="paid">Paid</option>
                                        <option value="partial-payment">Partial Payment</option>
                                        <option value="overdue">Overdue</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="label">Currency</label>
                                    <select
                                        name="currency"
                                        value={formData.currency}
                                        onChange={handleChange}
                                        className="input-field"
                                        required
                                    >
                                        {CURRENCIES.map(currency => (
                                            <option key={currency.code} value={currency.code}>
                                                {currency.symbol} {currency.code}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="label">Tax Rate (%)</label>
                                    <input
                                        type="number"
                                        name="taxRate"
                                        value={formData.taxRate}
                                        onChange={handleChange}
                                        className="input-field"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="label">Issue Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        className="input-field"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="label">Due Date</label>
                                    <input
                                        type="date"
                                        name="dueDate"
                                        value={formData.dueDate}
                                        onChange={handleChange}
                                        className="input-field"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Client Selection Card */}
                        <div className="card">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Client Information</h2>
                            <div>
                                <label className="label">Select Client</label>
                                <select
                                    name="clientId"
                                    value={formData.clientId}
                                    onChange={handleChange}
                                    className="input-field"
                                    required
                                >
                                    <option value="">Choose a client...</option>
                                    {clients.map(client => (
                                        <option key={client.id} value={client.id}>
                                            {client.name} - {client.company}
                                        </option>
                                    ))}
                                </select>
                                {clients.length === 0 && (
                                    <p className="mt-2 text-sm text-amber-600">
                                        No clients found. Please add a client first.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Items Card */}
                        <div className="card">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-900">Invoice Items</h2>
                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="btn-secondary text-sm py-2 px-3"
                                >
                                    <Plus size={16} />
                                    Add Item
                                </button>
                            </div>

                            <div className="space-y-4">
                                {formData.items.map((item, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                            <div className="md:col-span-5">
                                                <label className="label">Description</label>
                                                <input
                                                    type="text"
                                                    value={item.description}
                                                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                                    className="input-field"
                                                    placeholder="Service or product description"
                                                    required
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="label">Quantity</label>
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                                    className="input-field"
                                                    min="1"
                                                    required
                                                />
                                            </div>
                                            <div className="md:col-span-3">
                                                <label className="label">Rate ({CURRENCIES.find(c => c.code === formData.currency)?.symbol})</label>
                                                <input
                                                    type="number"
                                                    value={item.rate}
                                                    onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                                                    className="input-field"
                                                    min="0"
                                                    step="0.01"
                                                    required
                                                />
                                            </div>
                                            {formData.status === 'partial-payment' && (
                                                <div className="md:col-span-2">
                                                    <label className="label">Amount Paid</label>
                                                    <input
                                                        type="number"
                                                        value={item.amountPaid || 0}
                                                        onChange={(e) => handleItemChange(index, 'amountPaid', e.target.value)}
                                                        className="input-field"
                                                        min="0"
                                                        step="0.01"
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                            )}
                                            <div className={formData.status === 'partial-payment' ? 'md:col-span-2' : 'md:col-span-2'} >
                                                <div className="flex flex-col justify-end h-full">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium text-gray-700">
                                                            {formatCurrency(item.quantity * item.rate, formData.currency)}
                                                        </span>
                                                        {formData.items.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeItem(index)}
                                                                className="text-red-600 hover:text-red-800 p-2"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Notes Card */}
                        <div className="card">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Notes</h2>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                className="input-field resize-none"
                                rows="4"
                                placeholder="Add any additional information or payment terms..."
                            />
                        </div>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="card sticky top-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Summary</h2>

                            {selectedClient && (
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">Bill To</p>
                                    <p className="font-semibold text-gray-900">{selectedClient.name}</p>
                                    <p className="text-sm text-gray-600">{selectedClient.company}</p>
                                    <p className="text-sm text-gray-600">{selectedClient.email}</p>
                                </div>
                            )}

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span className="font-medium text-gray-900">{formatCurrency(calculateSubtotal(), formData.currency)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tax ({formData.taxRate}%):</span>
                                    <span className="font-medium text-gray-900">{formatCurrency(calculateTax(), formData.currency)}</span>
                                </div>
                                <div className="pt-3 border-t border-gray-200">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-lg font-semibold text-gray-900">Total:</span>
                                        <span className="text-2xl font-bold text-primary-600">
                                            {formatCurrency(calculateTotal(), formData.currency)}
                                        </span>
                                    </div>
                                    {formData.status === 'partial-payment' && calculateTotalPaid() > 0 && (
                                        <>
                                            <div className="flex justify-between text-sm mt-2">
                                                <span className="text-gray-600">Amount Paid:</span>
                                                <span className="font-medium text-green-600">-{formatCurrency(calculateTotalPaid(), formData.currency)}</span>
                                            </div>
                                            <div className="flex justify-between mt-2 pt-2 border-t border-gray-200">
                                                <span className="text-base font-semibold text-gray-900">Balance Due:</span>
                                                <span className="text-xl font-bold text-orange-600">
                                                    {formatCurrency(calculateBalance(), formData.currency)}
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <button type="submit" className="btn-primary w-full">
                                <Save size={18} />
                                {id ? 'Update Invoice' : 'Create Invoice'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateInvoice;
