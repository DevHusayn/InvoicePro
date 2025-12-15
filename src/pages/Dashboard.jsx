import { useInvoice } from '../context/InvoiceContext';
import { useSettings } from '../context/SettingsContext';
import { FileText, Users, DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/currency';

const Dashboard = () => {
    const { invoices, clients } = useInvoice();
    const { businessInfo } = useSettings();
    const navigate = useNavigate();

    const totalRevenue = invoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + inv.total, 0);

    const pendingRevenue = invoices
        .filter(inv => inv.status === 'pending')
        .reduce((sum, inv) => sum + inv.total, 0);

    const overdueInvoices = invoices.filter(inv => inv.status === 'overdue');

    const recentInvoices = [...invoices]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    const stats = [
        {
            name: 'Total Invoices',
            value: invoices.length,
            icon: FileText,
            color: 'bg-blue-500',
            bgLight: 'bg-blue-50',
            textColor: 'text-blue-600',
        },
        {
            name: 'Total Clients',
            value: clients.length,
            icon: Users,
            color: 'bg-purple-500',
            bgLight: 'bg-purple-50',
            textColor: 'text-purple-600',
        },
        {
            name: 'Revenue (Paid)',
            value: formatCurrency(totalRevenue, businessInfo.defaultCurrency || 'USD', true),
            icon: DollarSign,
            color: 'bg-green-500',
            bgLight: 'bg-green-50',
            textColor: 'text-green-600',
        },
        {
            name: 'Pending Revenue',
            value: formatCurrency(pendingRevenue, businessInfo.defaultCurrency || 'USD', true),
            icon: Clock,
            color: 'bg-yellow-500',
            bgLight: 'bg-yellow-50',
            textColor: 'text-yellow-600',
        },
    ];

    const getClientName = (clientId) => {
        const client = clients.find(c => c.id === clientId);
        return client ? client.name : 'Unknown Client';
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            paid: 'bg-green-100 text-green-800',
            overdue: 'bg-red-100 text-red-800',
            cancelled: 'bg-gray-100 text-gray-800',
        };
        return colors[status] || colors.pending;
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-10">
                <h1 className="text-3xl font-extrabold text-primary-700">Dashboard</h1>
                <p className="mt-2 text-gray-500 text-lg">Welcome back! Here's an overview of your invoicing</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.name} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex items-center gap-4">
                            <div className={`${stat.bgLight} p-4 rounded-xl flex items-center justify-center`}>
                                <Icon className={`h-7 w-7 ${stat.textColor}`} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-semibold">{stat.name}</p>
                                <p className="text-2xl font-extrabold text-gray-900">{stat.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-10 p-6">
                <h2 className="text-xl font-bold text-primary-700 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => navigate('/invoices/create')}
                        className="bg-primary-600 hover:bg-primary-700 text-white font-semibold flex items-center gap-2 px-6 py-4 rounded-xl shadow-md transition justify-start"
                    >
                        <FileText size={20} />
                        Create New Invoice
                    </button>
                    <button
                        onClick={() => navigate('/clients')}
                        className="bg-primary-100 hover:bg-primary-200 text-primary-700 font-semibold flex items-center gap-2 px-6 py-4 rounded-xl shadow-md transition justify-start"
                    >
                        <Users size={20} />
                        Manage Clients
                    </button>
                    <button
                        onClick={() => navigate('/invoices')}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold flex items-center gap-2 px-6 py-4 rounded-xl shadow-md transition justify-start"
                    >
                        <TrendingUp size={20} />
                        View All Invoices
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Invoices */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-primary-700 mb-4">Recent Invoices</h2>
                    {recentInvoices.length === 0 ? (
                        <div className="text-center py-10">
                            <FileText className="mx-auto h-12 w-12 text-gray-300" />
                            <p className="mt-3 text-gray-500 text-base">No invoices yet</p>
                            <button
                                onClick={() => navigate('/invoices/create')}
                                className="mt-6 bg-primary-600 hover:bg-primary-700 text-white font-semibold flex items-center gap-2 px-6 py-3 rounded-xl shadow-md transition"
                            >
                                Create Your First Invoice
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentInvoices.map((invoice) => (
                                <div
                                    key={invoice.id}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer border border-gray-100"
                                    onClick={() => navigate(`/invoices/edit/${invoice.id}`)}
                                >
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900">{invoice.invoiceNumber}</p>
                                        <p className="text-sm text-gray-500">{getClientName(invoice.clientId)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-primary-700">{formatCurrency(invoice.total, invoice.currency || 'USD', true)}</p>
                                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(invoice.status)} capitalize mt-1`}>
                                            {invoice.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Overdue & Alerts */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-primary-700 mb-4">Alerts & Notifications</h2>
                    {overdueInvoices.length === 0 ? (
                        <div className="text-center py-10">
                            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                            <p className="mt-3 font-semibold text-gray-900">All caught up!</p>
                            <p className="text-gray-500">No overdue invoices</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {overdueInvoices.map((invoice) => (
                                <div
                                    key={invoice.id}
                                    className="p-4 bg-red-50 border border-red-200 rounded-xl"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-semibold text-gray-900">{invoice.invoiceNumber}</p>
                                            <p className="text-sm text-gray-500">{getClientName(invoice.clientId)}</p>
                                            <p className="text-xs text-red-600 mt-1">
                                                Due: {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
                                            </p>
                                        </div>
                                        <p className="font-bold text-red-600">{formatCurrency(invoice.total, invoice.currency || 'USD', true)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
