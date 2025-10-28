# Baby Tracker Feature Specification

## Overview
The Baby Tracker provides parents with tools to monitor and record their baby's daily activities, including feeding, sleeping, diaper changes, and developmental milestones.

## Component Structure

```
/dashboard/tracker/
├── page.tsx (Tracker home dashboard)
├── feeding/
│   ├── page.tsx (Feeding log)
│   └── _components/
│       ├── feeding-form.tsx
│       ├── feeding-list.tsx
│       └── feeding-chart.tsx
├── sleep/
│   ├── page.tsx (Sleep log)
│   └── _components/
│       ├── sleep-timer.tsx
│       ├── sleep-list.tsx
│       └── sleep-chart.tsx
├── diapers/
│   ├── page.tsx (Diaper log)
│   └── _components/
│       ├── diaper-form.tsx
│       └── diaper-stats.tsx
├── milestones/
│   ├── page.tsx (Milestone tracker)
│   └── _components/
│       ├── milestone-list.tsx
│       ├── milestone-card.tsx
│       └── vaccination-reminder.tsx
```

## Features

### 1. Feeding Tracker

```typescript
interface FeedingEntry {
  id: string;
  userId: string;
  babyId: string;
  timestamp: Date;
  type: 'BREAST_LEFT' | 'BREAST_RIGHT' | 'BOTH_BREASTS' | 'BOTTLE' | 'SOLID';
  duration?: number; // minutes
  amount?: number; // ml for bottle/solid
  notes?: string;
}
```

**Quick Log Features:**
- One-tap buttons: "Left Breast", "Right Breast", "Bottle"
- Timer for breastfeeding duration
- Manual entry for amount (bottle feeding)
- Notes field for observations

**Insights:**
- Average feeding intervals
- Total daily feeding time
- Feeding patterns chart
- Reminders for next feeding

**Visualizations:**
- Daily feeding timeline
- Weekly feeding frequency chart
- Growth correlation chart

### 2. Sleep Tracker

```typescript
interface SleepEntry {
  id: string;
  userId: string;
  babyId: string;
  startTime: Date;
  endTime?: Date; // null if currently sleeping
  duration?: number; // minutes
  sleepType: 'NAP' | 'NIGHT_SLEEP';
  location: 'CRIB' | 'BED' | 'STROLLER' | 'OTHER';
  quality?: 'RESTFUL' | 'RESTLESS' | 'INTERRUPTED';
  notes?: string;
}
```

**Quick Log Features:**
- "Start Sleep" / "End Sleep" timer
- Quick nap timer (15min, 30min, 1hr presets)
- Manual time entry
- Sleep location selection
- Quality rating

**Insights:**
- Total sleep per day
- Day vs night sleep ratio
- Average nap duration
- Longest sleep stretch
- Sleep schedule recommendations

**Visualizations:**
- 24-hour sleep timeline
- Weekly sleep pattern chart
- Sleep quality trends

### 3. Diaper Tracker

```typescript
interface DiaperEntry {
  id: string;
  userId: string;
  babyId: string;
  timestamp: Date;
  type: 'WET' | 'DIRTY' | 'BOTH' | 'DRY';
  consistency?: 'SOFT' | 'NORMAL' | 'HARD' | 'LOOSE';
  color?: string;
  rash?: boolean;
  notes?: string;
}
```

**Quick Log Features:**
- One-tap buttons: "Wet", "Dirty", "Both"
- Quick entry form
- Rash indicator checkbox
- Photo upload (optional)

**Insights:**
- Daily diaper count
- Wet vs dirty ratio
- Diaper change patterns
- Health indicators
- Diaper supply tracker

**Visualizations:**
- Daily diaper summary
- Weekly pattern chart
- Health trend indicators

### 4. Milestone Tracker

```typescript
interface Milestone {
  id: string;
  category: 'PHYSICAL' | 'COGNITIVE' | 'SOCIAL' | 'LANGUAGE';
  ageRange: string; // "0-3 months"
  title: string;
  description: string;
  achieved: boolean;
  achievedDate?: Date;
}

interface VaccinationRecord {
  id: string;
  vaccineName: string;
  scheduledDate: Date;
  administeredDate?: Date;
  nextDoseDate?: Date;
  notes?: string;
}
```

**Developmental Milestones:**
- Predefined milestone checklist by age
- Custom milestone creation
- Photo/video attachment
- Celebratory animations on achievement

**Age Ranges:**
- 0-3 months: First smile, head control, tracking objects
- 3-6 months: Rolling over, reaching for objects, babbling
- 6-9 months: Sitting up, crawling, first foods
- 9-12 months: Standing, first words, pincer grasp
- 12+ months: Walking, more words, following instructions

**Vaccination Tracking:**
- Brazilian vaccination schedule
- Reminder notifications
- Dose tracking
- Vaccination record export (PDF)

**Common Brazilian Vaccines:**
- BCG (birth)
- Hepatitis B (birth, 1m, 6m)
- Pentavalente (2m, 4m, 6m)
- VIP (2m, 4m, 6m)
- Pneumocócica (2m, 4m, 6m, 12m)
- Meningocócica (3m, 5m, 12m)
- Tríplice viral (12m, 15m)

### 5. Growth Tracking

```typescript
interface GrowthEntry {
  id: string;
  userId: string;
  babyId: string;
  date: Date;
  weight: number; // kg
  height: number; // cm
  headCircumference?: number; // cm
}
```

**Features:**
- Weight tracking
- Height/length tracking
- Head circumference tracking
- WHO growth percentile charts
- Growth velocity calculations

**Visualizations:**
- Weight curve over time
- Height curve over time
- Percentile comparison charts

## Dashboard Overview

**At-a-Glance Stats:**
- Last feeding: "2 hours ago"
- Currently sleeping: "45 minutes"
- Diaper changes today: "6"
- Next milestone: "Rolling over (1 month to go)"
- Next vaccination: "Pentavalente - in 5 days"

**Quick Actions:**
- Log Feeding
- Start Sleep Timer
- Log Diaper
- Add Milestone
- Add Growth Entry

## Data Export

**Export Options:**
- PDF report (weekly/monthly)
- CSV export (all data)
- Share with pediatrician
- Print-friendly summary

**Report Contents:**
- Feeding summary
- Sleep analysis
- Diaper patterns
- Growth charts
- Milestone achievements
- Vaccination record

## Notifications & Reminders

**Smart Reminders:**
- Next feeding (based on pattern)
- Vaccination due date
- Growth measurement (monthly)
- Milestone check-ins
- Low diaper supply alert

**Notification Settings:**
- Enable/disable per category
- Custom reminder times
- Quiet hours configuration

## Privacy & Data

**Data Storage:**
- Encrypted in Firebase Firestore
- User-specific access only
- LGPD/GDPR compliant
- Option to delete all data

**Data Sharing:**
- Share with partner (multi-user access)
- Share with doctor (read-only link)
- No third-party sharing without consent

## AI Insights (Future)

**Planned Features:**
- Pattern recognition: "Your baby tends to sleep better after evening baths"
- Correlation analysis: "Solid food intake affects sleep duration"
- Anomaly detection: "Unusual feeding pattern detected, consider consulting doctor"
- Predictive scheduling: "Based on patterns, next feeding likely in 2.5 hours"

## Analytics Events

**Track:**
- `feeding_logged`: Feeding entry created
- `sleep_started`: Sleep timer started
- `diaper_logged`: Diaper entry created
- `milestone_achieved`: Milestone marked complete
- `export_requested`: Data export generated
- `reminder_set`: User sets custom reminder

---

*Feature Specification v1.0*  
*Last Updated: October 28, 2025*
