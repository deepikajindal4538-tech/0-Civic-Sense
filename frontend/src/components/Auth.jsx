import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5501/api/login', { username, password });
            if (res.data.success) {
                localStorage.setItem('user', JSON.stringify(res.data.user));
                if (res.data.user.role === 'admin') {
                    navigate('/dashboard');
                } else {
                    navigate('/');
                }
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <section className="view-section active">
            <div className="login-view-container">
                <div className="glass-panel login-panel">
                    <h2>Welcome</h2>
                    <p className="subtitle">Please log in to access this feature</p>
                    {error && <p style={{color: 'red'}}>{error}</p>}
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label>Username</label>
                            <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter 'admin' for Admin access" required />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password (admin123)" required />
                        </div>
                        <div className="form-actions" style={{justifyContent: 'center'}}>
                            <button type="submit" className="btn-primary" style={{width: '100%', justifyContent: 'center'}}>
                                Log In
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Auth;
