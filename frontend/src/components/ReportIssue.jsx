import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ReportIssue = () => {
    const [desc, setDesc] = useState('');
    const [category, setCategory] = useState('');
    const [location, setLocation] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const reportedBy = user ? user.username : 'Citizen';
            await axios.post('http://localhost:5501/api/issues', {
                desc, category, location, urgency: 'Medium', reportedBy
            });
            alert('✅ Your complaint has been submitted and is pending admin approval. It will appear on the public feed once approved.');
            navigate('/');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <section className="view-section active">
            <div className="report-container">
                <form onSubmit={handleSubmit} className="glass-panel">
                    <h2>Submit a New Issue</h2>
                    <p className="subtitle">Help us improve the community by reporting local issues.</p>
                    
                    <div className="form-group" style={{marginTop: '24px'}}>
                        <label>Category</label>
                        <select value={category} onChange={e => setCategory(e.target.value)} required style={{width: '100%', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border-glass)'}}>
                            <option value="">Select Category</option>
                            <option value="Infrastructure">Infrastructure</option>
                            <option value="Sanitation">Sanitation</option>
                            <option value="Lighting">Lighting</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea value={desc} onChange={e => setDesc(e.target.value)} rows="4" placeholder="Describe the issue..." required></textarea>
                    </div>

                    <div className="form-group">
                        <label>Location</label>
                        <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Type manually..." required />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-primary">Submit Report</button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default ReportIssue;
