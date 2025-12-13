import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInvoice } from '../context/InvoiceContext';
import { useSettings } from '../context/SettingsContext';
import { Plus, Edit, Trash2, Download, FileText, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { generatePDF } from '../utils/pdfGenerator';
import { formatCurrency } from '../utils/currency';

const Invoices = () => {
    const navigate = useNavigate();
    const { invoices, clients, deleteInvoice } = useInvoice();
    const { companyInfo } = useSettings();
    const [filter, setFilter] = useState('all');

    const getClientName = (clientId) => {
        const client = clients.find(c => c.id === clientId);
        return client ? client.name : 'Unknown Client';
    };

    const getClientCompany = (clientId) => {
        const client = clients.find(c => c.id === clientId);
        return client ? client.company : '';
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            paid: 'bg-green-100 text-green-800 border-green-200',
            'partial-payment': 'bg-blue-100 text-blue-800 border-blue-200',
            overdue: 'bg-red-100 text-red-800 border-red-200',
            cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
        };
        return colors[status] || colors.pending;
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this invoice?')) {
            deleteInvoice(id);
        }
    };

    const handleDownload = (invoice) => {
        const client = clients.find(c => c.id === invoice.clientId);
        if (!client) {
            alert('Client data not found for this invoice.');
            return;
        }
        try {
            console.log('Attempting to generate PDF for invoice:', invoice);
            console.log('Client:', client);
            console.log('Company Info:', companyInfo);
            generatePDF(invoice, client, companyInfo);
        } catch (error) {
            console.error('PDF generation error:', error);
            console.error('Error details:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
            alert(`Failed to generate PDF: ${error.message}`);
        }
    };

    const filteredInvoices = filter === 'all'
        ? invoices
        : invoices.filter(inv => inv.status === filter);

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
                    <p className="mt-2 text-gray-600">Manage and track all your invoices</p>
                </div>
                <button onClick={() => navigate('/invoices/create')} className="btn-primary">
                    <Plus size={20} />
                    Create Invoice
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="card mb-6">
                <div className="flex gap-2 overflow-x-auto">
                    {['all', 'pending', 'paid', 'partial-payment', 'overdue', 'cancelled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize whitespace-nowrap ${filter === status
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {status === 'partial-payment' ? 'Partial Payment' : status}
                            {status === 'all' && ` (${invoices.length})`}
                            {status !== 'all' && ` (${invoices.filter(inv => inv.status === status).length})`}
                        </button>
                    ))}
                </div>
            </div>

            {filteredInvoices.length === 0 ? (
                <div className="card text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                        {filter === 'all' ? 'No invoices yet' : `No ${filter} invoices`}
                    </h3>
                    <p className="mt-2 text-gray-500">
                        {filter === 'all'
                            ? 'Create your first invoice to get started'
                            : `You don't have any ${filter} invoices`}
                    </p>
                    {filter === 'all' && (
                        <button onClick={() => navigate('/invoices/create')} className="btn-primary mt-6">
                            <Plus size={20} />
                            Create Your First Invoice
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredInvoices.map((invoice) => (
                        <div key={invoice.id} className="card hover:shadow-md transition-shadow duration-200">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {invoice.invoiceNumber}
                                            </h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {getClientName(invoice.clientId)} • {getClientCompany(invoice.clientId)}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(invoice.status)} capitalize`}>
                                            {invoice.status === 'partial-payment' ? 'Partial Payment' : invoice.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                                        <div>
                                            <p className="text-gray-500">Issue Date</p>
                                            <p className="font-medium text-gray-900">
                                                {format(new Date(invoice.date), 'MMM dd, yyyy')}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Due Date</p>
                                            <p className="font-medium text-gray-900">
                                                {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Amount</p>
                                            <p className="font-semibold text-primary-600 text-lg">
                                                {formatCurrency(invoice.total, invoice.currency || 'USD')}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Items</p>
                                            <p className="font-medium text-gray-900">
                                                {invoice.items.length} item{invoice.items.length !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex lg:flex-col gap-2">
                                    <button
                                        onClick={() => handleDownload(invoice)}
                                        className="btn-secondary flex-1 lg:flex-initial text-sm"
                                        title="Download PDF"
                                    >
                                        <Download size={16} />
                                        PDF
                                    </button>
                                    <button
                                        onClick={() => navigate(`/invoices/edit/${invoice.id}`)}
                                        className="btn-secondary flex-1 lg:flex-initial text-sm"
                                        title="Edit Invoice"
                                    >
                                        <Edit size={16} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(invoice.id)}
                                        className="btn-danger flex-1 lg:flex-initial text-sm"
                                        title="Delete Invoice"
                                    >
                                        <Trash2 size={16} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Invoices;
