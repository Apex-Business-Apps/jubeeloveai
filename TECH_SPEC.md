# Jubee.Love Technical Specification

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Status**: Production-Ready (A+ Grade)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Database Schema](#4-database-schema)
5. [Edge Functions](#5-edge-functions)
6. [Security Architecture](#6-security-architecture)
7. [PWA Configuration](#7-pwa-configuration)
8. [Data Persistence Strategy](#8-data-persistence-strategy)
9. [Internationalization](#9-internationalization)
10. [Educational Modules](#10-educational-modules)
11. [Jubee Mascot System](#11-jubee-mascot-system)
12. [Performance Budgets](#12-performance-budgets)
13. [Testing Strategy](#13-testing-strategy)
14. [Error Handling](#14-error-handling)
15. [Monitoring & Analytics](#15-monitoring--analytics)
16. [CI/CD Pipeline](#16-cicd-pipeline)
17. [API Rate Limits](#17-api-rate-limits)
18. [Future Roadmap](#18-future-roadmap)

---

## 1. Project Overview

### 1.1 Application Description

Jubee.Love is a Progressive Web Application (PWA) designed for early childhood education (ages 3-7). The app features an AI-powered mascot named Jubee—a magical bee companion that guides children through interactive learning activities.

### 1.2 Target Audience

| Audience | Description |
|----------|-------------|
| Primary Users | Children ages 3-7 (pre-readers and early readers) |
| Secondary Users | Parents/guardians (for parental controls and insights) |

### 1.3 Core Features

- **AI Companion (Jubee)**: 3D animated mascot with emotional responses, voice interaction, and contextual animations
- **Educational Games**: Alphabet, numbers, colors, memory, patterns, puzzles
- **Interactive Stories**: Read-aloud stories with TTS narration
- **Creative Activities**: Drawing canvas, sticker collection
- **Parental Controls**: Screen time limits, usage schedules, activity monitoring
- **Offline-First**: Full functionality without internet connection
- **Multi-Language**: Support for 5 languages (EN, ES, FR, ZH, HI)

### 1.4 Access Model

- **Main App**: Completely open, no authentication required for toddlers
- **Parent Hub**: Protected route accessed via 3-second long-press on settings icon

---

## 2. Technology Stack

### 2.1 Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | ^18.3.1 | UI framework |
| TypeScript | ^5.x | Type safety |
| Vite | ^5.x | Build tool & dev server |
| Tailwind CSS | ^3.x | Utility-first styling |
| Three.js | ^0.160.0 | 3D graphics for Jubee mascot |
| Framer Motion | ^12.23.24 | Animations and page transitions |
| React Router | ^6.30.1 | Client-side routing |
| Zustand | ^4.4.7 | State management |
| React Query | ^5.83.0 | Server state management |
| i18next | ^25.6.2 | Internationalization |

### 2.2 Backend (Supabase)

| Service | Purpose |
|---------|---------|
| PostgreSQL | Primary database |
| Supabase Auth | Authentication (email, Google) |
| Edge Functions | Serverless API endpoints |
| Supabase Realtime | Live data subscriptions |
| Supabase Storage | File storage (future) |
| Supabase Vault | Secrets management |

### 2.3 External APIs

| Provider | Service | Purpose |
|----------|---------|---------|
| ElevenLabs | Text-to-Speech | Jubee voice (Lily voice) |
| OpenAI | GPT-5-mini | Conversational AI |
| OpenAI | Whisper | Speech-to-text |
| Resend | Email API | Screen time alerts |

### 2.4 Infrastructure

| Component | Technology |
|-----------|------------|
| Hosting | Lovable Platform |
| CDN | Automatic via Lovable |
| SSL | Automatic HTTPS |
| Domain | Custom domain support |

---

## 3. Project Structure

```
jubee-love/
├── src/
│   ├── assets/                    # Static assets (images, icons)
│   ├── components/
│   │   ├── ui/                    # Shadcn/UI components
│   │   ├── achievements/          # Achievement system components
│   │   ├── common/                # Shared components
│   │   ├── icons/                 # Icon components
│   │   └── rewards/               # Reward system components
│   ├── core/
│   │   └── jubee/                 # Jubee mascot core system
│   │       ├── JubeeMascot.tsx    # Main mascot component
│   │       ├── JubeeDom.ts        # DOM utilities
│   │       ├── JubeePositionManager.ts
│   │       ├── JubeeRenderingGuard.ts
│   │       ├── JubeeStateValidator.ts
│   │       └── JubeeSystemCheck.ts
│   ├── data/                      # Static data files
│   ├── hooks/                     # Custom React hooks
│   ├── i18n/
│   │   ├── config.ts              # i18n configuration
│   │   └── locales/               # Translation files (en, es, fr, zh, hi)
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts          # Supabase client
│   │       └── types.ts           # Generated types (read-only)
│   ├── lib/                       # Utility libraries
│   ├── modules/
│   │   ├── games/                 # Educational games
│   │   ├── reading/               # Reading activities
│   │   ├── shapes/                # Shape activities
│   │   └── writing/               # Writing/drawing activities
│   ├── pages/                     # Route components
│   ├── store/                     # Zustand stores
│   ├── test/                      # Test utilities
│   ├── types/                     # TypeScript type definitions
│   ├── workers/                   # Web Workers
│   ├── App.tsx                    # Root component
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Global styles & design tokens
├── supabase/
│   ├── config.toml                # Supabase configuration
│   └── functions/                 # Edge functions
│       ├── jubee-conversation/
│       ├── send-screen-time-alert/
│       ├── speech-to-text/
│       └── text-to-speech/
├── e2e/                           # Playwright E2E tests
├── public/                        # Public assets (PWA icons, manifest)
└── [config files]                 # Various configuration files
```

---

## 4. Database Schema

### 4.1 Supabase Project

- **Project ID**: `kphdqgidwipqdthehckg`
- **Region**: Default Supabase region
- **PostgreSQL Version**: Latest stable

### 4.2 Tables

#### 4.2.1 `profiles`

User profile information.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| user_id | uuid | Yes | - | Auth user reference |
| display_name | text | Yes | - | Display name |
| avatar_url | text | Yes | - | Avatar image URL |
| age | integer | Yes | - | User age |
| gender | text | Yes | - | User gender |
| created_at | timestamptz | Yes | now() | Creation timestamp |
| updated_at | timestamptz | Yes | now() | Update timestamp |

#### 4.2.2 `children_profiles`

Child profiles linked to parent accounts.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| parent_user_id | uuid | Yes | - | Parent's auth user ID |
| name | text | No | - | Child's name |
| age | integer | No | - | Child's age |
| gender | text | Yes | - | Child's gender |
| avatar_url | text | Yes | - | Avatar image URL |
| settings | jsonb | Yes | '{}' | Child-specific settings |
| created_at | timestamptz | Yes | now() | Creation timestamp |
| updated_at | timestamptz | Yes | now() | Update timestamp |

#### 4.2.3 `game_progress`

Tracks game progress and scores.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| user_id | uuid | Yes | - | Auth user reference |
| child_profile_id | uuid | Yes | - | Child profile reference |
| score | integer | Yes | 0 | Current score |
| activities_completed | integer | Yes | 0 | Activities completed count |
| current_theme | text | Yes | 'morning' | Current theme |
| last_activity | text | Yes | - | Last activity played |
| created_at | timestamptz | Yes | now() | Creation timestamp |
| updated_at | timestamptz | Yes | now() | Update timestamp |

#### 4.2.4 `achievements`

Unlocked achievements for users.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| achievement_id | text | No | - | Achievement identifier |
| user_id | uuid | Yes | - | Auth user reference |
| child_profile_id | uuid | Yes | - | Child profile reference |
| unlocked_at | timestamptz | Yes | now() | Unlock timestamp |
| created_at | timestamptz | Yes | now() | Creation timestamp |

#### 4.2.5 `stickers`

Collected stickers for users.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| sticker_id | text | No | - | Sticker identifier |
| user_id | uuid | Yes | - | Auth user reference |
| child_profile_id | uuid | Yes | - | Child profile reference |
| unlocked_at | timestamptz | Yes | now() | Unlock timestamp |
| created_at | timestamptz | Yes | now() | Creation timestamp |

#### 4.2.6 `drawings`

User-created drawings.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| user_id | uuid | Yes | - | Auth user reference |
| child_profile_id | uuid | Yes | - | Child profile reference |
| title | text | Yes | - | Drawing title |
| image_data | text | No | - | Base64 image data |
| created_at | timestamptz | Yes | now() | Creation timestamp |
| updated_at | timestamptz | Yes | now() | Update timestamp |

#### 4.2.7 `stories`

Story content for reading activities.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| title | text | No | - | Story title |
| description | text | Yes | - | Story description |
| category | text | No | 'free' | Story category |
| age_range | text | Yes | '2-5' | Target age range |
| illustration_style | text | Yes | 'emoji' | Illustration style |
| pages | jsonb | No | - | Story pages content |
| created_at | timestamptz | Yes | now() | Creation timestamp |
| updated_at | timestamptz | Yes | now() | Update timestamp |

#### 4.2.8 `story_completions`

Tracks completed stories.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| story_id | uuid | Yes | - | Story reference |
| user_id | uuid | Yes | - | Auth user reference |
| child_profile_id | uuid | Yes | - | Child profile reference |
| completed_at | timestamptz | Yes | now() | Completion timestamp |
| created_at | timestamptz | Yes | now() | Creation timestamp |

#### 4.2.9 `conversation_logs`

Logs of Jubee conversations for analytics.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| user_id | uuid | No | - | Auth user reference |
| child_profile_id | uuid | Yes | - | Child profile reference |
| sentiment | text | No | - | Detected sentiment |
| mood | text | No | - | Detected mood |
| confidence | numeric | No | - | Confidence score |
| keywords | jsonb | Yes | '[]' | Extracted keywords |
| message_preview | text | Yes | - | Message preview |
| response_length | integer | Yes | - | Response length |
| interaction_type | text | Yes | 'chat' | Interaction type |
| created_at | timestamptz | No | now() | Creation timestamp |

#### 4.2.10 `usage_sessions`

Tracks app usage sessions for screen time.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| user_id | uuid | No | - | Auth user reference |
| child_profile_id | uuid | Yes | - | Child profile reference |
| session_start | timestamptz | No | now() | Session start time |
| session_end | timestamptz | Yes | - | Session end time |
| duration_seconds | integer | Yes | 0 | Session duration |
| created_at | timestamptz | Yes | now() | Creation timestamp |
| updated_at | timestamptz | Yes | now() | Update timestamp |

#### 4.2.11 `screen_time_requests`

Child requests for additional screen time.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| user_id | uuid | No | - | Auth user reference |
| child_profile_id | uuid | No | - | Child profile reference |
| requested_minutes | integer | No | - | Minutes requested |
| status | text | No | 'pending' | Request status |
| responded_by | uuid | Yes | - | Responder user ID |
| responded_at | timestamptz | Yes | - | Response timestamp |
| created_at | timestamptz | No | now() | Creation timestamp |

#### 4.2.12 `user_roles`

User role assignments.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | uuid | No | gen_random_uuid() | Primary key |
| user_id | uuid | No | - | Auth user reference |
| role | app_role | No | - | Role enum value |
| created_at | timestamptz | Yes | now() | Creation timestamp |

### 4.3 Enums

```sql
CREATE TYPE app_role AS ENUM ('admin', 'moderator', 'user', 'premium');
```

### 4.4 Database Functions

| Function | Purpose |
|----------|---------|
| `update_updated_at_column()` | Trigger function to auto-update timestamps |
| `has_role(_user_id, _role)` | Check if user has specific role |
| `is_admin(_user_id)` | Check if user is admin |
| `is_premium(_user_id)` | Check if user is premium |
| `get_conversation_analytics(...)` | Aggregate conversation analytics |

### 4.5 Row Level Security (RLS)

All tables have RLS enabled with policies following these patterns:

- **Users**: Can CRUD their own records
- **Parents**: Can CRUD their children's records
- **Admins**: Can CRUD all records
- **Public**: Stories table is publicly readable

---

## 5. Edge Functions

### 5.1 `text-to-speech`

Converts text to speech using ElevenLabs API.

**Endpoint**: `POST /functions/v1/text-to-speech`

**Request Body**:
```typescript
{
  text: string;        // Text to convert
  mood?: string;       // Mood for voice modulation
  language?: string;   // Target language (en, es, fr, zh, hi)
  childName?: string;  // Child's name for personalization
}
```

**Response**: Audio buffer (audio/mpeg)

**Voice Configuration**:
- Voice: Lily (ElevenLabs child-friendly voice)
- Model: eleven_multilingual_v2
- Settings: stability 0.35, similarity_boost 0.75, style 0.45

**Mood Modulation**:
| Mood | Speed | Description |
|------|-------|-------------|
| excited | 1.2 | Faster, more energetic |
| happy | 1.1 | Slightly upbeat |
| curious | 1.0 | Normal pace |
| tired | 0.85 | Slower, gentler |
| default | 1.0 | Balanced |

### 5.2 `jubee-conversation`

AI-powered conversation endpoint for Jubee.

**Endpoint**: `POST /functions/v1/jubee-conversation`

**Request Body**:
```typescript
{
  message: string;       // User message
  childName?: string;    // Child's name
  childAge?: number;     // Child's age
  context?: string;      // Conversation context
  language?: string;     // Language preference
}
```

**Response**:
```typescript
{
  response: string;      // AI response
  mood: string;          // Detected mood
  sentiment: string;     // Sentiment analysis
  confidence: number;    // Confidence score
  keywords: string[];    // Extracted keywords
}
```

**Model**: GPT-5-mini (gpt-5-mini-2025-08-07)

**System Prompt Characteristics**:
- Friendly, encouraging tone
- Age-appropriate vocabulary
- Educational guidance
- Emotional support

### 5.3 `speech-to-text`

Transcribes audio to text using OpenAI Whisper.

**Endpoint**: `POST /functions/v1/speech-to-text`

**Request Body**: FormData with audio file

**Response**:
```typescript
{
  text: string;          // Transcribed text
  language?: string;     // Detected language
}
```

**Model**: whisper-1

### 5.4 `send-screen-time-alert`

Sends email alerts to parents about screen time.

**Endpoint**: `POST /functions/v1/send-screen-time-alert`

**Request Body**:
```typescript
{
  parentEmail: string;   // Parent's email
  childName: string;     // Child's name
  alertType: string;     // 'approaching_limit' | 'limit_reached' | 'request'
  remainingMinutes?: number;
  requestedMinutes?: number;
}
```

**Provider**: Resend API

---

## 6. Security Architecture

### 6.1 Authentication Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Landing   │────▶│    Auth     │────▶│   Parent    │
│    Page     │     │    Page     │     │    Hub      │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           │ Supabase Auth
                           ▼
                    ┌─────────────┐
                    │   Session   │
                    │  Management │
                    └─────────────┘
```

### 6.2 Supported Auth Methods

- Email/Password
- Google OAuth
- Magic Link (optional)

### 6.3 Row Level Security (RLS)

All database tables enforce RLS with these policy patterns:

```sql
-- User owns record
CREATE POLICY "Users can view own records"
ON table_name FOR SELECT
USING (auth.uid() = user_id);

-- Parent owns child's record
CREATE POLICY "Parents can view children's records"
ON table_name FOR SELECT
USING (child_profile_id IN (
  SELECT id FROM children_profiles
  WHERE parent_user_id = auth.uid()
));

-- Admin access
CREATE POLICY "Admins can view all"
ON table_name FOR SELECT
USING (is_admin(auth.uid()));
```

### 6.4 Input Validation

**Client-Side** (`src/lib/inputValidation.ts`):
- Zod schemas for type validation
- Length limits on all text inputs
- Sanitization of HTML/script content

**Server-Side** (Edge Functions):
- Request body validation
- Rate limiting
- Authentication verification

### 6.5 XSS Prevention

- React's built-in escaping
- No `dangerouslySetInnerHTML` usage
- CSP headers configured
- Input sanitization via `inputSanitizer.ts`

### 6.6 Secrets Management

| Secret | Purpose | Storage |
|--------|---------|---------|
| OPENAI_API_KEY | GPT & Whisper API | Supabase Vault |
| ELEVENLABS_API_KEY | TTS API | Supabase Vault |
| RESEND_API_KEY | Email API | Supabase Vault |
| SUPABASE_SERVICE_ROLE_KEY | Admin operations | Supabase Vault |

---

## 7. PWA Configuration

### 7.1 Service Worker Strategy

**File**: `vite.config.ts` (VitePWA plugin)

**Caching Strategy**:
- **Precache**: Core app shell, critical assets
- **Runtime Cache**: API responses, images
- **Network First**: Dynamic content
- **Cache First**: Static assets

**Update Interval**: 5 minutes (intentional for reliability)

### 7.2 Manifest Configuration

```json
{
  "name": "Jubee.Love - Learning with Love",
  "short_name": "Jubee",
  "description": "Interactive learning for young children",
  "theme_color": "#FFC300",
  "background_color": "#1A1A2E",
  "display": "standalone",
  "orientation": "portrait",
  "start_url": "/",
  "icons": [
    { "src": "/pwa-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/pwa-512x512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/pwa-maskable-192x192.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable" },
    { "src": "/pwa-maskable-512x512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

### 7.3 Offline Capabilities

- Full app functionality offline
- IndexedDB for local data storage
- Background sync when online
- Offline indicator UI component

---

## 8. Data Persistence Strategy

### 8.1 Three-Tier Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Zustand Stores                          │
│  (In-memory state with localStorage persist middleware)     │
├─────────────────────────────────────────────────────────────┤
│                      IndexedDB                              │
│  (Large/structured data: drawings, activity logs, cache)    │
├─────────────────────────────────────────────────────────────┤
│                    Supabase (Cloud)                         │
│  (Source of truth when online, bidirectional sync)          │
└─────────────────────────────────────────────────────────────┘
```

### 8.2 Zustand Stores

| Store | Purpose | Persist |
|-------|---------|---------|
| useJubeeStore | Mascot state, position, visibility | Yes |
| useGameStore | Game progress, scores | Yes |
| useAchievementStore | Unlocked achievements | Yes |
| useParentalStore | Parental control settings | Yes |
| useOnboardingStore | Onboarding completion state | Yes |

### 8.3 IndexedDB Usage

**Database**: `jubee-love-db`

**Object Stores**:
- `drawings`: User-created artwork
- `activity_logs`: Activity history
- `cached_content`: Offline content cache
- `sync_queue`: Pending sync operations

### 8.4 Sync Service

**File**: `src/lib/syncService.ts`

**Features**:
- Bidirectional sync with Supabase
- Conflict resolution (last-write-wins with user prompt for conflicts)
- Offline queue for pending operations
- Automatic sync on reconnection

---

## 9. Internationalization

### 9.1 Supported Languages

| Code | Language | Coverage |
|------|----------|----------|
| en | English | 100% |
| es | Spanish | 100% |
| fr | French | 100% |
| zh | Mandarin Chinese | 100% |
| hi | Hindi | 100% |

### 9.2 i18n Configuration

**File**: `src/i18n/config.ts`

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    resources: { /* loaded from locales */ }
  });
```

### 9.3 Translation Structure

```
src/i18n/locales/
├── en.json    # English translations
├── es.json    # Spanish translations
├── fr.json    # French translations
├── zh.json    # Mandarin translations
└── hi.json    # Hindi translations
```

### 9.4 Voice Language Support

TTS voices are selected per language using ElevenLabs multilingual model (eleven_multilingual_v2).

---

## 10. Educational Modules

### 10.1 Games (`src/modules/games/`)

| Game | File | Skills |
|------|------|--------|
| Alphabet Game | AlphabetGame.tsx | Letter recognition, phonics |
| Number Game | NumberGame.tsx | Counting, number recognition |
| Color Game | ColorGame.tsx | Color identification |
| Memory Game | MemoryGame.tsx | Memory, concentration |
| Pattern Game | PatternGame.tsx | Pattern recognition, logic |
| Puzzle Game | PuzzleGame.tsx | Spatial reasoning |

### 10.2 Reading (`src/modules/reading/`)

| Module | File | Features |
|--------|------|----------|
| Story Time | StoryTime.tsx | Interactive stories with TTS narration |
| Reading Practice | ReadingPractice.tsx | Word recognition, phonics practice |

### 10.3 Creative (`src/modules/`)

| Module | File | Features |
|--------|------|----------|
| Writing Canvas | writing/WritingCanvas.tsx | Drawing, tracing, free-form writing |
| Shape Sorter | shapes/ShapeSorter.tsx | Shape recognition, sorting |

### 10.4 Reward System

- **Stickers**: Collected for completing activities
- **Achievements**: Badges for milestones (streak, score, completion)
- **Celebration Animations**: Confetti, Jubee reactions

---

## 11. Jubee Mascot System

### 11.1 Architecture

**Rendering Engine**: Three.js Direct Canvas (not React Three Fiber)

**File**: `src/components/JubeeCanvas3DDirect.tsx`

### 11.2 3D Model Specifications

| Component | Geometry | Material |
|-----------|----------|----------|
| Body | SphereGeometry (64 segments) | MeshPhongMaterial |
| Stripes | TorusGeometry | MeshPhongMaterial |
| Wings | PlaneGeometry | MeshPhysicalMaterial (translucent) |
| Eyes | SphereGeometry | MeshPhongMaterial |
| Antennae | CylinderGeometry + SphereGeometry | MeshPhongMaterial |

### 11.3 Color Palette

| Element | Male (0xHEX) | Female (0xHEX) |
|---------|--------------|----------------|
| Body | #FFD700 (golden yellow) | #FFC300 (warm gold) + #FF69B4 accent |
| Stripes | #1A1A1A (soft black) | #1A1A1A |
| Wings | #E0F7FF (cyan-white) | #E0F7FF |
| Eyes | #FFFFFF with #1A1A1A pupils | #FFFFFF with #1A1A1A pupils |

### 11.4 Responsive Sizing

| Breakpoint | Container (px) | Model Scale |
|------------|----------------|-------------|
| Desktop (≥1024px) | 144 × 162 | 0.36 |
| Tablet (≥768px) | 126 × 144 | 0.36 |
| Mobile (<768px) | 108 × 130 | 0.36 |

*Note: 80% reduction from original size to prevent UI obstruction*

### 11.5 State Management

**Store**: `src/store/useJubeeStore.ts`

```typescript
interface JubeeState {
  isVisible: boolean;
  position: { x: number; y: number };
  containerPosition: { bottom: number; right: number };
  gender: 'male' | 'female';
  mood: 'happy' | 'excited' | 'curious' | 'tired' | 'thinking';
  animation: string;
  isSpeaking: boolean;
  interactionCount: number;
  // ... actions
}
```

### 11.6 Hardening Systems

| System | File | Purpose |
|--------|------|---------|
| Rendering Guard | JubeeRenderingGuard.ts | Validates rendering state |
| Position Manager | JubeePositionManager.ts | Centralized position logic |
| State Validator | JubeeStateValidator.ts | State consistency checks |
| Error Recovery | JubeeErrorRecovery.ts | Auto-recovery mechanisms |
| System Check | JubeeSystemCheck.ts | Health monitoring |

### 11.7 Animations

| Animation | Trigger | Description |
|-----------|---------|-------------|
| Idle | Default | Gentle hover, breathing |
| Excited | Games page, clicks | Bouncy movement, faster wing flutter |
| Curious | Stories page | Tilted head, perked antennae |
| Sleepy | Settings page | Droopy eyes, slow movement |
| Flying | Page transitions | Smooth flight across screen |
| Speaking | TTS active | Mouth animation, body movement |

### 11.8 Voice System

**Provider**: ElevenLabs API

**Voice**: Lily (child-friendly)

**Features**:
- Mood-based voice modulation
- Natural pauses and breathing
- Personalized greetings with child's name
- Multi-language support

---

## 12. Performance Budgets

### 12.1 Core Web Vitals Targets

| Metric | Mobile | Desktop |
|--------|--------|---------|
| FCP | <1.8s | <1.0s |
| LCP | <2.5s | <1.5s |
| TTI | <3.5s | <2.0s |
| TBT | <200ms | <100ms |
| CLS | <0.1 | <0.05 |
| FID | <100ms | <50ms |

### 12.2 Bundle Size Budgets

| Bundle | Target |
|--------|--------|
| Initial JS | <150KB gzipped |
| Initial CSS | <30KB gzipped |
| Vendor JS | <100KB gzipped |
| Lazy chunks | <50KB each |
| Images (initial) | <200KB total |

### 12.3 Runtime Performance

| Metric | Target |
|--------|--------|
| Frame time | <16ms (60fps) |
| Jubee render | <8ms |
| Game component render | <10ms |
| Animation frame | <12ms |

### 12.4 Memory Budgets

| Resource | Limit |
|----------|-------|
| JS Heap | <50MB |
| IndexedDB | <100MB |
| localStorage | <5MB |
| Canvas memory | <32MB |
| Image cache | <30MB |

---

## 13. Testing Strategy

### 13.1 E2E Tests (Playwright)

**Directory**: `e2e/`

| Test File | Coverage |
|-----------|----------|
| navigation.spec.ts | Route navigation, links |
| onboarding.spec.ts | Onboarding flow |
| games.spec.ts | All game modules |
| story-reading.spec.ts | Story reading flow |
| creative-activities.spec.ts | Drawing, stickers |
| parent-hub.spec.ts | Parent dashboard |
| settings.spec.ts | Settings page |
| accessibility.spec.ts | WCAG compliance |
| jubee-interaction.spec.ts | Mascot interactions |
| rewards-achievements.spec.ts | Reward system |
| visual-regression.spec.ts | Visual consistency |

### 13.2 Unit Tests (Vitest)

**Directory**: `src/**/__tests__/`

| Test File | Coverage |
|-----------|----------|
| useAuth.test.ts | Authentication hook |
| useDataPersistence.test.ts | Data persistence |
| useJubeeStore.test.ts | Jubee state management |

### 13.3 Test Commands

```bash
# Unit tests
npm run test           # Watch mode
npm run test:ci        # CI mode with coverage

# E2E tests
npx playwright test    # Run all E2E tests
npx playwright test --ui  # Interactive UI mode
```

---

## 14. Error Handling

### 14.1 Error Boundaries

**Components**:
- `ErrorBoundary.tsx` - Global error boundary
- `GameErrorBoundary.tsx` - Game-specific boundary
- `JubeeErrorBoundary.tsx` - Jubee mascot boundary
- `SentryErrorBoundary.tsx` - Sentry integration

### 14.2 Global Error Handlers

**File**: `src/lib/globalErrorHandlers.ts`

- Unhandled promise rejections
- Uncaught exceptions
- Network errors
- WebGL context loss

### 14.3 Sentry Integration

**File**: `src/lib/sentry.ts`

- Error tracking and reporting
- Performance monitoring
- User feedback collection
- Release tracking

### 14.4 Error Recovery Patterns

```typescript
// Retry with exponential backoff
async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  baseDelay = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      await sleep(baseDelay * Math.pow(2, attempt - 1));
    }
  }
}
```

---

## 15. Monitoring & Analytics

### 15.1 System Health Monitor

**Hook**: `useSystemHealthMonitor.ts`

**Checks**:
- Storage system health
- Auth state consistency
- Sync queue status
- Jubee rendering state
- Parental controls integrity

### 15.2 Performance Monitor

**Page**: `/performance`

**Metrics**:
- Core Web Vitals
- Component render times
- Memory usage
- Network latency

### 15.3 Conversation Analytics

**Database Function**: `get_conversation_analytics()`

**Metrics**:
- Total conversations per day
- Sentiment distribution
- Mood patterns
- Common keywords
- Confidence scores

---

## 16. CI/CD Pipeline

### 16.1 GitHub Actions

**File**: `.github/workflows/ci.yml`

**Jobs**:
1. **Lint**: ESLint checks
2. **Type Check**: TypeScript compilation
3. **Unit Tests**: Vitest suite
4. **E2E Tests**: Playwright suite
5. **Build**: Production build verification
6. **Deploy**: Automatic via Lovable

### 16.2 Quality Gates

- All linting rules must pass
- TypeScript strict mode compliance
- >80% unit test coverage
- All E2E tests passing
- Bundle size within budgets

---

## 17. API Rate Limits

### 17.1 Edge Function Limits

| Function | Rate Limit | Burst |
|----------|------------|-------|
| text-to-speech | 60/min per user | 10 |
| jubee-conversation | 30/min per user | 5 |
| speech-to-text | 20/min per user | 3 |
| send-screen-time-alert | 10/hour per user | 2 |

### 17.2 External API Limits

| Provider | Plan | Limit |
|----------|------|-------|
| ElevenLabs | Standard | 100K chars/month |
| OpenAI | Standard | Based on tokens |
| Resend | Free | 100 emails/day |

---

## 18. Future Roadmap

### 18.1 Apex Ecosystem Integration

**Phase 1** (Planned):
- OmniLink parent hub app integration
- Remote parental commands
- Cross-app screen time management
- AI-powered child insights dashboard

### 18.2 Content Expansion

- Additional story library
- More educational games
- Music and rhythm activities
- Advanced puzzles

### 18.3 Feature Enhancements

- Multiplayer activities
- Voice-controlled navigation
- Adaptive difficulty
- Progress reports for parents
- Custom avatar creation

### 18.4 Platform Expansion

- Native iOS app (Capacitor)
- Native Android app (Capacitor)
- Tablet-optimized layouts
- Smart TV support

---

## Appendix A: Environment Variables

### Client-Side (Vite)

*Note: VITE_* variables are not used. Supabase credentials are embedded in client.*

### Edge Functions

| Variable | Purpose |
|----------|---------|
| OPENAI_API_KEY | OpenAI API access |
| ELEVENLABS_API_KEY | ElevenLabs TTS |
| RESEND_API_KEY | Email sending |
| SUPABASE_URL | Supabase project URL |
| SUPABASE_ANON_KEY | Public API key |
| SUPABASE_SERVICE_ROLE_KEY | Admin operations |

---

## Appendix B: Design Tokens

### Color System (HSL)

```css
:root {
  /* Primary */
  --primary: 45 100% 50%;           /* Jubee gold */
  --primary-foreground: 222 47% 11%;
  
  /* Background */
  --background: 222 47% 11%;        /* Deep navy */
  --foreground: 210 40% 98%;
  
  /* Accents */
  --accent: 217 91% 60%;            /* Bright blue */
  --muted: 217 33% 17%;
  
  /* Semantic */
  --success: 142 76% 36%;
  --warning: 38 92% 50%;
  --destructive: 0 84% 60%;
}
```

### Jubee-Specific Tokens

```css
:root {
  --jubee-body: 45 100% 50%;
  --jubee-body-glow: 45 100% 70%;
  --jubee-stripe: 0 0% 10%;
  --jubee-wing: 195 100% 94%;
  --jubee-eye: 0 0% 100%;
}
```

---

## Appendix C: Glossary

| Term | Definition |
|------|------------|
| Jubee | The AI-powered bee mascot companion |
| RLS | Row Level Security (Supabase) |
| PWA | Progressive Web Application |
| TTS | Text-to-Speech |
| STT | Speech-to-Text |
| OmniLink | Parent control hub app (planned) |
| Apex Ecosystem | Suite of connected family apps |

---

*Document maintained by development team. For questions, contact the project maintainers.*
