import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Services from './pages/Services';
import Dashboard from './pages/Dashboard';
import Reservations from './pages/Reservations';
import PrestataireDashboard from './pages/PrestataireDashboard';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import Profile from "./pages/Profile";


const PrivateRoute = ({ children, role }) => {
    const { user, loading } = useAuth();
    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#080808' }}>
            <div style={{ color: '#C5A059', fontSize: '1.5rem', letterSpacing: '4px' }}>CHARGEMENT...</div>
        </div>
    );
    if (!user) return <Navigate to="/login" replace />;
    if (role && user.role !== role) return <Navigate to="/dashboard" replace />;
    return children;
};

const PublicOnlyRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#080808' }}>
            <div style={{ color: '#C5A059', fontSize: '1.5rem', letterSpacing: '4px' }}>CHARGEMENT...</div>
        </div>
    );
    if (user) {
        if (user.role === 'admin') return <Navigate to="/app-admin" replace />;
        if (user.role === 'prestataire') return <Navigate to="/prestataire" replace />;
        return <Navigate to="/dashboard" replace />;
    }
    return children;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <div style={{ minHeight: '80vh' }}>
                    <Routes>
                        {/* Publiques */}
                        <Route path="/" element={<Home />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
                        <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />

                        {/* Client */}
                        <Route path="/dashboard" element={<PrivateRoute role="client"><Dashboard /></PrivateRoute>} />
                        <Route path="/reservations" element={<PrivateRoute role="client"><Reservations /></PrivateRoute>} />

                        {/* Prestataire */}
                        <Route path="/prestataire" element={<PrivateRoute role="prestataire"><PrestataireDashboard /></PrivateRoute>} />

                        {/* Admin */}
                        <Route path="/app-admin" element={<PrivateRoute role="admin"><Admin /></PrivateRoute>} />
                        {/*Profile*/}
                        <Route path="/profile" element={<Profile />} />
                        {/* 404 */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
                <Footer />
            </Router>
        </AuthProvider>
    );
}

export default App;