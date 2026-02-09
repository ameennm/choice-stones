import { Link, useLocation } from 'react-router-dom'
import {
    LayoutDashboard, Package, Tags, LogOut, Menu, X,
    ChevronRight
} from 'lucide-react'
import { useState } from 'react'

function AdminLayout({ children, onLogout }) {
    const location = useLocation()
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const navItems = [
        { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { path: '/admin/products', icon: <Package size={20} />, label: 'Products' },
        { path: '/admin/categories', icon: <Tags size={20} />, label: 'Categories' }
    ]

    const isActive = (path) => {
        if (path === '/admin') {
            return location.pathname === '/admin'
        }
        return location.pathname.startsWith(path)
    }

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <img src="/logo.png" alt="Choice Stones" className="sidebar-logo" />
                    <button
                        className="sidebar-close"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                            {isActive(item.path) && <ChevronRight size={16} className="nav-arrow" />}
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={onLogout}>
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="admin-main">
                <header className="admin-header">
                    <button
                        className="menu-toggle"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu size={24} />
                    </button>
                    <div className="header-info">
                        <span className="header-welcome">Welcome, Admin</span>
                    </div>
                    <Link to="/" className="view-site-btn">
                        View Site →
                    </Link>
                </header>

                <main className="admin-content">
                    {children}
                </main>
            </div>

            {/* Overlay */}
            {isSidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    )
}

export default AdminLayout
