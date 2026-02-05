// WorldPulse MVP - Peer Advisory System Backend Extension
// Add these functions to your existing APPS_SCRIPT_CODE.gs

// ============================================
// PROJECT MANAGEMENT (Peer Advisory)
// ============================================

function submitProject(params) {
  const sheet = getSheet('Projects');
  const projectId = Utilities.getUuid();
  const timestamp = new Date();
  
  const row = [
    projectId,
    params.userId || '',
    params.name || '',
    params.location || '',
    params.project_description || '',
    params.personal_connection || '',
    params.accomplishment_goal || '',
    params.why_matters || '',
    params.attempts_so_far || '',
    params.what_worked || '',
    params.what_didnt_work || '',
    JSON.stringify(params.support_needed || []),
    params.breakthrough_outcome || '',
    params.outcome_statement || '',
    params.timeline || '',
    params.team_composition || '',
    'submitted', // status
    0, // advisor_count
    timestamp
  ];
  
  sheet.appendRow(row);
  
  return {
    success: true,
    projectId: projectId,
    message: 'Project submitted successfully'
  };
}

function getProjects(params) {
  const sheet = getSheet('Projects');
  const data = sheet.getDataRange().getValues();
  const projects = [];
  
  for (let i = 1; i < data.length; i++) {
    const project = {
      id: data[i][0],
      userId: data[i][1],
      name: data[i][2],
      location: data[i][3],
      project_description: data[i][4],
      personal_connection: data[i][5],
      accomplishment_goal: data[i][6],
      why_matters: data[i][7],
      attempts_so_far: data[i][8],
      what_worked: data[i][9],
      what_didnt_work: data[i][10],
      support_needed: JSON.parse(data[i][11] || '[]'),
      breakthrough_outcome: data[i][12],
      outcome_statement: data[i][13],
      timeline: data[i][14],
      team_composition: data[i][15],
      status: data[i][16],
      advisor_count: data[i][17],
      createdAt: data[i][18]
    };
    
    // Apply filters
    if (params.status && project.status !== params.status) continue;
    if (params.userId && project.userId !== params.userId) continue;
    
    projects.push(project);
  }
  
  return {
    success: true,
    count: projects.length,
    data: projects
  };
}

function getProjectById(params) {
  const sheet = getSheet('Projects');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === params.projectId) {
      return {
        success: true,
        data: {
          id: data[i][0],
          userId: data[i][1],
          name: data[i][2],
          location: data[i][3],
          project_description: data[i][4],
          personal_connection: data[i][5],
          accomplishment_goal: data[i][6],
          why_matters: data[i][7],
          attempts_so_far: data[i][8],
          what_worked: data[i][9],
          what_didnt_work: data[i][10],
          support_needed: JSON.parse(data[i][11] || '[]'),
          breakthrough_outcome: data[i][12],
          outcome_statement: data[i][13],
          timeline: data[i][14],
          team_composition: data[i][15],
          status: data[i][16],
          advisor_count: data[i][17]
        }
      };
    }
  }
  
  return { success: false, error: 'Project not found' };
}

function updateProject(params) {
  const sheet = getSheet('Projects');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === params.projectId) {
      // Update relevant fields
      if (params.status) sheet.getRange(i + 1, 17).setValue(params.status);
      if (params.name) sheet.getRange(i + 1, 3).setValue(params.name);
      if (params.project_description) sheet.getRange(i + 1, 5).setValue(params.project_description);
      
      return {
        success: true,
        message: 'Project updated successfully'
      };
    }
  }
  
  return { success: false, error: 'Project not found' };
}

function deleteProject(params) {
  const sheet = getSheet('Projects');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === params.projectId) {
      sheet.deleteRow(i + 1);
      return {
        success: true,
        message: 'Project deleted'
      };
    }
  }
  
  return { success: false, error: 'Project not found' };
}

// ============================================
// PROJECT MATCHING
// ============================================

function proposeMatch(params) {
  const sheet = getSheet('ProjectMatches');
  const matchId = Utilities.getUuid();
  const timestamp = new Date();
  
  const row = [
    matchId,
    params.projectId || '',
    params.advisorId || '',
    'pending', // status
    '', // notes
    timestamp,
    null // completedAt
  ];
  
  sheet.appendRow(row);
  
  // Update project advisor count
  updateProjectAdvisorCount(params.projectId);
  
  return {
    success: true,
    matchId: matchId,
    message: 'Advisor match proposed'
  };
}

function getProjectMatches(params) {
  const sheet = getSheet('ProjectMatches');
  const data = sheet.getDataRange().getValues();
  const matches = [];
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === params.projectId || data[i][2] === params.userId) {
      matches.push({
        id: data[i][0],
        projectId: data[i][1],
        advisorId: data[i][2],
        status: data[i][3],
        notes: data[i][4],
        createdAt: data[i][5],
        completedAt: data[i][6]
      });
    }
  }
  
  return {
    success: true,
    count: matches.length,
    data: matches
  };
}

function updateMatchStatus(params) {
  const sheet = getSheet('ProjectMatches');
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === params.matchId) {
      sheet.getRange(i + 1, 4).setValue(params.status);
      if (params.notes) sheet.getRange(i + 1, 5).setValue(params.notes);
      if (params.status === 'completed') {
        sheet.getRange(i + 1, 7).setValue(new Date());
      }
      
      return {
        success: true,
        message: 'Match status updated'
      };
    }
  }
  
  return { success: false, error: 'Match not found' };
}

function updateProjectAdvisorCount(projectId) {
  const matchesSheet = getSheet('ProjectMatches');
  const matchData = matchesSheet.getDataRange().getValues();
  
  let acceptedCount = 0;
  for (let i = 1; i < matchData.length; i++) {
    if (matchData[i][1] === projectId && matchData[i][3] === 'accepted') {
      acceptedCount++;
    }
  }
  
  // Update projects sheet
  const projectsSheet = getSheet('Projects');
  const projectData = projectsSheet.getDataRange().getValues();
  
  for (let i = 1; i < projectData.length; i++) {
    if (projectData[i][0] === projectId) {
      projectsSheet.getRange(i + 1, 18).setValue(acceptedCount);
      break;
    }
  }
}

// ============================================
// PROJECT FEEDBACK - RECIPIENT
// ============================================

function submitRecipientFeedback(params) {
  const sheet = getSheet('ProjectFeedbackRecipient');
  const feedbackId = Utilities.getUuid();
  const timestamp = new Date();
  
  const row = [
    feedbackId,
    params.projectId || '',
    params.advisorId || '',
    params.expertise_alignment_rating || 0,
    params.understanding_context_rating || 0,
    params.support_style_suitability || '',
    params.helpfulness_rating || 0,
    params.provided_clarity ? 'Yes' : 'No',
    params.specific_result || '',
    params.communication_rating || 0,
    params.felt_heard_respected_rating || 0,
    params.meeting_logistics_rating || 0,
    params.moved_project_closer_rating || 0,
    JSON.stringify(params.experienced_outcomes || []),
    params.continued_support_interest ? 'Yes' : 'No',
    params.overall_satisfaction || 0,
    params.recommend_program ? 'Yes' : 'No',
    params.improvement_suggestions || '',
    timestamp
  ];
  
  sheet.appendRow(row);
  
  return {
    success: true,
    feedbackId: feedbackId,
    message: 'Feedback submitted successfully'
  };
}

function getRecipientFeedback(params) {
  const sheet = getSheet('ProjectFeedbackRecipient');
  const data = sheet.getDataRange().getValues();
  const feedback = [];
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === params.projectId || data[i][2] === params.advisorId) {
      feedback.push({
        id: data[i][0],
        projectId: data[i][1],
        advisorId: data[i][2],
        expertise_alignment_rating: data[i][3],
        understanding_context_rating: data[i][4],
        support_style_suitability: data[i][5],
        helpfulness_rating: data[i][6],
        provided_clarity: data[i][7] === 'Yes',
        specific_result: data[i][8],
        communication_rating: data[i][9],
        felt_heard_respected_rating: data[i][10],
        meeting_logistics_rating: data[i][11],
        moved_project_closer_rating: data[i][12],
        experienced_outcomes: JSON.parse(data[i][13] || '[]'),
        continued_support_interest: data[i][14] === 'Yes',
        overall_satisfaction: data[i][15],
        recommend_program: data[i][16] === 'Yes',
        improvement_suggestions: data[i][17],
        createdAt: data[i][18]
      });
    }
  }
  
  return {
    success: true,
    count: feedback.length,
    data: feedback
  };
}

// ============================================
// PROJECT FEEDBACK - ADVISOR
// ============================================

function submitAdvisorFeedback(params) {
  const sheet = getSheet('ProjectFeedbackAdvisor');
  const feedbackId = Utilities.getUuid();
  const timestamp = new Date();
  
  const row = [
    feedbackId,
    params.projectId || '',
    params.advisorId || '',
    params.project_brief_quality_rating || 0,
    params.expertise_relevance_rating || 0,
    params.experience_satisfaction_rating || 0,
    params.improvement_suggestions || '',
    timestamp
  ];
  
  sheet.appendRow(row);
  
  return {
    success: true,
    feedbackId: feedbackId,
    message: 'Advisor feedback submitted'
  };
}

function getAdvisorFeedback(params) {
  const sheet = getSheet('ProjectFeedbackAdvisor');
  const data = sheet.getDataRange().getValues();
  const feedback = [];
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][2] === params.advisorId) {
      feedback.push({
        id: data[i][0],
        projectId: data[i][1],
        advisorId: data[i][2],
        project_brief_quality_rating: data[i][3],
        expertise_relevance_rating: data[i][4],
        experience_satisfaction_rating: data[i][5],
        improvement_suggestions: data[i][6],
        createdAt: data[i][7]
      });
    }
  }
  
  return {
    success: true,
    count: feedback.length,
    data: feedback
  };
}

// ============================================
// ADVISOR ANALYTICS
// ============================================

function getAdvisorRatings(params) {
  const feedbackSheet = getSheet('ProjectFeedbackAdvisor');
  const feedbackData = feedbackSheet.getDataRange().getValues();
  
  let totalRatings = 0;
  let qualitySum = 0;
  let relevanceSum = 0;
  let satisfactionSum = 0;
  let count = 0;
  
  for (let i = 1; i < feedbackData.length; i++) {
    if (feedbackData[i][2] === params.advisorId) {
      qualitySum += feedbackData[i][3] || 0;
      relevanceSum += feedbackData[i][4] || 0;
      satisfactionSum += feedbackData[i][5] || 0;
      count++;
    }
  }
  
  const avgQuality = count > 0 ? (qualitySum / count).toFixed(2) : 0;
  const avgRelevance = count > 0 ? (relevanceSum / count).toFixed(2) : 0;
  const avgSatisfaction = count > 0 ? (satisfactionSum / count).toFixed(2) : 0;
  
  return {
    success: true,
    data: {
      advisorId: params.advisorId,
      feedbackCount: count,
      avg_project_brief_quality: parseFloat(avgQuality),
      avg_expertise_relevance: parseFloat(avgRelevance),
      avg_experience_satisfaction: parseFloat(avgSatisfaction),
      overall_rating: parseFloat(((parseFloat(avgQuality) + parseFloat(avgRelevance) + parseFloat(avgSatisfaction)) / 3).toFixed(2))
    }
  };
}

function getProjectImpactMetrics(params) {
  const recipientSheet = getSheet('ProjectFeedbackRecipient');
  const recipientData = recipientSheet.getDataRange().getValues();
  
  let totalFeedback = 0;
  let recommendCount = 0;
  let continueInterestCount = 0;
  let satisfactionSum = 0;
  let movedCloserSum = 0;
  const outcomesMap = {};
  
  for (let i = 1; i < recipientData.length; i++) {
    if (recipientData[i][1] === params.projectId) {
      totalFeedback++;
      satisfactionSum += recipientData[i][15] || 0;
      movedCloserSum += recipientData[i][12] || 0;
      
      if (recipientData[i][16] === 'Yes') recommendCount++;
      if (recipientData[i][14] === 'Yes') continueInterestCount++;
      
      // Parse outcomes
      const outcomes = JSON.parse(recipientData[i][13] || '[]');
      outcomes.forEach(outcome => {
        outcomesMap[outcome] = (outcomesMap[outcome] || 0) + 1;
      });
    }
  }
  
  return {
    success: true,
    data: {
      projectId: params.projectId,
      total_feedback_responses: totalFeedback,
      recommend_program_percent: totalFeedback > 0 ? ((recommendCount / totalFeedback) * 100).toFixed(0) : 0,
      continue_support_percent: totalFeedback > 0 ? ((continueInterestCount / totalFeedback) * 100).toFixed(0) : 0,
      avg_satisfaction: totalFeedback > 0 ? (satisfactionSum / totalFeedback).toFixed(2) : 0,
      avg_project_progress: totalFeedback > 0 ? (movedCloserSum / totalFeedback).toFixed(2) : 0,
      reported_outcomes: outcomesMap
    }
  };
}
