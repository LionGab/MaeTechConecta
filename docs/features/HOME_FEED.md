# Home Feed Feature Specification

## Overview
The Home Feed is the primary entry point for Nossa Maternidade users, providing a personalized stream of content from Nathalia Valente's social media, AI-powered recommendations, and community highlights.

## User Stories

### As a new mother, I want to:
- See daily tips and inspiration from Nathalia
- Get personalized recommendations based on my baby's age
- Quickly access my baby tracker
- Stay updated on new community posts
- Discover relevant content and products

## Component Structure

```
/dashboard/page.tsx (Home Feed)
├── feed-header.tsx
├── feed-filters.tsx
├── content-cards/
│   ├── social-media-card.tsx (Instagram/TikTok)
│   ├── ai-recommendation-card.tsx
│   ├── community-highlight-card.tsx
│   ├── product-spotlight-card.tsx
│   └── quick-action-card.tsx
├── feed-skeleton.tsx (loading state)
└── empty-feed-state.tsx
```

## Feature Details

### 1. Social Media Integration Cards

**Instagram Post Card**
```typescript
interface InstagramPost {
  id: string;
  caption: string;
  mediaUrl: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL';
  permalink: string;
  timestamp: Date;
  likeCount: number;
  commentsCount: number;
}
```

**Display Elements:**
- Author avatar (Nathalia's profile photo)
- Post timestamp (relative: "há 2 horas")
- Media (image/video with lazy loading)
- Caption (truncated with "Ver mais")
- Engagement metrics
- "Abrir no Instagram" CTA button

**TikTok Video Card**
```typescript
interface TikTokVideo {
  id: string;
  description: string;
  videoUrl: string;
  coverUrl: string;
  shareUrl: string;
  createTime: Date;
  likeCount: number;
  viewCount: number;
}
```

**Display Elements:**
- Video thumbnail with play button
- Video description
- View count
- "Assistir no TikTok" CTA button

### 2. AI-Powered Recommendations

**Recommendation Card**
```typescript
interface AIRecommendation {
  id: string;
  type: 'ARTICLE' | 'VIDEO' | 'TIP' | 'PRODUCT';
  title: string;
  description: string;
  thumbnailUrl: string;
  relevanceScore: number;
  reason: string; // "Baseado na idade do seu bebê"
  ctaText: string;
  ctaLink: string;
}
```

**Personalization Factors:**
- Baby age (0-3 months, 3-6 months, 6-12 months, etc.)
- Maternity stage (pregnant, new mom, experienced mom)
- Interests selected during onboarding
- Previous content engagement
- Time of day
- Seasonal relevance

**Example Recommendations:**
- "Dicas de sono para bebês de 3 meses" (baby is 3 months old)
- "Exercícios pós-parto seguros" (recent mother)
- "Looks confortáveis para mães" (fashion interest)

### 3. Community Highlights

**Featured Post Card**
```typescript
interface CommunityHighlight {
  postId: string;
  authorName: string;
  authorAvatar: string;
  groupName: string;
  content: string;
  imageUrls: string[];
  commentCount: number;
  likeCount: number;
  timestamp: Date;
  isTrending: boolean;
}
```

**Highlighting Criteria:**
- High engagement (likes + comments)
- Recent posts (within 24 hours)
- Posts from user's groups
- Posts matching user interests
- Moderated and approved content

### 4. Quick Actions

**Quick Action Cards:**
- **Log Feeding**: Direct link to baby tracker
- **Ask NathIA**: Open AI chatbot
- **Browse Store**: Navigate to Nava Beachwear
- **Join Discussion**: Latest active forum thread

---

*Feature Specification v1.0*  
*Last Updated: October 28, 2025*
