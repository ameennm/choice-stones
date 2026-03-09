import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'
import AdminProducts from './AdminProducts'
import AdminWholesale from './AdminWholesale'
import AdminCategories from './AdminCategories'
import AdminSettings from './AdminSettings'
import AdminLayout from './AdminLayout'
import AdminImageMapping from './AdminImageMapping'
import './Admin.css'

function AdminApp() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const auth = sessionStorage.getItem('admin_auth');
        if (auth === 'true') {
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, [])

    const handleLogin = () => {
        sessionStorage.setItem('admin_auth', 'true');
        setIsAuthenticated(true)
    }

    const handleLogout = () => {
        sessionStorage.removeItem('admin_auth');
        setIsAuthenticated(false)
    }

    if (loading) {
        return <div className="loading-screen">Loading...</div>
    }

    if (!isAuthenticated) {
        return <AdminLogin onLogin={handleLogin} />
    }

    return (
        <AdminLayout onLogout={handleLogout}>
            <Routes>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/products" element={<AdminProducts />} />
                <Route path="/wholesale" element={<AdminWholesale />} />
                <Route path="/categories" element={<AdminCategories />} />
                <Route path="/image-mapping" element={<AdminImageMapping />} />
                <Route path="/settings" element={<AdminSettings />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
        </AdminLayout>
    )
}

export default AdminApp
