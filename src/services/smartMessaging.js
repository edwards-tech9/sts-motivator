// Smart Messaging Service - Predictive, psychology-based message generation
// Generates context-aware messages to minimize coach touchpoints while maximizing athlete engagement

import { getWorkouts, getPRs } from './localStorage';
import { getAthleteReadiness, generateProgramSuggestions } from './predictiveAnalysis';

// Psychology-based message templates organized by context and tone
// NOTE: In-platform messages skip the name since it's redundant (recipient knows who they are)
const MESSAGE_TEMPLATES = {
  // Re-engagement messages for inactive athletes
  reEngagement: {
    gentle: [
      "Hey! Just checking in - hope everything's okay. No pressure, but I'm here whenever you're ready to get back at it.",
      "Life happens, and that's okay. When you're ready to jump back in, I've got your program waiting. How are you doing?",
      "Wanted to reach out - it's been a bit since your last workout. Everything alright? Remember, showing up is half the battle.",
      "Taking a break is sometimes exactly what the body needs. Just wanted you to know I'm thinking about your progress. Ready when you are!",
    ],
    motivational: [
      "Your consistency was building something great - let's not lose that momentum! What's one small thing you can do today?",
      "Remember why you started. That fire is still in you. Even 20 minutes today would keep the streak alive.",
      "Champions take breaks, but they always come back stronger. Your next PR is waiting. Let's make it happen!",
      "Missing your updates! Your body has been adapting and recovering - now it's ready to grow. Let's channel that energy!",
    ],
    directConcern: [
      "I've noticed you've been away for a while. Is everything okay? I'm here if you need to talk or adjust your program.",
      "Just wanted to make sure you're doing alright. If life got busy or something came up, let me know how I can help.",
      "Your progress matters to me. If the program isn't working or you're facing challenges, let's figure it out together.",
    ],
  },

  // Compliance drop messages
  complianceDrop: {
    understanding: [
      "I noticed workouts have been tougher to fit in lately. Want to chat about adjusting your schedule? Sometimes less is more.",
      "Consistency > perfection. If 4 days a week feels like too much right now, let's dial it back and build from there.",
      "Life gets hectic - I get it. What if we simplified your program for the next few weeks? Quality over quantity always wins.",
    ],
    encouraging: [
      "Your compliance dipped a bit but that's just data, not a verdict. Every workout you do complete is building something. Keep showing up!",
      "Progress isn't linear. The fact that you're still in the game means you're winning. What's blocking you this week?",
      "A dip in consistency is normal - it happens to everyone. The difference is what we do next. Ready to reset?",
    ],
  },

  // PR celebration messages
  prCelebration: [
    "NEW PR ALERT! {exercise} at {weight}lbs - that's MASSIVE! All those reps are paying off. How did it feel?",
    "LET'S GO! {exercise} PR: {weight}lbs! This is what happens when you trust the process. Incredibly proud of you!",
    "You just crushed your {exercise} PR with {weight}lbs! That's not luck - that's earned. Celebrate this win!",
    "PR SMASHED! {weight}lbs on {exercise}! Your dedication is turning into results. What's the next target?",
  ],

  // Streak and consistency celebration
  streakCelebration: {
    short: [
      "{days} days straight - you're building momentum! Keep stacking those wins.",
      "{days}-day streak! Consistency is your superpower. The gains are coming.",
    ],
    medium: [
      "{days} days of showing up! That's not motivation anymore - that's DISCIPLINE. Respect!",
      "WOW! {days} consecutive days! You're in the top tier of committed athletes. This is how champions are made.",
    ],
    long: [
      "{days} DAYS! You're officially a machine. This kind of consistency transforms lives. Beyond proud!",
      "LEGENDARY! {days} days straight! Most people can't do this for a week. You're built different.",
    ],
  },

  // Program completion/transition
  programTransition: [
    "You're almost done with your current program! I've been analyzing your progress and have some exciting ideas for what's next. Let's talk!",
    "Week {week} of {totalWeeks} - you've crushed this program! Ready to level up? I've got your next challenge ready.",
    "Incredible work finishing this program block! Your body has adapted - time to give it a new stimulus. Check out what I've prepared for you!",
  ],

  // Fatigue/recovery messages
  recovery: [
    "Your recent numbers suggest you might be running on fumes. How's your sleep and stress been? Sometimes the best workout is rest.",
    "I'm seeing signs of accumulated fatigue. This week, let's prioritize recovery - your body will thank you with better gains next week.",
    "Pushing hard is great, but smart athletes know when to back off. Consider this your permission to take it easy for a few days.",
  ],

  // Form check reminders
  formCheck: [
    "You've been hitting new weights on {exercise}! Would love to see a form video to make sure we're moving safely at these loads.",
    "As you progress, form becomes even more critical. Mind sending a quick video of your {exercise}? Want to keep you injury-free!",
    "Your strength is climbing fast! Let's do a form check on {exercise} to ensure your technique is keeping pace with your gains.",
  ],

  // General check-ins
  checkIn: {
    casual: [
      "How's everything going? Just wanted to check in and see how you're feeling about the program.",
      "Quick check-in - how's the body feeling? Any exercises giving you trouble or areas you want to focus on?",
      "What's one thing that's going well and one thing you'd like to improve? I'm here to help either way!",
    ],
    progress: [
      "Looking at your recent workouts - solid work! Any specific goals you want to chase in the next few weeks?",
      "Your consistency has been great. Where do you want to see the most improvement? Let's dial in your focus.",
      "You've been putting in the work! Time to check in - are we on track with your goals, or should we adjust?",
    ],
  },

  // Plateau breaking
  plateau: [
    "I've noticed {exercise} has plateaued a bit. This is totally normal - it means we need to shake things up. Got some ideas for you!",
    "Plateaus happen to everyone. Your {exercise} might need a new stimulus. Let's try something different next week.",
    "Your body has adapted to the current challenge - time to evolve! I'm adjusting your program to break through this plateau.",
  ],

  // Missed workout recovery
  missedWorkout: [
    "Missed yesterday? No stress - one day doesn't define your journey. Ready to get back at it today?",
    "Yesterday is done. Today is a new opportunity. What's one exercise you can crush right now?",
    "Missing a workout isn't failure - it's life. The comeback is always stronger than the setback. Let's go!",
  ],

  // High performance acknowledgment
  highPerformance: [
    "Your recent performance has been EXCEPTIONAL. You're operating at a whole new level. Keep this energy!",
    "I've been watching your numbers and I'm genuinely impressed. You're doing everything right. Trust the process!",
    "Whatever you're doing outside the gym (sleep, nutrition, mindset) - keep doing it. Your results are showing it's working!",
  ],
};

// Analyze athlete data and determine appropriate message context
const analyzeAthleteContext = (athleteId, athleteProfile = {}) => {
  const workouts = getWorkouts(athleteId);
  const prs = getPRs(athleteId);
  const readiness = getAthleteReadiness(athleteId);
  const suggestions = generateProgramSuggestions(athleteId);

  // Calculate days since last workout
  let daysSinceLastWorkout = 0;
  if (workouts.length > 0) {
    const sortedWorkouts = workouts.sort((a, b) => new Date(b.date) - new Date(a.date));
    const lastWorkoutDate = new Date(sortedWorkouts[0].date);
    daysSinceLastWorkout = Math.floor((Date.now() - lastWorkoutDate) / (1000 * 60 * 60 * 24));
  }

  // Calculate weekly workout average
  let weeklyAverage = 0;
  if (workouts.length > 0) {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentWorkouts = workouts.filter(w => new Date(w.date) > thirtyDaysAgo);
    weeklyAverage = Math.round((recentWorkouts.length / 4) * 10) / 10;
  }

  // Calculate current streak
  let currentStreak = 0;
  if (workouts.length > 0) {
    const sortedWorkouts = workouts.sort((a, b) => new Date(b.date) - new Date(a.date));
    let lastDate = new Date();
    for (const workout of sortedWorkouts) {
      const workoutDate = new Date(workout.date);
      const dayDiff = Math.floor((lastDate - workoutDate) / (1000 * 60 * 60 * 24));
      if (dayDiff <= 2) { // Allow 1-2 day gaps for rest days
        currentStreak++;
        lastDate = workoutDate;
      } else {
        break;
      }
    }
  }

  // Check for recent PRs
  const recentPRs = [];
  Object.entries(prs).forEach(([exercise, prData]) => {
    if (prData.date) {
      const prDate = new Date(prData.date);
      const daysSincePR = Math.floor((Date.now() - prDate) / (1000 * 60 * 60 * 24));
      if (daysSincePR <= 7) {
        recentPRs.push({ exercise, ...prData, daysSincePR });
      }
    }
  });

  // Determine compliance trend
  let complianceTrend = 'stable';
  if (workouts.length >= 8) {
    const lastFourWeeks = workouts.slice(0, 16);
    const recentTwo = lastFourWeeks.slice(0, 8).length;
    const previousTwo = lastFourWeeks.slice(8, 16).length;
    if (recentTwo < previousTwo * 0.7) {
      complianceTrend = 'declining';
    } else if (recentTwo > previousTwo * 1.2) {
      complianceTrend = 'improving';
    }
  }

  // Check for plateau (no PRs in 4+ weeks)
  const weeksSinceLastPR = Object.values(prs).reduce((min, pr) => {
    if (pr.date) {
      const weeks = Math.floor((Date.now() - new Date(pr.date)) / (1000 * 60 * 60 * 24 * 7));
      return Math.min(min, weeks);
    }
    return min;
  }, Infinity);

  const hasPlateaued = weeksSinceLastPR >= 4 && workouts.length > 16;

  return {
    daysSinceLastWorkout,
    weeklyAverage,
    currentStreak,
    recentPRs,
    complianceTrend,
    hasPlateaued,
    weeksSinceLastPR,
    readinessScore: readiness.score,
    readinessStatus: readiness.status,
    totalWorkouts: workouts.length,
    suggestions,
    athleteProfile,
  };
};

// Get the athlete's first name for personalization
const getFirstName = (fullName) => {
  if (!fullName) return 'there';
  return fullName.split(' ')[0];
};

// Replace template variables with actual values
const personalizeMessage = (template, data) => {
  let message = template;
  Object.entries(data).forEach(([key, value]) => {
    message = message.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  });
  return message;
};

// Select random item from array
const randomSelect = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Generate smart message suggestions based on athlete context
export const generateSmartMessages = (athleteId, athleteName, athleteProfile = {}) => {
  const context = analyzeAthleteContext(athleteId, athleteProfile);
  const messages = [];

  // Priority 1: Re-engagement for inactive athletes
  if (context.daysSinceLastWorkout >= 14) {
    // Very inactive - use gentle + direct concern
    messages.push({
      type: 'reEngagement',
      priority: 'high',
      message: randomSelect(MESSAGE_TEMPLATES.reEngagement.gentle),
      reason: `No workout in ${context.daysSinceLastWorkout} days`,
      icon: 'heart',
    });
    messages.push({
      type: 'reEngagement',
      priority: 'high',
      message: randomSelect(MESSAGE_TEMPLATES.reEngagement.directConcern),
      reason: 'Extended absence - check wellbeing',
      icon: 'alert',
    });
  } else if (context.daysSinceLastWorkout >= 7) {
    // Week inactive - motivational approach
    messages.push({
      type: 'reEngagement',
      priority: 'medium',
      message: randomSelect(MESSAGE_TEMPLATES.reEngagement.motivational),
      reason: `${context.daysSinceLastWorkout} days since last workout`,
      icon: 'flame',
    });
  } else if (context.daysSinceLastWorkout >= 4) {
    // Few days - gentle nudge
    messages.push({
      type: 'missedWorkout',
      priority: 'low',
      message: randomSelect(MESSAGE_TEMPLATES.missedWorkout),
      reason: 'Missed recent workouts',
      icon: 'refresh',
    });
  }

  // Priority 2: Compliance drop detection
  if (context.complianceTrend === 'declining') {
    messages.push({
      type: 'complianceDrop',
      priority: 'medium',
      message: randomSelect(MESSAGE_TEMPLATES.complianceDrop.understanding),
      reason: 'Workout frequency declining',
      icon: 'calendar',
    });
  }

  // Priority 3: Celebrate recent PRs
  if (context.recentPRs.length > 0) {
    const latestPR = context.recentPRs[0];
    messages.push({
      type: 'prCelebration',
      priority: 'high',
      message: personalizeMessage(randomSelect(MESSAGE_TEMPLATES.prCelebration), {
        exercise: latestPR.exercise,
        weight: latestPR.weight,
      }),
      reason: `New PR on ${latestPR.exercise}!`,
      icon: 'trophy',
    });
  }

  // Priority 4: Streak celebration
  if (context.currentStreak >= 14) {
    messages.push({
      type: 'streakCelebration',
      priority: 'medium',
      message: personalizeMessage(randomSelect(MESSAGE_TEMPLATES.streakCelebration.long), {
        days: context.currentStreak,
      }),
      reason: `${context.currentStreak}-day streak!`,
      icon: 'fire',
    });
  } else if (context.currentStreak >= 7) {
    messages.push({
      type: 'streakCelebration',
      priority: 'low',
      message: personalizeMessage(randomSelect(MESSAGE_TEMPLATES.streakCelebration.medium), {
        days: context.currentStreak,
      }),
      reason: `${context.currentStreak}-day streak`,
      icon: 'fire',
    });
  }

  // Priority 5: Recovery recommendation for fatigued athletes
  if (context.readinessStatus === 'fatigued' || context.readinessScore < 40) {
    messages.push({
      type: 'recovery',
      priority: 'high',
      message: randomSelect(MESSAGE_TEMPLATES.recovery),
      reason: 'Signs of fatigue detected',
      icon: 'battery',
    });
  }

  // Priority 6: Plateau breaking
  if (context.hasPlateaued) {
    const lastPRExercise = Object.entries(context.athleteProfile?.prs || {}).sort(
      (a, b) => new Date(b[1].date) - new Date(a[1].date)
    )[0]?.[0] || 'your lifts';

    messages.push({
      type: 'plateau',
      priority: 'medium',
      message: personalizeMessage(randomSelect(MESSAGE_TEMPLATES.plateau), {
        exercise: lastPRExercise,
      }),
      reason: `No PRs in ${context.weeksSinceLastPR} weeks`,
      icon: 'trending',
    });
  }

  // Priority 7: High performance acknowledgment
  if (context.readinessScore > 80 && context.weeklyAverage >= 4 && context.recentPRs.length > 0) {
    messages.push({
      type: 'highPerformance',
      priority: 'low',
      message: randomSelect(MESSAGE_TEMPLATES.highPerformance),
      reason: 'Exceptional recent performance',
      icon: 'star',
    });
  }

  // Priority 8: General check-in (always include one)
  if (messages.length < 3) {
    const checkInType = context.totalWorkouts > 10 ? 'progress' : 'casual';
    messages.push({
      type: 'checkIn',
      priority: 'low',
      message: randomSelect(MESSAGE_TEMPLATES.checkIn[checkInType]),
      reason: 'Regular check-in',
      icon: 'message',
    });
  }

  // Sort by priority and return top 4
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  messages.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return messages.slice(0, 4);
};

// Generate alert-specific messages for the "Needs Attention" panel
export const generateAlertMessages = (alertType, athleteName, alertData = {}) => {
  const name = getFirstName(athleteName);

  const alertMessages = {
    noLogin: [
      `Hey ${name}, just checking in - hope everything's okay! No pressure, but I'm here whenever you're ready.`,
      `${name}, wanted to reach out and see how you're doing. Life gets busy, but your health matters. Thinking of you!`,
      `Hi ${name}! Haven't seen you in a while. Remember, even a quick workout counts. How can I help you get back on track?`,
      `${name}, your progress was inspiring! Whatever's keeping you away, I'm here to help work through it. Ready when you are.`,
    ],
    complianceDrop: [
      `${name}, I noticed things slowed down a bit. Want to chat about adjusting the program to fit your current schedule better?`,
      `Hey ${name}! Consistency dips happen - it's part of the journey. What's one thing we can do to make workouts easier to fit in?`,
      `${name}, no judgment here - life happens! Let's figure out what's working and what's not. Your success is my priority.`,
      `Hi ${name}! Quality over quantity always wins. Want me to simplify your program for the next few weeks?`,
    ],
    formIssue: [
      `${name}, I noticed some form cues we should address. Mind sending a quick video so I can help you move safer and stronger?`,
      `Hey ${name}! Want to do a form check on ${alertData.exercise || 'your lifts'}? Making sure you're moving well is priority one.`,
      `${name}, as weights go up, form becomes even more critical. Let's do a quick check to keep you injury-free!`,
    ],
    fatigued: [
      `${name}, your body is telling us something. How's sleep and stress been lately? Sometimes the best workout is recovery.`,
      `Hey ${name}! I'm seeing signs you might need a break. Consider this your permission to rest - you've earned it.`,
      `${name}, smart training means knowing when to push and when to recover. This week, let's focus on restoration.`,
    ],
    plateau: [
      `${name}, plateaus are just your body asking for something new! I've got some ideas to break through. Interested?`,
      `Hey ${name}! Time to shake things up. Your body has adapted - let's give it a new challenge to conquer.`,
      `${name}, stalled progress? That's not failure, that's data. Let's use it to evolve your program!`,
    ],
  };

  const messages = alertMessages[alertType] || alertMessages.noLogin;
  return messages.map((message, index) => ({
    id: `alert_${alertType}_${index}`,
    message,
    type: alertType,
  }));
};

// Get context-aware quick replies for chat
export const getChatQuickReplies = (athleteId, athleteName, lastMessage = '') => {
  const context = analyzeAthleteContext(athleteId);
  const name = getFirstName(athleteName);
  const replies = [];

  // Analyze last message sentiment (simple keyword detection)
  const lowerMessage = lastMessage.toLowerCase();
  const isPositive = /great|good|awesome|amazing|love|better|improved|pr|record/.test(lowerMessage);
  const isNegative = /tired|sore|pain|hurt|struggling|hard|difficult|can't|busy|stressed/.test(lowerMessage);
  const isQuestion = /\?|how|what|when|why|should/.test(lowerMessage);

  if (isPositive) {
    replies.push(
      `That's amazing to hear, ${name}! Keep that momentum going!`,
      `Love the energy! This is exactly what consistent effort looks like.`,
      `You've earned this progress. Proud of you!`
    );
  } else if (isNegative) {
    replies.push(
      `I hear you, ${name}. Let's figure out how to work with where you're at right now.`,
      `Thanks for being honest. We can always adjust - your wellbeing comes first.`,
      `That's completely normal. Want to dial things back a bit this week?`
    );
  } else if (isQuestion) {
    replies.push(
      `Great question! Let me think about the best approach for you specifically.`,
      `I'll look into this and get back to you with a personalized recommendation.`,
      `Happy to help clarify - what specifically would be most helpful to know?`
    );
  }

  // Add context-aware suggestions
  if (context.daysSinceLastWorkout >= 3) {
    replies.push(`How's the body feeling? Ready to get after it again?`);
  }

  if (context.readinessScore < 50) {
    replies.push(`Remember, recovery is when gains happen. Listen to your body!`);
  }

  if (context.recentPRs.length > 0) {
    replies.push(`Still riding high from that ${context.recentPRs[0].exercise} PR? You should be!`);
  }

  // Default helpful replies
  if (replies.length < 4) {
    replies.push(
      `Let me know if you need any adjustments to your program!`,
      `How are you feeling about your progress so far?`,
      `Remember, consistency beats perfection every time.`,
      `I'm here if you need anything!`
    );
  }

  return replies.slice(0, 4);
};

export default {
  generateSmartMessages,
  generateAlertMessages,
  getChatQuickReplies,
  analyzeAthleteContext,
};
