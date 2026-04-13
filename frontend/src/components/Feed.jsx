import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Feed = () => {
    const [issues, setIssues] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5501/api/issues')
            .then(res => setIssues(res.data))
            .catch(err => console.error(err));
    }, []);

    const upvote = async (id) => {
        try {
            const res = await axios.patch(`http://localhost:5501/api/issues/${id}/upvote`);
            setIssues(issues.map(i => i._id === id ? res.data : i));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <section className="view-section active">
            <div className="feed-controls" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px'}}>
                <h2>Top Issues in your area</h2>
            </div>
            <div className="feed-grid">
                {issues.map(issue => (
                    <div key={issue._id} className="issue-card glass-panel">
                        <img src={issue.image} alt="Issue" className="issue-img" />
                        <div className="issue-content">
                            <span className="issue-tag warning">{issue.urgency} Priority</span>
                            <span className="issue-tag">{issue.category}</span>
                            <h3>{issue.title}</h3>
                            <p className="issue-meta">{issue.location} • {new Date(issue.createdAt).toLocaleDateString()}</p>
                            <p className="issue-desc">{issue.desc}</p>
                        </div>
                        <div className="issue-footer" style={{padding: '16px', borderTop: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between'}}>
                            <button onClick={() => upvote(issue._id)} className={`btn-action ${issue.isVoted ? 'active' : ''}`}>
                                <i className="fa-solid fa-arrow-up"></i> {issue.upvotes}
                            </button>
                            <span className={`status-badge ${issue.status}`}>{issue.status}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Feed;
