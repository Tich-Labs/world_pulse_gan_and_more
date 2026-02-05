/**
 * WorldPulse Backend - Google Apps Script
 * Handles all data persistence for the frontend
 * 
 * SETUP:
 * 1. Replace YOUR_GOOGLE_SHEET_ID below with your actual Sheet ID
 * 2. Paste this ENTIRE FILE into Google Apps Script (replace all existing code)
 * 3. Deploy as Web App (Execute as your account, Who has access: Anyone)
 * 4. Copy the deployment URL to your frontend's API_BASE_URL
 */

// ============================================
// CONFIGURATION - UPDATE THIS!
// ============================================
const SHEET_ID = '1m7dE0f7ifrdjyevdRyxZwRW7i2Wxn0eYMi00DpkrMKY';
const SHEET = SpreadsheetApp.openById(SHEET_ID);
// ============================================
// MAIN REQUEST HANDLER
// ============================================

// Handle CORS preflight requests
function doOptions(e) {
  // Note: ContentService.TextOutput does not support custom headers in Apps Script runtime.
  // Browsers will still send OPTIONS preflight; ensure you deploy the web app with
  // appropriate access (Anyone, even anonymous) so CORS is allowed. Return a simple 200.
  return ContentService.createTextOutput('').setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;
    
    // Route to appropriate handler
    switch(action) {
      // User Profile
      case 'saveProfile':
        return success(saveProfile(payload.data));
      case 'getProfile':
        return success(getProfile(payload.userId));
      case 'getUserCount':
        return success({ count: getActiveUserCount() });
      
      // Ideas / Roadmap
      case 'submitIdea':
        return success(submitIdea(payload.data));
      case 'getIdeas':
        return success(getIdeas());
      case 'voteIdea':
        return success(voteIdea(payload.ideaId));
      
      // Training Requests
      case 'submitTrainingRequest':
        return success(submitTrainingRequest(payload.data));
      case 'submitTrainingOffering':
        return success(submitTrainingOffering(payload.data));
      case 'getTrainingRequests':
        return success(getTrainingRequests());
      
      // Stories
      case 'submitStory':
        return success(submitStory(payload.data));
      case 'getStories':
        return success(getStories());
      case 'voteStory':
        return success(voteStory(payload.storyId));
      
      // Dashboard
      case 'getDashboardStats':
        return success(getDashboardStats());
      
      // Advice/Mentorship
      case 'submitAdviceRequest':
        return success(submitAdviceRequest(payload.data));
      case 'getAdviceRequests':
        return success(getAdviceRequests());
      // Peer Advisory / Projects
      case 'submitProject':
        return success(submitProject(payload.data));
      case 'getProjects':
        return success(getProjects(payload.data || {}));
      
      default:
        return error('Unknown action: ' + action);
    }
  } catch(err) {
    return error(err.message);
  }
}


// ============================================
// USER PROFILE FUNCTIONS
// ============================================

function saveProfile(data) {
  const sheet = getOrCreateSheet('Users');
  const headers = ['id', 'name', 'bio', 'role', 'focusArea', 'timestamp'];
  
  ensureHeaders(sheet, headers);
  
  const userId = Utilities.getUuid();
  const timestamp = new Date().toISOString();
  
  sheet.appendRow([
    userId,
    data.name || '',
    data.bio || '',
    data.role || '',
    data.focusArea || '',
    timestamp
  ]);
  
  return { success: true, userId, data };
}

function getProfile(userId) {
  const sheet = getOrCreateSheet('Users');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === userId) {
      return {
        id: data[i][0],
        name: data[i][1],
        bio: data[i][2],
        role: data[i][3],
        focusArea: data[i][4]
      };
    }
  }
  return null;
}

function getActiveUserCount() {
  const sheet = getOrCreateSheet('Users');
  return Math.max(0, sheet.getLastRow() - 1);
}

// ============================================
// IDEAS / ROADMAP FUNCTIONS
// ============================================

function submitIdea(data) {
  const sheet = getOrCreateSheet('Ideas');
  const headers = ['id', 'title', 'description', 'category', 'votes', 'userId', 'timestamp'];
  
  ensureHeaders(sheet, headers);
  
  const ideaId = Utilities.getUuid();
  const timestamp = new Date().toISOString();
  
  sheet.appendRow([
    ideaId,
    data.title || '',
    data.description || '',
    data.category || 'Feature',
    0,
    data.userId || '',
    timestamp
  ]);
  
  return { success: true, ideaId };
}

function getIdeas() {
  const sheet = getOrCreateSheet('Ideas');
  const data = sheet.getDataRange().getValues();
  const ideas = [];
  
  for (let i = 1; i < data.length; i++) {
    ideas.push({
      id: data[i][0],
      title: data[i][1],
      description: data[i][2],
      category: data[i][3],
      votes: data[i][4] || 0,
      userId: data[i][5],
      timestamp: data[i][6]
    });
  }
  
  return ideas.sort((a, b) => b.votes - a.votes);
}

function voteIdea(ideaId) {
  const sheet = getOrCreateSheet('Ideas');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === ideaId) {
      const newVotes = (data[i][4] || 0) + 1;
      sheet.getRange(i + 1, 5).setValue(newVotes);
      return { success: true, votes: newVotes };
    }
  }
  return { success: false, error: 'Idea not found' };
}

// ============================================
// TRAINING FUNCTIONS
// ============================================

function submitTrainingRequest(data) {
  const sheet = getOrCreateSheet('TrainingRequests');
  const headers = ['id', 'topic', 'description', 'userId', 'timestamp'];
  
  ensureHeaders(sheet, headers);
  
  const requestId = Utilities.getUuid();
  const timestamp = new Date().toISOString();
  
  sheet.appendRow([
    requestId,
    data.topic || '',
    data.description || '',
    data.userId || '',
    timestamp
  ]);
  
  return { success: true, requestId };
}

function submitTrainingOffering(data) {
  const sheet = getOrCreateSheet('TrainingOfferings');
  const headers = ['id', 'topic', 'description', 'availability', 'userId', 'timestamp'];
  
  ensureHeaders(sheet, headers);
  
  const offeringId = Utilities.getUuid();
  const timestamp = new Date().toISOString();
  
  sheet.appendRow([
    offeringId,
    data.topic || '',
    data.description || '',
    data.availability || 'flexible',
    data.userId || '',
    timestamp
  ]);
  
  return { success: true, offeringId };
}

function getTrainingRequests() {
  const sheet = getOrCreateSheet('TrainingRequests');
  const data = sheet.getDataRange().getValues();
  const requests = [];
  
  for (let i = 1; i < data.length; i++) {
    requests.push({
      id: data[i][0],
      topic: data[i][1],
      description: data[i][2],
      userId: data[i][3],
      timestamp: data[i][4]
    });
  }
  
  return requests;
}

// ============================================
// STORY FUNCTIONS
// ============================================

function submitStory(data) {
  const sheet = getOrCreateSheet('Stories');
  const headers = ['id', 'title', 'author', 'content', 'votes', 'userId', 'url', 'timestamp'];
  
  ensureHeaders(sheet, headers);
  
  const storyId = Utilities.getUuid();
  const timestamp = new Date().toISOString();
  
  sheet.appendRow([
    storyId,
    data.title || '',
    data.author || '',
    data.content || '',
    0,
    data.userId || '',
    data.url || '',
    timestamp
  ]);
  
  return { success: true, storyId };
}

function getStories() {
  const sheet = getOrCreateSheet('Stories');
  const data = sheet.getDataRange().getValues();
  const stories = [];
  
  for (let i = 1; i < data.length; i++) {
    stories.push({
      id: data[i][0],
      title: data[i][1],
      author: data[i][2],
      content: data[i][3],
      votes: data[i][4] || 0,
      userId: data[i][5],
      url: data[i][6],
      timestamp: data[i][7]
    });
  }
  
  return stories.sort((a, b) => b.votes - a.votes);
}

function voteStory(storyId) {
  const sheet = getOrCreateSheet('Stories');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === storyId) {
      const newVotes = (data[i][4] || 0) + 1;
      sheet.getRange(i + 1, 5).setValue(newVotes);
      return { success: true, votes: newVotes };
    }
  }
  return { success: false, error: 'Story not found' };
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function getOrCreateSheet(sheetName) {
  let sheet = SHEET.getSheetByName(sheetName);

  if (!sheet) {
    sheet = SHEET.insertSheet(sheetName);

    // Auto-create header rows for known backend sheets to ensure compatibility
    const headersMap = {
      'Projects': ['id','userId','name','location','project_description','personal_connection','accomplishment_goal','why_matters','attempts_so_far','what_worked','what_didnt_work','support_needed','breakthrough_outcome','outcome_statement','timeline','team_composition','status','advisor_count','createdAt'],
      'ProjectMatches': ['id','projectId','advisorId','status','notes','createdAt','completedAt'],
      'ProjectFeedbackRecipient': ['id','projectId','advisorId','expertise_alignment_rating','understanding_context_rating','support_style_suitability','helpfulness_rating','provided_clarity','specific_result','communication_rating','felt_heard_respected_rating','meeting_logistics_rating','moved_project_closer_rating','experienced_outcomes','continued_support_interest','overall_satisfaction','recommend_program','improvement_suggestions','createdAt'],
      'ProjectFeedbackAdvisor': ['id','projectId','advisorId','project_brief_quality_rating','expertise_relevance_rating','experience_satisfaction_rating','improvement_suggestions','createdAt']
    };

    if (headersMap[sheetName]) {
      const headers = headersMap[sheetName];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
  }

  return sheet;
}

// Alias helper used by peer-advisory backend code
function getSheet(sheetName) {
  return getOrCreateSheet(sheetName);
}

function ensureHeaders(sheet, headers) {
  const firstRow = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  
  if (!firstRow[0] || firstRow[0] === '') {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
}

function success(data) {
  // Return JSON response. Note: TextOutput doesn't support adding headers via .addHeader()
  // If you need custom CORS headers, reconfigure web app access or implement a proxy.
  return ContentService.createTextOutput(JSON.stringify({ success: true, data: data }))
    .setMimeType(ContentService.MimeType.JSON);
}

function error(message) {
  return ContentService.createTextOutput(JSON.stringify({ success: false, error: message }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================
// ADVICE REQUEST FUNCTIONS
// ============================================

function submitAdviceRequest(data) {
  const sheet = getOrCreateSheet('AdviceRequests');
  const headers = ['id', 'name', 'title', 'location', 'problem', 'tried', 'supportNeeded', 'outcome', 'visibility', 'userId', 'timestamp'];
  
  ensureHeaders(sheet, headers);
  
  const requestId = Utilities.getUuid();
  const timestamp = new Date().toISOString();
  
  const supportNeeded = Array.isArray(data.supportNeeded) ? data.supportNeeded.join(',') : '';
  
  sheet.appendRow([
    requestId,
    data.name || '',
    data.title || '',
    data.location || '',
    data.problem || '',
    data.tried || '',
    supportNeeded,
    data.outcome || '',
    data.visibility || 'public',
    data.userId || '',
    timestamp
  ]);
  
  return { success: true, requestId };
}

function getAdviceRequests() {
  const sheet = getOrCreateSheet('AdviceRequests');
  const data = sheet.getDataRange().getValues();
  const requests = [];
  
  for (let i = 1; i < data.length; i++) {
    requests.push({
      id: data[i][0],
      name: data[i][1],
      title: data[i][2],
      location: data[i][3],
      problem: data[i][4],
      tried: data[i][5],
      supportNeeded: (data[i][6] || '').split(',').filter(s => s),
      outcome: data[i][7],
      visibility: data[i][8],
      userId: data[i][9],
      timestamp: data[i][10]
    });
  }
  
  return requests;
}

// ============================================
// DASHBOARD STATS
// ============================================

function getDashboardStats() {
  return {
    members: getActiveUserCount(),
    ideas: getIdeas().length,
    stories: getStories().length,
    training: getTrainingRequests().length
  };
}

// ============================================
// DEPLOYMENT INSTRUCTIONS
// ============================================
/*
SETUP INSTRUCTIONS:

1. Create a new Google Apps Script project at https://script.google.com

2. Replace "Code.gs" with this entire script

3. Create a Google Sheet for storing data:
   - Go to https://sheets.google.com
   - Create a new sheet
   - Copy its ID from the URL (between /d/ and /edit)

4. In the Apps Script editor:
   - Find line: const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID';
   - Replace with your actual Sheet ID

5. Deploy as Web App:
   - Click "Deploy" > "New Deployment"
   - Select type: "Web app"
   - Execute as: "Me"
   - Who has access: "Anyone"
   - Click "Deploy"
   - Copy the Deployment URL

6. Copy the Deployment URL and update main.js:
   const API_BASE_URL = 'YOUR_DEPLOYMENT_URL';

7. Test with a simple request:
   - POST to: {API_BASE_URL}
   - Body: { "action": "getDashboardStats" }
   - Should return member/idea/story counts

DONE! Your backend is now connected.
*/
