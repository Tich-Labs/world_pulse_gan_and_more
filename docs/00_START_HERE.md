# 📖 WorldPulse Documentation

**Last Updated:** February 4, 2026  
**Project Status:** Phase 1 Complete + Data Seeding Ready

---

## 🚀 Quick Navigation

Choose your path based on your role:

| Role | Time | Start Here |
|------|------|-----------|
| **👨‍💻 Developer** | 15 min | [Setup Guide](#setup-guide) |
| **📋 Product Manager** | 20 min | [Project Overview](#project-overview) |
| **👥 Joining Team** | 30 min | [Developer Reference](#developer-reference) |
| **🧪 QA/Tester** | 20 min | [Testing & Demo](#testing--demo) |

---

## Setup Guide

### 🎯 5-Minute Deployment

#### Step 1: Create Google Sheet
- Go to `sheets.google.com`
- Create new blank sheet
- Copy the Sheet ID from URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`

#### Step 2: Create Apps Script Backend
- Go to `script.google.com`
- Create new project
- Copy entire code from `docs/APPS_SCRIPT_CODE.gs`
- Paste into Apps Script editor
- Replace `YOUR_GOOGLE_SHEET_ID` with your Sheet ID (line 2)
- **File → Save**

#### Step 3: Deploy as Web App
- Click **Deploy** → **New Deployment**
- Type: **Web app**
- Execute as: Your Gmail account
- Who has access: **Anyone**
- Click **Deploy**
- Copy the deployment URL (looks like: `https://script.googleapis.com/macros/s/.../usercoderun`)

#### Step 4: Update Frontend Configuration
- Open `js/main.js`
- Line 1: `const API_BASE_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL'`
- Paste your deployment URL
- **Save**

#### Step 5: Test Connection
- Start server: `python3 -m http.server 8000`
- Open: `http://localhost:8000/index.html#profile`
- Fill out profile form and submit
- Check Google Sheet → should see new row in Users table

✅ **Success!** Your backend is connected.

---

### 📦 What Gets Created

#### Google Sheet Tables (6 tables auto-created)

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| **Users** | User profiles | id, name, email, bio, role, focusArea, timestamp |
| **Matches** | Mentor pairings | id, mentorId, menteeId, status, matchedDate |
| **Feedback** | Mentor ratings | id, userId, matchId, rating, comment, timestamp |
| **Ideas** | Roadmap voting | id, userId, title, description, votes, timestamp |
| **Stories** | Impact stories | id, userId, title, content, votes, timestamp |
| **TrainingRequests** | Training requests | id, userId, topic, description, votes, timestamp |

---

### 🔌 API Reference

**Base URL:** Your deployment URL  
**Method:** POST  
**Content-Type:** application/json

#### User Management
```javascript
// Create user profile
{
  "action": "createUser",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "mentor",  // or "mentee", "advisor"
  "focusArea": "Healthcare"
}

// Get all users (with optional filters)
{
  "action": "getUsers",
  "role": "mentor",  // optional
  "focusArea": "Healthcare"  // optional
}

// Get specific user
{
  "action": "getUserById",
  "userId": "user_123"
}
```

#### Matching System
```javascript
// Create mentor-mentee match
{
  "action": "createMatch",
  "mentorId": "user_123",
  "menteeId": "user_456"
}

// Get matches for user
{
  "action": "getMatches",
  "userId": "user_123"
}

// Update match status
{
  "action": "updateMatchStatus",
  "matchId": "match_789",
  "status": "active"  // or "completed", "paused"
}
```

#### Ideas & Voting
```javascript
// Submit idea
{
  "action": "submitIdea",
  "userId": "user_123",
  "title": "Mobile App",
  "description": "Build mobile version for iOS"
}

// Vote on idea
{
  "action": "voteIdea",
  "ideaId": "idea_456",
  "userId": "user_123"
}

// Get all ideas
{
  "action": "getIdeas"
}
```

#### Stories & Impact
```javascript
// Submit story
{
  "action": "submitStory",
  "userId": "user_123",
  "title": "Success Story",
  "content": "How mentorship changed my project",
  "impact": "Increased revenue by 40%"
}

// Vote/appreciate story
{
  "action": "voteStory",
  "storyId": "story_789",
  "userId": "user_123"
}

// Get all stories
{
  "action": "getStories"
}
```

#### Training Requests
```javascript
// Submit training request
{
  "action": "submitTrainingRequest",
  "userId": "user_123",
  "topic": "Social Media Marketing",
  "description": "Need help with Instagram strategy"
}

// Get all requests
{
  "action": "getTrainingRequests"
}
```

#### Feedback & Ratings
```javascript
// Submit feedback on mentor
{
  "action": "submitFeedback",
  "userId": "user_123",
  "matchId": "match_789",
  "rating": 5,
  "comment": "Very helpful advisor!"
}

// Get feedback
{
  "action": "getFeedback",
  "userId": "user_123"
}
```

#### Dashboard Stats
```javascript
// Get platform metrics
{
  "action": "getDashboardStats"
}
// Returns: totalUsers, totalMatches, totalIdeas, totalStories
```

---

## Project Overview

### 🎯 What Is WorldPulse?

WorldPulse is a **community impact platform** connecting mentors, mentees, and advisors to:
- **Find peer support** for projects
- **Vote on feature ideas** for the platform
- **Share impact stories** and learn from others
- **Request and offer training** in skill areas
- **Track feedback** from mentors

### 🏗️ Architecture

```
Frontend (HTML/CSS/JS)
        ↓
index.html (SPA) + Standalone Pages (matchmaking.html, etc.)
        ↓
Tailwind CSS + DaisyUI
        ↓
localStorage (MVP) or API Calls (Production)
        ↓
Google Apps Script Backend
        ↓
Google Sheets Database
```

### 📱 Pages

| Page | URL | Purpose |
|------|-----|---------|
| Dashboard | `/index.html#dashboard` | Overview, metrics, trending |
| Profile | `/index.html#profile` | User profile management |
| Matchmaking | `/matchmaking.html` | Project seeking support |
| Community Hub | `/community-hub.html` | Training, ideas, stories voting |
| Roadmap | `/roadmap.html` | Feature ideas (legacy) |
| Training | `/training.html` | Training requests (legacy) |
| Awards | `/awards.html` | Stories (legacy) |
| Docs | `/documentation.html` | Platform documentation |

### 🎨 Design System

- **Framework:** Tailwind CSS + DaisyUI
- **Colors:** Primary (Blue), Secondary (Purple), Accent (Orange)
- **Responsive:** Mobile-first, tablet-optimized, desktop-enhanced
- **Components:** Shared footer, sticky navbar, modular cards

---

## Developer Reference

### 📁 Project Structure

```
worldpulse/
├── index.html                    # Main SPA (hash-based routing)
├── matchmaking.html              # Project submission & listing
├── community-hub.html            # Voting hub (training/ideas/stories)
├── roadmap.html, training.html, awards.html  # Feature pages
├── shared-footer.html            # Shared footer markup
├── css/
│   └── custom.css                # Custom styles + responsive rules
├── js/
│   ├── main.js                   # SPA logic + data management
│   ├── main-api-ready.js         # API-integrated version
│   ├── seed-data.js              # Sample data generator
│   ├── load-footer.js            # Footer injection script
│   └── peer-advisory.js          # Peer advisory wizard
├── docs/
│   ├── QUICK_START.md
│   ├── SETUP_GUIDE.md
│   ├── DEVELOPER_REFERENCE.md
│   ├── TESTING_DEMO.md
│   ├── APPS_SCRIPT_CODE.gs       # Backend code
│   ├── SHEETS_STRUCTURE.md       # Database schema
│   └── ...
└── README.md
```

### 🔑 Key localStorage Keys

```javascript
worldpulse_projects              // Project records
worldpulse_training_requests     // Training requests
worldpulse_ideas                 // Roadmap ideas
worldpulse_stories               // Impact stories
worldpulse_advices               // Advice requests
worldpulse_profiles              // User profiles
worldpulse_advisor_feedback      // Feedback records
```

### 📝 Form Submissions Flow

**Example: Project Submission (matchmaking.html)**

```javascript
1. User fills 6-step form
   ↓
2. Form validates at each step
   ↓
3. On submit, creates project object:
   {
     id: timestamp,
     name: string,
     location: string,
     description: string,
     // ... 12 fields total
     submittedAt: ISO8601
   }
   ↓
4. Store to localStorage['worldpulse_projects']
   ↓
5. Display in projects list
   ↓
6. When backend connected: POST to API
```

### 🎨 Components

#### Navbar (Shared Across Pages)
- Sticky top positioning (z-50)
- Logo on left, 5 nav links on right
- Consistent styling: navbar-custom class
- Links: Dashboard, Connect, Community Hub, Docs, Profile

#### Footer (Shared Markup)
- Injected via `load-footer.js`
- Loads from `shared-footer.html`
- Full-bleed styling (100vw width)
- 3-column layout: brand, links, support

#### Card Component
- `card` class with padding
- Border-left accent colors (blue/purple/amber)
- Vote/appreciate buttons
- Responsive grid layout

### 🔄 Data Flow (with Backend)

```
User Action (submit form)
        ↓
Form Validation
        ↓
Create Data Object
        ↓
POST to API_BASE_URL
        ↓
Apps Script Backend
        ↓
Google Sheets Database
        ↓
Return Success/Error
        ↓
Update UI (list updates)
        ↓
Show Confirmation Message
```

### 🧪 Testing with Sample Data

```bash
1. Open dashboard: http://localhost:8000/index.html#dashboard
2. Click 🌱 "Load Sample Data" button (bottom right)
3. 25+ records populate across:
   - 5 projects (matchmaking.html)
   - 5 training requests (Community Hub)
   - 5 roadmap ideas (Community Hub)
   - 5 impact stories (Community Hub)
   - 4 advice requests (matchmaking directory)
   - 5 advisor profiles (dashboard metrics)
```

---

## Testing & Demo

### 🧪 Manual Testing Checklist

#### Dashboard
- [ ] Metrics display: 5 members, 5 ideas, 5 stories, 5 trainings
- [ ] Trending ideas sorted by votes (highest first)
- [ ] Trending stories sorted by votes (highest first)
- [ ] Quick access cards link to other pages

#### Matchmaking
- [ ] 6-step form validates before advancing
- [ ] All 6 steps display with correct questions
- [ ] Form submission clears and adds to list
- [ ] New projects appear at top of recent list
- [ ] Support type badges display correctly

#### Community Hub
- [ ] Training tab shows 5+ requests
- [ ] Ideas tab shows 5+ ideas with vote counts
- [ ] Stories tab shows 5+ stories with appreciation counts
- [ ] Sort toggle switches between "Top Voted" and "Most Recent"
- [ ] Voting updates count in real-time
- [ ] Tab switching works smoothly

#### Responsive Design
- [ ] Desktop (1920px): Full layout, no overflow
- [ ] Tablet (768px): Responsive grid, readable text
- [ ] Mobile (375px): Stacked layout, tappable buttons

#### Data Persistence
- [ ] Submit form → data appears in list
- [ ] Refresh page → data still there
- [ ] Vote on item → count increments
- [ ] Refresh page → vote count persists

#### Navigation
- [ ] All navbar links work
- [ ] Navbar visible on all pages
- [ ] Footer visible on all pages
- [ ] No broken links

### 🎬 5-Minute Demo Script

**Setup:**
1. Open dashboard: `http://localhost:8000/index.html#dashboard`
2. Click 🌱 "Load Sample Data" button

**Stage 1: Dashboard (1 min)**
- Show metrics: "5 active members, 5 ideas, 5 stories, 5 trainings"
- Show trending ideas (top 3 by votes)
- Show trending stories (top 3 by votes)

**Stage 2: Matchmaking (1 min)**
- Click "Connect" navbar link
- Show 5 projects with details
- Show 6-step project submission form
- Mention: "Users submit multi-step projects seeking support"

**Stage 3: Community Hub (1 min)**
- Click "Community Hub" navbar link
- Show Training tab (5 requests + submit form)
- Click to Ideas tab (5 ideas, sort by votes)
- Click to Stories tab (5 stories, sort by votes)

**Stage 4: Interactive Demo (1 min)**
- Vote on an idea (watch count increment)
- Appreciate a story (watch count increment)
- Refresh page (data persists)

**Stage 5: Responsive Design (1 min)**
- Resize browser to tablet size
- Show responsive grid
- Resize to mobile
- Show stacked mobile layout

### 📊 Sample Data Included

**Total: 29 Records**

- **5 Projects:** Maria (Brazil), Amara (Nigeria), Rahul (India), Sophie (France), David (Singapore)
- **5 Training Requests:** Marketing, Finance, Operations, Impact, Tech (15-31 votes each)
- **5 Roadmap Ideas:** Mobile-First (51 votes), Multilingual (38), Matching (42), Offline (35), Video (19)
- **5 Impact Stories:** Scaling (89 votes), Revenue (67), Funding (72), Crisis (48), Growth (54)
- **4 Advice Requests:** Education, Scaling, Commerce, Water projects
- **5 Advisor Profiles:** Health, Tech, Strategy, Fundraising, Operations experts

---

## 🔧 Troubleshooting

### Server Issues

**"Connection refused on localhost:8000"**
```bash
cd /home/tich/Documents/coding/worldpulse
python3 -m http.server 8000
```

**"Module not found" errors**
- Check all script tags have correct paths
- Verify `js/` folder exists with all files
- Check console (F12) for specific error messages

### Backend Issues

**"API_BASE_URL is undefined"**
- Check `js/main.js` line 1
- Verify deployment URL is correctly set
- Refresh page and clear cache

**"Data not saving to Google Sheet"**
1. Verify Apps Script is deployed
2. Check Sheet ID in Apps Script code
3. Test with console: `fetch(API_BASE_URL, {method: 'POST', ...})`
4. Check Google Sheet for new rows

### Data Issues

**"No data showing on pages"**
1. Click 🌱 "Load Sample Data" button
2. Check localStorage: `localStorage.getItem('worldpulse_projects')`
3. If empty, click button again

**"Votes not saving"**
1. Check browser allows localStorage
2. Test: `localStorage.setItem('test', 'value')`
3. Check console for errors

---

## 🚀 Next Steps

### Short-term (1-2 days)
- [ ] Connect to Google Apps Script backend
- [ ] Test API endpoints with real data
- [ ] Deploy to production server

### Medium-term (1 week)
- [ ] Add user authentication (Google Sign-In)
- [ ] Implement admin dashboard
- [ ] Add email notifications

### Long-term (2-4 weeks)
- [ ] Mobile app (React Native)
- [ ] Advanced search and filtering
- [ ] Analytics dashboard
- [ ] Custom theme support

---

## 📞 Support

**Questions?** Check:
1. This documentation (you're reading it!)
2. `docs/SHEETS_STRUCTURE.md` - Database schema
3. `js/main.js` - Frontend logic
4. `docs/APPS_SCRIPT_CODE.gs` - Backend code

**Still stuck?** Create an issue with:
- What you tried
- Error message (from console F12)
- Screenshot or reproduction steps
