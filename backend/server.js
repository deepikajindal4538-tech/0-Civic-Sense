require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5501;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Serve static files for frontend and legacy
app.use('/frontend', express.static(path.join(__dirname, '../frontend')));
app.use('/legacy', express.static(path.join(__dirname, '../legacy')));

// =========================================================
//  In-Memory Data Store (works without MongoDB)
// =========================================================
let idCounter = 6;
function generateId() {
    idCounter++;
    return 'ISS-' + String(idCounter).padStart(3, '0');
}

const issues = [
    {
        _id: 'ISS-001', id: 'ISS-001',
        title: 'Broken Streetlight on MG Road',
        desc: 'The streetlight near the bus stop on MG Road has been non-functional for over a week, making the area unsafe at night.',
        category: 'Street Lighting',
        location: 'MG Road, Near Bus Stop',
        ward: 'Ward 12',
        authority: 'State Electricity Board',
        status: 'pending',
        approved: true,
        image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80',
        upvotes: 24,
        isAnonymous: false,
        reportedBy: 'Ravi Kumar',
        urgency: 'High',
        priorityScore: 15,
        comments: [],
        falseResolution: false,
        mlPriority: 'high',
        mlDuplicate: false,
        date: '2026-03-28',
        createdAt: '2026-03-28T10:00:00Z'
    },
    {
        _id: 'ISS-002', id: 'ISS-002',
        title: 'Overflowing Garbage Dump at Sector 14',
        desc: 'The community garbage collection point at Sector 14 has not been cleared for days and is overflowing onto the road.',
        category: 'Sanitation',
        location: 'Sector 14, Community Park Road',
        ward: 'Ward 9',
        authority: 'Municipality (Sanitation)',
        status: 'progress',
        approved: true,
        image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=600&q=80',
        upvotes: 18,
        isAnonymous: false,
        reportedBy: 'Citizen',
        urgency: 'Medium',
        priorityScore: 10,
        comments: [],
        falseResolution: false,
        mlPriority: 'med',
        mlDuplicate: false,
        date: '2026-04-01',
        createdAt: '2026-04-01T08:30:00Z'
    },
    {
        _id: 'ISS-003', id: 'ISS-003',
        title: 'Pothole on NH-48 Service Road',
        desc: 'A large pothole has developed on the service road of NH-48 near the toll plaza causing frequent accidents.',
        category: 'Infrastructure',
        location: 'NH-48 Service Road, Near Toll Plaza',
        ward: 'Ward 5',
        authority: 'Municipality (Civil)',
        status: 'pending',
        approved: true,
        image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80',
        upvotes: 31,
        isAnonymous: true,
        reportedBy: 'Anonymous Citizen',
        urgency: 'High',
        priorityScore: 12,
        comments: [],
        falseResolution: false,
        mlPriority: 'high',
        mlDuplicate: true,
        date: '2026-04-05',
        createdAt: '2026-04-05T14:15:00Z'
    },
    {
        _id: 'ISS-004', id: 'ISS-004',
        title: 'Illegal Parking Near School Zone',
        desc: 'Cars are regularly parked illegally near the school zone on Nehru Street causing traffic congestion during school hours.',
        category: 'Traffic & Parking',
        location: 'Nehru Street, Near DPS School',
        ward: 'Ward 3',
        authority: 'Traffic Police',
        status: 'resolved',
        approved: true,
        image: 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=600&q=80',
        upvotes: 12,
        isAnonymous: false,
        reportedBy: 'Citizen',
        urgency: 'Medium',
        priorityScore: 7,
        comments: [],
        falseResolution: false,
        mlPriority: 'med',
        mlDuplicate: false,
        date: '2026-03-20',
        createdAt: '2026-03-20T09:00:00Z'
    },
    {
        _id: 'ISS-005', id: 'ISS-005',
        title: 'Water Pipeline Leak in Rajpur Colony',
        desc: 'A major water pipeline is leaking continuously near the main junction, wasting thousands of litres of water daily.',
        category: 'Water & Flooding',
        location: 'Rajpur Colony, Main Junction',
        ward: 'Ward 7',
        authority: 'Municipality (Civil)',
        status: 'progress',
        approved: true,
        image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=600&q=80',
        upvotes: 42,
        isAnonymous: false,
        reportedBy: 'admin',
        urgency: 'High',
        priorityScore: 14,
        comments: [],
        falseResolution: false,
        mlPriority: 'high',
        mlDuplicate: false,
        date: '2026-04-08',
        createdAt: '2026-04-08T11:45:00Z'
    },
    {
        _id: 'ISS-006', id: 'ISS-006',
        title: 'Open Manhole on Ring Road',
        desc: 'An open manhole without any cover or barricade on Ring Road poses serious danger to commuters, especially during night.',
        category: 'Infrastructure',
        location: 'Ring Road, Near Flyover',
        ward: 'Ward 11',
        authority: 'Municipality (Civil)',
        status: 'resolved',
        approved: true,
        image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=600&q=80',
        upvotes: 56,
        isAnonymous: false,
        reportedBy: 'Citizen',
        urgency: 'High',
        priorityScore: 15,
        comments: [],
        falseResolution: false,
        mlPriority: 'high',
        mlDuplicate: false,
        date: '2026-03-15',
        createdAt: '2026-03-15T07:20:00Z'
    }
];

// =========================================================
//  Helper
// =========================================================
function mapAuthority(cat) {
    if (!cat) return 'Public Works Dept';
    const p = cat.toLowerCase();
    if (p.includes('sanitation') || p.includes('garbage') || p.includes('dumping')) return 'Municipality (Sanitation)';
    if (p.includes('infrastructure') || p.includes('pothole') || p.includes('water') || p.includes('flood')) return 'Municipality (Civil)';
    if (p.includes('lighting') || p.includes('electric')) return 'State Electricity Board';
    if (p.includes('traffic') || p.includes('parking') || p.includes('police')) return 'Traffic Police';
    return 'Public Works Department';
}

// =========================================================
//  API Routes
// =========================================================

// GET /api/issues — only returns approved issues for public feed
app.get('/api/issues', (req, res) => {
    const approved = issues.filter(i => i.approved === true);
    const sorted = approved.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.status(200).json(sorted);
});

// GET /api/issues/pending-approval — unapproved complaint requests (admin)
app.get('/api/issues/pending-approval', (req, res) => {
    const unapproved = issues.filter(i => i.approved === false);
    const sorted = unapproved.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.status(200).json(sorted);
});

// POST /api/issues
app.post('/api/issues', (req, res) => {
    const data = req.body;

    const rand = Math.random();
    const mlPriority = rand > 0.7 ? "high" : (rand > 0.3 ? "med" : "low");
    const dupChoices = [true, false, false, false];
    const mlDuplicate = dupChoices[Math.floor(Math.random() * dupChoices.length)];

    const urgency = data.urgency || 'Medium';
    let priorityScore = (urgency === 'High' ? 10 : (urgency === 'Medium' ? 5 : 2));
    if (mlPriority === 'high') priorityScore += 5;

    const newId = generateId();
    const now = new Date().toISOString();

    const newIssue = {
        _id: newId, id: newId,
        title: data.title || `New ${data.category || 'General'} Issue`,
        desc: data.desc || '',
        category: data.category || 'Other',
        location: data.location || 'Unknown Location',
        ward: data.ward || 'Unknown Area',
        authority: mapAuthority(data.category),
        status: 'pending',
        approved: false,
        image: data.image || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=600&q=80',
        upvotes: 0,
        isAnonymous: data.isAnonymous || false,
        reportedBy: data.isAnonymous ? 'Anonymous Citizen' : (data.reportedBy || 'Citizen'),
        urgency: urgency,
        priorityScore: priorityScore,
        comments: [],
        falseResolution: false,
        mlPriority: mlPriority,
        mlDuplicate: mlDuplicate,
        date: now.split('T')[0],
        createdAt: now
    };

    issues.unshift(newIssue);
    res.status(201).json(newIssue);
});

// PATCH /api/issues/:id/upvote
app.patch('/api/issues/:id/upvote', (req, res) => {
    const issue = issues.find(i => i.id === req.params.id || i._id === req.params.id);
    if (!issue) return res.status(404).json({ error: "Issue not found" });
    issue.upvotes += 1;
    res.status(200).json(issue);
});

// PATCH /api/issues/:id/status
app.patch('/api/issues/:id/status', (req, res) => {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: "Status is required" });
    const issue = issues.find(i => i.id === req.params.id || i._id === req.params.id);
    if (!issue) return res.status(404).json({ error: "Issue not found" });
    issue.status = status;
    res.status(200).json(issue);
});

// POST /api/issues/:id/comments
app.post('/api/issues/:id/comments', (req, res) => {
    const { user, text } = req.body;
    if (!text) return res.status(400).json({ error: "Comment text required" });
    const issue = issues.find(i => i.id === req.params.id || i._id === req.params.id);
    if (!issue) return res.status(404).json({ error: "Issue not found" });
    const comment = { user: user || 'Anonymous', text, date: new Date().toISOString() };
    issue.comments.push(comment);
    res.status(201).json(comment);
});

// PATCH /api/issues/:id/reopen
app.patch('/api/issues/:id/reopen', (req, res) => {
    const issue = issues.find(i => i.id === req.params.id || i._id === req.params.id);
    if (!issue) return res.status(404).json({ error: "Issue not found" });
    issue.status = 'progress';
    issue.falseResolution = true;
    res.status(200).json(issue);
});

// PATCH /api/issues/:id/approve
app.patch('/api/issues/:id/approve', (req, res) => {
    const issue = issues.find(i => i.id === req.params.id || i._id === req.params.id);
    if (!issue) return res.status(404).json({ error: "Issue not found" });
    issue.approved = true;
    res.status(200).json(issue);
});

// PATCH /api/issues/:id/reject
app.patch('/api/issues/:id/reject', (req, res) => {
    const idx = issues.findIndex(i => i.id === req.params.id || i._id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Issue not found" });
    const removed = issues.splice(idx, 1)[0];
    res.status(200).json({ message: "Complaint rejected and removed", issue: removed });
});

// In-memory users store
let registeredUsers = [
    { username: 'admin', password: 'admin123', fullname: 'Admin User', email: 'admin@civicconnect.in', role: 'admin' }
];

// POST /api/login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const found = registeredUsers.find(u => u.username === username && u.password === password);
    if (found) {
        return res.status(200).json({ success: true, user: { username: found.username, role: found.role, fullname: found.fullname, email: found.email } });
    }
    // Fallback: allow any username/password for citizen
    if (username && password) {
        return res.status(200).json({ success: true, user: { username: username, role: 'citizen' } });
    }
    return res.status(401).json({ error: "Invalid credentials" });
});

// POST /api/signup
app.post('/api/signup', (req, res) => {
    const { fullname, email, username, password, phone } = req.body;
    if (!fullname || !email || !username || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }
    if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
    }
    const exists = registeredUsers.find(u => u.username === username || u.email === email);
    if (exists) {
        return res.status(409).json({ error: "Username or email already registered" });
    }
    const newUser = { username, password, fullname, email, phone: phone || '', role: 'citizen' };
    registeredUsers.push(newUser);
    return res.status(201).json({ success: true, user: { username: newUser.username, role: newUser.role, fullname: newUser.fullname, email: newUser.email, phone: newUser.phone } });
});

// GET /api/users — returns all users with complaint stats + complaint list
app.get('/api/users', (req, res) => {
    const usersWithStats = registeredUsers.map(u => {
        const userIssues = issues.filter(i => i.reportedBy === u.username);
        const complaintsRegistered = userIssues.length;
        const complaintsResolved = userIssues.filter(i => i.status === 'resolved').length;
        const complaintsPending = userIssues.filter(i => i.status === 'pending').length;
        const complaintsInProgress = userIssues.filter(i => i.status === 'progress').length;
        // Map complaint summaries
        const complaints = userIssues.map(i => ({
            id: i.id,
            title: i.title,
            category: i.category,
            status: i.status,
            date: i.date,
            location: i.location
        }));
        // Return without password
        const { password, ...safeUser } = u;
        return {
            ...safeUser,
            complaintsRegistered,
            complaintsResolved,
            complaintsPending,
            complaintsInProgress,
            complaints
        };
    });
    res.status(200).json(usersWithStats);
});

// POST /api/auth/google (simulated Google login)
app.post('/api/auth/google', (req, res) => {
    const { email, fullname } = req.body;
    if (!email) return res.status(400).json({ error: "Email required" });
    // Check if already registered
    let user = registeredUsers.find(u => u.email === email);
    if (!user) {
        // Auto-register Google user
        const username = email.split('@')[0];
        user = { username, password: '', fullname: fullname || username, email, role: 'citizen' };
        registeredUsers.push(user);
    }
    return res.status(200).json({ success: true, user: { username: user.username, role: user.role, fullname: user.fullname, email: user.email } });
});

// PATCH /api/user/password
app.patch('/api/user/password', (req, res) => {
    const { username, currentPassword, newPassword } = req.body;
    if (!username || !currentPassword || !newPassword) return res.status(400).json({ error: "All fields required" });
    if (newPassword.length < 6) return res.status(400).json({ error: "New password must be at least 6 characters" });
    const user = registeredUsers.find(u => u.username === username);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.password && user.password !== currentPassword) return res.status(403).json({ error: "Current password is incorrect" });
    user.password = newPassword;
    return res.status(200).json({ success: true, message: "Password updated successfully" });
});

// PATCH /api/user/email
app.patch('/api/user/email', (req, res) => {
    const { username, newEmail } = req.body;
    if (!username || !newEmail) return res.status(400).json({ error: "All fields required" });
    const emailTaken = registeredUsers.find(u => u.email === newEmail && u.username !== username);
    if (emailTaken) return res.status(409).json({ error: "Email already in use by another account" });
    const user = registeredUsers.find(u => u.username === username);
    if (!user) return res.status(404).json({ error: "User not found" });
    user.email = newEmail;
    return res.status(200).json({ success: true, message: "Email updated successfully", email: newEmail });
});

// PATCH /api/user/phone
app.patch('/api/user/phone', (req, res) => {
    const { username, newPhone } = req.body;
    if (!username || !newPhone) return res.status(400).json({ error: "All fields required" });
    const user = registeredUsers.find(u => u.username === username);
    if (!user) return res.status(404).json({ error: "User not found" });
    user.phone = newPhone;
    return res.status(200).json({ success: true, message: "Phone number updated successfully", phone: newPhone });
});

// =========================================================
//  Start Server
// =========================================================
app.listen(PORT, () => {
    console.log(`✅ CivicConnect backend running on http://localhost:${PORT}`);
    console.log(`📂 Legacy UI: http://localhost:${PORT}/legacy/index.html`);
    console.log(`📡 API: http://localhost:${PORT}/api/issues`);
});
