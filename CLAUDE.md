# STS M0TIV8R - Project Context

## Overview
A fitness coaching app for Scullin Training Systems that combines workout tracking with gamification psychology to drive user engagement and habit formation.

**Live URL**: https://sts-motivator.vercel.app
**GitHub**: https://github.com/edwards-tech9/sts-motivator

## Tech Stack
- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS with custom carbon/gold theme
- **Deployment**: Vercel (auto-deploys from main)
- **State**: LocalStorage for persistence (no backend yet)

## Key Commands
```bash
npm run dev      # Start dev server
npm run build    # Production build
npx vercel --prod --yes  # Deploy to production
```

## Project Structure
```
src/
├── pages/           # Main views (AthleteHome, LiveActivity, Settings, etc.)
├── components/
│   ├── gamification/  # XPDisplay, BadgeGrid, Leaderboard, DailyQuests
│   ├── workout/       # RestTimer, LiveEncouragement, ExerciseCard
│   ├── dashboard/     # StreakDisplay
│   └── ui/            # AnimatedComponents, shared UI
├── services/
│   ├── gamificationService.js  # XP, streaks, badges, goals
│   └── localStorage.js         # Data persistence
└── data/
    └── gamification.js         # Badges, levels, XP rewards config
```

## Recently Completed Features
1. **Gamification System**
   - Daily XP goals (200 XP) with bonus rewards
   - Weekly XP tracking (1000 XP) with trend comparison
   - Streak milestones (7/14/30/100/365 days) with XP bonuses
   - +5 XP for sending encouragements
   - Visual goal progress bars on dashboard

2. **Social Features**
   - Live activity feed during workouts
   - Encouragement system with flame button
   - Toast notifications for feedback

3. **UI/UX**
   - Streak "at risk" warnings
   - Milestone countdown alerts
   - Floating XP gain animations

## Remaining Work (From Plan)

### Phase 2: Competition (Not Started)
- League system (Bronze → Diamond tiers)
- Weekly leaderboard competition
- Promotion/demotion mechanics

### Phase 3: Polish (Not Started)
- Level-up celebration screen with confetti
- Sound effects (toggle in settings)
- Variable reward multipliers (surprise 2x/3x XP)

### Phase 4: Backend Integration (Future)
- Firebase/Supabase for real user data
- Real-time live activity (not mock data)
- Push notifications for streak warnings
- User authentication

## Design Patterns
- **Variable Rewards**: XP has randomness for dopamine engagement
- **Loss Aversion**: Streak warnings create urgency
- **Social Proof**: Live activity shows others working out
- **Progress Visualization**: Multiple progress bars and goal tracking

## Notes
- Mock users are used for live activity (MOCK_LIVE_USERS arrays)
- Gamification state persists in localStorage under 'sts_gamification'
- The app targets mobile-first (PWA-ready structure)
- Color scheme: carbon (dark grays), gold (#F59E0B variants)
