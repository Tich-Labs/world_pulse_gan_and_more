# Mentorship Matchmaker - Technical Roadmap

## Project Overview
- **Project Name**: Mentorship Matchmaker
- **Type**: SaaS Platform (Multi-tenant, Generic Matchmaking Engine)
- **Core Concept**: A configurable matchmaking platform that can connect any two groups for any purpose
- **Target Users**: Platform operators, and end-users seeking matches (mentors/mentees, influencers/businesses, etc.)

## Example Use Cases (Tenant Configurations)
| Use Case | Side A | Side B |
|----------|--------|--------|
| Influencer Marketing | Business Owner | Influencer |
| Mentorship | Mentee | Mentor |
| Talent Matching | Employer | Job Seeker |
| Volunteer | Non-profit | Volunteer |
| Dating | Person A | Person B |
| Tutoring | Student | Tutor |
| Partner Finding | Co-founder | Co-founder |

---

## Current State (As-Is)

### ✓ Implemented
| Feature | Description |
|---------|-------------|
| User Authentication | Basic email/password registration & login |
| Project Submission | Multi-step form for business owners to describe projects |
| Project Browsing | View projects, read details, provide help |
| Basic Messaging | Send messages to project owners |
| Admin Dashboard | View users, projects, messages, CSV import |
| Training Requests | Community training requests/offerings |
| Stories/Awards | Community stories with voting |
| Roadmap Ideas | Public roadmap with voting |

### Current Models
```
User (id, name, email, password_digest, role, created_at)
Project (id, name, email, location, description, support_types, timeline, team_composition, user_id, created_at)
Message (id, content, project_id, user_id, created_at)
Story (id, title, content, author, votes, created_at)
RoadmapIdea (id, title, description, votes, created_at)
TrainingRequest (id, title, description, requester_name, votes, created_at)
TrainingOffering (id, title, description, provider_name, votes, created_at)
```

---

## Target State (To-Be) - MVP

### Multi-Tenant Architecture
All tables must include `tenant_id` or `account_id` for multi-tenancy support.

### Core Data Models

```
Account (id, name, slug, plan, config_json, created_at)
  - SaaS tenant: company/org using the platform
  - config_json: defines the matchmaking type, profile fields, matching rules
  - Plans: free, starter, professional, enterprise

MatchType (id, account_id, name_a, name_b, description)
  - Defines the two sides: "Influencer/Business", "Mentor/Mentee", etc.
  - Each MatchType has configurable profile fields

ProfileField (id, match_type_id, side, name, field_type, options, required, order)
  - side: 'a' or 'b'
  - field_type: text, number, select, multiselect, textarea, boolean
  - options: JSON array for select fields

User (id, account_id, match_type_id, side, name, email, password_digest, role, created_at)
  - side: 'a' or 'b' (based on what they're looking for)
  - role: admin, member

Profile (id, user_id, match_type_id, data_json, created_at)
  - Flexible profile data based on MatchType's ProfileFields
  - data_json stores all custom fields as key-value pairs

Match (id, account_id, match_type_id, user_a_id, user_b_id, score, status, created_at)
  - status: suggested, pending, accepted, rejected
  - score: algorithm match percentage

Conversation (id, account_id, match_id, created_at)

Message (id, conversation_id, sender_id, content, read_at, created_at)

Review (id, match_id, reviewer_id, reviewee_id, rating, feedback, created_at)
```

### MVP Features

#### Phase 1: Multi-Tenant Foundation & Match Types (Priority: High)
- [ ] Add Account model with configurable match types
- [ ] Add MatchType model (defines what sides A/B are called)
- [ ] Add ProfileField model (custom fields per match type)
- [ ] Add Profile model with flexible JSON data
- [ ] Update User model: add side (a/b), match_type_id
- [ ] Tenant context: set current_account on each request
- [ ] Super admin: can create/manage tenants

#### Phase 2: Profile Builder (Priority: High)
- [ ] Dynamic profile forms based on MatchType configuration
- [ ] Profile field types: text, number, select, multiselect, textarea
- [ ] Profile completion indicators
- [ ] Profile visibility settings

#### Phase 3: Discovery & Matching (Priority: High)
- [ ] Search across profile fields
- [ ] Filter by any profile field
- [ ] Basic matching algorithm based on field compatibility
- [ ] Match suggestions with compatibility scores
- [ ] Save favorites

#### Phase 4: Connection & Proposals (Priority: High)
- [ ] Connection requests
- [ ] Structured proposals (configurable fields)
- [ ] Accept/decline/modify workflow
- [ ] Connection history

#### Phase 5: Messaging System (Priority: High)
- [ ] Conversation threading
- [ ] Real-time messaging (ActionCable)
- [ ] Read receipts
- [ ] File attachments
- [ ] Notifications

#### Phase 6: Reviews & Feedback (Priority: Medium)
- [ ] Rating system (1-5 stars)
- [ ] Written feedback
- [ ] Display on profiles
- [ ] Report inappropriate reviews

#### Phase 7: Analytics & Admin (Priority: Medium)
- [ ] Tenant analytics dashboard
- [ ] User activity tracking
- [ ] Content moderation tools
- [ ] Export functionality

---

## Feature Priority Matrix

| Priority | Feature | Complexity | Est. Effort |
|----------|---------|------------|-------------|
| P0 | Multi-tenancy foundation | High | 2-3 days |
| P0 | Enhanced profiles | Medium | 2 days |
| P0 | Influencer search/discovery | Medium | 2-3 days |
| P1 | Proposal system | Medium | 2 days |
| P1 | Messaging with ActionCable | High | 3 days |
| P1 | Reviews/feedback | Low | 1 day |
| P2 | Analytics dashboards | Medium | 2-3 days |
| P2 | Admin tenant management | Medium | 2 days |

---

## Database Schema Changes Required

### New Tables
1. `accounts` - Tenant organizations
2. `match_types` - Defines the two sides (e.g., "Mentor/Mentee")
3. `profile_fields` - Configurable fields per match type
4. `profiles` - Flexible JSON profile data per user
5. `matches` - Suggested/pending/accepted connections
6. `conversations` - Message threads
7. `reviews` - Feedback/ratings

### Existing Tables to Modify
1. `users` - Add: account_id, match_type_id, side ('a'/'b')
2. `projects` - Add: account_id, match_type_id, side
3. `messages` - Add: conversation_id, read_at

---

## Technical Considerations

### Multi-Tenancy Strategy
- **Approach**: Row-level security with `account_id` foreign key
- **Default scope**: All queries scoped to current_account
- **Super admin**: Can access all tenants

### Authentication
- Current: Cookie-based session
- Keep: Sessions with account context
- Add: Invitation system for team members

### API Design
- RESTful endpoints
- All resources belong to an account
- Tenant identified via subdomain or header

---

## Action Items

### Immediate (This Sprint)
- [ ] Create Account model (tenants)
- [ ] Create MatchType model (defines A/B sides)
- [ ] Create ProfileField model (custom fields)
- [ ] Create Profile model (flexible JSON data)
- [ ] Update User to belong to Account and MatchType
- [ ] Set up tenant scoping in ApplicationController
- [ ] Create super admin for platform management

### Short-term (2-4 weeks)
- [ ] Build dynamic profile form builder
- [ ] Implement profile CRUD based on MatchType config
- [ ] Build discovery/search with dynamic filters
- [ ] Implement matching algorithm
- [ ] Build connection/proposal workflow

### Mid-term (1-2 months)
- [ ] Real-time messaging (ActionCable)
- [ ] Reviews system
- [ ] Analytics dashboards
- [ ] Admin tenant management

---

## Notes
- **Generic Matchmaking Engine**: The platform is designed to be use-case agnostic
- Each tenant configures their "MatchType" - defining what the two sides are called
- Profile fields are fully configurable per match type via ProfileField model
- Current mentorship features can be one "MatchType" (Mentor/Mentee)
- Influencer/Business can be another MatchType
- UI remains similar, but data model is flexible
