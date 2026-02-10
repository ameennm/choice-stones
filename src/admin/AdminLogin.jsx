import { useState } from 'react'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { account } from '../lib/appwrite'

function AdminLogin({ onLogin }) {
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    // Hardcoded admin email for password-only login experience
    const ADMIN_EMAIL = 'admin@choicestones.com'

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            // Login with hardcoded email
            await account.createEmailPasswordSession(ADMIN_EMAIL, password)
            onLogin()
        } catch (err) {
            console.error(err)
            // Show genetic error or specific if needed
            setError('Invalid password. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="admin-login">
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <img src="/logo.png" alt="Choice Stones" className="login-logo" />
                        <h1>Admin Access</h1>
                        <p>Enter password to manage store</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        {error && (
                            <div className="login-error">
                                {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-wrapper">
                                <Lock size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter admin password"
                                    required
                                    autoFocus
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
                            {isLoading ? 'Verifying...' : 'Access Dashboard'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AdminLogin
