# WorldPulse Backend Deployment Guide

Complete step-by-step guide to deploy your Google Apps Script backend and connect it to the frontend.

---

## Phase 1: Create Google Sheet for Data Storage

### Step 1: Create a New Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com)
2. Click the **"+"** button to create a new blank sheet
3. Name it: **"WorldPulse MVP Database"**
4. Leave it blank - the Apps Script will auto-create tables

### Step 2: Get Your Sheet ID

In the URL bar, you'll see:
```
https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit#gid=0
```

Copy the `YOUR_SHEET_ID` (the long string between `/d/` and `/edit`)

**Save this ID** - you'll need it in Step 5 below.

---

## Phase 2: Set Up Google Apps Script

### Step 3: Create Apps Script Project

1. Go to [script.google.com](https://script.google.com)
2. Click **"+ New project"**
3. Name it: **"WorldPulse Backend"**
4. Delete the default `function myFunction()` code

### Step 4: Add the Backend Code

1. Copy all code from [APPS_SCRIPT_CODE.gs](./APPS_SCRIPT_CODE.gs)
2. Paste it into the `Code.gs` file in your Apps Script editor
3. Find this line (around line 7):
   ```javascript
   const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID';
   ```
4. Replace `YOUR_GOOGLE_SHEET_ID` with the Sheet ID you copied in Step 2
5. **Click "Save"**

### Step 5: Create Execution Configuration

1. In Apps Script editor, find **"Project Settings"** (⚙️ icon)
2. Enable "Show 'appsscript.json' manifest file"
3. Click on the **"appsscript.json"** tab
4. Verify it contains this (add if missing):
   ```json
   {
     "timeZone": "America/New_York",
     "exceptionLogging": "STACKDRIVER",
     "runtimeVersion": "V8"
   }
   ```
5. Save the file

---

## Phase 3: Deploy as Web App

### Step 6: Deploy the Script

1. In the Apps Script editor, click **"Deploy"** (top right)
2. Select **"New Deployment"**
3. Click the **dropdown** next to "Select type"
4. Choose **"Web app"**
5. Fill in the form:
   - **Execute as**: Select your Google account
   - **Who has access**: "Anyone" (for MVP)
6. Click **"Deploy"**

### Step 7: Copy Deployment URL

After deployment, you'll see a popup with a URL like:
```
https://script.googleapis.com/macros/d/YOUR_DEPLOYMENT_ID/userweb
```

**Copy this entire URL** - this is your API endpoint!

---

## Phase 4: Update Frontend Configuration

### Step 8: Update main.js

Choose ONE of these two files:

**Option A: If you want to use the new API-integrated version:**

1. Replace your current `js/main.js` with `js/main-api-ready.js`:
   ```bash
   mv js/main-api-ready.js js/main.js
   ```

2. Open `js/main.js` and find line 1:
   ```javascript
   const API_BASE_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL';
   ```

3. Replace it with your deployment URL from Step 7:
   ```javascript
   const API_BASE_URL = 'https://script.googleapis.com/macros/d/YOUR_ID/userweb';
   ```

**Option B: Keep your current main.js (uses mock data)**

Your current `main.js` will continue to work with mock data. You can upgrade later by following Option A.

---

## Phase 5: Test the Connection

### Step 9: Test Backend Connection

1. Open your app at `http://localhost:8000`
2. Open browser **Developer Tools** (F12)
3. Go to **Console** tab
4. Paste this test command:
   ```javascript
   fetch('YOUR_DEPLOYMENT_URL', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ action: 'getDashboardStats' })
   }).then(r => r.json()).then(d => console.log(d))
   ```
5. Replace `YOUR_DEPLOYMENT_URL` with your actual URL
6. Press Enter

You should see a response like:
```json
{
  "success": true,
  "members": 0,
  "ideas": 0,
  "stories": 0,
  "training": 0
}
```

✅ **If you see this, your backend is working!**

---

## Phase 6: Test Core Features

### Step 10: Test Creating a User Profile

1. On the "Profile" page, fill in:
   - Name: "Test User"
   - Bio: "Testing the backend"
   - Role: "mentor"
   - Focus Area: "tech"

2. Click "Save Profile"

3. Check your Google Sheet:
   - Go to your Sheet from Step 1
   - You should see a new "Users" tab with your profile data
   - ✅ Your first user is created!

### Step 11: Test Dashboard Stats

1. Go back to Dashboard
2. Refresh the page (Ctrl+R)
3. Check the metrics - should show "1 Active Members"
4. ✅ Dashboard is pulling live data!

### Step 12: Test Creating an Idea

1. Go to "Roadmap Voting" page
2. Click "+ Submit New Idea"
3. Fill in:
   - Title: "Test Idea"
   - Description: "Testing the backend"
4. Click "Submit"
5. Refresh and verify it appears
6. ✅ Ideas are persisting in the backend!

---

## Troubleshooting

### Issue: "Backend not configured" Error

**Cause:** API_BASE_URL still set to placeholder
**Fix:**
1. Open `js/main.js`
2. Check line 1 has your actual deployment URL
3. No quotes around the URL should be missing
4. Refresh the page and retry

### Issue: CORS Error in Console

**Error:** `No 'Access-Control-Allow-Origin' header`

**Cause:** Apps Script deployment isn't set to "Anyone"
**Fix:**
1. Go to Apps Script editor
2. Click "Deploy" → Select your deployment
3. Click the pencil icon to edit
4. Change "Who has access" to "Anyone"
5. Click "Update"
6. Refresh your app and retry

### Issue: Sheet Not Being Created

**Cause:** Sheet ID is incorrect in Apps Script
**Fix:**
1. Double-check your Sheet ID from Step 2
2. Go back to Apps Script
3. Find line with `const SHEET_ID = ...`
4. Verify the ID matches exactly (copy-paste again)
5. Save and test again

### Issue: Deployment URL Not Working

**Error:** `fetch failed` or `404 not found`

**Cause:** Wrong deployment URL
**Fix:**
1. Go to Apps Script editor
2. Click "Deploy" → "Manage Deployments"
3. Copy the exact URL (starts with `https://script.googleapis.com...`)
4. Update `js/main.js` line 1
5. No trailing slashes or extra characters!

### Issue: Form Data Not Saving

**Cause:** Backend endpoint missing or database permission issue
**Fix:**
1. Check Developer Console (F12) for errors
2. Verify Apps Script SHEET_ID is correct
3. Make sure you have edit access to the Google Sheet
4. Try the test command from Step 9 again

---

## Data Flow Diagram

```
Frontend (index.html)
    ↓
JavaScript (main.js)
    ↓
fetch() → API_BASE_URL
    ↓
Google Apps Script
    ↓
Google Sheets Database
```

Example flow for creating a user:
```
1. User fills profile form
2. Clicks "Save Profile"
3. saveProfile() calls callBackend('createUser', {...})
4. fetch() sends POST to Apps Script deployment URL
5. Apps Script receives request in doPost()
6. Routes to createUser() function
7. Generates UUID for user
8. Appends row to "Users" sheet
9. Returns { success: true, userId: "..." }
10. Frontend receives response
11. User sees success notification
```

---

## API Endpoints Reference

All endpoints are accessed via POST to your deployment URL with a JSON body containing an `action` field.

### User Management
- `createUser` - Create new user profile
- `updateUser` - Update existing user
- `getUsers` - Get all users (with filters)
- `getUserById` - Get single user

### Matching System
- `createMatch` - Create mentor-mentee pairing
- `getMatches` - Get matches for a user
- `updateMatchStatus` - Update match progress

### Voting & Feedback
- `submitIdea` - Submit roadmap idea
- `getIdeas` - Get all ideas sorted by votes
- `voteIdea` - Add vote to an idea
- `submitStory` - Submit impact story
- `getStories` - Get all stories sorted by votes
- `voteStory` - Add vote to a story

### Other
- `getDashboardStats` - Get dashboard metrics
- `submitFeedback` - Submit match feedback
- `getFeedback` - Get feedback for user
- `submitTrainingRequest` - Request training
- `getTrainingRequests` - Get training requests

---

## Next Steps

### After Basic Deployment
1. ✅ Create test user profiles
2. ✅ Add ideas and stories
3. ✅ Test voting functionality
4. ✅ Try the matchmaking feature

### Adding More Features
- Implement "Accept/Reject" for match requests
- Add training endorsements
- Create feedback surveys
- Build analytics dashboard

### Before Production
- [ ] Add user authentication (Google Sign-in)
- [ ] Implement rate limiting in Apps Script
- [ ] Add input validation
- [ ] Set up error logging
- [ ] Create database backup strategy
- [ ] Test with multiple concurrent users

---

## File References

| File | Purpose |
|------|---------|
| [APPS_SCRIPT_CODE.gs](./APPS_SCRIPT_CODE.gs) | Backend API code to deploy to Apps Script |
| [SHEETS_STRUCTURE.md](./SHEETS_STRUCTURE.md) | Database schema documentation |
| [main-api-ready.js](../js/main-api-ready.js) | Frontend code with API integration |

---

## Quick Reference Checklist

- [ ] Created Google Sheet
- [ ] Copied Sheet ID
- [ ] Created Apps Script project
- [ ] Pasted backend code
- [ ] Updated Sheet ID in Apps Script
- [ ] Deployed as Web App
- [ ] Copied deployment URL
- [ ] Updated API_BASE_URL in main.js
- [ ] Tested backend with console command
- [ ] Created test user profile
- [ ] Verified data in Google Sheet
- [ ] Tested form submissions
- [ ] Refreshed dashboard metrics

---

## Support

If you encounter issues:

1. **Check the console** - Open Developer Tools (F12) and look for errors
2. **Check the Apps Script logs** - In Apps Script editor, click "Executions" to see what went wrong
3. **Verify Sheet ID and Deployment URL** - Copy-paste them again to avoid typos
4. **Test with the console command** - Use the test from Step 9 to isolate frontend vs backend issues

**Debug Tip:** Add console.log statements in your Apps Script to see what's happening:
```javascript
Logger.log('Creating user: ' + JSON.stringify(params));
```
Then check the "Executions" tab to see the logs.

---

**Ready to go live?**

Once you're confident in the deployment:
1. Push to GitHub (`git add . && git commit -m "Add backend" && git push`)
2. Your GitHub Pages site auto-deploys
3. Share the URL with your team!

```bash
# From your worldpulse directory
git add .
git commit -m "Phase 1 complete: Core backend setup"
git push origin main
```

---

**Last Updated:** February 4, 2026
