import { useState } from 'react';
import AlertModal from '../components/AlertModal';
import ConfirmModal from '../components/ConfirmModal';
import { useNavigate } from 'react-router-dom';
import { useInvoice } from '../context/InvoiceContext';
import Spinner from '../components/Spinner';
import { useSettings } from '../context/SettingsContext';
import { Plus, Edit, Trash2, Download, FileText, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { generatePDF } from '../utils/pdfGenerator';
import { formatCurrency } from '../utils/currency';

const Invoices = () => {
    const navigate = useNavigate();
    const { invoices, clients, deleteInvoice, loading } = useInvoice();
    const { businessInfo } = useSettings();
    const [filter, setFilter] = useState('all');
    const [alert, setAlert] = useState({ open: false, message: '', type: 'error' });
    const [confirm, setConfirm] = useState({ open: false, invoiceId: null });

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
            overdue: 'bg-red-100 text-red-800 border-red-200',
            cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
        };
        return colors[status] || colors.pending;
    };

    const handleDelete = (id) => {
        setConfirm({ open: true, invoiceId: id });
    };

    const confirmDelete = async () => {
        const id = confirm.invoiceId;
        try {
            await deleteInvoice(id);
            setAlert({ open: true, message: 'Invoice deleted successfully!', type: 'success' });
        } catch (err) {
            setAlert({ open: true, message: err.message || 'Failed to delete invoice.', type: 'error' });
        }
        setConfirm({ open: false, invoiceId: null });
    };

    const handleDownload = (invoice) => {
        const client = clients.find(c => c.id === invoice.clientId);
        if (!client) {
            setAlert({ open: true, message: 'Client data not found for this invoice.' });
            return;
        }
        try {
            generatePDF(invoice, client, businessInfo);
        } catch (error) {
            setAlert({ open: true, message: `Failed to generate PDF: ${error.message}` });
        }
    };

    const filteredInvoices = filter === 'all'
        ? invoices
        : invoices.filter(inv => inv.status === filter);

    return (
        <>
            <AlertModal open={alert.open} message={alert.message} type={alert.type} onClose={() => setAlert({ open: false, message: '', type: 'error' })} />
            <ConfirmModal
                open={confirm.open}
                message={"Are you sure you want to delete this invoice?"}
                onConfirm={confirmDelete}
                onCancel={() => setConfirm({ open: false, invoiceId: null })}
            />
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-primary-700">Invoices</h1>
                        <p className="mt-2 text-gray-500 text-lg">Manage and track all your invoices</p>
                    </div>
                    <button onClick={() => navigate('/invoices/create')} className="bg-primary-600 hover:bg-primary-700 text-white font-semibold flex items-center gap-2 px-6 py-3 rounded-xl shadow-md transition">
                        <Plus size={20} />
                        Create Invoice
                    </button>
                </div>
                {/* Filter Tabs */}
                <div className="mb-8 flex justify-center">
                    <div className="inline-flex bg-gray-100 rounded-full shadow-sm p-1">
                        {['all', 'pending', 'paid', 'overdue', 'cancelled'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-5 py-2 rounded-full font-semibold capitalize transition-colors whitespace-nowrap text-sm focus:outline-none ${filter === status
                                    ? 'bg-primary-600 text-white shadow'
                                    : 'text-gray-700 hover:bg-primary-100'
                                    }`}
                            >
                                {status}
                                {status === 'all' && ` (${invoices.length})`}
                                {status !== 'all' && ` (${invoices.filter(inv => inv.status === status).length})`}
                            </button>
                        ))}
                    </div>
                </div>
                {loading ? (
                    <div className="py-24 flex justify-center items-center"><Spinner /></div>
                ) : filteredInvoices.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 text-center py-16 px-4">
                        <FileText className="mx-auto h-14 w-14 text-gray-300" />
                        <h3 className="mt-5 text-xl font-bold text-gray-900">
                            {filter === 'all' ? 'No invoices yet' : `No ${filter} invoices`}
                        </h3>
                        <p className="mt-2 text-gray-500 text-base">
                            {filter === 'all'
                                ? 'Create your first invoice to get started'
                                : `You don't have any ${filter} invoices`}
                        </p>
                        {filter === 'all' && (
                            <button onClick={() => navigate('/invoices/create')} className="mt-8 bg-primary-600 hover:bg-primary-700 text-white font-semibold flex items-center gap-2 px-6 py-3 rounded-xl shadow-md transition">
                                <Plus size={20} />
                                Create Your First Invoice
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredInvoices.map((invoice) => (
                            <div key={invoice.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-6">
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">
                                                    {invoice.invoiceNumber}
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {getClientName(invoice.clientId)} • {getClientCompany(invoice.clientId)}
                                                </p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(invoice.status)} capitalize`}>
                                                {invoice.status}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                                            <div>
                                                <p className="text-gray-400">Issue Date</p>
                                                <p className="font-medium text-gray-900">
                                                    {format(new Date(invoice.date), 'MMM dd, yyyy')}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400">Due Date</p>
                                                <p className="font-medium text-gray-900">
                                                    {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400">Amount</p>
                                                <p className="font-semibold text-primary-600 text-lg">
                                                    {formatCurrency(invoice.total, invoice.currency || 'USD', true)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400">Items</p>
                                                <p className="font-medium text-gray-900">
                                                    {invoice.items.length} item{invoice.items.length !== 1 ? 's' : ''}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex lg:flex-col gap-2 min-w-[120px]">
                                        <button
                                            onClick={() => handleDownload(invoice)}
                                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold flex items-center gap-2 px-4 py-2 rounded-lg transition text-sm"
                                            title="Download PDF"
                                        >
                                            <Download size={16} />
                                            PDF
                                        </button>
                                        <button
                                            onClick={() => navigate(`/invoices/edit/${invoice.id}`)}
                                            className="bg-primary-100 hover:bg-primary-200 text-primary-700 font-semibold flex items-center gap-2 px-4 py-2 rounded-lg transition text-sm"
                                            title="Edit Invoice"
                                        >
                                            <Edit size={16} />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(invoice.id)}
                                            className="bg-red-100 hover:bg-red-200 text-red-700 font-semibold flex items-center gap-2 px-4 py-2 rounded-lg transition text-sm"
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
                )
                }
            </div >
        </>
    );
};

export default Invoices;
