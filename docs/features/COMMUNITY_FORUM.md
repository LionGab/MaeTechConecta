# Community Forum Feature Specification

## Overview
The Community Forum provides thematic groups where mothers can connect, share experiences, ask questions, and support each other through their maternity journey.

## Thematic Groups

### 1. Gestantes Iniciantes (New Pregnant Women)
**Target Audience**: First-time pregnant women, first trimester
**Topics**:
- Pregnancy symptoms and concerns
- Prenatal care and checkups
- Preparing for baby's arrival
- Emotional changes
- Partner involvement

### 2. Mães de Bebês 0-6 Meses (Mothers of 0-6 Month Babies)
**Target Audience**: New mothers with newborns and young infants
**Topics**:
- Breastfeeding challenges
- Sleep schedules and sleep training
- Postpartum recovery
- Baby development milestones
- Colic and crying management

### 3. Moda Maternidade (Maternity Fashion)
**Target Audience**: All mothers interested in style and fashion
**Topics**:
- Mother-baby matching outfits
- Comfortable yet stylish clothing
- Postpartum body confidence
- Beachwear and swimwear
- Budget-friendly fashion tips

## Component Structure

```
/dashboard/forum/
├── page.tsx (Forum home)
├── [groupId]/
│   ├── page.tsx (Group view)
│   ├── [postId]/
│   │   └── page.tsx (Post detail)
├── _components/
│   ├── group-card.tsx
│   ├── group-list.tsx
│   ├── post-card.tsx
│   ├── post-form.tsx
│   ├── comment-section.tsx
│   ├── moderation-tools.tsx
│   └── chat-interface.tsx
```

## Features

### Post Creation
```typescript
interface ForumPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  groupId: string;
  title: string;
  content: string;
  images: string[]; // max 5
  tags: string[];
  timestamp: Date;
  likes: string[]; // user IDs
  comments: Comment[];
  isModerated: boolean;
  isPinned: boolean;
}
```

**Form Fields:**
- Title (required, max 100 chars)
- Content (required, max 3000 chars, rich text)
- Images (optional, max 5, 5MB each)
- Tags (optional, max 5)
- Group selection (required)

### Comment System
```typescript
interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  timestamp: Date;
  likes: string[];
  replies: Reply[]; // 1 level deep only
}
```

### Private Messaging
```typescript
interface Conversation {
  id: string;
  participants: string[]; // max 2 for MVP
  messages: Message[];
  lastMessage: Date;
  unreadCount: number;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}
```

### Moderation Features

**AI-Powered Content Filtering:**
- Inappropriate language detection
- Spam detection
- Harmful content flagging
- Medical misinformation alerts

**Manual Moderation:**
- User reporting system
- Review queue for moderators
- Ban/suspend users
- Delete/hide posts
- Pin important posts

**Moderation Actions:**
```typescript
enum ModerationAction {
  APPROVE = 'approve',
  FLAG = 'flag',
  REMOVE = 'remove',
  BAN_USER = 'ban_user',
  PIN = 'pin',
}
```

## Local Groups

### Location-Based Discovery
```typescript
interface LocalGroup {
  id: string;
  city: string;
  state: string;
  memberCount: number;
  description: string;
  meetupSchedule?: MeetupEvent[];
}
```

**Features:**
- Automatic location detection (with permission)
- Manual city selection
- Group discovery by proximity
- Meetup event coordination
- Local resource sharing

## User Interactions

### Engagement Actions
- **Like**: Heart button (double-tap on mobile)
- **Comment**: Reply to post
- **Share**: Share to other groups or external
- **Save**: Bookmark for later
- **Report**: Flag inappropriate content
- **Follow**: Subscribe to post updates

### Notifications
- New comment on your post
- Reply to your comment
- Someone mentioned you
- Post from followed topics
- Meetup event reminder

## Safety & Guidelines

### Community Guidelines
1. **Be Respectful**: No personal attacks or harassment
2. **No Medical Advice**: Share experiences, not diagnoses
3. **Privacy First**: Don't share others' personal info
4. **No Spam**: No excessive self-promotion
5. **Portuguese Only**: Primary language is PT-BR

### Content Restrictions
- No hate speech or discrimination
- No explicit content
- No selling/advertising (except in designated areas)
- No medical misinformation
- No political or religious debates

## Analytics

**Track:**
- `post_created`: New post submitted
- `post_viewed`: Post opened
- `post_liked`: Like action
- `comment_posted`: Comment submitted
- `user_reported`: Report submitted
- `group_joined`: User joins group
- `conversation_started`: DM initiated

---

*Feature Specification v1.0*  
*Last Updated: October 28, 2025*
