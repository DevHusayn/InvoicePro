import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Invoices from './pages/Invoices';
import CreateInvoice from './pages/CreateInvoice';
import Clients from './pages/Clients';
import Settings from './pages/Settings';
import { InvoiceProvider } from './context/InvoiceContext';
import { SettingsProvider } from './context/SettingsContext';

function App() {
    return (
        <SettingsProvider>
            <InvoiceProvider>
                <Router>
                    <Layout>
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/invoices" element={<Invoices />} />
                            <Route path="/invoices/create" element={<CreateInvoice />} />
                            <Route path="/invoices/edit/:id" element={<CreateInvoice />} />
                            <Route path="/clients" element={<Clients />} />
                            <Route path="/settings" element={<Settings />} />
                        </Routes>
                    </Layout>
                </Router>
            </InvoiceProvider>
        </SettingsProvider>
    );
}

export default App;
