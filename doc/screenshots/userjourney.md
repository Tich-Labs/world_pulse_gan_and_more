# User Journey - World Pulse WP+ App

## Overview
WP+ is a platform connecting women in tech through mentorship, projects, training, and community.

---

## Pages & User Journey

### 1. Landing Page (Home)
**Route:** `/` (root)
- Hero section with call-to-action
- Navigation bar with links to all sections
- Overview of platform features

### 2. Sign Up / Sign In
**Routes:**
- Sign Up: `/users/new`
- Sign In: `/session/new`

**Journey:** User clicks "Join Now" or "Sign In" from navbar

---

### 3. Before Profile
**Route:** `/before_profile`
- Pre-profile landing page
- Explains the onboarding process
- Call-to-action to complete profile

---

### 4. Profile
**Route:** `/profile`
- User's personal profile page
- Editable user details
- Links to other sections

---

### 5. After Profile
**Route:** `/after_profile`
- Post-profile welcome/redirect page
- Guides users to next steps after profile completion

---

### 6. Matchmaking
**Route:** `/matchmaking`
- Mentorship matching system
- Connect with mentors/mentees

---

### 7. Messaging
**Route:** `/messaging`
- Internal messaging system
- Communication between users

---

### 8. Training
**Route:** `/training`
- Training requests and offerings
- Skill development opportunities
- Vote on training topics

---

### 9. Roadmap
**Route:** `/roadmap`
- Feature voting/roadmap
- Community-driven priorities

---

### 10. Awards
**Route:** `/awards`
- Awards and recognition
- Success stories section

---

### 11. Documentation
**Route:** `/documentation`
- Help docs and guides
- Platform information

---

## Navigation Flow

```
Home
├── Sign Up → Profile Setup → After Profile
├── Sign In
├── Matchmaking (requires auth)
├── Messaging (requires auth)
├── Training (requires auth)
├── Roadmap
├── Awards
└── Documentation
```

---

## Screenshots Required

1. `01-home.png` - Landing page
2. `02-signup.png` - Sign up form
3. `03-signin.png` - Sign in form
4. `04-before-profile.png` - Pre-profile page
5. `05-profile.png` - User profile
6. `06-after-profile.png` - Post-profile page
7. `07-matchmaking.png` - Matchmaking page
8. `08-messaging.png` - Messaging page
9. `09-training.png` - Training page
10. `10-roadmap.png` - Roadmap page
11. `11-awards.png` - Awards page
12. `12-documentation.png` - Documentation page
