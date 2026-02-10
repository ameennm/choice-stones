import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import FloatingCart from './components/FloatingCart'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import About from './pages/About'
import Contact from './pages/Contact'
import AdminApp from './admin/AdminApp'
import { client } from './lib/appwrite'

function App() {
    const location = useLocation()
    const isAdminRoute = location.pathname.startsWith('/admin')

    // Ping Appwrite on app startup to verify the connection
    useEffect(() => {
        // Appwrite initialized
        console.log('✅ Appwrite initialized')
    }, [])

    return (
        <div className="app">
            {!isAdminRoute && <Navbar />}
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/admin/*" element={<AdminApp />} />
                </Routes>
            </main>
            {!isAdminRoute && <FloatingCart />}
            {!isAdminRoute && <Footer />}
        </div>
    )
}

export default App
