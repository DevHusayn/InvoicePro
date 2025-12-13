import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, Settings as SettingsIcon, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Layout = ({ children }) => {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Invoices', href: '/invoices', icon: FileText },
        { name: 'Clients', href: '/clients', icon: Users },
        { name: 'Settings', href: '/settings', icon: SettingsIcon },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar for desktop */}
            <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
                <div className="flex min-h-0 flex-1 flex-col bg-gradient-to-b from-primary-700 to-primary-900">
                    <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
                        <div className="flex items-center flex-shrink-0 px-6 mb-8">
                            <FileText className="h-8 w-8 text-white mr-3" />
                            <span className="text-2xl font-bold text-white">InvoicePro</span>
                        </div>
                        <nav className="mt-5 flex-1 space-y-1 px-4">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`${isActive(item.href)
                                            ? 'bg-primary-800 text-white'
                                            : 'text-primary-100 hover:bg-primary-800 hover:text-white'
                                            } group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200`}
                                    >
                                        <Icon className="mr-3 h-5 w-5" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                    <div className="flex flex-shrink-0 bg-primary-800 p-4">
                        <div className="w-full">
                            <p className="text-xs text-primary-200">Professional Invoicing</p>
                            <p className="text-sm font-medium text-white mt-1">v1.0.0</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile sidebar */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 flex md:hidden">
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
                    <div className="relative flex w-full max-w-xs flex-1 flex-col bg-gradient-to-b from-primary-700 to-primary-900">
                        <div className="absolute top-0 right-0 -mr-12 pt-2">
                            <button
                                type="button"
                                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <X className="h-6 w-6 text-white" />
                            </button>
                        </div>
                        <div className="flex items-center flex-shrink-0 px-6 pt-5 mb-8">
                            <FileText className="h-8 w-8 text-white mr-3" />
                            <span className="text-2xl font-bold text-white">InvoicePro</span>
                        </div>
                        <nav className="mt-5 flex-1 space-y-1 px-4">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`${isActive(item.href)
                                            ? 'bg-primary-800 text-white'
                                            : 'text-primary-100 hover:bg-primary-800 hover:text-white'
                                            } group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200`}
                                    >
                                        <Icon className="mr-3 h-5 w-5" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </div>
            )}

            {/* Main content */}
            <div className="md:pl-64 flex flex-col flex-1">
                {/* Mobile header */}
                <div className="sticky top-0 z-10 bg-white shadow-sm md:hidden">
                    <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center">
                            <FileText className="h-7 w-7 text-primary-600 mr-2" />
                            <span className="text-xl font-bold text-gray-900">InvoicePro</span>
                        </div>
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                <main className="flex-1">
                    <div className="py-6 px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
