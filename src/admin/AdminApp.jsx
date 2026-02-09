import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'
import AdminProducts from './AdminProducts'
import AdminCategories from './AdminCategories'
import AdminLayout from './AdminLayout'
import './Admin.css'

function AdminApp() {
    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage.getItem('adminAuth') === 'true'
    )

    const handleLogin = () => {
        localStorage.setItem('adminAuth', 'true')
        setIsAuthenticated(true)
    }

    const handleLogout = () => {
        localStorage.removeItem('adminAuth')
        setIsAuthenticated(false)
    }

    if (!isAuthenticated) {
        return <AdminLogin onLogin={handleLogin} />
    }

    return (
        <AdminLayout onLogout={handleLogout}>
            <Routes>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="/products" element={<AdminProducts />} />
                <Route path="/categories" element={<AdminCategories />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
        </AdminLayout>
    )
}

export default AdminApp
