import { useState } from 'react';
import { useInvoice } from '../context/InvoiceContext';
import { Plus, Edit, Trash2, Building2, Mail, Phone, MapPin } from 'lucide-react';

const Clients = () => {
    const { clients, addClient, updateClient, deleteClient } = useInvoice();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        phone: '',
        address: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingClient) {
            updateClient(editingClient.id, formData);
        } else {
            addClient(formData);
        }
        closeModal();
    };

    const openModal = (client = null) => {
        if (client) {
            setEditingClient(client);
            setFormData(client);
        } else {
            setEditingClient(null);
            setFormData({
                name: '',
                company: '',
                email: '',
                phone: '',
                address: '',
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingClient(null);
        setFormData({
            name: '',
            company: '',
            email: '',
            phone: '',
            address: '',
        });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this client?')) {
            deleteClient(id);
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
                    <p className="mt-2 text-gray-600">Manage your client database</p>
                </div>
                <button onClick={() => openModal()} className="btn-primary">
                    <Plus size={20} />
                    Add Client
                </button>
            </div>

            {clients.length === 0 ? (
                <div className="card text-center py-12">
                    <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No clients yet</h3>
                    <p className="mt-2 text-gray-500">Get started by adding your first client</p>
                    <button onClick={() => openModal()} className="btn-primary mt-6">
                        <Plus size={20} />
                        Add Your First Client
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clients.map((client) => (
                        <div key={client.id} className="card hover:shadow-md transition-shadow duration-200">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
                                    <p className="text-sm text-gray-600 mt-1 flex items-center">
                                        <Building2 size={14} className="mr-1" />
                                        {client.company}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openModal(client)}
                                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(client.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm">
                                <p className="text-gray-600 flex items-center">
                                    <Mail size={14} className="mr-2 text-gray-400" />
                                    {client.email}
                                </p>
                                {client.phone && (
                                    <p className="text-gray-600 flex items-center">
                                        <Phone size={14} className="mr-2 text-gray-400" />
                                        {client.phone}
                                    </p>
                                )}
                                {client.address && (
                                    <p className="text-gray-600 flex items-start">
                                        <MapPin size={14} className="mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                                        <span>{client.address}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            {editingClient ? 'Edit Client' : 'Add New Client'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="label">Full Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="input-field"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="label">Company Name *</label>
                                    <input
                                        type="text"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                        className="input-field"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="label">Email Address *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="input-field"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="label">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    <label className="label">Address</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="input-field"
                                        rows="3"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button type="button" onClick={closeModal} className="btn-secondary flex-1">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary flex-1">
                                    {editingClient ? 'Update' : 'Add'} Client
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Clients;
