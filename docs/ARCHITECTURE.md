# Nossa Maternidade - Technical Architecture

## System Overview

Nossa Maternidade is built as a modern Progressive Web Application (PWA) using Next.js 15 with Firebase backend services. The architecture prioritizes scalability, performance, and user experience while maintaining security and data privacy compliance.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Browser    │  │   iOS PWA    │  │ Android PWA  │          │
│  │  (Desktop)   │  │              │  │              │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                  │                  │                  │
│         └──────────────────┴──────────────────┘                  │
│                            │                                     │
└────────────────────────────┼─────────────────────────────────────┘
                             │
                             │ HTTPS
                             │
┌────────────────────────────┼─────────────────────────────────────┐
│                   Next.js 15 Application                         │
│  ┌──────────────────────────────────────────────────────┐       │
│  │              App Router (React Server Components)     │       │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │       │
│  │  │   Pages    │  │  Layouts   │  │ Components │     │       │
│  │  └────────────┘  └────────────┘  └────────────┘     │       │
│  └──────────────────────────────────────────────────────┘       │
│  ┌──────────────────────────────────────────────────────┐       │
│  │              API Routes & Server Actions              │       │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │       │
│  │  │ Auth APIs  │  │  AI Flows  │  │ User APIs  │     │       │
│  │  └────────────┘  └────────────┘  └────────────┘     │       │
│  └──────────────────────────────────────────────────────┘       │
└────────────────────────────┼─────────────────────────────────────┘
                             │
                             │
┌────────────────────────────┼─────────────────────────────────────┐
│                      Firebase Services                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Firestore DB │  │  Firebase    │  │   Firebase   │          │
│  │              │  │     Auth     │  │   Storage    │          │
│  │  (NoSQL)     │  │ (Multi-Auth) │  │   (Media)    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Functions   │  │   Analytics  │  │   Hosting    │          │
│  │ (Serverless) │  │              │  │     (CDN)    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└────────────────────────────┼─────────────────────────────────────┘
                             │
                             │
┌────────────────────────────┼─────────────────────────────────────┐
│                   External Services & APIs                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Instagram   │  │   TikTok     │  │    Stripe    │          │
│  │  Graph API   │  │     API      │  │   Payments   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │Google Gemini │  │    OpenAI    │  │   AR SDK     │          │
│  │   (Genkit)   │  │   (Future)   │  │   (Future)   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└──────────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Frontend Architecture

#### Technology Stack
- **Framework**: Next.js 15.3.3 with App Router
- **Language**: TypeScript 5
- **UI Framework**: React 18.3.1
- **Styling**: Tailwind CSS 3.4.1
- **Component Library**: Radix UI (accessible primitives)
- **State Management**: React Context API + Firebase SDK

#### Key Features
- **Server Components**: Leverage React Server Components for performance
- **Client Components**: Strategic use for interactive features
- **PWA Support**: Offline capabilities and installability
- **Responsive Design**: Mobile-first approach
- **Code Splitting**: Automatic route-based splitting

#### Directory Structure
```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication routes
│   │   ├── page.tsx         # Login/Signup
│   │   └── layout.tsx       # Auth layout
│   ├── dashboard/           # Protected routes
│   │   ├── page.tsx         # Dashboard home
│   │   ├── forum/           # Community features
│   │   ├── content/         # Content library
│   │   ├── tracker/         # Baby tracker
│   │   ├── loja/            # Store
│   │   ├── profile/         # User profile
│   │   └── _components/     # Shared dashboard components
│   ├── api/                 # API routes
│   └── layout.tsx           # Root layout
├── components/              # Reusable components
│   ├── ui/                  # shadcn/ui components
│   └── shared/              # App-specific shared components
├── lib/                     # Utilities and helpers
├── hooks/                   # Custom React hooks
├── firebase/                # Firebase configuration
└── ai/                      # AI flows and configurations
```

### 2. Backend Architecture

#### Firebase Services

##### Firestore Database Structure
```
users/
├── {userId}/
│   ├── profile
│   ├── settings
│   └── subscriptions

posts/
├── {postId}/
│   ├── content
│   ├── authorId
│   ├── timestamp
│   └── metadata

groups/
├── {groupId}/
│   ├── name
│   ├── description
│   ├── members[]
│   └── posts[]

trackers/
├── {userId}/
│   ├── baby/
│   │   ├── feeding[]
│   │   ├── sleep[]
│   │   ├── diapers[]
│   │   └── milestones[]

content/
├── {contentId}/
│   ├── type (video/article)
│   ├── title
│   ├── description
│   ├── url
│   └── category

products/
├── {productId}/
│   ├── name
│   ├── price
│   ├── images[]
│   ├── category
│   └── affiliateLink

messages/
├── {conversationId}/
│   ├── participants[]
│   └── messages[]
```

##### Security Rules
```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User data - only accessible by owner
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Posts - read by all authenticated users, write by owner
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                            resource.data.authorId == request.auth.uid;
    }
    
    // Groups - members only
    match /groups/{groupId} {
      allow read: if request.auth != null && 
                   request.auth.uid in resource.data.members;
      allow write: if request.auth != null && 
                    request.auth.uid in resource.data.moderators;
    }
  }
}
```

##### Firebase Authentication
- **Providers**: 
  - Google OAuth
  - Apple Sign-In
  - Instagram/Facebook OAuth
  - Email/Password
- **Session Management**: Firebase SDK handles tokens
- **Security**: Server-side verification for all protected routes

##### Firebase Storage
- **User Uploads**: Profile photos, journal images
- **Content Media**: Videos, article images
- **Product Images**: Store catalog photos
- **Organization**: 
  ```
  users/{userId}/
  ├── profile/
  ├── journal/
  └── uploads/
  
  content/
  ├── videos/
  └── images/
  
  products/
  └── images/
  ```

### 3. AI Integration (Genkit)

#### AI Flows

##### 1. NathIA Chatbot
```typescript
// answer-common-questions.ts
Purpose: 24/7 support for common maternity questions
Input: User question + context (baby age, maternity stage)
Output: Personalized answer + related resources
Model: Google Gemini Pro
```

##### 2. Content Moderation
```typescript
// moderate-forum-content.ts
Purpose: Filter inappropriate content in forum
Input: Post content (text + images)
Output: Moderation decision (approve/flag/reject)
Model: Google Gemini with safety filters
```

##### 3. Personalized Recommendations
```typescript
// suggest-relevant-matches.ts
Purpose: Suggest connections and content
Input: User profile + preferences + activity
Output: Ranked recommendations
Model: Google Gemini with custom prompts
```

#### Genkit Configuration
```typescript
// ai/genkit.ts
import { genkit } from 'genkit';
import { googleGenAI } from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleGenAI()],
  model: 'googleai/gemini-pro',
  promptDir: './prompts',
});
```

### 4. API Integration Layer

#### Social Media APIs

##### Instagram Graph API
- **Purpose**: Fetch Nathalia's posts for home feed
- **Endpoints**:
  - `/me/media` - Get recent posts
  - `/media/{id}` - Get post details
- **Rate Limits**: 200 calls/hour
- **Caching**: Redis for 1-hour TTL

##### TikTok API
- **Purpose**: Fetch video content
- **Endpoints**:
  - `/user/videos` - Get user videos
  - `/video/info` - Get video details
- **Rate Limits**: 100 calls/minute
- **Caching**: Redis for 30-minute TTL

#### Payment Integration (Stripe)

```typescript
// Planned implementation
Stripe Checkout Session
├── Product selection
├── Customer creation
├── Payment processing
└── Webhook handling
```

### 5. Data Flow

#### User Registration Flow
```
1. User clicks "Continuar com Instagram"
2. OAuth redirect to Instagram
3. Instagram returns authorization code
4. Exchange code for access token
5. Fetch user profile from Instagram
6. Create Firebase user account
7. Store user data in Firestore
8. Generate session token
9. Redirect to dashboard
```

#### Content Personalization Flow
```
1. User opens home feed
2. Load user profile + preferences
3. Fetch recent Instagram/TikTok posts
4. Call AI recommendation API
5. Rank and filter content
6. Cache results (5 minutes)
7. Display personalized feed
8. Track engagement metrics
```

#### Baby Tracker Flow
```
1. User logs feeding/sleep/diaper
2. Validate input on client
3. Send to Firestore via API
4. Update local state optimistically
5. Firestore confirms write
6. Update analytics
7. Check for milestone triggers
8. Generate insights/tips
```

### 6. Performance Optimization

#### Caching Strategy
- **Static Assets**: CDN caching (1 year)
- **API Responses**: Redis cache (5-60 minutes)
- **Database Queries**: Firestore automatic caching
- **Images**: Next.js Image Optimization
- **Service Worker**: PWA offline caching

#### Loading Strategy
- **Critical CSS**: Inline in HTML
- **JavaScript**: Code splitting by route
- **Images**: Lazy loading with blur placeholder
- **Fonts**: Self-hosted with font-display: swap
- **Third-party Scripts**: Deferred loading

#### Performance Metrics
- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.5s
- **Cumulative Layout Shift (CLS)**: < 0.1

### 7. Security Architecture

#### Authentication & Authorization
- **Multi-factor Authentication**: Optional for users
- **Session Management**: Firebase SDK handles tokens
- **CSRF Protection**: Built into Next.js
- **Rate Limiting**: Firebase App Check
- **API Key Rotation**: Automated every 90 days

#### Data Protection
- **Encryption at Rest**: Firebase default encryption
- **Encryption in Transit**: HTTPS/TLS 1.3
- **Data Minimization**: Collect only necessary data
- **Data Retention**: Configurable per user
- **Right to Erasure**: LGPD/GDPR compliant deletion

#### Privacy Compliance
- **LGPD (Brazil)**: Full compliance
  - Consent management
  - Data portability
  - Deletion requests
  - Privacy policy
  
- **GDPR (EU)**: Full compliance
  - Cookie consent
  - Data processing agreements
  - DPO contact info
  - Privacy by design

### 8. Monitoring & Analytics

#### Firebase Analytics
- **User Events**: Page views, button clicks, form submissions
- **Custom Events**: Content engagement, tracker usage, store visits
- **User Properties**: Subscription tier, baby age, location
- **Conversion Tracking**: Subscription signups, purchases

#### Error Tracking
- **Client Errors**: Console.error monitoring
- **Server Errors**: Cloud Functions logs
- **Performance Issues**: Web Vitals tracking
- **User Feedback**: In-app bug reporting

#### Business Metrics
- **DAU/MAU**: Daily/Monthly Active Users
- **Retention**: D1, D7, D30 retention rates
- **Engagement**: Session duration, pages per session
- **Monetization**: Conversion rates, ARPU, LTV

### 9. Scalability Plan

#### Current Capacity
- **Firebase Spark Plan**: Free tier (development)
- **Expected Load**: 500k users in 6 months
- **Database Reads**: 50M/month estimated
- **Storage**: 100GB estimated

#### Scaling Strategy
```
Phase 1 (0-10k users): Firebase Spark Plan
Phase 2 (10k-100k users): Firebase Blaze Plan + Auto-scaling
Phase 3 (100k+ users): Multi-region deployment + CDN
Phase 4 (500k+ users): Database sharding + Read replicas
```

#### Load Balancing
- **Firebase Hosting**: Automatic load balancing
- **Cloud Functions**: Auto-scaling (0-1000 instances)
- **Firestore**: Automatic sharding and replication
- **CDN**: Cloudflare/Firebase CDN for static assets

### 10. Development Workflow

#### Environment Setup
```
Development: localhost:9002 + Firebase Emulator
Staging: staging.nossamaternidade.app + Firebase Staging
Production: nossamaternidade.app + Firebase Production
```

#### CI/CD Pipeline
```
1. Developer commits to feature branch
2. GitHub Actions runs:
   - Linting (ESLint)
   - Type checking (TypeScript)
   - Tests (Jest + Playwright)
   - Build verification
3. Create Pull Request
4. Code review + approval
5. Merge to main branch
6. Automatic deployment to staging
7. Manual promotion to production
```

#### Testing Strategy
- **Unit Tests**: Component logic (Jest)
- **Integration Tests**: API flows (Jest)
- **E2E Tests**: User flows (Playwright)
- **Performance Tests**: Lighthouse CI
- **Security Tests**: npm audit, Snyk

### 11. Disaster Recovery

#### Backup Strategy
- **Firestore**: Automatic daily backups
- **User Data**: Export capability
- **Code**: Git version control
- **Configurations**: Environment variables backup

#### Recovery Plan
- **RTO (Recovery Time Objective)**: 2 hours
- **RPO (Recovery Point Objective)**: 24 hours
- **Incident Response**: On-call rotation
- **Communication**: Status page + email alerts

### 12. Future Enhancements

#### Planned Features
- **AR Try-On**: Camera-based virtual try-on
- **Video Calls**: 1-on-1 expert consultations
- **Offline Mode**: Full PWA offline functionality
- **Push Notifications**: Real-time updates
- **Geolocation**: Local group discovery
- **Multi-language**: English, Spanish support

#### Technical Improvements
- **GraphQL API**: Replace REST for better performance
- **Edge Functions**: Deploy AI to edge for lower latency
- **Real-time Sync**: WebSocket for live chat
- **Advanced Analytics**: ML-powered insights
- **A/B Testing**: Feature flag system

---

## Deployment Architecture

### Production Environment

```
Domain: nossamaternidade.app
SSL/TLS: Automatic (Firebase Hosting)
CDN: Firebase CDN (Global)
DNS: Cloudflare
Monitoring: Firebase Performance Monitoring
```

### Infrastructure as Code

```yaml
# firebase.json
{
  "hosting": {
    "public": "out",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "X-Frame-Options",
            "value": "DENY"
          },
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          }
        ]
      }
    ]
  }
}
```

---

## Conclusion

This architecture provides a solid foundation for Nossa Maternidade, ensuring:
- **Scalability**: Handle 500k+ users
- **Performance**: Sub-3s load times
- **Security**: LGPD/GDPR compliant
- **Reliability**: 99.9% uptime target
- **Maintainability**: Clean code structure
- **Extensibility**: Easy feature additions

The combination of Next.js, Firebase, and Genkit AI creates a modern, performant, and intelligent application that can grow with Nathalia Valente's community.

---

*Document Version: 1.0*  
*Last Updated: October 28, 2025*  
*Author: MaeTech Technical Team*
