# STS M0TIV8R

A comprehensive personal training app for coaches and athletes. Track workouts, build training programs, celebrate PRs, and manage clients - all in a sleek, mobile-first interface.

## Features

- **Athlete View**: Track daily workouts, log sets/reps/weight, automatic PR detection with celebrations
- **Coach View**: Manage clients, view compliance metrics, create and assign programs
- **Workout History**: Calendar view with workout details and progress tracking
- **Program Builder**: Create multi-day programs with exercise library (20+ exercises)
- **Dark/Light Theme**: Full theme support with system preference detection
- **PWA Support**: Installable app with offline caching
- **Accessibility**: Full ARIA support, keyboard navigation, skip links

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open http://localhost:5173

The app works immediately in **Demo Mode** with sample data - no configuration required.

---

## Deploy to Vercel (Easiest - 2 clicks)

1. Push this folder to a new GitHub repo
2. Go to [vercel.com](https://vercel.com) → "Add New Project" → Import your repo
3. Click "Deploy" - Vercel auto-detects Vite and configures everything

**That's it. You'll have a live URL in ~60 seconds.**

---

## Firebase Setup (Optional)

To enable user authentication and cloud sync:

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password + Google)
3. Create a Firestore database (start in test mode)
4. Copy your Firebase config to a `.env` file:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

---

## Tech Stack

- **React 18** + Vite 5
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Firebase** (optional) for auth/database
- **LocalStorage** for demo mode persistence

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # AnimatedComponents, Confetti
│   ├── workout/        # ExerciseCard, RestTimer, SetLogging
│   ├── dashboard/      # StreakDisplay
│   └── layout/         # BottomNav, Header
├── pages/              # Route-level components
│   ├── AthleteHome.jsx
│   ├── Workout.jsx
│   ├── WorkoutHistory.jsx
│   ├── CoachDashboard.jsx
│   ├── ProgramBuilder.jsx
│   ├── Login.jsx
│   └── Settings.jsx
├── context/            # React Context providers
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
├── services/           # Data layer
│   ├── firebase.js     # Firebase initialization
│   ├── auth.js         # Authentication
│   ├── database.js     # Firestore operations
│   └── localStorage.js # Demo mode persistence
└── hooks/              # Custom hooks
    └── usePWA.js       # PWA install/update
```

## License

MIT
