// Configuration
const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbwakZS-RGygrzke6x2ntC5BL_XuYLZbvMi1AkbmEPmgvZoVTxeSCvTaqAzEIoUsphlk/exec'; // Replace with your Apps Script deployment URL
const USE_MOCK_DATA = API_BASE_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL'; // Use mock data if API not configured

// Data storage
let appData = {
  profiles: [],
  ideas: [],
  stories: [],
  trainingRequests: [],
  currentUser: null
};

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  console.log('WorldPulse MVP initialized');
  console.log('Using mock data:', USE_MOCK_DATA);
  loadInitialData();
  loadUserProfile();
  switchPage('dashboard');
});

// Load initial data from backend or mock
async function loadInitialData() {
  try {
    if (USE_MOCK_DATA) {
      console.log('Loading mock data (backend not configured)');
      appData.profiles = getMockProfiles();
      appData.ideas = getMockIdeas();
      appData.stories = getMockStories();
      appData.trainingRequests = getMockTrainingRequests();
    } else {
      console.log('Loading data from backend...');
      // Load from backend
      const usersResponse = await callBackend('getUsers', {});
      appData.profiles = usersResponse.data || [];
      
      const ideasResponse = await callBackend('getIdeas', {});
      appData.ideas = ideasResponse.data || [];
      
      const storiesResponse = await callBackend('getStories', {});
      appData.stories = storiesResponse.data || [];
      
      const trainingResponse = await callBackend('getTrainingRequests', {});
      appData.trainingRequests = trainingResponse.data || [];
    }
    
    updateDashboardMetrics();
    updateTrendingContent();
  } catch (error) {
    console.error('Error loading initial data:', error);
    // Fallback to mock data on error
    appData.profiles = getMockProfiles();
    appData.ideas = getMockIdeas();
    appData.stories = getMockStories();
    appData.trainingRequests = getMockTrainingRequests();
    updateDashboardMetrics();
    updateTrendingContent();
  }
}

// Load user profile from localStorage or backend
async function loadUserProfile() {
  const savedProfile = localStorage.getItem('worldpulse_profile');
  if (savedProfile) {
    appData.currentUser = JSON.parse(savedProfile);
    populateProfileForm();
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
      renderProfiles();
    } else if (pageName === 'roadmap') {
      renderIdeas();
    } else if (pageName === 'awards') {
      renderStories();
    } else if (pageName === 'training') {
      renderTrainingRequests();
    }
  }
  
  // Scroll to top
  window.scrollTo(0, 0);
}

// ============ DASHBOARD ============

function updateDashboardMetrics() {
  document.getElementById('metric-members').textContent = appData.profiles.length;
  document.getElementById('metric-ideas').textContent = appData.ideas.length;
  document.getElementById('metric-stories').textContent = appData.stories.length;
  document.getElementById('metric-training').textContent = appData.trainingRequests.length;
}

function updateTrendingContent() {
  // Trending ideas (top 3 by votes)
  const topIdeas = appData.ideas
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 3);
  
  const ideasHTML = topIdeas.map(idea => `
    <div class="border-l-4 border-accent pl-3">
      <p class="font-semibold text-primary">${idea.title}</p>
      <p class="text-sm text-muted">${idea.votes} votes</p>
    </div>
  `).join('');
  
  document.getElementById('trending-ideas').innerHTML = ideasHTML || '<p class="text-muted text-sm">No ideas yet</p>';
}

// ============ COMMUNITY MATCHMAKING ============

function renderProfiles() {
  const profilesHTML = appData.profiles.map((profile, index) => `
    <div class="card-custom">
      <div class="flex justify-between items-start mb-3">
        <div>
          <h3 class="text-lg font-bold text-primary">${profile.name || 'Anonymous'}</h3>
          <div class="flex gap-2 mt-2">
            <span class="badge badge-accent">${profile.role || 'peer'}</span>
            <span class="badge badge-cta">${profile.focusArea || 'general'}</span>
          </div>
        </div>
      </div>
      <p class="text-muted text-sm mb-4">${profile.bio || 'No bio provided'}</p>
      ${profile.location ? `<p class="text-muted text-xs mb-3">📍 ${profile.location}</p>` : ''}
      ${profile.skills ? `<p class="text-muted text-xs mb-4">Skills: ${profile.skills}</p>` : ''}
      <button class="btn btn-primary-custom w-full" onclick="connectWithProfile('${profile.id || index}')">
        Connect
      </button>
    </div>
  `).join('');
  
  document.getElementById('profiles-list').innerHTML = profilesHTML || '<p class="text-center text-muted py-8">No profiles yet. Be the first!</p>';
}

function filterProfiles() {
  const role = document.getElementById('filter-role').value;
  const focus = document.getElementById('filter-focus').value;
  
  const filtered = appData.profiles.filter(profile => {
    const roleMatch = !role || profile.role === role;
    const focusMatch = !focus || profile.focusArea === focus;
    return roleMatch && focusMatch;
  });
  
  const profilesHTML = filtered.map((profile, index) => `
    <div class="card-custom">
      <h3 class="text-lg font-bold text-primary">${profile.name || 'Anonymous'}</h3>
      <div class="flex gap-2 mt-2">
        <span class="badge badge-accent">${profile.role || 'peer'}</span>
        <span class="badge badge-cta">${profile.focusArea || 'general'}</span>
      </div>
      <p class="text-muted text-sm my-4">${profile.bio || 'No bio provided'}</p>
      <button class="btn btn-primary-custom w-full" onclick="connectWithProfile('${profile.id || index}')">
        Connect
      </button>
    </div>
  `).join('');
  
  document.getElementById('profiles-list').innerHTML = profilesHTML || '<p class="text-center text-muted py-8">No profiles match your filters</p>';
}

async function connectWithProfile(profileId) {
  if (!USE_MOCK_DATA && appData.currentUser) {
    try {
      const result = await callBackend('createMatch', {
        mentorId: profileId,
        menteeId: appData.currentUser.id
      });
      
      if (result.success) {
        showNotification('Connection request sent! 🎉', 'success');
      }
    } catch (error) {
      console.error('Error creating match:', error);
      showNotification('Error sending connection. Please try again.', 'error');
    }
  } else {
    showNotification('Connection request recorded! 📬', 'success');
  }
}

// ============ ROADMAP VOTING ============

function renderIdeas() {
  const sorted = [...appData.ideas].sort((a, b) => (b.votes || 0) - (a.votes || 0));
  
  const ideasHTML = sorted.map((idea) => `
    <div class="card-custom">
      <h3 class="text-lg font-bold text-primary mb-2">${idea.title || 'Untitled Idea'}</h3>
      <p class="text-muted text-sm mb-4">${idea.description || 'No description'}</p>
      <div class="flex justify-between items-center">
        <span class="text-lg font-bold text-accent">${idea.votes || 0} votes</span>
        <button class="btn btn-sm btn-primary-custom" onclick="voteOnIdea('${idea.id || idea.title}')">
          👍 Upvote
        </button>
      </div>
    </div>
  `).join('');
  
  document.getElementById('ideas-list').innerHTML = ideasHTML || '<p class="text-center text-muted py-8">No ideas yet. Submit one!</p>';
}

async function voteOnIdea(ideaId) {
  if (!USE_MOCK_DATA) {
    try {
      const result = await callBackend('voteIdea', { ideaId });
      if (result.success) {
        // Update local idea count
        const idea = appData.ideas.find(i => i.id === ideaId);
        if (idea) {
          idea.votes = (idea.votes || 0) + 1;
        }
        renderIdeas();
        showNotification('Vote recorded! ✅', 'success');
      }
    } catch (error) {
      console.error('Error voting:', error);
      showNotification('Error recording vote', 'error');
    }
  } else {
    // Mock vote
    const idea = appData.ideas.find(i => i.id === ideaId);
    if (idea) {
      idea.votes = (idea.votes || 0) + 1;
    }
    renderIdeas();
    showNotification('Vote recorded! ✅', 'success');
  }
}

function submitIdea() {
  const title = document.getElementById('idea-title')?.value || '';
  const description = document.getElementById('idea-description')?.value || '';
  
  if (!title || !description) {
    showNotification('Please fill in all fields', 'error');
    return;
  }
  
  if (!USE_MOCK_DATA && appData.currentUser) {
    callBackend('submitIdea', {
      userId: appData.currentUser.id,
      title,
      description
    }).then(result => {
      if (result.success) {
        appData.ideas.push({
          id: result.ideaId,
          title,
          description,
          userId: appData.currentUser.id,
          votes: 0,
          createdAt: new Date().toISOString()
        });
        renderIdeas();
        showNotification('Idea submitted! 🚀', 'success');
        document.getElementById('submitIdeaForm')?.reset();
      }
    }).catch(error => {
      console.error('Error submitting idea:', error);
      showNotification('Error submitting idea', 'error');
    });
  } else {
    appData.ideas.push({
      id: Date.now().toString(),
      title,
      description,
      votes: 0
    });
    renderIdeas();
    showNotification('Idea submitted! 🚀', 'success');
  }
}

// ============ TRAINING & EVENTS ============

function renderTrainingRequests() {
  const requestsHTML = appData.trainingRequests.map((request) => `
    <div class="card-custom">
      <h3 class="text-lg font-bold text-primary mb-2">${request.topic || 'Untitled'}</h3>
      <p class="text-muted text-sm mb-3">${request.description || 'No description'}</p>
      <button class="btn btn-sm btn-cta-custom" onclick="endorseTraining('${request.id || request.topic}')">
        👍 I'm Interested
      </button>
    </div>
  `).join('');
  
  document.getElementById('training-requests').innerHTML = requestsHTML || '<p class="text-muted text-sm">No training requests yet</p>';
}

async function submitTrainingRequest(event) {
  event.preventDefault();
  
  const form = event.target;
  const topic = form.querySelector('input[type="text"]')?.value || '';
  const description = form.querySelector('textarea')?.value || '';
  
  if (!topic || !description) {
    showNotification('Please fill in all fields', 'error');
    return;
  }
  
  if (!USE_MOCK_DATA && appData.currentUser) {
    try {
      const result = await callBackend('submitTrainingRequest', {
        userId: appData.currentUser.id,
        topic,
        description
      });
      
      if (result.success) {
        appData.trainingRequests.push({
          id: result.requestId,
          userId: appData.currentUser.id,
          topic,
          description,
          status: 'pending'
        });
        renderTrainingRequests();
        form.reset();
        showNotification('Training request submitted! 📚', 'success');
      }
    } catch (error) {
      console.error('Error submitting training:', error);
      showNotification('Error submitting request', 'error');
    }
  } else {
    appData.trainingRequests.push({
      id: Date.now().toString(),
      topic,
      description
    });
    renderTrainingRequests();
    form.reset();
    showNotification('Training request submitted! 📚', 'success');
  }
}

async function endorseTraining(requestId) {
  if (!USE_MOCK_DATA) {
    // TODO: Implement backend call for endorsing training
    showNotification('Interest recorded!', 'success');
  } else {
    showNotification('Interest recorded!', 'success');
  }
}

// ============ STORY AWARDS ============

function renderStories() {
  const sorted = [...appData.stories].sort((a, b) => (b.votes || 0) - (a.votes || 0));
  
  const storiesHTML = sorted.map((story) => `
    <div class="card-custom">
      <h3 class="text-lg font-bold text-primary mb-2">${story.title || 'Untitled Story'}</h3>
      <p class="text-muted text-sm mb-2">by <strong>${story.userId || 'Anonymous'}</strong></p>
      <p class="text-gray-700 text-sm mb-4">${story.content || 'No content'}</p>
      <div class="flex justify-between items-center">
        <span class="text-lg font-bold text-cta">${story.votes || 0} votes</span>
        <button class="btn btn-sm btn-cta-custom" onclick="voteOnStory('${story.id || story.title}')">
          ⭐ Vote
        </button>
      </div>
    </div>
  `).join('');
  
  document.getElementById('stories-list').innerHTML = storiesHTML || '<p class="text-center text-muted py-8">No stories yet</p>';
}

async function voteOnStory(storyId) {
  if (!USE_MOCK_DATA) {
    try {
      const result = await callBackend('voteStory', { storyId });
      if (result.success) {
        const story = appData.stories.find(s => s.id === storyId);
        if (story) {
          story.votes = (story.votes || 0) + 1;
        }
        renderStories();
        showNotification('Vote recorded! ⭐', 'success');
      }
    } catch (error) {
      console.error('Error voting:', error);
      showNotification('Error recording vote', 'error');
    }
  } else {
    const story = appData.stories.find(s => s.id === storyId);
    if (story) {
      story.votes = (story.votes || 0) + 1;
    }
    renderStories();
    showNotification('Vote recorded! ⭐', 'success');
  }
}

// ============ PROFILE ============

function populateProfileForm() {
  if (appData.currentUser) {
    document.getElementById('profile-name').value = appData.currentUser.name || '';
    document.getElementById('profile-bio').value = appData.currentUser.bio || '';
    document.getElementById('profile-role').value = appData.currentUser.role || '';
    document.getElementById('profile-focus').value = appData.currentUser.focusArea || '';
  }
}

async function saveProfile(event) {
  event.preventDefault();
  
  const profile = {
    name: document.getElementById('profile-name').value,
    bio: document.getElementById('profile-bio').value,
    role: document.getElementById('profile-role').value,
    focusArea: document.getElementById('profile-focus').value,
  };
  
  if (!profile.name || !profile.role) {
    showNotification('Please fill in all required fields', 'error');
    return;
  }
  
  if (!USE_MOCK_DATA) {
    try {
      // Check if user exists
      if (appData.currentUser && appData.currentUser.id) {
        // Update existing user
        const result = await callBackend('updateUser', {
          userId: appData.currentUser.id,
          ...profile
        });
        
        if (result.success) {
          appData.currentUser = { id: appData.currentUser.id, ...profile };
          localStorage.setItem('worldpulse_profile', JSON.stringify(appData.currentUser));
          showNotification('Profile updated! ✅', 'success');
        }
      } else {
        // Create new user
        const result = await callBackend('createUser', profile);
        
        if (result.success) {
          appData.currentUser = { id: result.userId, ...profile };
          localStorage.setItem('worldpulse_profile', JSON.stringify(appData.currentUser));
          showNotification('Profile created! 🎉', 'success');
          
          // Add to profiles list
          appData.profiles.push(appData.currentUser);
          updateDashboardMetrics();
        }
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      showNotification('Error saving profile', 'error');
      return;
    }
  } else {
    // Mock save
    appData.currentUser = profile;
    localStorage.setItem('worldpulse_profile', JSON.stringify(profile));
    
    if (!appData.profiles.find(p => p.name === profile.name)) {
      appData.profiles.push(profile);
    }
    
    updateDashboardMetrics();
    showNotification('Profile saved! ✅', 'success');
  }
  
  switchPage('dashboard');
}

// ============ UTILITIES ============

function showNotification(message, type = 'info') {
  const alertClass = type === 'error' ? 'alert-error' : type === 'success' ? 'alert-success' : 'alert-info';
  const alertHTML = `
    <div class="alert ${alertClass} shadow-lg fixed bottom-4 right-4 z-50 max-w-sm">
      <span>${message}</span>
      <button class="btn btn-sm btn-ghost" onclick="this.parentElement.remove()">✕</button>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', alertHTML);
  
  // Auto-remove after 4 seconds
  setTimeout(() => {
    const alerts = document.querySelectorAll('.alert');
    if (alerts.length > 0) {
      alerts[0].remove();
    }
  }, 4000);
}

function showModal(modalId) {
  const modalHTML = `
    <div class="modal modal-open z-50">
      <div class="modal-box">
        <h3 class="font-bold text-lg text-primary">Submit Your Idea</h3>
        <div class="py-4">
          <input type="text" id="idea-title" class="input-custom w-full mb-3" placeholder="Idea title" />
          <textarea id="idea-description" class="input-custom w-full" placeholder="Describe your idea..." rows="4"></textarea>
        </div>
        <div class="modal-action">
          <button class="btn btn-primary-custom" onclick="submitIdea(); document.querySelector('.modal').remove()">Submit</button>
          <button class="btn" onclick="document.querySelector('.modal').remove()">Cancel</button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button onclick="document.querySelector('.modal').remove()">close</button>
      </form>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// ============ BACKEND API INTEGRATION ============

async function callBackend(action, data = {}) {
  if (API_BASE_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL') {
    console.warn(`Backend not configured. Skipping API call for action: ${action}`);
    return { success: false, error: 'Backend not configured' };
  }
  
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action,
        ...data
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`Backend error for action "${action}":`, error);
    throw error;
  }
}

// ============ MOCK DATA ============

function getMockProfiles() {
  return [
    {
      id: 'user-001',
      name: 'Sarah Chen',
      bio: 'Tech entrepreneur with 10+ years in AI/ML',
      role: 'mentor',
      focusArea: 'tech',
      location: 'San Francisco, CA',
      skills: 'JavaScript, Python, AWS, Machine Learning'
    },
    {
      id: 'user-002',
      name: 'Marcus Johnson',
      bio: 'Business strategist helping startups scale',
      role: 'mentor',
      focusArea: 'business',
      location: 'New York, NY',
      skills: 'Strategy, Fundraising, Marketing'
    },
    {
      id: 'user-003',
      name: 'Dr. Aisha Patel',
      bio: 'Healthcare innovator focused on accessibility',
      role: 'peer',
      focusArea: 'health',
      location: 'Boston, MA',
      skills: 'Healthcare, Product Design, Research'
    }
  ];
}

function getMockIdeas() {
  return [
    {
      id: 'idea-001',
      title: 'AI-powered mentorship matching',
      description: 'Use ML to match mentors and mentees based on skills, goals, and interests',
      category: 'feature',
      votes: 24,
      createdAt: new Date(Date.now() - 7*24*60*60*1000).toISOString()
    },
    {
      id: 'idea-002',
      title: 'Mobile app for WorldPulse',
      description: 'Native iOS and Android apps for better accessibility and engagement',
      category: 'feature',
      votes: 18,
      createdAt: new Date(Date.now() - 14*24*60*60*1000).toISOString()
    },
    {
      id: 'idea-003',
      title: 'Regional community hubs',
      description: 'Create local chapters for in-person connections and networking events',
      category: 'feature',
      votes: 15,
      createdAt: new Date(Date.now() - 21*24*60*60*1000).toISOString()
    }
  ];
}

function getMockStories() {
  return [
    {
      id: 'story-001',
      title: 'How mentorship changed my career path',
      userId: 'user-004',
      content: 'Thanks to a mentor from WorldPulse, I was able to transition into tech and land my dream job. The guidance and support were invaluable.',
      impact: 'Landed senior engineer role at Google',
      votes: 42,
      createdAt: new Date(Date.now() - 30*24*60*60*1000).toISOString()
    },
    {
      id: 'story-002',
      title: 'Building a startup with community support',
      userId: 'user-005',
      content: 'The feedback and connections from WorldPulse helped me validate my business idea and secure $2M in seed funding.',
      impact: 'Raised Series A funding, 50+ team members',
      votes: 35,
      createdAt: new Date(Date.now() - 45*24*60*60*1000).toISOString()
    }
  ];
}

function getMockTrainingRequests() {
  return [
    {
      id: 'training-001',
      topic: 'Digital Marketing for Nonprofits',
      description: 'Learn how to effectively market your nonprofit on a limited budget',
      status: 'pending',
      createdAt: new Date(Date.now() - 10*24*60*60*1000).toISOString()
    },
    {
      id: 'training-002',
      topic: 'Technical Writing for Product Teams',
      description: 'Master the art of clear communication in technical documentation',
      status: 'pending',
      createdAt: new Date(Date.now() - 5*24*60*60*1000).toISOString()
    }
  ];
}
