import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Invoices from './pages/Invoices';
import CreateInvoice from './pages/CreateInvoice';
import Clients from './pages/Clients';
import Settings from './pages/Settings';
import Auth from './pages/Auth';
import ResetPassword from './pages/ResetPassword';
import PrivateRoute from './utils/PrivateRoute';
import AdminRoute from './utils/AdminRoute';
import AdminDashboard from './pages/AdminDashboard';
import { InvoiceProvider } from './context/InvoiceContext';
import { SettingsProvider } from './context/SettingsContext';

function App() {
    return (
        <SettingsProvider>
            <InvoiceProvider>
                <Router>
                    <Routes>
                        <Route path="/auth" element={<Auth />} />
                        <Route path="/reset-password/:token" element={<ResetPassword />} />
                        <Route
                            path="*"
                            element={
                                <Layout>
                                    <Routes>
                                        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                                        <Route path="/invoices" element={<PrivateRoute><Invoices /></PrivateRoute>} />
                                        <Route path="/invoices/create" element={<PrivateRoute><CreateInvoice /></PrivateRoute>} />
                                        <Route path="/invoices/edit/:id" element={<PrivateRoute><CreateInvoice /></PrivateRoute>} />
                                        <Route path="/clients" element={<PrivateRoute><Clients /></PrivateRoute>} />
                                        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
                                        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                                    </Routes>
                                </Layout>
                            }
                        />
                    </Routes>
                </Router>
            </InvoiceProvider>
        </SettingsProvider>
    );
}

export default App;
