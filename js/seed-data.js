/**
 * Seed Data Generator for WorldPulse
 * Populates localStorage with sample data to demonstrate all features
 */

function seedAllData() {
  console.log('🌱 Seeding sample data...');
  
  // Clear existing data
  localStorage.clear();
  
  // Seed projects
  seedProjects();
  
  // Seed training requests
  seedTrainingRequests();
  
  // Seed roadmap ideas
  seedRoadmapIdeas();
  
  // Seed impact stories
  seedImpactStories();
  
  // Seed advice requests
  seedAdviceRequests();
  
  // Seed user profiles
  seedProfiles();
  
  alert('✅ Sample data loaded! Navigate to the pages to see populated content.\n\nPages to check:\n- Dashboard\n- Connect (matchmaking.html)\n- Community Hub (community-hub.html)\n- Roadmap, Training, Awards');
  
  // Reload current page to show updated data
  location.reload();
}

function seedProjects() {
  const projects = [
    {
      id: Date.now() - 100000,
      name: "Maria Santos",
      location: "São Paulo, Brazil",
      description: "Building a platform to connect rural farmers with market opportunities",
      accomplishment: "Helping smallholder farmers increase income by 40%",
      whyMatters: "Rural poverty drives migration to cities. This directly impacts family stability.",
      attempts: "Started with WhatsApp groups, built basic website, tried local partnerships",
      whatWorked: "Direct farmer feedback was gold. Partnership with agricultural co-ops showed promise.",
      idealOutcome: "Platform reaching 500 farmers with transparent pricing and fair market access",
      timeline: "2026-06-30",
      supportNeeded: ["Strategic advice", "Resource connections", "Practical tips"],
      teamComposition: "Small Team (2-3)",
      submittedAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: Date.now() - 90000,
      name: "Amara Okonkwo",
      location: "Lagos, Nigeria",
      description: "Creating affordable digital literacy program for underserved communities",
      accomplishment: "Training 200+ women in basic digital skills",
      whyMatters: "Digital skills are now essential for job prospects and entrepreneurship",
      attempts: "In-person classes at community centers, online YouTube tutorials, partnership attempts",
      whatWorked: "Peer-to-peer learning worked best. Women became mentors for others.",
      idealOutcome: "Sustainable model training 1000+ people annually with 80% job placement",
      timeline: "2026-09-15",
      supportNeeded: ["Moral support", "Skill building", "Resource connections"],
      teamComposition: "Small Team (2-3)",
      submittedAt: new Date(Date.now() - 172800000).toISOString()
    },
    {
      id: Date.now() - 80000,
      name: "Rahul Sharma",
      location: "Mumbai, India",
      description: "Mobile app helping people with mental health access affordable counseling",
      accomplishment: "Connected 150 people with therapists, avoided crisis situations",
      whyMatters: "Mental health support is inaccessible for most low-income populations",
      attempts: "Built MVP, partnered with 2 therapists, received 50+ user signups",
      whatWorked: "Anonymity and 24/7 availability resonated strongly. Users felt safe.",
      idealOutcome: "Network of 50+ therapists, sustainable revenue model, 5000 active users",
      timeline: "2026-08-01",
      supportNeeded: ["Strategic advice", "Practical tips", "Resource connections"],
      teamComposition: "Small Team (2-3)",
      submittedAt: new Date(Date.now() - 259200000).toISOString()
    },
    {
      id: Date.now() - 70000,
      name: "Sophie Leclerc",
      location: "Paris, France",
      description: "Reducing food waste through community sharing network",
      accomplishment: "Diverted 10,000 kg of food from landfills in 3 months",
      whyMatters: "1/3 of food is wasted while millions face food insecurity",
      attempts: "Manual coordination, small local network, attempted scaling",
      whatWorked: "Mobile-first approach got adoption. Restaurants liked tax incentives.",
      idealOutcome: "Network across 5 cities, preventing 100,000 kg waste annually",
      timeline: "2026-07-20",
      supportNeeded: ["Strategic advice", "Moral support"],
      teamComposition: "Solo",
      submittedAt: new Date(Date.now() - 345600000).toISOString()
    },
    {
      id: Date.now() - 60000,
      name: "David Chen",
      location: "Singapore",
      description: "Open-source education platform for refugee children",
      accomplishment: "Teaching 80 refugee children across 5 countries",
      whyMatters: "Refugee children often miss years of schooling, limiting future prospects",
      attempts: "Started with basic LMS, gathered volunteer teachers, got NGO partnerships",
      whatWorked: "Gamification kept engagement high. Volunteer teachers were passionate.",
      idealOutcome: "Serving 1000+ children with multilingual support and certified courses",
      timeline: "2026-05-31",
      supportNeeded: ["Resource connections", "Skill building", "Strategic advice"],
      teamComposition: "Larger Team (4+)",
      submittedAt: new Date(Date.now() - 432000000).toISOString()
    }
  ];
  
  localStorage.setItem('worldpulse_projects', JSON.stringify(projects));
  console.log('✅ Seeded 5 projects');
}

function seedTrainingRequests() {
  const requests = [
    {
      id: Date.now() - 150000,
      title: "Social Media Strategy for NGOs",
      description: "Need help developing effective social media strategy to raise awareness about our clean water initiative",
      submittedBy: "Emma Thompson",
      category: "Marketing",
      votes: 24,
      supportLevel: "Looking for high-level guidance",
      submittedAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: Date.now() - 140000,
      title: "Financial Planning & Sustainability",
      description: "How to build sustainable revenue models that don't compromise our social mission",
      submittedBy: "Kwame Asante",
      category: "Finance",
      votes: 18,
      supportLevel: "Need to understand different models",
      submittedAt: new Date(Date.now() - 172800000).toISOString()
    },
    {
      id: Date.now() - 130000,
      title: "Volunteer Management Systems",
      description: "Best practices for coordinating 50+ volunteers across remote locations",
      submittedBy: "Jessica Martinez",
      category: "Operations",
      votes: 22,
      supportLevel: "Practical tools and templates",
      submittedAt: new Date(Date.now() - 259200000).toISOString()
    },
    {
      id: Date.now() - 120000,
      title: "Impact Measurement Framework",
      description: "How do we measure real impact? Need guidance on metrics that matter",
      submittedBy: "Kofi Mensah",
      category: "Impact",
      votes: 31,
      supportLevel: "Strategic framework and examples",
      submittedAt: new Date(Date.now() - 345600000).toISOString()
    },
    {
      id: Date.now() - 110000,
      title: "Tech Stack for Nonprofits",
      description: "What tools and platforms work best for small NGOs with limited budgets?",
      submittedBy: "Priya Patel",
      category: "Technology",
      votes: 15,
      supportLevel: "Recommendations and setup help",
      submittedAt: new Date(Date.now() - 432000000).toISOString()
    }
  ];
  
  localStorage.setItem('worldpulse_training_requests', JSON.stringify(requests));
  console.log('✅ Seeded 5 training requests');
}

function seedRoadmapIdeas() {
  const ideas = [
    {
      id: Date.now() - 200000,
      title: "Peer Advisory Matching Algorithm",
      description: "Auto-match projects with advisors based on expertise, location, and experience. Could dramatically speed up connections.",
      submittedBy: "Alex Rivera",
      category: "Feature",
      votes: 42,
      status: "Under consideration",
      impact: "High",
      submittedAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: Date.now() - 190000,
      title: "Multilingual Support",
      description: "Platform should support Arabic, Swahili, Mandarin, and Spanish to serve global communities",
      submittedBy: "Aisha Ibrahim",
      category: "Localization",
      votes: 38,
      status: "Planned",
      impact: "High",
      submittedAt: new Date(Date.now() - 172800000).toISOString()
    },
    {
      id: Date.now() - 180000,
      title: "Mobile-First Design",
      description: "Most users access via mobile in low-bandwidth areas. Redesign UI for mobile-first experience.",
      submittedBy: "Dev Team",
      category: "UX",
      votes: 51,
      status: "In progress",
      impact: "Critical",
      submittedAt: new Date(Date.now() - 259200000).toISOString()
    },
    {
      id: Date.now() - 170000,
      title: "Video Testimonials Feature",
      description: "Let advisors record short intro videos so seekers can connect with them better",
      submittedBy: "Sarah Chen",
      category: "Feature",
      votes: 19,
      status: "New",
      impact: "Medium",
      submittedAt: new Date(Date.now() - 345600000).toISOString()
    },
    {
      id: Date.now() - 160000,
      title: "Offline Mode for Low Connectivity",
      description: "Allow core features to work without internet, sync when connection returns",
      submittedBy: "Tech Lead",
      category: "Technical",
      votes: 35,
      status: "Under consideration",
      impact: "High",
      submittedAt: new Date(Date.now() - 432000000).toISOString()
    }
  ];
  
  localStorage.setItem('worldpulse_ideas', JSON.stringify(ideas));
  console.log('✅ Seeded 5 roadmap ideas');
}

function seedImpactStories() {
  const stories = [
    {
      id: 1,
      title: "I felt small, yet I knew something...",
      author: "Global Advocate",
      content: "A powerful reflection on personal empowerment and finding strength in moments of uncertainty.",
      votes: 12,
      url: "https://www.worldpulse.org/story/i-felt-small-yet-i-knew-something-74730",
      timestamp: "2024-12-04T00:00:00Z"
    },
    {
      id: 2,
      title: "The trauma she endured: Silent tears never noticed",
      author: "Resilience Speaker",
      content: "A courageous account of overcoming trauma and breaking the silence surrounding mental health.",
      votes: 18,
      url: "https://www.worldpulse.org/story/the-trauma-she-endurance-a-silent-tears-never-noticed-74731",
      timestamp: "2024-12-04T00:00:00Z"
    },
    {
      id: 3,
      title: "School pledge on ending child marriages",
      author: "Education Champion",
      content: "An inspiring initiative bringing communities together to protect children's futures through education.",
      votes: 25,
      url: "https://www.worldpulse.org/story/school-pledge-on-ending-child-marriages--74761",
      timestamp: "2024-12-04T00:00:00Z"
    },
    {
      id: 4,
      title: "A silent pain",
      author: "Healing Activist",
      content: "Exploring the hidden struggles many face and the importance of speaking up for support.",
      votes: 9,
      url: "https://www.worldpulse.org/story/a-silent-pain-74788",
      timestamp: "2024-12-04T00:00:00Z"
    },
    {
      id: 5,
      title: "Peace is the dignity of every girl",
      author: "Girls' Rights Advocate",
      content: "Celebrating the inherent dignity and rights of girls worldwide in the pursuit of peace.",
      votes: 31,
      url: "https://www.worldpulse.org/story/peace-is-the-dignity-of-every-girl-74792",
      timestamp: "2024-12-04T00:00:00Z"
    },
    {
      id: 6,
      title: "When men do it, we are told to endure",
      author: "Justice Seeker",
      content: "Challenging gender inequalities and the double standards women face in society.",
      votes: 22,
      url: "https://www.worldpulse.org/story/when-men-do-it-we-are-told-to-endure-74876",
      timestamp: "2024-12-04T00:00:00Z"
    },
    {
      id: 7,
      title: "The eternal flame: A World Pulse Heroes Remembrance Day",
      author: "Community Leader",
      content: "Proposing a meaningful way to honor and remember the heroes making a difference worldwide.",
      votes: 16,
      url: "https://www.worldpulse.org/story/the-eternal-flame-proposing-a-world-pulse-heroes-remembrance-day-74889",
      timestamp: "2024-12-04T00:00:00Z"
    },
    {
      id: 8,
      title: "Why I joined World Pulse",
      author: "Community Member",
      content: "A personal account of why World Pulse became instrumental in connecting and empowering.",
      votes: 14,
      url: "https://www.worldpulse.org/story/why-i-joined-world-pulse-74963",
      timestamp: "2024-12-04T00:00:00Z"
    },
    {
      id: 9,
      title: "Between silence and strength: The stigma toward divorced women in the Philippines",
      author: "Women's Advocate",
      content: "Addressing the stigma and discrimination faced by divorced and separated women in society.",
      votes: 27,
      url: "https://www.worldpulse.org/story/between-silence-and-strength-the-stigma-toward-divorced-and-separated-filipinas-in-philip-74959",
      timestamp: "2024-12-04T00:00:00Z"
    }
  ];
  
  localStorage.setItem('worldpulse_stories', JSON.stringify(stories));
  console.log('✅ Seeded 9 impact stories');
}

function seedAdviceRequests() {
  const advices = [
    {
      id: Date.now() - 300000,
      name: "Anita Kapoor",
      title: "Education Tech for Rural Areas",
      location: "Hyderabad, India",
      problem: "Our online education platform works in cities but connectivity is poor in rural areas. Users drop off.",
      tried: "We optimized for low bandwidth, created offline content packs, partnered with local telecom",
      outcome: "Want to reach 100K rural students while maintaining quality",
      visibility: "public",
      support: ["strategic", "practical", "connections"],
      submittedAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: Date.now() - 290000,
      name: "Carlos Rivera",
      title: "Scaling Our Social Enterprise",
      location: "Bogotá, Colombia",
      problem: "We've grown to 50 employees but operations are chaotic. Need structure without losing impact focus.",
      tried: "Hired operations manager, tried several project management tools, implemented basic processes",
      outcome: "Streamlined operations that can handle 200+ employees while maintaining culture",
      visibility: "public",
      support: ["strategic", "practical"],
      submittedAt: new Date(Date.now() - 172800000).toISOString()
    },
    {
      id: Date.now() - 280000,
      name: "Fatima Al-Dosari",
      title: "Women's Cooperative - From Craft to Commerce",
      location: "Riyadh, Saudi Arabia",
      problem: "45 women making beautiful crafts but no direct market access. Middlemen take 60% margin.",
      tried: "Built basic e-commerce site, tried social media marketing, got 10 orders in 3 months",
      outcome: "Direct market access generating income for 45 women families",
      visibility: "public",
      support: ["strategic", "connections", "skills"],
      submittedAt: new Date(Date.now() - 259200000).toISOString()
    },
    {
      id: Date.now() - 270000,
      name: "Jamal Hassan",
      title: "Clean Water Initiative - Scaling Beyond Pilot",
      location: "Dar es Salaam, Tanzania",
      problem: "Pilot reached 500 people. Now we need to scale to 50K but have no revenue model.",
      tried: "Government partnership attempts, NGO grant applications, local fee testing",
      outcome: "Sustainable model serving 50K people with reliable clean water",
      visibility: "private",
      support: ["strategic", "connections"],
      submittedAt: new Date(Date.now() - 345600000).toISOString()
    }
  ];
  
  localStorage.setItem('worldpulse_advices', JSON.stringify(advices));
  console.log('✅ Seeded 4 advice requests');
}

function seedProfiles() {
  const profiles = [
    {
      id: Date.now() - 400000,
      name: "Dr. Amara Okafor",
      role: "Health Systems Expert",
      expertise: ["Healthcare", "Impact measurement", "Fundraising"],
      bio: "20 years experience building health systems in West Africa",
      availability: "10 hours/month"
    },
    {
      id: Date.now() - 390000,
      name: "James Chen",
      role: "Tech Founder & Advisor",
      expertise: ["Product", "Scaling", "Tech infrastructure"],
      bio: "Built 3 startups in Southeast Asia, now advising early-stage founders",
      availability: "5 hours/month"
    },
    {
      id: Date.now() - 380000,
      name: "Sofia Moreno",
      role: "Social Enterprise Strategist",
      expertise: ["Business model innovation", "Market strategy", "Partnerships"],
      bio: "15 years in social enterprise development across Latin America",
      availability: "8 hours/month"
    },
    {
      id: Date.now() - 370000,
      name: "Ahmed Hassan",
      role: "Fundraising Expert",
      expertise: ["Grant writing", "Impact investing", "Donor relations"],
      bio: "Helped 50+ organizations raise $20M+ in impact funding",
      availability: "12 hours/month"
    },
    {
      id: Date.now() - 360000,
      name: "Lisa Wang",
      role: "Operations & Scale Specialist",
      expertise: ["Operations", "Team building", "Process design"],
      bio: "Scaled social organizations from 5 to 500+ employees",
      availability: "6 hours/month"
    }
  ];
  
  localStorage.setItem('worldpulse_profiles', JSON.stringify(profiles));
  console.log('✅ Seeded 5 advisor profiles');
}

// Add seed button to dashboard
document.addEventListener('DOMContentLoaded', () => {
  const dashboardSection = document.querySelector('#page-dashboard');
  if (dashboardSection && !document.getElementById('seed-data-btn')) {
    const seedBtn = document.createElement('button');
    seedBtn.id = 'seed-data-btn';
    seedBtn.className = 'btn btn-outline btn-sm fixed bottom-4 right-4 z-40';
    seedBtn.textContent = '🌱 Load Sample Data';
    seedBtn.onclick = seedAllData;
    document.body.appendChild(seedBtn);
  }
});
