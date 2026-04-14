<p align="center">
  <h1 align="center">Aretē</h1>
  <p align="center"><strong>Pursue Excellence</strong></p>
  <p align="center">
    A Stoic-inspired productivity app that helps you discover your core life pillars, track your daily work, and receive AI-powered wisdom to stay aligned with what matters most.
  </p>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#roadmap">Roadmap</a> •
  <a href="#license">License</a>
</p>

---

## Why Aretē?

*Aretē* (ἀρετή) is the ancient Greek concept of excellence — living up to your full potential. Most productivity apps track tasks. Aretē asks a harder question first: **what should you actually be spending your time on?**

Through a Socratic onboarding process, you distill your 10 life goals down to 3 core pillars. Every task you log, every hour you track, is measured against those pillars. At the end of each day, an AI Oracle delivers a personalized recap — sometimes encouraging, sometimes brutally Stoic — based on how well your actions aligned with your values.

## Features

### Socratic Onboarding
A guided three-step reflection wizard that narrows your priorities:
- **Step 1**: Write down 10 life goals
- **Step 2**: Cut to the 5 that matter most
- **Step 3**: Commit to your final 3 Pillars

### Hybrid Task Tracking
- **Focus Timer** — One-click start/stop timer for active work sessions
- **Manual Log** — Add past tasks with an honesty confirmation modal ("No cheat?")
- **Pillar Tagging** — Optionally tag each task to one of your 3 Pillars

### Daily Visualization
- **Activity Chart** — Hourly breakdown of tasks and duration (Recharts)
- **Weekly Stats** — Total tasks, hours logged, active days, and streak tracking
- **14-Day History** — Browse past days with full task details in a sidebar

### AI Daily Oracle
An end-of-day recap powered by Google Gemini that analyzes your day against your Pillars:
- **Encouraging tone** when you complete 5+ tasks aligned with your goals
- **Strict Stoic tone** after 3+ consecutive low-productivity days
- **Neutral tone** as the balanced default
- Actionable suggestions grounded in Stoic philosophy

### Design
- Greek pillar-themed UI with gold accents on warm parchment
- Smooth animations: breathing backgrounds, floating cards, shimmer effects
- Fully responsive with mobile-friendly layouts
- Respects `prefers-reduced-motion` for accessibility

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Frontend | React 19, TypeScript 5, Tailwind CSS 4 |
| Animation | Framer Motion 12 |
| Auth | [Clerk](https://clerk.com/) |
| Database | [Supabase](https://supabase.com/) (PostgreSQL + RLS) |
| AI | [Google Gemini 2.0 Flash](https://ai.google.dev/) |
| Charts | [Recharts](https://recharts.org/) |

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- A [Clerk](https://clerk.com/) account
- A [Supabase](https://supabase.com/) project
- A [Google AI Studio](https://aistudio.google.com/) API key

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/Arete.git
cd Arete
npm install
```

### 2. Set up Supabase

1. Create a new project in the [Supabase dashboard](https://app.supabase.com/)
2. Open the SQL Editor and run the contents of `supabase-schema.sql`
3. Copy your project URL, anon key, and service role key

### 3. Set up Clerk

1. Create a new application in the [Clerk dashboard](https://dashboard.clerk.com/)
2. Copy your publishable key and secret key

### 4. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in your keys in `.env.local`:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google Gemini
GOOGLE_GEMINI_API_KEY=your-api-key
```

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to get started.

## Architecture

```
src/
├── app/
│   ├── (auth)/                # Clerk-protected route group
│   │   ├── page.tsx           # Landing page
│   │   ├── dashboard/         # Main productivity dashboard
│   │   ├── onboarding/        # Socratic goal-selection wizard
│   │   ├── features/          # Feature showcase
│   │   ├── sign-in/           # Auth pages
│   │   └── sign-up/
│   ├── api/
│   │   ├── profile/route.ts   # Profile CRUD
│   │   ├── tasks/route.ts     # Task CRUD
│   │   └── recap/route.ts     # AI recap generation
│   ├── layout.tsx             # Root layout (Playfair Display + Inter)
│   └── globals.css            # Theme, animations, component styles
├── components/
│   ├── FocusTimer.tsx         # Start/stop active timer
│   ├── ManualLog.tsx          # Past task entry + honesty modal
│   ├── TaskChart.tsx          # Hourly activity chart
│   ├── DailyRecap.tsx         # AI Oracle component
│   ├── HistorySidebar.tsx     # 14-day history browser
│   ├── ProgressStats.tsx      # Weekly stats display
│   ├── UserProfileModal.tsx   # Pillar editor
│   └── ui/                    # Reusable UI primitives
├── contexts/
│   └── SidebarContext.tsx     # Sidebar state
├── lib/
│   ├── supabase.ts            # Supabase client
│   └── database.types.ts      # DB type definitions
└── middleware.ts              # Clerk route protection
```

### Database Schema

**profiles** — Stores each user's goals and preferences

| Column | Type | Description |
|--------|------|-------------|
| `user_id` | `TEXT UNIQUE` | Clerk user ID |
| `goals_10` | `JSONB` | Initial 10 goals |
| `goals_5` | `JSONB` | Narrowed 5 goals |
| `top_3` | `JSONB` | Final 3 pillars |
| `day_end_time` | `TEXT` | When the day ends (default: `22:00`) |

**tasks** — Tracks all logged work sessions

| Column | Type | Description |
|--------|------|-------------|
| `user_id` | `TEXT` | Clerk user ID |
| `task_name` | `TEXT` | What the user worked on |
| `tag` | `TEXT` | Associated pillar (optional) |
| `start_time` | `TIMESTAMPTZ` | When the task started |
| `end_time` | `TIMESTAMPTZ` | When the task ended |
| `is_manual` | `BOOLEAN` | Whether manually logged |

Both tables have Row Level Security (RLS) enabled — users can only access their own data.

## User Flow

```
Sign Up → Onboarding (10 goals → 5 → 3 Pillars) → Dashboard → Track → AI Recap
```

1. **Sign up** with Clerk authentication
2. **Onboarding** — Socratic reflection to define your 3 core Pillars
3. **Dashboard** — Log tasks via Focus Timer or Manual Log, tag them to Pillars
4. **Review** — Check your activity chart, weekly stats, and 14-day history
5. **Oracle** — Get an AI-generated end-of-day recap with Stoic wisdom

## Roadmap

- [ ] Goal refinement and pillar editing UX improvements
- [ ] Habit tracking alongside task tracking
- [ ] More granular analytics and trends over time
- [ ] Data export and backup
- [ ] Community features and accountability partners
- [ ] Mobile app (React Native)

## License

MIT
