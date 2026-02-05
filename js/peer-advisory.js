// ============================================
// PEER ADVISORY - PROJECT SUBMISSION
// ============================================

let projectFormData = {
  step1: {}, step2: {}, step3: {}, step4: {}, step5: {}, step6: {}
};
let currentStep = 1;
let userProjects = [];

function handleProjectStep(event) {
  if (currentStep < 6) {
    event.preventDefault();
    nextStep();
  } else {
    event.preventDefault();
    submitProject();
  }
}

function nextStep() {
  if (!validateCurrentStep()) return;
  
  saveCurrentStep();
  currentStep++;
  updateStepDisplay();
}

function previousStep() {
  saveCurrentStep();
  currentStep--;
  updateStepDisplay();
}

function validateCurrentStep() {
  const form = document.getElementById('project-form');
  const formData = new FormData(form);
  
  switch(currentStep) {
    case 1:
      if (!formData.get('name') || formData.get('name').length < 2) {
        showNotification('Please enter your name', 'error');
        return false;
      }
      if (!formData.get('project_description') || formData.get('project_description').length < 50) {
        showNotification('Project description must be at least 50 characters', 'error');
        return false;
      }
      break;
    case 2:
      if (!formData.get('accomplishment_goal') || formData.get('accomplishment_goal').length < 50) {
        showNotification('Accomplishment goal must be at least 50 characters', 'error');
        return false;
      }
      break;
    case 3:
      if (!formData.get('attempts_so_far') || formData.get('attempts_so_far').length < 50) {
        showNotification('Please describe your attempts in detail', 'error');
        return false;
      }
      break;
    case 4:
      const checkboxes = document.querySelectorAll('.support-checkbox:checked');
      if (checkboxes.length === 0) {
        showNotification('Please select at least one support type', 'error');
        return false;
      }
      break;
    case 5:
      if (!formData.get('breakthrough_outcome') || formData.get('breakthrough_outcome').length < 50) {
        showNotification('Please describe your breakthrough outcome', 'error');
        return false;
      }
      if (!formData.get('timeline')) {
        showNotification('Please select a target timeline', 'error');
        return false;
      }
      break;
    case 6:
      if (!formData.get('team_composition')) {
        showNotification('Please select a team composition', 'error');
        return false;
      }
      break;
  }
  
  return true;
}

function saveCurrentStep() {
  const form = document.getElementById('project-form');
  const formData = new FormData(form);
  
  switch(currentStep) {
    case 1:
      projectFormData.step1 = {
        name: formData.get('name'),
        location: formData.get('location') || '',
        project_description: formData.get('project_description'),
        personal_connection: formData.get('personal_connection')
      };
      break;
    case 2:
      projectFormData.step2 = {
        accomplishment_goal: formData.get('accomplishment_goal'),
        why_matters: formData.get('why_matters')
      };
      break;
    case 3:
      projectFormData.step3 = {
        attempts_so_far: formData.get('attempts_so_far'),
        what_worked: formData.get('what_worked') || '',
        what_didnt_work: formData.get('what_didnt_work') || ''
      };
      break;
    case 4:
      projectFormData.step4 = {
        support_needed: Array.from(document.querySelectorAll('.support-checkbox:checked'))
          .map(el => el.value)
          .join(', ')
      };
      break;
    case 5:
      projectFormData.step5 = {
        breakthrough_outcome: formData.get('breakthrough_outcome'),
        outcome_statement: formData.get('outcome_statement'),
        timeline: formData.get('timeline')
      };
      break;
    case 6:
      projectFormData.step6 = {
        team_composition: formData.get('team_composition')
      };
      break;
  }
}

function updateStepDisplay() {
  for (let i = 1; i <= 6; i++) {
    const step = document.getElementById(`step-${i}`);
    if (step) step.classList.add('hidden');
  }
  
  const currentStepEl = document.getElementById(`step-${currentStep}`);
  if (currentStepEl) currentStepEl.classList.remove('hidden');
  
  const labels = [
    'Identity & Story',
    'Your Challenge',
    'What You\'ve Tried',
    'Support Needed',
    'Ideal Outcome',
    'Team Composition'
  ];
  document.getElementById('step-label').textContent = `Step ${currentStep}: ${labels[currentStep - 1]}`;
  document.getElementById('step-count').textContent = `${currentStep} / 6`;
  document.getElementById('step-progress').value = (currentStep / 6) * 100;
  
  document.getElementById('prev-btn').classList.toggle('hidden', currentStep === 1);
  document.getElementById('next-btn').classList.toggle('hidden', currentStep === 6);
  document.getElementById('submit-btn').classList.toggle('hidden', currentStep !== 6);
}

async function submitProject() {
  const fullData = {
    ...projectFormData.step1,
    ...projectFormData.step2,
    ...projectFormData.step3,
    ...projectFormData.step4,
    ...projectFormData.step5,
    ...projectFormData.step6,
    userId: appData.currentUser?.id || 'user_' + Date.now(),
    submittedAt: new Date().toISOString(),
    status: 'pending'
  };
  
  try {
    const projectId = 'project_' + Date.now();
    const newProject = { id: projectId, ...fullData };
    userProjects.push(newProject);
    localStorage.setItem('worldpulse_projects', JSON.stringify(userProjects));
    
    showNotification('Project submitted! We\'ll find advisors soon. 🎉', 'success');
    projectFormData = { step1: {}, step2: {}, step3: {}, step4: {}, step5: {}, step6: {} };
    currentStep = 1;
    setTimeout(() => switchPage('my-projects'), 1500);
  } catch (error) {
    console.error('Error submitting project:', error);
    showNotification('Error submitting project', 'error');
  }
}

// ============================================
// PEER ADVISORY - MY PROJECTS
// ============================================

function loadUserProjects() {
  const saved = localStorage.getItem('worldpulse_projects');
  userProjects = saved ? JSON.parse(saved) : [];
  displayProjects();
}

function displayProjects() {
  const container = document.getElementById('projects-list');
  
  if (userProjects.length === 0) {
    container.innerHTML = '<p class="text-center text-muted py-8">No projects yet. <a href="#" onclick="switchPage(\'submit-project\')" class="text-primary font-semibold">Create one</a>!</p>';
    updateProjectStats();
    return;
  }
  
  container.innerHTML = userProjects.map(project => `
    <div class="card-custom cursor-pointer hover:shadow-lg" onclick="viewProjectDetails('${project.id}')">
      <div class="flex justify-between items-start mb-2">
        <h3 class="text-xl font-bold text-primary">${project.project_description.substring(0, 50)}...</h3>
        <span class="badge badge-${project.status === 'active' ? 'accent' : project.status === 'completed' ? 'success' : 'warning'}">${project.status}</span>
      </div>
      <p class="text-muted text-sm mb-3">${project.name} • ${new Date(project.submittedAt).toLocaleDateString()}</p>
      <div class="flex gap-2">
        <div class="badge">Goal: ${project.accomplishment_goal.substring(0, 30)}...</div>
      </div>
    </div>
  `).join('');
  
  updateProjectStats();
}

function updateProjectStats() {
  const total = userProjects.length;
  const active = userProjects.filter(p => p.status === 'active' || p.status === 'pending').length;
  const matched = userProjects.filter(p => p.advisors && p.advisors.length > 0).length;
  const completed = userProjects.filter(p => p.status === 'completed').length;
  
  document.getElementById('projects-total').textContent = total;
  document.getElementById('projects-active').textContent = active;
  document.getElementById('projects-matched').textContent = matched;
  document.getElementById('projects-completed').textContent = completed;
}

function viewProjectDetails(projectId) {
  const project = userProjects.find(p => p.id === projectId);
  if (!project) return;
  
  const detailsHtml = `
    <div>
      <div class="mb-6">
        <span class="badge badge-lg badge-${project.status === 'active' ? 'accent' : 'warning'}">${project.status.toUpperCase()}</span>
      </div>
      
      <h2 class="text-3xl font-bold text-primary mb-4">${project.project_description.substring(0, 100)}</h2>
      <p class="text-muted mb-6">Submitted ${new Date(project.submittedAt).toLocaleDateString()}</p>
      
      <div class="space-y-6">
        <div class="border-b pb-4">
          <h3 class="text-lg font-bold text-primary mb-2">Your Story</h3>
          <p class="text-gray-700">${project.personal_connection}</p>
        </div>
        
        <div class="border-b pb-4">
          <h3 class="text-lg font-bold text-primary mb-2">The Challenge</h3>
          <p class="text-gray-700"><strong>Goal:</strong> ${project.accomplishment_goal}</p>
          <p class="text-gray-700 mt-2"><strong>Why it matters:</strong> ${project.why_matters}</p>
        </div>
        
        <div class="border-b pb-4">
          <h3 class="text-lg font-bold text-primary mb-2">What You've Tried</h3>
          <p class="text-gray-700">${project.attempts_so_far}</p>
          ${project.what_worked ? `<p class="text-gray-700 mt-2"><strong>What worked:</strong> ${project.what_worked}</p>` : ''}
        </div>
        
        <div class="border-b pb-4">
          <h3 class="text-lg font-bold text-primary mb-2">Support Needed</h3>
          <p class="text-gray-700">${project.support_needed}</p>
        </div>
        
        <div class="border-b pb-4">
          <h3 class="text-lg font-bold text-primary mb-2">Success Vision</h3>
          <p class="text-gray-700">${project.outcome_statement}</p>
          <p class="text-muted text-sm mt-2">Target: ${new Date(project.timeline).toLocaleDateString()}</p>
        </div>
        
        <div>
          <h3 class="text-lg font-bold text-primary mb-2">Team</h3>
          <p class="text-gray-700">${project.team_composition}</p>
        </div>
      </div>
      
      <div class="mt-6 pt-6 border-t">
        <button class="btn btn-primary w-full" onclick="switchPage('feedback-recipient')">Leave Feedback</button>
      </div>
    </div>
  `;
  
  document.getElementById('project-details-content').innerHTML = detailsHtml;
  switchPage('project-details');
}

// ============================================
// PEER ADVISORY - FEEDBACK
// ============================================

async function submitRecipientFeedback(event) {
  event.preventDefault();
  
  const form = event.target;
  const formData = new FormData(form);
  
  const feedback = {
    understanding_context_rating: parseInt(formData.get('understanding_context')),
    helpfulness_rating: parseInt(formData.get('helpfulness')),
    provided_clarity: formData.get('provided_clarity') === 'yes',
    specific_result: formData.get('specific_result') || '',
    moved_project_closer_rating: parseInt(formData.get('moved_closer')),
    overall_satisfaction: parseInt(formData.get('overall_satisfaction')),
    recommend_program: formData.get('recommend_program') === 'yes',
    improvement_suggestions: formData.get('improvement_suggestions') || '',
    submittedAt: new Date().toISOString()
  };
  
  try {
    localStorage.setItem('worldpulse_feedback', JSON.stringify(feedback));
    showNotification('Feedback submitted! Thank you for sharing. ✓', 'success');
    setTimeout(() => switchPage('my-projects'), 1500);
  } catch (error) {
    console.error('Error submitting feedback:', error);
    showNotification('Error submitting feedback', 'error');
  }
}

// ============================================
// UTILITIES
// ============================================

function showNotification(message, type = 'info') {
  const alert = document.createElement('div');
  alert.className = `alert alert-${type === 'error' ? 'error' : type === 'success' ? 'success' : 'info'} mb-4 fixed top-20 right-4 max-w-sm z-50`;
  alert.innerHTML = message;
  document.body.appendChild(alert);
  setTimeout(() => alert.remove(), 3000);
}
