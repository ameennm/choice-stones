import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { account } from '../lib/appwrite'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'
import AdminProducts from './AdminProducts'
import AdminCategories from './AdminCategories'
import AdminLayout from './AdminLayout'
import './Admin.css'

function AdminApp() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
            await account.get()
            setIsAuthenticated(true)
        } catch (error) {
            setIsAuthenticated(false)
        } finally {
            setLoading(false)
        }
    }

    const handleLogin = () => {
        setIsAuthenticated(true)
    }

    const handleLogout = async () => {
        try {
            await account.deleteSession('current')
            setIsAuthenticated(false)
        } catch (error) {
            console.error('Logout failed:', error)
        }
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
                <Route path="/categories" element={<AdminCategories />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
        </AdminLayout>
    )
}

export default AdminApp
