# Roadmap Ideas Seed Data
roadmap_ideas = [
  { name: "Peer Advisory Matching Algorithm", submitter: "Alex Rivera", idea_type: "Feature", user_story: "As a seeker, I want automatic matches with advisors so I can get help faster.", votes: 42 },
  { name: "Multilingual Support", submitter: "Aisha Ibrahim", idea_type: "Localization", user_story: "As a non-English speaker, I want the site in my language so I can participate fully.", votes: 38 },
  { name: "Mobile-First Design", submitter: "Dev Team", idea_type: "UX", user_story: "As a mobile user in low-bandwidth areas, I need a streamlined mobile UI that loads quickly.", votes: 51 },
  { name: "Video Introductions for Advisors", submitter: "Sarah Chen", idea_type: "Feature", user_story: "As a seeker, I want to watch short advisor intros to know who to contact.", votes: 19 },
  { name: "Offline Mode", submitter: "Tech Lead", idea_type: "Technical", user_story: "As a user with intermittent connectivity, I want to use core features offline and sync later.", votes: 35 },
  { name: "Advanced Search Filters", submitter: "Product", idea_type: "Feature", user_story: "As a seeker, I want to filter advisors by skill, location and availability.", votes: 28 },
  { name: "Structured Mentorship Paths", submitter: "Program Team", idea_type: "Program", user_story: "As a user, I want guided mentorship tracks for common challenges so I can follow a roadmap.", votes: 22 },
  { name: "Impact Measurement Toolkit", submitter: "M&E Team", idea_type: "Feature", user_story: "As a project lead, I want templates and dashboards to measure impact easily.", votes: 31 },
  { name: "Donor Collaboration Space", submitter: "Partnerships", idea_type: "Collaboration", user_story: "As a funder, I want a private workspace to collaborate with grantees.", votes: 14 },
  { name: "Accessibility Improvements", submitter: "Accessibility Lead", idea_type: "UX", user_story: "As a user with accessibility needs, I want WCAG-compliant options and adjustable text sizes.", votes: 17 }
]

roadmap_ideas.each do |idea|
  RoadmapIdea.find_or_create_by!(name: idea[:name]) do |record|
    record.submitter = idea[:submitter]
    record.idea_type = idea[:idea_type]
    record.user_story = idea[:user_story]
    record.votes = idea[:votes]
  end
end

puts "Created #{RoadmapIdea.count} roadmap ideas"

# Stories Seed Data
stories = [
  { title: "I felt small, yet I knew something...", author: "Global Advocate", content: "A powerful reflection on personal empowerment and finding strength in moments of uncertainty.", votes: 45, url: "https://www.worldpulse.org/story/i-felt-small-yet-i-knew-something-74730", tags: [ "personal", "empowerment" ] },
  { title: "The trauma she endured: Silent tears never noticed", author: "Resilience Speaker", content: "A courageous account of overcoming trauma and breaking the silence surrounding mental health.", votes: 38, url: "https://www.worldpulse.org/story/the-trauma-she-endurance-a-silent-tears-never-noticed-74731", tags: [ "trauma", "resilience" ] },
  { title: "School pledge on ending child marriages", author: "Education Champion", content: "An inspiring initiative bringing communities together to protect children's futures through education.", votes: 52, url: "https://www.worldpulse.org/story/school-pledge-on-ending-child-marriages--74761", tags: [ "education", "child protection" ] },
  { title: "A silent pain", author: "Healing Activist", content: "Exploring the hidden struggles many face and the importance of speaking up for support.", votes: 29, url: "https://www.worldpulse.org/story/a-silent-pain-74788", tags: [ "personal", "struggle" ] },
  { title: "Peace is the dignity of every girl", author: "Girls' Rights Advocate", content: "Celebrating the inherent dignity and rights of girls worldwide in the pursuit of peace.", votes: 41, url: "https://www.worldpulse.org/story/peace-is-the-dignity-of-every-girl-74792", tags: [ "girls", "peace", "dignity" ] },
  { title: "When men do it, we are told to endure", author: "Justice Seeker", content: "Challenging gender inequalities and the double standards women face in society.", votes: 33, url: "https://www.worldpulse.org/story/when-men-do-it-we-are-told-to-endure-74876", tags: [ "gender", "justice", "endurance" ] },
  { title: "The eternal flame: A World Pulse Heroes Remembrance Day", author: "Community Leader", content: "Proposing a meaningful way to honor and remember the heroes making a difference worldwide.", votes: 27, url: "https://www.worldpulse.org/story/the-eternal-flame-proposing-a-world-pulse-heroes-remembrance-day-74889", tags: [ "commemoration", "heroes", "remembrance" ] },
  { title: "Why I joined World Pulse", author: "Community Member", content: "A personal account of why World Pulse became instrumental in connecting and empowering.", votes: 35, url: "https://www.worldpulse.org/story/why-i-joined-world-pulse-74963", tags: [ "community", "motivation", "connection" ] },
  { title: "Between silence and strength: The stigma toward divorced women in the Philippines", author: "Women's Advocate", content: "Addressing the stigma and discrimination faced by divorced and separated women in society.", votes: 44, url: "https://www.worldpulse.org/story/between-silence-and-strength-the-stigma-toward-divorced-and-separated-filipinas-in-philip-74959", tags: [ "divorce", "stigma", "women" ] }
]

stories.each do |story|
  Story.find_or_create_by!(title: story[:title]) do |record|
    record.author = story[:author]
    record.content = story[:content]
    record.votes = story[:votes]
    record.url = story[:url]
    record.tags = story[:tags]
  end
end

puts "Created #{Story.count} stories"

# Training Requests Seed Data
training_requests = [
  { topic: "Digital Marketing Basics", description: "I want to learn how to promote my community project online.", status: "pending", votes: 28 },
  { topic: "Grant Writing", description: "Looking for help writing compelling grant proposals.", status: "pending", votes: 35 },
  { topic: "Public Speaking", description: "I need confidence to present my ideas to donors and stakeholders.", status: "pending", votes: 22 }
]

training_requests.each do |req|
  TrainingRequest.find_or_create_by!(topic: req[:topic]) do |record|
    record.description = req[:description]
    record.status = req[:status]
    record.votes = req[:votes]
  end
end

puts "Created #{TrainingRequest.count} training requests"

# Training Offerings Seed Data
training_offerings = [
  { topic: "Social Media Strategy", description: "I can teach how to build an online presence for your cause.", availability: "Weekly", votes: 18 },
  { topic: "Financial Planning for NGOs", description: "Expertise in budgeting and financial management for non-profits.", availability: "Monthly", votes: 12 },
  { topic: "Storytelling for Impact", description: "Learn to tell compelling stories that inspire action.", availability: "Bi-weekly", votes: 25 }
]

training_offerings.each do |offer|
  TrainingOffering.find_or_create_by!(topic: offer[:topic]) do |record|
    record.description = offer[:description]
    record.availability = offer[:availability]
    record.votes = offer[:votes]
  end
end

puts "Created #{TrainingOffering.count} training offerings"

# Projects Seed Data
Project.create!(name: "Tech Training for Women", location: "Kilifi, Kenya", description: "Training women over 25 how to code and use AI to upskill", votes: 45, support_types: "Practical tips, Resource connections", accomplishment_goal: "Train 25 women in basic coding", why_matters: "Women need digital skills for economic empowerment", attempts_so_far: "Borrowed laptops, virtual sessions", what_worked: "High demand from community", ideal_outcome: "25 women employed in tech roles", timeline: "December 2026", team_composition: "Solo founder")

Project.create!(name: "Clean Water Initiative", location: "Lagos, Nigeria", description: "Providing clean water access to rural communities", votes: 38, support_types: "Mentorship, Funding connections", accomplishment_goal: "Build 3 boreholes", why_matters: "Clean water is a basic need", attempts_so_far: "Purchased water tanks", what_worked: "Community partnerships", ideal_outcome: "5000 people with clean water", timeline: "March 2027", team_composition: "Team of 3")

Project.create!(name: "Youth Education Program", location: "Mumbai, India", description: "After-school coding program for underserved youth", votes: 52, support_types: "Volunteers, Partnerships", accomplishment_goal: "100 students enrolled", why_matters: "Digital skills create opportunities", attempts_so_far: "Pilot with 10 students", what_worked: "Parent enthusiasm", ideal_outcome: "50 students in internships", timeline: "June 2027", team_composition: "Founding team of 2")

Project.create!(name: "Women's Health Clinic", location: "Nairobi, Kenya", description: "Mobile health clinic for rural women", votes: 29, support_types: "Medical supplies, Funding", accomplishment_goal: "Serve 1000 women", why_matters: "Healthcare access is limited", attempts_so_far: "Partnered with local hospital", what_worked: "Word of mouth referrals", ideal_outcome: "Monthly mobile clinics", timeline: "September 2027", team_composition: "Medical director + 2 volunteers")

Project.create!(name: "Sustainable Farming Project", location: "Lima, Peru", description: "Teaching organic farming techniques to local farmers", votes: 33, support_types: "Agricultural expertise, Market access", accomplishment_goal: "50 farmers trained", why_matters: "Sustainable farming increases income", attempts_so_far: "Community workshops", what_worked: "Farmer testimonials", ideal_outcome: "Farmers exporting organic produce", timeline: "November 2027", team_composition: "Agricultural specialist + 2 locals")

puts "Created #{Project.count} projects"
