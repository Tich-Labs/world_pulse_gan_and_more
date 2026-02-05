// Configuration
const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbwakZS-RGygrzke6x2ntC5BL_XuYLZbvMi1AkbmEPmgvZoVTxeSCvTaqAzEIoUsphlk/exec'; // This needs to be updated with your deployed Apps Script URL

// API Helper Function with better error handling and loading states
async function callAPI(action, data = {}) {
  try {
    console.log(`Calling API: ${action}`, data);
    
    // Show loading state
    showLoading(true);
    
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ action, data })
    });
    
    console.log(`API Response status: ${response.status}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log(`API Response data:`, result);
    
    // Hide loading state
    showLoading(false);
    
    // Return the result based on the API response structure
    return result.success ? result.data : null;
  } catch (error) {
    console.error('API Call Failed:', action, error);
    showLoading(false);
    // Return null to indicate failure
    return null;
  }
}

// Show/hide loading indicator
function showLoading(show) {
  const body = document.body;
  if (show) {
    body.classList.add('loading');
  } else {
    body.classList.remove('loading');
  }
}

// Test API connectivity
async function testAPI() {
  try {
    // Test with a simple request
    const result = await callAPI('getDashboardStats');
    return result !== null;
  } catch (error) {
    console.error('API Test Error:', error);
    return false;
  }
}

// Data storage (local for MVP, replace with backend calls)
let appData = {
  profiles: [],
  ideas: [],
  stories: [],
  trainingRequests: [],
  projects: [],
  advices: [],
  currentUser: null,
  advisors: [], // Track advisors specifically
  seekers: []    // Track advice seekers specifically
};

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  console.log('WorldPulse MVP initialized');
  initializeApp();
});

async function initializeApp() {
  // Initialize authentication state from localStorage
  initAuthState();
  
  // First check if API is available
  const apiAvailable = await testAPI();
  
  if (apiAvailable) {
    console.log('✅ API is available, loading from backend');
    await loadInitialDataFromAPI();
  } else {
    console.log('⚠️ API unavailable, loading from localStorage');
    loadInitialDataFromLocalStorage();
  }
  
  loadUserProfile();
  
  // Update trending content after data is loaded
  updateTrendingContent();
  
  // If a hash is present (e.g. #matchmaking), open that page, otherwise default to dashboard
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    switchPage(hash);
  } else {
    switchPage('dashboard');
  }
}

// Load initial data from API
async function loadInitialDataFromAPI() {
  try {
    // Show loading state
    showLoading(true);
    
    // Try to load from API with individual error handling
    const stats = await callAPI('getDashboardStats');
    if (stats) {
      console.log('Loaded dashboard stats:', stats);
      
      // Load each data type separately with fallback
      appData.ideas = await callAPI('getIdeas') || [];
      appData.stories = await callAPI('getStories') || [];
      appData.trainingRequests = await callAPI('getTrainingRequests') || [];
      appData.profiles = await callAPI('getProfile') ? [await callAPI('getProfile')] : [];
      appData.advices = await callAPI('getAdviceRequests') || [];
      
      // Load projects from localStorage as they might not be in the API yet
      appData.projects = JSON.parse(localStorage.getItem('worldpulse_projects') || '[]');
      
      console.log('✅ Data loaded from API');
    } else {
      console.log('⚠️ API stats unavailable, falling back to localStorage');
      loadInitialDataFromLocalStorage();
    }
    
    updateDashboardMetrics();
    updateTrendingContent();
    
    // Hide loading state
    showLoading(false);
  } catch (error) {
    console.error('Error loading data from API:', error);
    showLoading(false);
    console.log('Falling back to localStorage');
    loadInitialDataFromLocalStorage();
  }
}

// Load initial data from localStorage (fallback)
function loadInitialDataFromLocalStorage() {
  try {
    // Load from localStorage
    appData.profiles = JSON.parse(localStorage.getItem('worldpulse_profiles') || '[]');
    appData.ideas = JSON.parse(localStorage.getItem('worldpulse_ideas') || '[]');
    appData.stories = JSON.parse(localStorage.getItem('worldpulse_stories') || '[]');
    appData.trainingRequests = JSON.parse(localStorage.getItem('worldpulse_training_requests') || '[]');
    appData.projects = JSON.parse(localStorage.getItem('worldpulse_projects') || '[]');
    appData.advices = JSON.parse(localStorage.getItem('worldpulse_advices') || '[]');
    
    console.log('✅ Data loaded from localStorage');
    updateDashboardMetrics();
    updateTrendingContent();
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
  }
}

// Load user profile from localStorage
  }
}

// Function to register as a community member (advice seeker)
function registerAsSeeker() {
  // Check if user is authenticated
  if (!isAuthenticated || !currentUser) {
    showNotification('Please sign in first to create your profile.', 'error');
    return;
  }
  
  const name = document.getElementById('profile-name').value;
  const bio = document.getElementById('profile-bio').value;
  const focusArea = document.getElementById('profile-focus').value;
  
  if (!name) {
    showNotification('Please enter your name', 'error');
    return;
  }
  
  const profile = {
    id: currentUser.id || Date.now(), // Use the authenticated user ID or generate new
    provider: currentUser.provider, // Track the auth method
    name: name,
    bio: bio,
    role: 'seeker', // Specifically for advice seeking
    focus_area: focusArea,
    expertise: '',
    availability: 'flexible',
    registeredAs: 'seeker',
    timestamp: new Date().toISOString()
  };
  
  // Add to profiles and seekers arrays
  appData.profiles.push(profile);
  appData.seekers.push(profile);
  appData.currentUser = profile;
  
  // Save to localStorage
  localStorage.setItem('worldpulse_profile', JSON.stringify(profile));
  localStorage.setItem('worldpulse_profiles', JSON.stringify(appData.profiles));
  localStorage.setItem('worldpulse_seekers', JSON.stringify(appData.seekers));
  
  // Try to save to backend as well
  saveToBackendOrStorage('profiles', appData.profiles);
  
  // Save authentication state
  saveAuthState();
  
  showNotification('✅ Registered as advice seeker successfully!', 'success');
  switchPage('dashboard');
}

// Function to register as a peer advisor
function registerAsAdvisor() {
  // Check if user is authenticated
  if (!isAuthenticated || !currentUser) {
    showNotification('Please sign in first to create your profile.', 'error');
    return;
  }
  
  const name = document.getElementById('profile-name').value;
  const bio = document.getElementById('profile-bio').value;
  const focusArea = document.getElementById('profile-focus').value;
  const expertise = document.getElementById('profile-expertise').value;
  const availability = document.getElementById('profile-availability').value;
  
  if (!name) {
    showNotification('Please enter your name', 'error');
    return;
  }
  
  if (!expertise) {
    showNotification('Please enter your areas of expertise', 'error');
    return;
  }
  
  const profile = {
    id: currentUser.id || Date.now(), // Use the authenticated user ID or generate new
    provider: currentUser.provider, // Track the auth method
    name: name,
    bio: bio,
    role: 'advisor', // Specifically for advising
    focus_area: focusArea,
    expertise: expertise,
    availability: availability,
    registeredAs: 'advisor',
    timestamp: new Date().toISOString()
  };
  
  // Add to profiles and advisors arrays
  appData.profiles.push(profile);
  appData.advisors.push(profile);
  appData.currentUser = profile;
  
  // Save to localStorage
  localStorage.setItem('worldpulse_profile', JSON.stringify(profile));
  localStorage.setItem('worldpulse_profiles', JSON.stringify(appData.profiles));
  localStorage.setItem('worldpulse_advisors', JSON.stringify(appData.advisors));
  
  // Try to save to backend as well
  saveToBackendOrStorage('profiles', appData.profiles);
  
  // Save authentication state
  saveAuthState();
  
  showNotification('✅ Registered as peer advisor successfully!', 'success');
  switchPage('dashboard');
}

// Function to update profile form for different registration types
function setRegistrationType(type) {
  const expertiseField = document.getElementById('profile-expertise');
  const advisorFields = document.getElementById('advisor-fields');
  const submitBtn = document.getElementById('profile-submit-btn');
  const seekerCard = document.querySelector('.profile-type-card[data-type="seeker"]');
  const advisorCard = document.querySelector('.profile-type-card[data-type="advisor"]');
  const profileForm = document.getElementById('profile-form');
  
  // Update card selections
  if (seekerCard && advisorCard) {
    if (type === 'seeker') {
      seekerCard.classList.add('selected');
      advisorCard.classList.remove('selected');
    } else if (type === 'advisor') {
      advisorCard.classList.add('selected');
      seekerCard.classList.remove('selected');
    }
  }
  
  // Store the selected type in the form element
  if (profileForm) {
    profileForm.setAttribute('data-profile-type', type);
  }
  
  if (type === 'seeker') {
    if (expertiseField) expertiseField.required = false;
    if (advisorFields) advisorFields.style.display = 'none';
    if (submitBtn) {
      // Change the submit button's functionality based on context
      if (appData.currentUser && appData.currentUser.name) {
        // If updating existing profile
        submitBtn.onclick = function() { saveUpdatedProfile(); };
      } else {
        // If creating new profile
        submitBtn.onclick = function() { registerAsSeeker(); };
      }
      submitBtn.textContent = 'Complete Registration';
      submitBtn.disabled = false;
    }
  } else if (type === 'advisor') {
    if (expertiseField) expertiseField.required = true;
    if (advisorFields) advisorFields.style.display = 'block';
    if (submitBtn) {
      // Change the submit button's functionality based on context
      if (appData.currentUser && appData.currentUser.name) {
        // If updating existing profile
        submitBtn.onclick = function() { saveUpdatedProfile(); };
      } else {
        // If creating new profile
        submitBtn.onclick = function() { registerAsAdvisor(); };
      }
      submitBtn.textContent = 'Complete Registration';
      submitBtn.disabled = false;
    }
  }
}

// Function to load user profile and update UI
function loadUserProfile() {
  const savedProfile = localStorage.getItem('worldpulse_profile');
  if (savedProfile) {
    appData.currentUser = JSON.parse(savedProfile);
    populateProfileForm();
    
    // Update the profile page based on user type
    if (appData.currentUser.registeredAs === 'advisor') {
      setRegistrationType('advisor');
    } else if (appData.currentUser.registeredAs === 'seeker') {
      setRegistrationType('seeker');
    }
  }
}

// Function to populate profile form with existing data
function populateProfileForm() {
  if (!appData.currentUser) return;
  
  const nameInput = document.getElementById('profile-name');
  const bioInput = document.getElementById('profile-bio');
  const focusInput = document.getElementById('profile-focus');
  const expertiseInput = document.getElementById('profile-expertise');
  const availabilityInput = document.getElementById('profile-availability');
  
  if (nameInput) nameInput.value = appData.currentUser.name || '';
  if (bioInput) bioInput.value = appData.currentUser.bio || '';
  if (focusInput) focusInput.value = appData.currentUser.focus_area || '';
  if (expertiseInput) expertiseInput.value = appData.currentUser.expertise || '';
  if (availabilityInput) availabilityInput.value = appData.currentUser.availability || 'flexible';
  
  // Update UI based on user type
  if (appData.currentUser.registeredAs === 'advisor') {
    setRegistrationType('advisor');
  } else if (appData.currentUser.registeredAs === 'seeker') {
    setRegistrationType('seeker');
  }
}

// Switch between pages
function switchPage(pageName) {
  // Hide all pages
  document.querySelectorAll('.page-content').forEach(page => {
    page.classList.add('hidden');
  });
  
  // Show selected page
  const page = document.getElementById(`page-${pageName}`);
  if (page) {
    page.classList.remove('hidden');
    
    // Trigger page-specific setup
    if (pageName === 'matchmaking') {
      renderAdvices();
    } else if (pageName === 'roadmap') {
      renderIdeas();
    } else if (pageName === 'awards') {
      renderStories();
    } else if (pageName === 'training') {
      renderTrainingRequests();
    } else if (pageName === 'submit-project') {
      currentStep = 1;
      updateStepDisplay();
    } else if (pageName === 'my-projects') {
      loadUserProjects();
    } else if (pageName === 'profile') {
      // Initialize profile page
      initializeProfilePage();
    }
  }
  
  // Scroll to top
  window.scrollTo(0, 0);
  // Update URL hash so pages can be linked/shared
  try {
    if (pageName) window.location.hash = pageName;
  } catch (e) {
    // ignore
  }
}

// Authentication state
let isAuthenticated = false;
let currentUser = null;

// Initialize authentication state from localStorage
function initAuthState() {
  const savedAuth = localStorage.getItem('worldpulse_auth');
  if (savedAuth) {
    const authData = JSON.parse(savedAuth);
    isAuthenticated = authData.isAuthenticated || false;
    currentUser = authData.currentUser || null;
  }
}

// Save authentication state to localStorage
function saveAuthState() {
  const authData = {
    isAuthenticated: isAuthenticated,
    currentUser: currentUser
  };
  localStorage.setItem('worldpulse_auth', JSON.stringify(authData));
}

// Sign in with Google (simulated for demo)
function signInWithGoogle() {
  showNotification('Google sign-in would connect to your Google account', 'info');
  
  // In a real implementation, this would use Google OAuth
  // For now, we'll simulate successful login
  setTimeout(() => {
    // Set authentication state
    isAuthenticated = true;
    currentUser = {
      id: 'google_' + Date.now(),
      provider: 'google',
      authenticated: true
    };
    
    // Save authentication state
    saveAuthState();
    
    showNotification('Signed in with Google successfully!', 'success');
    
    // Hide the login options and show profile form
    document.querySelector('.card-custom.p-6.mb-8').style.display = 'none';
    
    // Enable the submit button
    document.getElementById('profile-submit-btn').disabled = false;
    
    // Update profile page to reflect new auth state
    initializeProfilePage();
  }, 1000);
}

// Sign in with Email (simulated for demo)
function signInWithEmail() {
  const email = prompt('Enter your email:');
  if (email) {
    showNotification('Email sign-in would authenticate with your email', 'info');
    
    // In a real implementation, this would use email/password authentication
    // For now, we'll simulate successful login
    setTimeout(() => {
      // Set authentication state
      isAuthenticated = true;
      currentUser = {
        id: 'email_' + Date.now(),
        provider: 'email',
        email: email,
        authenticated: true
      };
      
      // Save authentication state
      saveAuthState();
      
      showNotification('Email verified successfully!', 'success');
      
      // Hide the login options and show profile form
      document.querySelector('.card-custom.p-6.mb-8').style.display = 'none';
      
      // Enable the submit button
      document.getElementById('profile-submit-btn').disabled = false;
      
      // Update profile page to reflect new auth state
      initializeProfilePage();
    }, 1000);
  }
}

// ============ DASHBOARD ============

function updateDashboardMetrics() {
  const membersElement = document.getElementById('metric-members');
  const ideasElement = document.getElementById('metric-ideas');
  const storiesElement = document.getElementById('metric-stories');
  const trainingElement = document.getElementById('metric-training');
  
  if (membersElement) membersElement.textContent = appData.profiles.length;
  if (ideasElement) ideasElement.textContent = appData.ideas.length;
  if (storiesElement) storiesElement.textContent = appData.stories.length;
  if (trainingElement) trainingElement.textContent = appData.trainingRequests.length;
}

function updateTrendingContent() {
  console.log('updateTrendingContent called');
  console.log('appData.ideas length:', appData.ideas?.length || 0);
  console.log('appData.stories length:', appData.stories?.length || 0);
  
  // Trending ideas (top 3 by votes)
  const trendingIdeasElement = document.getElementById('trending-ideas');
  if (trendingIdeasElement) {
    console.log('Found trending-ideas element');
    if (!appData.ideas || appData.ideas.length === 0) {
      console.log('No ideas in appData, loading from localStorage');
      // Try to load from localStorage directly as fallback
      try {
        const ideasFromStorage = JSON.parse(localStorage.getItem('worldpulse_ideas') || '[]');
        console.log('ideas from localStorage:', ideasFromStorage.length);
        appData.ideas = ideasFromStorage;
      } catch (e) {
        console.error('Error loading ideas from localStorage:', e);
        appData.ideas = [];
      }
    }
    
    const topIdeas = [...appData.ideas]
      .sort((a, b) => (b.votes || 0) - (a.votes || 0))
      .slice(0, 2); // Reduced to 2 to fit better in the layout
    
    console.log('topIdeas:', topIdeas);
    
    const ideasHTML = topIdeas.map(idea => `
      <div class="idea-card mb-3">
        <div class="idea-card-header">
          <div>
            <h3 class="idea-card-title">${idea.title}</h3>
            <span class="idea-card-category">${idea.category || 'Feature'}</span>
          </div>
          <div class="idea-card-vote-count">
            <div class="idea-card-votes">${idea.votes || 0}</div>
            <div class="idea-card-vote-label">votes</div>
          </div>
        </div>
        <p class="idea-card-description">${idea.description ? idea.description.substring(0, 100) + (idea.description.length > 100 ? '...' : '') : 'No description'}</p>
      </div>
    `).join('');
    
    console.log('ideasHTML:', ideasHTML || 'empty');
    trendingIdeasElement.innerHTML = ideasHTML || '<p class="text-muted text-sm">No ideas yet</p>';
  }
  
  // Trending stories (top 3 by votes)
  const trendingStoriesElement = document.getElementById('trending-stories');
  if (trendingStoriesElement) {
    console.log('Found trending-stories element');
    if (!appData.stories || appData.stories.length === 0) {
      console.log('No stories in appData, loading from localStorage');
      // Try to load from localStorage directly as fallback
      try {
        const storiesFromStorage = JSON.parse(localStorage.getItem('worldpulse_stories') || '[]');
        console.log('stories from localStorage:', storiesFromStorage.length);
        appData.stories = storiesFromStorage;
      } catch (e) {
        console.error('Error loading stories from localStorage:', e);
        appData.stories = [];
      }
    }
    
    const topStories = [...appData.stories]
      .sort((a, b) => (b.votes || 0) - (a.votes || 0))
      .slice(0, 2); // Reduced to 2 to fit better in the layout
    
    console.log('topStories:', topStories);
    
    const storiesHTML = topStories.map(story => `
      <div class="idea-card idea-type-story mb-3">
        <div class="idea-card-header">
          <div>
            <h3 class="idea-card-title">${story.title}</h3>
            <span class="idea-card-category">Story</span>
          </div>
          <div class="idea-card-vote-count">
            <div class="idea-card-votes">${story.votes || 0}</div>
            <div class="idea-card-vote-label">votes</div>
          </div>
        </div>
        <p class="idea-card-description">by ${story.author || 'Anonymous'}</p>
      </div>
    `).join('');
    
    console.log('storiesHTML:', storiesHTML || 'empty');
    
    if (storiesHTML) {
      trendingStoriesElement.innerHTML = `
        <h3 class="font-bold text-primary mb-2">Trending Stories</h3>
        ${storiesHTML}
      `;
    } else {
      trendingStoriesElement.innerHTML = '<h3 class="font-bold text-primary mb-2">Trending Stories</h3><p class="text-muted text-sm">No stories yet</p>';
    }
  }
}

// ============ COMMUNITY MATCHMAKING ============

function renderProfiles() {
  const profilesListElement = document.getElementById('profiles-list');
  if (!profilesListElement) return;
  
  if (appData.profiles.length === 0) {
    profilesListElement.innerHTML = '<p class="text-center text-muted py-8">No profiles yet</p>';
    return;
  }
  
  const profilesHTML = appData.profiles.map((profile, index) => `
    <div class="card-custom animate-fadeInUp">
      <div class="flex justify-between items-start mb-3">
        <div>
          <h3 class="text-lg font-bold text-primary">${profile.name}</h3>
          <div class="flex gap-2 mt-2">
            <span class="badge-custom">${profile.role}</span>
            <span class="badge-custom accent">${profile.focus_area || profile.focusArea || ''}</span>
          </div>
        </div>
      </div>
      <p class="text-muted text-sm mb-4">${profile.bio}</p>
      <button class="btn btn-primary-custom w-full" onclick="connectWithProfile(${index})">
        Offer Support
      </button>
    </div>
  `).join('');
  
  profilesListElement.innerHTML = profilesHTML;
}

// Advice requests directory (advice seekers)
function renderAdvices() {
  const advicesListElement = document.getElementById('advices-list');
  if (!advicesListElement) return;
  
  const adv = appData.advices || [];
  if (!adv || adv.length === 0) {
    advicesListElement.innerHTML = '<p class="text-center text-muted py-8">No requests yet — published requests will appear here.</p>';
    return;
  }

  const html = adv.slice().reverse().map((a, i) => {
    // show most recent first
    const supports = (a.supportNeeded || a.support || []).map(s => `<span class="badge-custom">${s}</span>`).join(' ');
    return `
      <div class="card-custom animate-fadeInUp">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-lg font-bold text-primary">${a.title}</h3>
            <div class="text-sm text-muted">by ${a.name}${a.location ? ' • ' + a.location : ''}</div>
            <div class="mt-3 text-sm text-gray-700">${a.problem}</div>
            <div class="mt-3 flex flex-wrap gap-1">${supports}</div>
          </div>
          <div class="text-sm text-right">
            <div class="text-muted">${new Date(a.timestamp || a.submittedAt).toLocaleString()}</div>
            <div class="mt-2">
              <button class="btn btn-sm btn-primary-custom" onclick="claimAdvice(${i})">Offer Help</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  advicesListElement.innerHTML = html;
}

function submitAdvice(event) {
  event.preventDefault();
  const name = document.getElementById('advice-name').value.trim();
  const title = document.getElementById('advice-title').value.trim();
  const location = document.getElementById('advice-location').value.trim();
  const problem = document.getElementById('advice-problem').value.trim();
  const tried = document.getElementById('advice-tried').value.trim();
  const outcome = document.getElementById('advice-outcome').value.trim();
  const visibility = document.getElementById('advice-visibility').value;
  const supportNodes = Array.from(document.querySelectorAll('#advice-form input[name="support"]:checked'));
  const support = supportNodes.map(n => n.value);

  if (!name || !title || !problem) {
    showNotification('Please fill name, title and problem summary', 'error');
    return;
  }

  const entry = {
    id: Date.now(),
    name,
    title,
    location,
    problem,
    tried,
    outcome,
    supportNeeded: support,
    visibility,
    timestamp: new Date().toISOString()
  };

  appData.advices = appData.advices || [];
  appData.advices.push(entry);
  
  // Try to save to backend, fallback to localStorage
  saveToBackendOrStorage('advices', appData.advices);
  
  // Reset form and re-render
  document.getElementById('advice-form').reset();
  renderAdvices();
  updateDashboardMetrics();
  showNotification('Advice request published — advisors can now browse and offer help', 'success');
}

function claimAdvice(indexFromEnd) {
  // index passed corresponds to reversed list in UI; convert to actual index
  const adv = appData.advices || [];
  const realIndex = adv.length - 1 - indexFromEnd;
  const entry = adv[realIndex];
  if (!entry) return showNotification('Request not found', 'error');
  
  // For MVP, simply show notification and store a lightweight "interest" record
  entry.claims = entry.claims || 0;
  entry.claims += 1;
  
  // Try to save to backend, fallback to localStorage
  saveToBackendOrStorage('advices', appData.advices);
  
  showNotification(`Thanks — interest recorded for "${entry.title}"`, 'success');
}

function saveToBackendOrStorage(type, data) {
  // First try to save to backend
  const actionMap = {
    'advices': 'submitAdviceRequest',
    'ideas': 'submitIdea', 
    'stories': 'submitStory',
    'trainingRequests': 'submitTrainingRequest',
    'projects': 'addProject', // This might not exist in API yet
    'profiles': 'saveProfile'
  };
  
  const action = actionMap[type];
  if (action) {
    // Prepare data for the specific API call
    let apiData = data[data.length - 1]; // Get the latest item
    
    if (action === 'submitAdviceRequest') {
      apiData = {
        name: apiData.name,
        title: apiData.title,
        location: apiData.location,
        problem: apiData.problem,
        tried: apiData.tried,
        outcome: apiData.outcome,
        supportNeeded: apiData.supportNeeded,
        visibility: apiData.visibility,
        userId: appData.currentUser?.id || ''
      };
    } else if (action === 'saveProfile') {
      apiData = {
        name: apiData.name,
        bio: apiData.bio,
        role: apiData.role,
        focusArea: apiData.focus_area || apiData.focusArea
      };
    }
    
    callAPI(action, apiData)
      .then(result => {
        if (result) {
          console.log(`✅ Saved ${type} to backend`);
        } else {
          console.log(`⚠️ Backend save failed, using localStorage for ${type}`);
          localStorage.setItem(`worldpulse_${type}`, JSON.stringify(data));
        }
      })
      .catch(err => {
        console.error(`Error saving ${type} to backend:`, err);
        localStorage.setItem(`worldpulse_${type}`, JSON.stringify(data));
      });
  } else {
    // For types not supported by API, save to localStorage
    localStorage.setItem(`worldpulse_${type}`, JSON.stringify(data));
  }
}

function filterProfiles() {
  const role = document.getElementById('filter-role').value;
  const focus = document.getElementById('filter-focus').value;
  
  const filtered = appData.profiles.filter(profile => {
    const roleMatch = !role || profile.role === role;
    const focusMatch = !focus || (profile.focus_area || profile.focusArea) === focus;
    return roleMatch && focusMatch;
  });
  
  if (filtered.length === 0) {
    document.getElementById('profiles-list').innerHTML = '<p class="text-center text-muted py-8">No profiles match your filters</p>';
  } else {
    appData.profiles = filtered;
    renderProfiles();
  }
}

function connectWithProfile(index) {
  const profile = appData.profiles[index];
  showNotification(`Connection request sent to ${profile.name}!`, 'success');
}

// ============ ROADMAP VOTING ============

function renderIdeas() {
  const ideasListElement = document.getElementById('ideas-list');
  if (!ideasListElement) return;
  
  if (appData.ideas.length === 0) {
    ideasListElement.innerHTML = '<p class="text-center text-muted py-8">No ideas yet</p>';
    return;
  }
  
  const sorted = [...appData.ideas].sort((a, b) => (b.votes || 0) - (a.votes || 0));
  
  const ideasHTML = sorted.map((idea, index) => `
    <div class="idea-card animate-fadeInUp mb-4">
      <div class="idea-card-header">
        <div>
          <h3 class="idea-card-title">${idea.title}</h3>
          <span class="idea-card-category">${idea.category || 'Feature'}</span>
        </div>
        <div class="idea-card-vote-count">
          <div class="idea-card-votes">${idea.votes || 0}</div>
          <div class="idea-card-vote-label">votes</div>
        </div>
      </div>
      <p class="idea-card-description">${idea.description}</p>
      <div class="idea-card-footer">
        <button class="btn btn-sm btn-primary-custom" onclick="voteOnIdea(${index})">👍 Vote</button>
        <span class="idea-card-date">${new Date(idea.timestamp).toLocaleDateString()}</span>
      </div>
    </div>
  `).join('');
  
  ideasListElement.innerHTML = ideasHTML;
}

function voteOnIdea(index) {
  appData.ideas[index].votes = (appData.ideas[index].votes || 0) + 1;
  
  // Try to update on backend, fallback to localStorage
  callAPI('voteIdea', { ideaId: appData.ideas[index].id })
    .then(result => {
      if (result) {
        console.log('✅ Vote recorded on backend');
      } else {
        // If backend fails, save to localStorage
        localStorage.setItem('worldpulse_ideas', JSON.stringify(appData.ideas));
      }
    })
    .catch(() => {
      // If backend fails, save to localStorage
      localStorage.setItem('worldpulse_ideas', JSON.stringify(appData.ideas));
    });
  
  // Update community hub if it exists
  if (typeof filterItems === 'function') {
    renderAllItems();
  } else {
    renderIdeas();
  }
  // Update trending content on dashboard
  updateTrendingContent();
  showNotification('Vote recorded!', 'success');
}

async function submitIdea(event) {
  if (event) {
    event.preventDefault();
  }
  
  // Get form from event or use document for modal
  const form = event ? event.target : document;
  
  // Try different strategies to find the form elements
  const titleInput = form.querySelector('#idea-title') || form.querySelector('[id*="title"]') || document.getElementById('idea-title');
  const categoryInput = form.querySelector('#idea-category') || form.querySelector('[id*="category"]') || document.getElementById('idea-category');
  const descriptionInput = form.querySelector('#idea-desc') || form.querySelector('#idea-description') || form.querySelector('[id*="desc"]') || document.getElementById('idea-description');
  
  if (!titleInput || !descriptionInput) {
    showNotification('Form elements not found', 'error');
    return;
  }
  
  const title = titleInput.value;
  const category = categoryInput?.value || 'Feature';
  const description = descriptionInput.value;
  
  if (title && description) {
    const newIdea = {
      id: Date.now(),
      title,
      category,
      description,
      votes: 0,
      timestamp: new Date().toISOString()
    };
    
    appData.ideas.push(newIdea);
    
    // Try to save to backend, fallback to localStorage
    try {
      const result = await callAPI('submitIdea', {
        title,
        category,
        description,
        userId: appData.currentUser?.id || ''
      });
      
      if (result) {
        console.log('✅ Idea submitted to backend');
      } else {
        console.log('⚠️ Backend save failed, using localStorage');
        localStorage.setItem('worldpulse_ideas', JSON.stringify(appData.ideas));
      }
    } catch (error) {
      console.error('Error submitting idea:', error);
      localStorage.setItem('worldpulse_ideas', JSON.stringify(appData.ideas));
    }
    
    renderIdeas();
    // Update trending content on dashboard
    updateTrendingContent();
    // Reset form inputs
    titleInput.value = '';
    if (categoryInput) categoryInput.value = '';
    descriptionInput.value = '';
    showNotification('✅ Idea submitted!', 'success');
  } else {
    showNotification('Please fill in all required fields', 'error');
  }
}

// ============ TRAINING & EVENTS ============

function renderTrainingRequests() {
  const trainingListElement = document.getElementById('training-requests');
  if (!trainingListElement) return;
  
  if (appData.trainingRequests.length === 0) {
    trainingListElement.innerHTML = '<p class="text-muted text-sm">No training requests yet</p>';
    return;
  }
  
  const requestsHTML = appData.trainingRequests.map((request, index) => `
    <div class="card-custom animate-fadeInUp">
      <h3 class="text-lg font-bold text-primary mb-2">${request.topic}</h3>
      <p class="text-muted text-sm mb-3">${request.description}</p>
      <div class="flex justify-between items-center">
        <span class="badge-custom">${request.votes || request.endorsements || 0} seconds</span>
        <button class="btn btn-sm btn-cta-custom" onclick="endorseTraining(${index})">
          Second
        </button>
      </div>
    </div>
  `).join('');
  
  trainingListElement.innerHTML = requestsHTML;
}

function renderTrainingOfferings() {
  const offeringsListElement = document.getElementById('offerings-list');
  if (!offeringsListElement) return;
  
  // Load training offerings from localStorage if not already in appData
  if (!appData.trainingOfferings) {
    try {
      appData.trainingOfferings = JSON.parse(localStorage.getItem('worldpulse_training_offerings') || '[]');
    } catch (e) {
      appData.trainingOfferings = [];
      console.error('Error loading training offerings from localStorage:', e);
    }
  }
  
  if (!appData.trainingOfferings || appData.trainingOfferings.length === 0) {
    offeringsListElement.innerHTML = '<p class="text-muted text-sm">No training offerings yet</p>';
    return;
  }
  
  const offeringsHTML = appData.trainingOfferings.map(offering => `
    <div class="card-custom animate-fadeInUp">
      <h3 class="text-lg font-bold text-primary mb-2">${offering.topic}</h3>
      <p class="text-muted text-sm mb-2">${offering.availability} • ${offering.trainer || 'Anonymous'}</p>
      <p class="text-text-primary">${offering.description}</p>
    </div>
  `).join('');
  
  offeringsListElement.innerHTML = offeringsHTML;
}

async function submitTrainingRequest(event) {
  event.preventDefault();
  
  const form = event.target;
  
  // Try different strategies to find the form elements
  let topicInput = form.querySelector('#train-topic') || form.querySelector('#req-topic') || form.querySelector('input[type="text"]:not([type="hidden"])');
  let descriptionInput = form.querySelector('#train-desc') || form.querySelector('#req-desc') || form.querySelector('textarea');
  let audienceInput = form.querySelector('#train-audience');
  
  if (!topicInput || !descriptionInput) {
    showNotification('Form elements not found', 'error');
    return;
  }
  
  const topic = topicInput.value;
  const description = descriptionInput.value;
  const audience = audienceInput ? audienceInput.value : '';
  
  if (topic && description) {
    const newRequest = {
      id: Date.now(),
      topic,
      description,
      audience,
      endorsements: 0,
      timestamp: new Date().toISOString()
    };
    
    appData.trainingRequests.push(newRequest);
    
    // Try to save to backend, fallback to localStorage
    try {
      const result = await callAPI('submitTrainingRequest', {
        topic,
        description,
        audience,
        userId: appData.currentUser?.id || ''
      });
      
      if (result) {
        console.log('✅ Training request submitted to backend');
      } else {
        console.log('⚠️ Backend save failed, using localStorage');
        localStorage.setItem('worldpulse_training_requests', JSON.stringify(appData.trainingRequests));
      }
    } catch (error) {
      console.error('Error submitting training request:', error);
      localStorage.setItem('worldpulse_training_requests', JSON.stringify(appData.trainingRequests));
    }
    
    renderTrainingRequests();
    renderTrainingOfferings(); // Refresh offerings as well
    // Update trending content on dashboard
    updateTrendingContent();
    // Reset form inputs
    topicInput.value = '';
    descriptionInput.value = '';
    if (audienceInput) audienceInput.value = '';
    showNotification('✅ Training request submitted!', 'success');
  } else {
    showNotification('Please fill in all required fields', 'error');
  }
}

async function submitTrainingOffering(event) {
  event.preventDefault();
  
  const form = event.target;
  const topicInput = form.querySelector('input[type="text"]');
  const descriptionInput = form.querySelectorAll('textarea')[0];
  const availabilitySelect = form.querySelector('select');
  
  if (!topicInput || !descriptionInput || !availabilitySelect) {
    showNotification('Form elements not found', 'error');
    return;
  }
  
  const topic = topicInput.value;
  const description = descriptionInput.value;
  const availability = availabilitySelect.value;
  
  if (topic && description && availability) {
    const newOffering = {
      id: Date.now(),
      topic,
      description,
      availability,
      trainer: appData.currentUser?.name || 'Anonymous',
      timestamp: new Date().toISOString()
    };
    
    appData.trainingOfferings = appData.trainingOfferings || [];
    appData.trainingOfferings.push(newOffering);
    
    // Save to localStorage as backend implementation may not exist yet
    localStorage.setItem('worldpulse_training_offerings', JSON.stringify(appData.trainingOfferings));
    
    // Reset form inputs
    topicInput.value = '';
    descriptionInput.value = '';
    availabilitySelect.value = '';
    
    renderTrainingRequests(); // Refresh requests as well
    renderTrainingOfferings(); // Refresh offerings
    showNotification('✅ Training offering submitted!', 'success');
  } else {
    showNotification('Please fill in all required fields', 'error');
  }
}

function endorseTraining(index) {
  appData.trainingRequests[index].endorsements = (appData.trainingRequests[index].endorsements || 0) + 1;
  
  // For now, just save to localStorage since endorsement might not be in the API
  localStorage.setItem('worldpulse_training_requests', JSON.stringify(appData.trainingRequests));
  
  // Update community hub if it exists
  if (typeof filterItems === 'function') {
    renderAllItems();
  } else {
    renderTrainingRequests();
  }
  // Update trending content on dashboard
  updateTrendingContent();
  showNotification('You seconded this request!', 'success');
}

// ============ STORY AWARDS ============

function renderStories() {
  const storiesListElement = document.getElementById('stories-list');
  if (!storiesListElement) return;
  
  if (appData.stories.length === 0) {
    storiesListElement.innerHTML = '<p class="text-center text-muted py-8">No stories yet</p>';
    return;
  }
  
  const sorted = [...appData.stories].sort((a, b) => (b.votes || 0) - (a.votes || 0));
  
  const storiesHTML = sorted.map((story, index) => `
    <div class="card-custom animate-fadeInUp">
      <h3 class="text-lg font-bold text-primary mb-2">${story.title}</h3>
      <p class="text-muted text-sm mb-2">by <strong>${story.author}</strong></p>
      <p class="text-gray-700 text-sm mb-4">${story.content}</p>
      <div class="flex justify-between items-center">
        <span class="text-lg font-bold text-cta">${story.votes || 0} votes</span>
        <button class="btn btn-sm btn-cta-custom" onclick="voteOnStory(${index})">
          ⭐ Vote
        </button>
      </div>
    </div>
  `).join('');
  
  storiesListElement.innerHTML = storiesHTML;
}

function voteOnStory(index) {
  appData.stories[index].votes = (appData.stories[index].votes || 0) + 1;
  
  // Try to update on backend, fallback to localStorage
  callAPI('voteStory', { storyId: appData.stories[index].id })
    .then(result => {
      if (result) {
        console.log('✅ Vote recorded on backend');
      } else {
        // If backend fails, save to localStorage
        localStorage.setItem('worldpulse_stories', JSON.stringify(appData.stories));
      }
    })
    .catch(() => {
      // If backend fails, save to localStorage
      localStorage.setItem('worldpulse_stories', JSON.stringify(appData.stories));
    });
  
  // Update community hub if it exists
  if (typeof filterItems === 'function') {
    renderAllItems();
  } else {
    renderStories();
  }
  // Update trending content on dashboard
  updateTrendingContent();
  showNotification('Vote recorded!', 'success');
}

async function submitStory(event) {
  if (event) {
    event.preventDefault();
  }
  
  // Get form from event or use document for modal
  const form = event ? event.target : document;
  
  // Try different strategies to find the form elements
  const titleInput = form.querySelector('#story-title') || form.querySelector('[id*="title"]') || document.getElementById('story-title');
  const authorInput = form.querySelector('#story-author') || form.querySelector('[id*="author"]') || document.getElementById('story-author');
  const contentInput = form.querySelector('#story-content') || form.querySelector('[id*="content"]') || form.querySelector('textarea') || document.getElementById('story-content');
  
  if (!titleInput || !authorInput || !contentInput) {
    showNotification('Form elements not found', 'error');
    return;
  }
  
  const title = titleInput.value;
  const author = authorInput.value;
  const content = contentInput.value;
  
  if (title && author && content) {
    const newStory = {
      id: Date.now(),
      title,
      author,
      content,
      votes: 0,
      timestamp: new Date().toISOString()
    };
    
    appData.stories.push(newStory);
    
    // Try to save to backend, fallback to localStorage
    try {
      const result = await callAPI('submitStory', {
        title,
        author,
        content,
        userId: appData.currentUser?.id || ''
      });
      
      if (result) {
        console.log('✅ Story submitted to backend');
      } else {
        console.log('⚠️ Backend save failed, using localStorage');
        localStorage.setItem('worldpulse_stories', JSON.stringify(appData.stories));
      }
    } catch (error) {
      console.error('Error submitting story:', error);
      localStorage.setItem('worldpulse_stories', JSON.stringify(appData.stories));
    }
    
    renderStories();
    // Update trending content on dashboard
    updateTrendingContent();
    // Reset form inputs
    titleInput.value = '';
    authorInput.value = '';
    contentInput.value = '';
    showNotification('✅ Story shared!', 'success');
  } else {
    showNotification('Please fill in all required fields', 'error');
  }
}

// ============ PROFILE ============

// Initialize profile page based on authentication state
function initializeProfilePage() {
  const loginSection = document.getElementById('login-section');
  const formSection = document.getElementById('profile-form-section');
  const viewSection = document.getElementById('profile-view-section');
  
  if (isAuthenticated && appData.currentUser) {
    // User is authenticated, show profile view or form based on whether profile exists
    if (appData.currentUser.name) {
      // User has a profile, show profile view
      showProfileView();
    } else {
      // User needs to create profile, show form
      if (loginSection) loginSection.style.display = 'none';
      if (formSection) formSection.classList.remove('hidden');
      if (viewSection) viewSection.classList.add('hidden');
    }
  } else {
    // User is not authenticated, show login options
    if (loginSection) loginSection.classList.remove('hidden');
    if (formSection) formSection.classList.add('hidden');
    if (viewSection) viewSection.classList.add('hidden');
  }
}

// Show profile view for existing users
function showProfileView() {
  const loginSection = document.getElementById('login-section');
  const formSection = document.getElementById('profile-form-section');
  const viewSection = document.getElementById('profile-view-section');
  
  if (loginSection) loginSection.classList.add('hidden');
  if (formSection) formSection.classList.add('hidden');
  if (viewSection) viewSection.classList.remove('hidden');
  
  if (appData.currentUser) {
    // Populate profile view with user data
    document.getElementById('view-profile-name').textContent = appData.currentUser.name || 'User Name';
    document.getElementById('view-profile-type').textContent = appData.currentUser.registeredAs || 'Type';
    document.getElementById('view-profile-focus').textContent = appData.currentUser.focus_area || appData.currentUser.focusArea || 'Focus';
    document.getElementById('view-profile-bio').textContent = appData.currentUser.bio || 'User bio will appear here...';
    
    // Handle advisor-specific fields if applicable
    const viewAdvisorFields = document.getElementById('view-advisor-fields');
    if (viewAdvisorFields) {
      if (appData.currentUser.registeredAs === 'advisor') {
        viewAdvisorFields.classList.remove('hidden');
        document.getElementById('view-profile-expertise').textContent = appData.currentUser.expertise || 'Expertise areas will appear here...';
        document.getElementById('view-profile-availability').textContent = appData.currentUser.availability || 'Availability info will appear here...';
      } else {
        viewAdvisorFields.classList.add('hidden');
      }
    }
    
    // Load advice sessions
    loadAdviceSessions();
  }
}

// Load advice sessions for the current user
function loadAdviceSessions() {
  const sessionsList = document.getElementById('sessions-list');
  if (!sessionsList) return;
  
  // Get conversations from localStorage
  const conversations = JSON.parse(localStorage.getItem('worldpulse_conversations') || '[]');
  
  if (conversations.length === 0) {
    sessionsList.innerHTML = '<p class="text-center text-muted py-4">No advice sessions yet</p>';
    return;
  }
  
  let html = '<div class="space-y-3">';
  conversations.forEach(conversation => {
    const lastMessage = conversation.messages[conversation.messages.length - 1] || {text: 'No messages yet', timestamp: new Date().toISOString()};
    html += `
      <div class="p-3 border border-gray-200 rounded-lg">
        <div class="flex justify-between items-center">
          <h4 class="font-bold text-primary">${conversation.contactName}</h4>
          <span class="text-xs text-muted">${formatTime(lastMessage.timestamp)}</span>
        </div>
        <p class="text-sm text-muted truncate">${lastMessage.text}</p>
        <a href="messaging.html" class="text-xs text-primary hover:underline mt-1 inline-block">Continue conversation</a>
      </div>
    `;
  });
  html += '</div>';
  
  sessionsList.innerHTML = html;
}

// Format time for display
function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Switch to profile editing mode
function editProfile() {
  const loginSection = document.getElementById('login-section');
  const formSection = document.getElementById('profile-form-section');
  const viewSection = document.getElementById('profile-view-section');
  
  if (loginSection) loginSection.classList.add('hidden');
  if (viewSection) viewSection.classList.add('hidden');
  if (formSection) formSection.classList.remove('hidden');
  
  // Populate form with existing data
  populateProfileForm();
  
  // Set the correct registration type
  if (appData.currentUser && appData.currentUser.registeredAs) {
    setRegistrationType(appData.currentUser.registeredAs);
  }
}

// Populate profile form with existing data
function populateProfileForm() {
  if (!appData.currentUser) return;
  
  const nameInput = document.getElementById('profile-name');
  const bioInput = document.getElementById('profile-bio');
  const focusInput = document.getElementById('profile-focus');
  const expertiseInput = document.getElementById('profile-expertise');
  const availabilityInput = document.getElementById('profile-availability');
  
  if (nameInput) nameInput.value = appData.currentUser.name || '';
  if (bioInput) bioInput.value = appData.currentUser.bio || '';
  if (focusInput) focusInput.value = appData.currentUser.focus_area || appData.currentUser.focusArea || '';
  if (expertiseInput) expertiseInput.value = appData.currentUser.expertise || '';
  if (availabilityInput) availabilityInput.value = appData.currentUser.availability || 'flexible';
  
  // Set the registration type and show appropriate fields
  if (appData.currentUser.registeredAs) {
    setRegistrationType(appData.currentUser.registeredAs);
  }
}

// Save updated profile
function saveUpdatedProfile() {
  if (!isAuthenticated || !appData.currentUser) {
    showNotification('Please sign in first to update your profile.', 'error');
    return;
  }
  
  const name = document.getElementById('profile-name').value.trim();
  const profileType = document.getElementById('profile-form').getAttribute('data-profile-type') || appData.currentUser.registeredAs;
  
  if (!name) {
    showNotification('Please enter your name.', 'error');
    return;
  }
  
  if (!profileType) {
    showNotification('Please select your role (Advice Seeker or Peer Advisor).', 'error');
    return;
  }
  
  // Create updated profile object
  const profile = {
    id: appData.currentUser.id, // Keep the same ID
    provider: appData.currentUser.provider, // Keep the same provider
    name: name,
    bio: document.getElementById('profile-bio').value.trim(),
    focus_area: document.getElementById('profile-focus').value,
    registeredAs: profileType,
    timestamp: new Date().toISOString()
  };
  
  // Add advisor-specific fields if applicable
  if (profileType === 'advisor') {
    profile.expertise = document.getElementById('profile-expertise').value.trim();
    profile.availability = document.getElementById('profile-availability').value;
  }
  
  // Update the profile in the appropriate array
  if (profileType === 'advisor') {
    const advisorIndex = appData.advisors.findIndex(a => a.id === profile.id);
    if (advisorIndex !== -1) {
      appData.advisors[advisorIndex] = profile;
    } else {
      appData.advisors.push(profile);
    }
    localStorage.setItem('worldpulse_advisors', JSON.stringify(appData.advisors));
  } else {
    const seekerIndex = appData.seekers.findIndex(s => s.id === profile.id);
    if (seekerIndex !== -1) {
      appData.seekers[seekerIndex] = profile;
    } else {
      appData.seekers.push(profile);
    }
    localStorage.setItem('worldpulse_seekers', JSON.stringify(appData.seekers));
  }
  
  // Update the current user data
  appData.currentUser = profile;
  localStorage.setItem('worldpulse_profile', JSON.stringify(profile));
  
  // Save authentication state
  saveAuthState();
  
  showNotification('Profile updated successfully!', 'success');
  
  // Show the updated profile view
  setTimeout(() => {
    showProfileView();
  }, 1000);
}

// ============ UTILITIES ============

function showNotification(message, type = 'info') {
  // Remove any existing notifications
  document.querySelectorAll('.alert').forEach(alert => alert.remove());
  
  const alertClass = `alert alert-${type} animate-fadeInUp`;
  const iconMap = {
    'success': '✓',
    'error': '✗',
    'warning': '!',
    'info': 'ℹ'
  };
  
  const alertHTML = `
    <div class="${alertClass}">
      <span class="alert-icon">${iconMap[type] || 'ℹ'}</span>
      <span>${message}</span>
      <button class="btn btn-sm btn-ghost ml-auto" onclick="this.parentElement.remove()">✕</button>
    </div>
  `;
  
  // Add notification to the top of the body
  document.body.insertAdjacentHTML('afterbegin', alertHTML);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    const alert = document.querySelector('.alert');
    if (alert) {
      alert.style.opacity = '0';
      setTimeout(() => alert.remove(), 300);
    }
  }, 5000);
}

function showModal(modalId) {
  // Remove any existing modals
  document.querySelectorAll('.modal-overlay').forEach(modal => modal.remove());
  
  // Simple modal implementation
  let modalHTML = '';
  
  if (modalId === 'submitIdea') {
    modalHTML = `
      <div class="modal-overlay">
        <div class="modal-box animate-scaleIn">
          <div class="p-6">
            <h3 class="font-bold text-lg text-primary mb-4">Submit Your Idea</h3>
            <div class="py-4 space-y-4">
              <div class="form-group">
                <label class="block font-semibold text-primary mb-2">Idea Title *</label>
                <input type="text" id="idea-title-modal" class="input-custom w-full" placeholder="Enter idea title" />
              </div>
              <div class="form-group">
                <label class="block font-semibold text-primary mb-2">Description *</label>
                <textarea id="idea-description-modal" class="input-custom w-full" placeholder="Describe your idea..." rows="4"></textarea>
              </div>
            </div>
            <div class="flex justify-end gap-3 pt-4">
              <button class="btn btn-secondary-custom" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
              <button class="btn btn-primary-custom" onclick="submitModalIdea()">Submit</button>
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (modalId === 'submitStory') {
    modalHTML = `
      <div class="modal-overlay">
        <div class="modal-box animate-scaleIn">
          <div class="p-6">
            <h3 class="font-bold text-lg text-primary mb-4">Share Your Story</h3>
            <div class="py-4 space-y-4">
              <div class="form-group">
                <label class="block font-semibold text-primary mb-2">Story Title *</label>
                <input type="text" id="story-title-modal" class="input-custom w-full" placeholder="Enter story title" />
              </div>
              <div class="form-group">
                <label class="block font-semibold text-primary mb-2">Your Name *</label>
                <input type="text" id="story-author-modal" class="input-custom w-full" placeholder="Enter your name" />
              </div>
              <div class="form-group">
                <label class="block font-semibold text-primary mb-2">Story Content *</label>
                <textarea id="story-content-modal" class="input-custom w-full" placeholder="Tell your story..." rows="6"></textarea>
              </div>
            </div>
            <div class="flex justify-end gap-3 pt-4">
              <button class="btn btn-secondary-custom" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
              <button class="btn btn-primary-custom" onclick="submitModalStory()">Share</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  if (modalHTML) {
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }
}

// Submit functions for modals
function submitModalIdea() {
  const title = document.getElementById('idea-title-modal').value;
  const description = document.getElementById('idea-description-modal').value;
  
  if (title && description) {
    // Use the same submitIdea function but with modal inputs
    const newIdea = {
      id: Date.now(),
      title,
      description,
      votes: 0,
      timestamp: new Date().toISOString()
    };
    
    appData.ideas.push(newIdea);
    
    // Try to save to backend, fallback to localStorage
    saveToBackendOrStorage('ideas', appData.ideas);
    
    renderIdeas();
    document.querySelector('.modal-overlay').remove();
    showNotification('Idea submitted successfully!', 'success');
  } else {
    showNotification('Please fill in all required fields', 'error');
  }
}

function submitModalStory() {
  const title = document.getElementById('story-title-modal').value;
  const author = document.getElementById('story-author-modal').value;
  const content = document.getElementById('story-content-modal').value;
  
  if (title && author && content) {
    const newStory = {
      id: Date.now(),
      title,
      author,
      content,
      votes: 0,
      timestamp: new Date().toISOString()
    };
    
    appData.stories.push(newStory);
    
    // Try to save to backend, fallback to localStorage
    saveToBackendOrStorage('stories', appData.stories);
    
    renderStories();
    document.querySelector('.modal-overlay').remove();
    showNotification('Story shared successfully!', 'success');
  } else {
    showNotification('Please fill in all required fields', 'error');
  }
}

// ============ FORM VALIDATION HELPERS ============

// Add real-time validation to forms
function setupFormValidation() {
  // Add event listeners to all forms for real-time validation
  document.querySelectorAll('input[required], textarea[required]').forEach(input => {
    input.addEventListener('blur', function() {
      if (!this.value.trim()) {
        this.classList.add('error');
        // Add error message if not already present
        if (!this.nextElementSibling || !this.nextElementSibling.classList.contains('error-message')) {
          const errorMsg = document.createElement('div');
          errorMsg.className = 'error-message';
          errorMsg.textContent = 'This field is required';
          this.parentNode.insertBefore(errorMsg, this.nextSibling);
        }
      } else {
        this.classList.remove('error');
        // Remove error message if present
        const errorMsg = this.nextElementSibling;
        if (errorMsg && errorMsg.classList.contains('error-message')) {
          errorMsg.remove();
        }
      }
    });
  });
}

// Run validation setup when DOM is loaded
document.addEventListener('DOMContentLoaded', setupFormValidation);

// ============ MOCK DATA ============

function getMockProfiles() {
  return [
    {
      id: 1,
      name: 'Sarah Chen',
      bio: 'Tech entrepreneur with 10+ years of experience in AI and machine learning',
      role: 'mentor',
      focus_area: 'tech'
    },
    {
      id: 2,
      name: 'Marcus Johnson',
      bio: 'Business strategist helping startups scale from idea to market',
      role: 'mentor',
      focus_area: 'business'
    },
    {
      id: 3,
      name: 'Dr. Aisha Patel',
      bio: 'Healthcare innovator focused on accessible medical technology',
      role: 'peer',
      focus_area: 'health'
    }
  ];
}

function getMockIdeas() {
  return [
    {
      id: 1,
      title: 'AI-powered mentorship matching',
      description: 'Use machine learning to match mentors and mentees based on skills and goals',
      votes: 24
    },
    {
      id: 2,
      title: 'Mobile app for WorldPulse',
      description: 'Native iOS and Android applications for better accessibility',
      votes: 18
    },
    {
      id: 3,
      title: 'Localized community hubs',
      description: 'Create regional chapters for in-person connections and events',
      votes: 15
    }
  ];
}

function getMockStories() {
  return [
    {
      id: 1,
      title: 'How mentorship changed my career path',
      author: 'Priya Kumar',
      content: 'Thanks to a mentor I met through WorldPulse, I was able to transition into tech and land my dream job.',
      votes: 42
    },
    {
      id: 2,
      title: 'Building a startup with community support',
      author: 'James Wilson',
      content: 'The support and feedback from the WorldPulse community helped me validate my business idea and secure funding.',
      votes: 35
    }
  ];
}

function getMockTrainingRequests() {
  return [
    {
      id: 1,
      topic: 'Digital Marketing for Nonprofits',
      description: 'Learn how to effectively market your nonprofit on a budget',
      endorsements: 7
    },
    {
      id: 2,
      topic: 'Technical Writing for Product Teams',
      description: 'Master the art of clear communication in tech documentation',
      endorsements: 4
    }
  ];
}