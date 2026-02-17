# README

# Mentorship Matchmaker — Technical Roadmap

This repository contains work for the Mentorship Matchmaker platform — a configurable, multi-tenant matchmaking engine that can connect any two sides (mentor/mentee, influencer/business, employer/job seeker, etc.).

## Project Overview
- Type: SaaS Platform (Multi-tenant)
- Core concept: Configurable matchmaking per tenant via MatchType and ProfileField configuration
- Target users: tenant admins and end users (side A / side B)

## Current State (Implemented)
- Basic user auth (email/password)
- Project submission & browsing
- Messaging (basic)
- Admin dashboard with CSV imports
- Training requests / offerings
- Stories & roadmap ideas with voting

## Target State (MVP Highlights)
- Multi-tenant foundation (Account model, tenant scoping)
- Configurable MatchType and ProfileField models
- Flexible Profile model using JSON for custom fields
- Discovery & matching: search, filters, basic matching algorithm
- Connection/proposal workflow and messaging (ActionCable later)

## Short Roadmap (Prioritized)
1. Multi-tenant foundation & match types (High)
	- Account, MatchType, ProfileField, Profile models
	- Update User to include `account_id`, `match_type_id`, `side`
2. Profile builder (High)
	- Dynamic forms from ProfileField configuration
3. Discovery & matching (High)
	- Search across profile fields, filters, scoring
4. Connection proposals & messaging (High)
5. Reviews, analytics, tenant admin (Medium)

## Immediate Action Items (This Sprint)
- Create `accounts`, `match_types`, `profile_fields`, `profiles` tables
- Update `users` with tenant and match_type references
- Implement tenant scoping in `ApplicationController`
- Add super-admin UI for tenant management

## Development & Contributing
1. Setup (Rails app):
```bash
git clone <repo>
bundle install
bin/rails db:create db:migrate
bin/rails server
```
2. Run tests (if present):
```bash
bin/rails test
```
3. Feature work: branch off `main`, open PR, include migrations and model tests.

## Notes
- Design the platform to be data-model driven: UI and matching behaviors should derive from MatchType and ProfileField configuration per tenant.
- Use row-level tenant scoping (foreign keys + default scopes) and a `current_account` context to isolate tenant data.

---
If you'd like, I can now:
- create the initial migrations/models for `Account`, `MatchType`, `ProfileField`, and `Profile`, or
- update `ApplicationController` with tenant scoping scaffolding.
Which should I do next?
