# API Integration Guide - Nossa Maternidade

## Overview
This guide details all external API integrations required for the Nossa Maternidade app, including setup instructions, authentication, rate limits, and best practices.

## 1. Instagram Graph API

### Purpose
Fetch Nathalia Valente's Instagram posts to display in the home feed.

### Setup

#### Step 1: Create Facebook App
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create new app
3. Select "Business" type
4. Add Instagram Graph API product

#### Step 2: Configure Permissions
Required permissions:
- `instagram_basic`
- `pages_read_engagement`
- `pages_show_list`

#### Step 3: Get Access Token
```bash
# Get short-lived token via OAuth
# Then exchange for long-lived token (60 days)

curl -i -X GET "https://graph.facebook.com/v18.0/oauth/access_token
  ?grant_type=fb_exchange_token
  &client_id={app-id}
  &client_secret={app-secret}
  &fb_exchange_token={short-lived-token}"
```

### Implementation

#### Fetch Instagram Posts
```typescript
// lib/instagram-api.ts

interface InstagramPost {
  id: string;
  caption: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  permalink: string;
  timestamp: string;
  like_count: number;
  comments_count: number;
}

export async function getInstagramPosts(
  accessToken: string,
  limit: number = 10
): Promise<InstagramPost[]> {
  const fields = 'id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count';
  
  const response = await fetch(
    `https://graph.instagram.com/me/media?fields=${fields}&limit=${limit}&access_token=${accessToken}`
  );
  
  if (!response.ok) {
    throw new Error(`Instagram API error: ${response.status}`);
  }
  
  const data = await response.json();
  return data.data;
}
```

#### Caching Strategy
```typescript
// lib/cache.ts
import { unstable_cache } from 'next/cache';

export const getCachedInstagramPosts = unstable_cache(
  async (accessToken: string) => {
    return await getInstagramPosts(accessToken);
  },
  ['instagram-posts'],
  {
    revalidate: 3600, // 1 hour
    tags: ['instagram'],
  }
);
```

### Rate Limits
- **200 calls/hour per user**
- **200 calls/hour per app**

### Error Handling
```typescript
export class InstagramAPIError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number
  ) {
    super(message);
    this.name = 'InstagramAPIError';
  }
}

// Handle common errors
try {
  const posts = await getInstagramPosts(token);
} catch (error) {
  if (error instanceof InstagramAPIError) {
    switch (error.code) {
      case 'OAuthException':
        // Token expired - need re-authentication
        await refreshAccessToken();
        break;
      case 'API_EC_RATE_LIMIT':
        // Rate limit exceeded - use cached data
        return getCachedPosts();
      default:
        console.error('Instagram API error:', error);
    }
  }
}
```

### Environment Variables
```bash
# .env.local
INSTAGRAM_ACCESS_TOKEN=your_long_lived_token
INSTAGRAM_USER_ID=nathalia_valente_user_id
```

---

## 2. TikTok API

### Purpose
Fetch Nathalia's TikTok videos for home feed.

### Setup

#### Note on Availability
As of October 2025, TikTok API access is limited and requires business account approval. 

**Alternative Approach:**
1. Manual content curation
2. Use TikTok embed URLs
3. Store video metadata in Firebase

#### Embed Approach (Recommended for MVP)
```typescript
interface TikTokVideo {
  id: string;
  embedUrl: string; // https://www.tiktok.com/embed/v2/video_id
  description: string;
  thumbnailUrl: string;
  publishedAt: Date;
}

// Manually curate and add to Firebase
async function addTikTokVideo(video: TikTokVideo) {
  await db.collection('tiktok_videos').add(video);
}
```

### Display in App
```tsx
// components/tiktok-embed.tsx
export function TikTokEmbed({ videoId }: { videoId: string }) {
  return (
    <iframe
      src={`https://www.tiktok.com/embed/v2/${videoId}`}
      width="100%"
      height="740"
      frameBorder="0"
      allow="encrypted-media;"
      sandbox="allow-same-origin allow-scripts"
    />
  );
}
```

---

## 3. Google Gemini AI (via Genkit)

### Purpose
Power NathIA chatbot, content moderation, and personalized recommendations.

### Setup

#### Step 1: Get API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create new API key
3. Enable Gemini Pro API

#### Step 2: Configure Genkit
```typescript
// src/ai/genkit.ts
import { genkit } from 'genkit';
import { googleGenAI } from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleGenAI({
      apiKey: process.env.GOOGLE_AI_API_KEY,
    }),
  ],
  model: 'googleai/gemini-pro',
});
```

### Implementation

#### NathIA Chatbot
```typescript
// src/ai/flows/answer-common-questions.ts
export const answerQuestion = ai.defineFlow(
  {
    name: 'answerMaternityQuestion',
    inputSchema: z.object({
      question: z.string(),
      context: z.object({
        babyAge: z.number().optional(),
        maternityStage: z.string(),
      }),
    }),
  },
  async (input) => {
    const prompt = `
Context: Baby age ${input.context.babyAge} months
Question: ${input.question}

Provide helpful, empathetic advice in Portuguese (PT-BR).
`;

    const response = await ai.generate({
      model: 'googleai/gemini-pro',
      prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 500,
      },
    });

    return response.text;
  }
);
```

#### Content Moderation
```typescript
// src/ai/flows/moderate-forum-content.ts
export const moderateContent = ai.defineFlow(
  {
    name: 'moderateForumContent',
    inputSchema: z.object({
      content: z.string(),
    }),
  },
  async (input) => {
    const prompt = `
Analyze this forum post for inappropriate content:
${input.content}

Check for:
- Hate speech
- Spam
- Medical misinformation
- Explicit content

Return JSON: { isAppropriate: boolean, reason: string }
`;

    const response = await ai.generate({
      model: 'googleai/gemini-pro',
      prompt,
      output: { format: 'json' },
    });

    return JSON.parse(response.text);
  }
);
```

### Rate Limits
- **Gemini Pro**: 60 requests/minute (free tier)
- **Gemini Pro**: 1,500 requests/day (free tier)

### Cost Management
```typescript
// Track usage
export async function generateWithTracking(prompt: string) {
  const startTime = Date.now();
  const response = await ai.generate({ prompt });
  const duration = Date.now() - startTime;
  
  // Log to analytics
  await logAIUsage({
    model: 'gemini-pro',
    tokensUsed: response.usage?.totalTokens,
    duration,
    cost: calculateCost(response.usage?.totalTokens),
  });
  
  return response;
}
```

### Environment Variables
```bash
# .env.local
GOOGLE_AI_API_KEY=your_gemini_api_key
```

---

## 4. Stripe Payment Gateway

### Purpose
Process payments for premium subscriptions and store purchases.

### Setup

#### Step 1: Create Stripe Account
1. Sign up at [stripe.com](https://stripe.com/)
2. Complete business verification
3. Enable Brazilian payment methods

#### Step 2: Get API Keys
```bash
# Test mode
STRIPE_PUBLISHABLE_KEY_TEST=pk_test_...
STRIPE_SECRET_KEY_TEST=sk_test_...

# Production mode
STRIPE_PUBLISHABLE_KEY_LIVE=pk_live_...
STRIPE_SECRET_KEY_LIVE=sk_live_...
```

### Implementation

#### Create Checkout Session
```typescript
// app/api/create-checkout/route.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: Request) {
  const { priceId, userId } = await request.json();
  
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing?canceled=true`,
    client_reference_id: userId,
    locale: 'pt-BR',
  });
  
  return Response.json({ sessionId: session.id });
}
```

#### Handle Webhooks
```typescript
// app/api/webhooks/stripe/route.ts
export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;
  
  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
  
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object);
      break;
    case 'customer.subscription.deleted':
      await handleSubscriptionCanceled(event.data.object);
      break;
  }
  
  return Response.json({ received: true });
}
```

### Brazilian Payment Methods
Enable in Stripe Dashboard:
- Credit cards (Visa, Mastercard)
- Boleto bancário
- PIX (instant payment)

### Rate Limits
No strict rate limits, but implement:
- Request debouncing
- Idempotency keys
- Webhook signature verification

### Environment Variables
```bash
STRIPE_SECRET_KEY=sk_test_or_live_key
STRIPE_PUBLISHABLE_KEY=pk_test_or_live_key
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 5. Firebase Services

### Already Configured ✅
- Firestore Database
- Firebase Authentication
- Firebase Storage
- Firebase Hosting

### Additional Setup Needed

#### Firebase Cloud Messaging (Push Notifications)
```typescript
// lib/firebase/messaging.ts
import { getMessaging, getToken } from 'firebase/messaging';

export async function requestNotificationPermission() {
  const messaging = getMessaging();
  
  try {
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });
    
    // Save token to Firestore
    await saveNotificationToken(token);
    
    return token;
  } catch (error) {
    console.error('Error getting notification permission:', error);
    return null;
  }
}
```

---

## Security Best Practices

### 1. API Key Storage
- ✅ Store in environment variables
- ✅ Never commit to Git
- ✅ Use different keys for dev/prod
- ✅ Rotate keys quarterly

### 2. Request Authentication
```typescript
// middleware.ts
export function verifyAPIRequest(request: Request) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Unauthorized');
  }
  
  const token = authHeader.substring(7);
  return verifyFirebaseToken(token);
}
```

### 3. Rate Limiting
```typescript
// lib/rate-limit.ts
export async function rateLimit(userId: string, limit: number = 10) {
  const key = `rate_limit:${userId}`;
  const count = await redis.incr(key);
  
  if (count === 1) {
    await redis.expire(key, 60); // 1 minute window
  }
  
  if (count > limit) {
    throw new Error('Rate limit exceeded');
  }
}
```

---

## Monitoring & Debugging

### Log API Calls
```typescript
export async function logAPICall(api: string, status: string) {
  await db.collection('api_logs').add({
    api,
    status,
    timestamp: new Date(),
    environment: process.env.NODE_ENV,
  });
}
```

### Error Tracking
Use Sentry or similar:
```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.captureException(error, {
  tags: { api: 'instagram' },
  extra: { userId, endpoint },
});
```

---

*Integration Guide v1.0*  
*Last Updated: October 28, 2025*
