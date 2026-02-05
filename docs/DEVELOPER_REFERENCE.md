# 👨‍💻 Developer Reference Guide

**For:** Software engineers, backend developers, frontend developers  
**Time:** 30-45 minutes to read completely

---

## Quick Links
- [Project Architecture](#project-architecture)
- [File Structure](#file-structure)
- [Data Models](#data-models)
- [Key JavaScript Functions](#key-javascript-functions)
- [localStorage Keys](#localstorage-keys)
- [Form Submission Flow](#form-submission-flow)
- [API Integration Points](#api-integration-points)

---

## Project Architecture

### Technology Stack

**Frontend:**
- HTML5, CSS3, JavaScript (vanilla)
- Tailwind CSS (utility-first styling)
- DaisyUI (Tailwind component library)
- Single Page App (SPA) + Standalone pages hybrid

**Backend (Optional):**
- Google Apps Script (JavaScript runtime)
- Google Sheets (data storage)
- REST API (POST endpoint)

**Data Storage:**
- localStorage (MVP/Demo)
- Google Sheets (Production-ready)

### High-level Flow

```
┌─────────────────────┐
│   index.html (SPA)  │  ← Hash-based routing
└──────────┬──────────┘
           │
      switchPage()
      │
  ├─ #dashboard
  ├─ #matchmaking
  ├─ #documentation
  └─ #profile
           │
           ↓
    ┌──────────────┐
    │ main.js      │  ← Core SPA logic
    └──────┬───────┘
           │
    updateDashboardMetrics()
    renderProjects()
    renderIdeas()
    renderStories()
           │
           ↓
    ┌──────────────────────┐
    │ localStorage or API  │  ← Data source
    └─────────────────────┘
```

### Standalone Pages Architecture

```
standalone pages (matchmaking.html, community-hub.html, etc.)
    │
    ├─ <nav class="navbar-custom">  ← Shared navbar
    ├─ <main>                        ← Page content
    ├─ <div id="shared-footer">      ← Shared footer (injected)
    └─ <script src="js/load-footer.js">  ← Footer loader
```

---

## File Structure

### Root Files
```
worldpulse/
├── index.html                  (1000 lines) - Main SPA, all pages in one
├── matchmaking.html            (350 lines)  - Project submission page
├── community-hub.html          (410 lines)  - Voting hub (training/ideas/stories)
├── roadmap.html                (90 lines)   - Legacy feature page
├── training.html               (90 lines)   - Legacy training page
├── awards.html                 (90 lines)   - Legacy story page
├── documentation.html          (45 lines)   - Docs page
├── shared-footer.html          (30 lines)   - Shared footer markup
├── README.md                   (150 lines)  - Project overview
├── tailwind.config.js          (50 lines)   - Tailwind configuration
├── SEED_DATA_GUIDE.md          (150 lines)  - Sample data documentation
└── QUICK_REFERENCE.md          (100 lines)  - Quick reference guide
```

### CSS Directory
```
css/
└── custom.css                  (250 lines)  - Custom styles, responsive rules
                                              - Sticky footer styling
                                              - Custom color palette
                                              - Responsive padding rules
```

### JavaScript Directory
```
js/
├── main.js                     (652 lines)  - SPA core, data management
│                                            - switchPage()
│                                            - updateDashboardMetrics()
│                                            - renderProjects/Ideas/Stories/etc
│
├── main-api-ready.js           (650 lines)  - API-integrated version
│                                            - Replace localStorage with API calls
│                                            - Same function signatures
│
├── seed-data.js                (423 lines)  - Sample data generator
│                                            - seedAllData()
│                                            - 6 seed functions (projects/ideas/stories/etc)
│
├── load-footer.js              (15 lines)   - Footer injector
│                                            - Fetches shared-footer.html
│                                            - Injects into <div id="shared-footer">
│
└── peer-advisory.js            (300 lines)  - Peer advisory wizard
                                             - Multi-step form logic
                                             - Form validation
```

### Documentation Directory
```
docs/
├── 00_START_HERE.md            - **READ THIS FIRST** (consolidated guide)
├── DEVELOPER_REFERENCE.md      - **THIS FILE** (architecture & code reference)
├── TESTING_DEMO.md             - Testing procedures, demo script
├── APPS_SCRIPT_CODE.gs         - Backend code (copy to Google Apps Script)
├── SHEETS_STRUCTURE.md         - Database schema details
├── PROJECT_STRUCTURE.md        - Project overview (detailed)
└── [deprecated docs]           - Legacy documentation (to be removed)
```

---

## Data Models

### Projects (matchmaking.html)
```javascript
{
  id: 1707007200000,                    // timestamp
  name: "Maria Santos",                 // submitter name
  location: "São Paulo, Brazil",
  description: "Building a platform to connect rural farmers",
  accomplishment: "Helping smallholder farmers increase income",
  whyMatters: "Rural poverty drives migration to cities",
  attempts: "Started with WhatsApp groups, built website",
  whatWorked: "Direct farmer feedback was gold",
  idealOutcome: "Platform reaching 500 farmers",
  timeline: "2026-06-30",              // target date
  supportNeeded: [                      // array of support types
    "Strategic advice",
    "Resource connections",
    "Practical tips"
  ],
  teamComposition: "Small Team (2-3)",  // Solo, Small Team, Larger Team
  submittedAt: "2026-02-03T10:00:00Z"
}
```
**localStorage Key:** `worldpulse_projects`  
**Typical Count:** 5-50 projects

### Training Requests (community-hub.html)
```javascript
{
  id: 1707007100000,
  title: "Social Media Strategy for NGOs",
  description: "Need help developing effective social media strategy",
  submittedBy: "Emma Thompson",
  category: "Marketing",
  votes: 24,
  supportLevel: "Looking for high-level guidance",
  submittedAt: "2026-02-03T10:00:00Z"
}
```
**localStorage Key:** `worldpulse_training_requests`  
**Typical Count:** 5-30 requests

### Roadmap Ideas (community-hub.html)
```javascript
{
  id: 1707007000000,
  title: "Peer Advisory Matching Algorithm",
  description: "Auto-match projects with advisors based on expertise",
  submittedBy: "Alex Rivera",
  category: "Feature",  // Feature, UX, Performance, Technical
  votes: 42,
  status: "Under consideration",  // New, Under consideration, Planned, In progress
  impact: "High",  // Low, Medium, High, Critical
  submittedAt: "2026-02-03T10:00:00Z"
}
```
**localStorage Key:** `worldpulse_ideas`  
**Typical Count:** 5-30 ideas

### Impact Stories (community-hub.html)
```javascript
{
  id: 1707006900000,
  title: "From Advice to Revenue: How Peer Mentorship Saved Our Project",
  description: "Maria was struggling to monetize her education platform",
  author: "Maria Gonzalez",
  location: "Mexico City, Mexico",
  impact: "Revenue impact: $5,000/month",
  category: "Success Story",  // Success Story, Impact Story, Funding Story, Lessons Learned
  votes: 67,
  url: "https://worldpulse.example.com/stories/1",  // optional
  submittedAt: "2026-02-03T10:00:00Z"
}
```
**localStorage Key:** `worldpulse_stories`  
**Typical Count:** 5-30 stories

### Advice Requests (matchmaking.html directory)
```javascript
{
  id: 1707006800000,
  name: "Anita Kapoor",
  title: "Education Tech for Rural Areas",
  location: "Hyderabad, India",
  problem: "Our online education platform works in cities but connectivity is poor",
  tried: "We optimized for low bandwidth, created offline content packs",
  outcome: "Want to reach 100K rural students",
  visibility: "public",  // public or private
  support: [            // support types needed
    "strategic",
    "practical",
    "connections"
  ],
  submittedAt: "2026-02-03T10:00:00Z"
}
```
**localStorage Key:** `worldpulse_advices`  
**Typical Count:** 4-20 requests

### User Profiles
```javascript
{
  id: 1707006700000,
  name: "Dr. Amara Okafor",
  role: "Health Systems Expert",
  expertise: ["Healthcare", "Impact measurement", "Fundraising"],
  bio: "20 years experience building health systems in West Africa",
  availability: "10 hours/month"
}
```
**localStorage Key:** `worldpulse_profiles`  
**Typical Count:** 5-100 profiles

---

## Key JavaScript Functions

### SPA Navigation (main.js)

```javascript
// Main page switcher
function switchPage(pageName) {
  // Hides all pages except target
  // Updates URL hash
  // Triggers page-specific setup
  
  document.querySelectorAll('.page-content').forEach(page => {
    page.classList.add('hidden');
  });
  
  const page = document.getElementById(`page-${pageName}`);
  if (page) {
    page.classList.remove('hidden');
    // Trigger page-specific functions
    if (pageName === 'roadmap') renderIdeas();
    if (pageName === 'awards') renderStories();
  }
  
  window.scrollTo(0, 0);
  window.location.hash = pageName;
}
```

### Data Loading

```javascript
// Load all data from localStorage
async function loadInitialData() {
  appData.profiles = JSON.parse(
    localStorage.getItem('worldpulse_profiles') || '[]'
  );
  appData.ideas = JSON.parse(
    localStorage.getItem('worldpulse_ideas') || '[]'
  );
  // ... repeat for all data types
  
  updateDashboardMetrics();
  updateTrendingContent();
}

// Load from API instead (when backend ready)
async function loadInitialData() {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'getAllData' })
    });
    const data = await response.json();
    appData = data;
    updateDashboardMetrics();
  } catch (error) {
    console.error('Error loading data:', error);
  }
}
```

### Dashboard Metrics

```javascript
// Update metrics display
function updateDashboardMetrics() {
  document.getElementById('metric-members').textContent = 
    appData.profiles.length;
  document.getElementById('metric-ideas').textContent = 
    appData.ideas.length;
  document.getElementById('metric-stories').textContent = 
    appData.stories.length;
  document.getElementById('metric-training').textContent = 
    appData.trainingRequests.length;
}

// Update trending content (top 3 by votes)
function updateTrendingContent() {
  const topIdeas = appData.ideas
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 3);
  
  const html = topIdeas.map(idea => `
    <div class="border-l-4 border-accent pl-3">
      <p class="font-semibold">${idea.title}</p>
      <p class="text-sm text-muted">${idea.votes} votes</p>
    </div>
  `).join('');
  
  document.getElementById('trending-ideas').innerHTML = html;
}
```

### Standalone Page Data Loading (matchmaking.html)

```javascript
// Load projects from localStorage
function loadProjects() {
  const projects = JSON.parse(
    localStorage.getItem('worldpulse_projects') || '[]'
  );
  
  const el = document.getElementById('projects-list');
  
  el.innerHTML = projects.map(proj => `
    <div class="card p-4 bg-base-200 border-l-4 border-primary">
      <h3 class="font-bold">${proj.accomplishment}</h3>
      <p class="text-sm text-muted">by ${proj.name}</p>
      <div class="flex gap-1">
        ${proj.supportNeeded.map(s => 
          `<span class="badge badge-outline">${s}</span>`
        ).join('')}
      </div>
    </div>
  `).join('');
}

// Or call API when backend ready
async function loadProjects() {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    body: JSON.stringify({ action: 'getProjects' })
  });
  const projects = await response.json();
  // ... render projects
}
```

---

## localStorage Keys

| Key | Content | Typical Size | Sync With |
|-----|---------|-------------|-----------|
| `worldpulse_projects` | Array of 5-50 project objects | 50-200KB | Google Sheets Users table |
| `worldpulse_training_requests` | Array of training requests | 20-100KB | Google Sheets TrainingRequests table |
| `worldpulse_ideas` | Array of roadmap ideas | 20-100KB | Google Sheets Ideas table |
| `worldpulse_stories` | Array of impact stories | 20-100KB | Google Sheets Stories table |
| `worldpulse_advices` | Array of advice requests | 10-50KB | Google Sheets Advices table |
| `worldpulse_profiles` | Array of user profiles | 20-100KB | Google Sheets Users table |
| `worldpulse_advisor_feedback` | Array of feedback records | 10-50KB | Google Sheets Feedback table |

**Total capacity:** ~5-10MB per browser  
**Current usage:** ~200KB with sample data

---

## Form Submission Flow

### Example: Project Submission (6-step form)

```
1. USER INTERACTION
   Step 1: Fill "Who You Are" (name, location, project description)
   Step 2: Fill "Your Challenge" (goal, why it matters)
   Step 3: Fill "What You've Tried" (attempts, what worked)
   Step 4: Select "Support Needed" (checkboxes)
   Step 5: Fill "Ideal Outcome" (outcome, timeline)
   Step 6: Select "Team Composition" (radio buttons)
   
2. VALIDATION
   validateStep() checks:
   - Required fields filled
   - Radio/checkbox selections made
   - Dates in valid format

3. FORM SUBMISSION
   document.getElementById('project-form').addEventListener('submit', e => {
     e.preventDefault();
     
     // Create project object from form fields
     const project = {
       id: Date.now(),
       name: document.getElementById('name').value,
       location: document.getElementById('location').value,
       description: document.getElementById('project_description').value,
       supportNeeded: Array.from(
         document.querySelectorAll('.support-checkbox:checked')
       ).map(cb => cb.value),
       // ... collect all 12 fields
     };
     
     // Save to localStorage
     const projects = JSON.parse(
       localStorage.getItem('worldpulse_projects') || '[]'
     );
     projects.unshift(project);  // Add to beginning
     localStorage.setItem('worldpulse_projects', 
       JSON.stringify(projects));
     
     alert('✓ Project submitted!');
     form.reset();
     loadProjects();  // Refresh display
   });

4. WITH API (when backend ready)
   // Replace localStorage lines with:
   const response = await fetch(API_BASE_URL, {
     method: 'POST',
     body: JSON.stringify({
       action: 'submitProject',
       ...project
     })
   });
   const result = await response.json();
   if (result.success) {
     alert('✓ Project submitted!');
   }
```

---

## API Integration Points

### To Migrate from localStorage to API

**File:** `js/main.js`

**Before (localStorage):**
```javascript
appData.projects = JSON.parse(
  localStorage.getItem('worldpulse_projects') || '[]'
);
```

**After (API):**
```javascript
const response = await fetch(API_BASE_URL, {
  method: 'POST',
  body: JSON.stringify({ action: 'getProjects' })
});
appData.projects = await response.json();
```

### API Endpoint Mapping

| Feature | localStorage | API Action |
|---------|---|---|
| Load projects | `worldpulse_projects` | `getProjects` |
| Submit project | `.push()` then `.setItem()` | `submitProject` |
| Vote on idea | Update array, `.setItem()` | `voteIdea` |
| Get training requests | `worldpulse_training_requests` | `getTrainingRequests` |
| Submit training | `.push()` then `.setItem()` | `submitTrainingRequest` |
| Get ideas | `worldpulse_ideas` | `getIdeas` |
| Vote on story | Update array, `.setItem()` | `voteStory` |

### Pattern for Migration

1. **Create function wrapper:**
```javascript
async function getProjects() {
  if (USE_LOCALSTORAGE) {
    return JSON.parse(
      localStorage.getItem('worldpulse_projects') || '[]'
    );
  } else {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'getProjects' })
    });
    return await response.json();
  }
}
```

2. **Use wrapper everywhere:**
```javascript
const projects = await getProjects();
projects.push(newProject);
```

3. **Switch flag when ready:**
```javascript
const USE_LOCALSTORAGE = false;  // Switch to API
```

---

## Common Development Tasks

### Add New Data Type

1. **Create data model** in this doc
2. **Add form** in appropriate page (index.html or standalone)
3. **Add localStorage key:** `worldpulse_[newtype]`
4. **Add render function:**
   ```javascript
   function render[NewType]() {
     const items = JSON.parse(
       localStorage.getItem('worldpulse_[newtype]') || '[]'
     );
     // Render items to DOM
   }
   ```
5. **Add submit handler:**
   ```javascript
   document.getElementById('[newtype]-form').addEventListener('submit', e => {
     e.preventDefault();
     // Create item object
     // Push to localStorage
     // Call render function
   });
   ```
6. **Call render on page load:**
   ```javascript
   if (pageName === 'dashboard') render[NewType]();
   ```

### Add New Page

1. **Create HTML file** (e.g., `features.html`)
2. **Copy navbar & footer structure** from existing page
3. **Add main content** in `<main>` tag
4. **Add form** if needed
5. **Add script** to load/render data
6. **Add footer loader:** `<script src="js/load-footer.js"></script>`
7. **Update navbars** on all pages to link to new page

### Debug Data Issues

```javascript
// View all localStorage keys
Object.keys(localStorage)

// View specific data
JSON.parse(localStorage.getItem('worldpulse_projects'))

// Clear all data
localStorage.clear()

// Check API endpoint
fetch(API_BASE_URL, {
  method: 'POST',
  body: JSON.stringify({ action: 'getDashboardStats' })
}).then(r => r.json()).then(console.log)
```

---

## Performance Considerations

- **localStorage limit:** ~5-10MB per domain
- **Current data:** ~200KB with 29 sample records
- **Scale:** Can handle ~5000 records before optimization needed
- **API calls:** Keep <100ms for responsive UI
- **DOM rendering:** Keep <50 items per page for smooth scrolling

---

## Browser Compatibility

- **Chrome/Edge:** ✅ Full support
- **Firefox:** ✅ Full support
- **Safari:** ✅ Full support (iOS 12+)
- **IE 11:** ❌ Not supported (uses ES6 syntax)

---

## Security Notes

⚠️ **MVP Warnings:**
- localStorage is unencrypted (visible in dev tools)
- No user authentication
- No data validation on backend
- No rate limiting

🔒 **For Production:**
- Add OAuth2 authentication
- Validate all inputs on backend
- Use HTTPS only
- Implement rate limiting
- Add SQL injection protection (use parameterized queries)
- Encrypt sensitive data
