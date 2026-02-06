import { useState } from 'react'
import { Eye, EyeOff, Lock, User } from 'lucide-react'

function AdminLogin({ onLogin }) {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    // Demo credentials
    const DEMO_CREDENTIALS = {
        username: 'admin',
        password: 'admin123'
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        if (
            formData.username === DEMO_CREDENTIALS.username &&
            formData.password === DEMO_CREDENTIALS.password
        ) {
            onLogin()
        } else {
            setError('Invalid username or password')
        }

        setIsLoading(false)
    }

    return (
        <div className="admin-login">
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <img src="/logo.png" alt="Choice Stones" className="login-logo" />
                        <h1>Admin Panel</h1>
                        <p>Sign in to manage your store</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        {error && (
                            <div className="login-error">
                                {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <div className="input-wrapper">
                                <User size={18} />
                                <input
                                    type="text"
                                    id="username"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    placeholder="Enter username"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-wrapper">
                                <Lock size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Enter password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary login-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="demo-credentials">
                        <p><strong>Demo Credentials:</strong></p>
                        <p>Username: admin | Password: admin123</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminLogin
