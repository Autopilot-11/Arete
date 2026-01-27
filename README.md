# Aretē - Pursue Excellence

A Stoic productivity app that helps you define your top life priorities, track your daily activities, and receive AI-powered wisdom to stay aligned with what matters most.

## Features

- **Socratic Onboarding**: Discover your Top 3 Life Pillars through a guided reflection process
- **Focus Timer**: Track active work sessions with one click
- **Manual Logging**: Log past activities (with honesty confirmation!)
- **Activity Visualization**: See your daily productivity with interactive charts
- **AI Daily Oracle**: Get personalized end-of-day recaps comparing your activities to your pillars
- **Dynamic Tone System**: AI adapts from encouraging to strict Stoic mode based on your consistency

## Tech Stack

- **Frontend**: Next.js 16, React, Tailwind CSS
- **Authentication**: Clerk
- **Database**: Supabase (PostgreSQL)
- **AI**: Claude (Anthropic API)
- **Charts**: Recharts

## Theme

- Background: #F5F5DC (Beige/Parchment)
- Accents: #D4AF37 (Gold)
- Typography: Serif headings, Sans-serif body
- UI: Pillar-style borders on containers

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Clerk account
- Supabase account
- Anthropic API key

### 1. Clone and Install

```bash
cd Arete
npm install
```

### 2. Set Up Supabase

1. Create a new Supabase project
2. Run the SQL schema in `supabase-schema.sql` via the SQL Editor
3. Copy your project URL and anon key

### 3. Set Up Clerk

1. Create a Clerk application
2. Copy your publishable key and secret key

### 4. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

Update the following:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Routes with Clerk auth
│   │   ├── page.tsx      # Landing page
│   │   ├── dashboard/    # Main dashboard
│   │   ├── onboarding/   # Goal selection wizard
│   │   ├── sign-in/      # Clerk sign-in
│   │   └── sign-up/      # Clerk sign-up
│   ├── api/
│   │   ├── profile/      # User profile CRUD
│   │   ├── tasks/        # Task tracking CRUD
│   │   └── recap/        # AI recap generation
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── FocusTimer.tsx    # Active task timer
│   ├── ManualLog.tsx     # Past task entry
│   ├── TaskChart.tsx     # Recharts visualization
│   ├── DailyRecap.tsx    # AI Oracle component
│   └── Providers.tsx     # Client providers
└── lib/
    ├── supabase.ts       # Supabase client
    └── database.types.ts # TypeScript types
```

## Database Schema

### profiles
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | TEXT | Clerk user ID |
| goals_10 | JSON | Initial 10 goals |
| goals_5 | JSON | Narrowed 5 goals |
| top_3 | JSON | Final 3 pillars |
| day_end_time | TEXT | Default: '22:00' |

### tasks
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | TEXT | Clerk user ID |
| task_name | TEXT | Task description |
| tag | TEXT | Associated pillar |
| start_time | TIMESTAMPTZ | Start timestamp |
| end_time | TIMESTAMPTZ | End timestamp |
| is_manual | BOOLEAN | Manual entry flag |

## User Flow

1. **Sign Up** -> Create account via Clerk
2. **Onboarding** -> Enter 10 goals -> Select 5 -> Select final 3 Pillars
3. **Dashboard** -> Track tasks, view charts, get AI recaps
4. **Daily Oracle** -> AI compares your day to your Pillars with Stoic wisdom

## License

MIT
