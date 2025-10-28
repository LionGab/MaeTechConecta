# Quick Start Guide - Nossa Maternidade

## For Developers Starting the Project

This guide will get you from zero to running the app locally in under 10 minutes.

---

## Prerequisites

Make sure you have installed:
- **Node.js** 20+ ([download](https://nodejs.org/))
- **npm** or **yarn**
- **Git**
- **Code editor** (VS Code recommended)

---

## Step 1: Clone & Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/LionGab/MaeTechConecta.git
cd MaeTechConecta

# Note: The repository is named 'MaeTechConecta' (original name)
# but the app is branded as 'Nossa Maternidade' (new branding).
# This is intentional to maintain Git history and avoid breaking existing links.

# Install dependencies
npm install
```

---

## Step 2: Environment Setup (3 minutes)

Create a `.env.local` file in the root directory:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google Gemini AI (for NathIA chatbot)
GOOGLE_AI_API_KEY=your_gemini_api_key

# Instagram API (optional for MVP)
INSTAGRAM_ACCESS_TOKEN=your_instagram_token
INSTAGRAM_USER_ID=nathalia_valente_user_id

# Stripe (optional for MVP - use test keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### Where to get these keys:

**Firebase** (required):
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing
3. Go to Project Settings → General
4. Scroll to "Your apps" → Web app
5. Copy configuration values

**Google Gemini AI** (required for NathIA):
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key

**Instagram API** (optional for MVP):
1. See [API Integration Guide](./docs/API_INTEGRATION_GUIDE.md#1-instagram-graph-api)
2. Can use mock data initially

**Stripe** (optional for MVP):
1. Sign up at [stripe.com](https://stripe.com/)
2. Use test mode keys initially

---

## Step 3: Run Development Server (1 minute)

```bash
# Start the development server
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser.

**Note**: The dev server runs on port 9002 (not the default 3000) to avoid conflicts with other development projects. This is configured in `package.json` with the `-p 9002` flag.

You should see the Nossa Maternidade login page with:
- Ocean blue branding
- "Nossa Maternidade" title
- Social login buttons (Google, Apple, Instagram)
- Email/password tabs

---

## Step 4: Test Authentication (2 minutes)

### Using Email/Password:
1. Click "Criar Conta" tab
2. Fill in name, email, password
3. Click "Criar Conta"
4. You'll be redirected to `/dashboard`

### Using Google (if configured):
1. Click "Continuar com Google"
2. Complete Google OAuth flow
3. You'll be redirected to `/dashboard`

---

## Step 5: Explore the Dashboard (2 minutes)

After login, you'll see:
- **Home Dashboard**: Welcome message, NathIA chatbot, featured content
- **Bottom Navigation**: Home, Comunidade, Conteúdo, Perfil
- **Header**: Notifications, settings, user menu

### Current Working Features:
✅ Authentication (Google, Email/Password)  
✅ Dashboard layout  
✅ Navigation  
✅ NathIA chatbot (if Gemini API key configured)  
✅ Forum structure  
✅ Content library  
✅ Basic profile  

### Features Needing Implementation:
⏳ Instagram feed integration  
⏳ Baby tracker full functionality  
⏳ Store/shopping cart  
⏳ Full forum features  
⏳ Payment integration  

---

## Project Structure

```
MaeTechConecta/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── page.tsx         # Login page (updated branding ✅)
│   │   ├── dashboard/       # Protected routes
│   │   │   ├── page.tsx     # Dashboard home
│   │   │   ├── forum/       # Community features
│   │   │   ├── content/     # Content library
│   │   │   ├── loja/        # Store
│   │   │   └── profile/     # User profile
│   │   └── globals.css      # Global styles (updated theme ✅)
│   ├── components/          # Reusable components
│   │   └── ui/              # shadcn/ui components
│   ├── firebase/            # Firebase config & helpers
│   ├── ai/                  # Genkit AI flows
│   ├── hooks/               # Custom React hooks
│   └── lib/                 # Utilities
├── public/                  # Static assets
│   └── manifest.json        # PWA manifest (updated ✅)
├── docs/                    # Documentation (NEW! ✅)
│   ├── NOSSA_MATERNIDADE_MVP.md
│   ├── ARCHITECTURE.md
│   ├── LAUNCH_TIMELINE.md
│   ├── API_INTEGRATION_GUIDE.md
│   ├── IMPLEMENTATION_SUMMARY.md
│   └── features/            # Feature specifications
└── package.json             # Dependencies (updated name ✅)
```

---

## Available Scripts

```bash
# Development
npm run dev              # Start dev server (port 9002)
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run typecheck        # Run TypeScript compiler

# AI Development
npm run genkit:dev       # Start Genkit AI development
npm run genkit:watch     # Start Genkit with watch mode
```

---

## Common Issues & Solutions

### Issue: "Firebase not configured"
**Solution**: Make sure `.env.local` exists with Firebase credentials

### Issue: "Port 9002 already in use"
**Solution**: Kill the process or change port in `package.json`

### Issue: "NathIA not responding"
**Solution**: Check that `GOOGLE_AI_API_KEY` is set in `.env.local`

### Issue: "Instagram feed shows mock data"
**Solution**: This is expected for MVP. See API Integration Guide to connect real Instagram

### Issue: TypeScript errors on build
**Solution**: The project currently has `ignoreBuildErrors: true` in `next.config.ts` for rapid prototyping. This is a temporary setting that should be removed before production deployment. TypeScript errors should be addressed incrementally during Week 4 (Testing & Refinement phase) of the launch timeline. For now, use `npm run typecheck` to see all TypeScript issues without blocking development.

---

## Next Steps for Development

### Week 2 Sprint Tasks (Current):
1. **Home Feed Implementation**
   - [ ] Create feed component structure
   - [ ] Connect Instagram API (or use mock data)
   - [ ] Implement AI recommendations
   - [ ] Add pull-to-refresh

2. **Baby Tracker Enhancement**
   - [ ] Complete feeding log interface
   - [ ] Add sleep timer functionality
   - [ ] Implement data visualization
   - [ ] Create export functionality

3. **Community Forum**
   - [ ] Build post creation form
   - [ ] Implement comment system
   - [ ] Add image upload
   - [ ] Set up moderation flow

### Priority Features:
1. 🔥 **High**: Instagram feed integration
2. 🔥 **High**: Baby tracker full functionality
3. 🔥 **High**: Forum post creation
4. 🟡 **Medium**: Store catalog
5. 🟡 **Medium**: Payment integration
6. 🟢 **Low**: AR try-on

---

## Documentation to Read

### Essential (Read First):
1. **[IMPLEMENTATION_SUMMARY.md](./docs/IMPLEMENTATION_SUMMARY.md)** - Overall project overview
2. **[NOSSA_MATERNIDADE_MVP.md](./docs/NOSSA_MATERNIDADE_MVP.md)** - Complete feature specifications
3. **[LAUNCH_TIMELINE.md](./docs/LAUNCH_TIMELINE.md)** - 6-week roadmap

### Technical (Read When Implementing):
4. **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - System design and infrastructure
5. **[API_INTEGRATION_GUIDE.md](./docs/API_INTEGRATION_GUIDE.md)** - API setup instructions

### Feature-Specific (Read When Working On Feature):
6. **[HOME_FEED.md](./docs/features/HOME_FEED.md)** - Home feed specifications
7. **[COMMUNITY_FORUM.md](./docs/features/COMMUNITY_FORUM.md)** - Forum features
8. **[BABY_TRACKER.md](./docs/features/BABY_TRACKER.md)** - Tracker specifications
9. **[AI_CHATBOT.md](./docs/features/AI_CHATBOT.md)** - NathIA implementation

---

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/home-feed-integration

# Make changes and commit
git add .
git commit -m "feat: implement Instagram feed integration"

# Push to remote
git push origin feature/home-feed-integration

# Create pull request on GitHub
```

### Commit Message Convention:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Formatting, styling
- `refactor:` Code restructuring
- `test:` Adding tests
- `chore:` Maintenance tasks

---

## Testing

Currently, there are no automated tests (as noted in technical audit).

### Manual Testing Checklist:
- [ ] Login with email/password
- [ ] Login with Google
- [ ] Navigate to dashboard
- [ ] Test NathIA chatbot
- [ ] Browse forum
- [ ] Check responsive design (mobile, tablet, desktop)
- [ ] Test PWA installation

### Planned Testing (Week 4):
- Unit tests: Jest + React Testing Library
- E2E tests: Playwright
- Performance tests: Lighthouse CI

---

## Getting Help

### Resources:
- **Documentation**: `/docs` directory
- **Technical Issues**: Check ARCHITECTURE.md
- **Feature Questions**: Check feature specs in `/docs/features`
- **API Issues**: Check API_INTEGRATION_GUIDE.md

### Contacts:
- **Project Manager**: [To be assigned]
- **Lead Developer**: [To be assigned]
- **Stakeholder**: Nathalia Valente

### Daily Standup:
- **When**: Every day at 10:00 AM (Brazil time)
- **Duration**: 15 minutes
- **Format**: What I did yesterday, what I'll do today, any blockers

---

## Success Criteria

You're ready to start development when you can:
- ✅ Run `npm run dev` successfully
- ✅ See the login page with correct branding
- ✅ Create an account and reach the dashboard
- ✅ Navigate between different pages
- ✅ Understand the project structure
- ✅ Know where to find documentation

---

## Quick Reference Commands

```bash
# Install dependencies
npm install

# Start development
npm run dev

# Build for production
npm run build

# Type checking
npm run typecheck

# View documentation
ls docs/

# Check git status
git status
```

---

**Welcome to Nossa Maternidade! 🌊👶💙**

Let's build something amazing that will empower Brazilian mothers! If you have any questions, check the comprehensive documentation in the `/docs` folder or reach out to the team.

---

*Quick Start Guide v1.0*  
*Last Updated: October 28, 2025*  
*Status: Ready for Development*
