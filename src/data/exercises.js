// Comprehensive Exercise Database with multiple video sources
// Each exercise has primary and alternative videos from top fitness channels
// Coaches can swap videos using the video management UI

export const exerciseDatabase = {
  // === COMPOUND LOWER BODY ===
  'Back Squat': {
    id: 'back-squat',
    name: 'Back Squat',
    category: 'compound',
    equipment: ['barbell', 'squat rack'],
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['hamstrings', 'core', 'lower back'],
    difficulty: 'intermediate',
    videoId: 'bEv6CCg2BC8', // Squat University
    alternativeVideos: [
      { id: 'gcNh17Ckjgg', channel: 'Alan Thrall', title: 'How To Squat' },
      { id: 'nhoikoUEI8U', channel: 'Jeff Nippard', title: 'Squat Technique' },
      { id: 'Uv_DKDl7EjA', channel: 'AthleanX', title: 'Perfect Squat' },
    ],
    instructions: [
      'Set the barbell at shoulder height in the squat rack',
      'Step under the bar and position it across your upper traps',
      'Grip the bar slightly wider than shoulder width',
      'Unrack and take 2-3 steps back, feet shoulder-width apart',
      'Brace your core and initiate the descent by breaking at hips and knees',
      'Lower until thighs are parallel to the ground (or deeper if mobility allows)',
      'Drive through your heels to stand back up',
      'Keep chest up and knees tracking over toes throughout'
    ],
    tips: [
      'Keep your weight balanced over mid-foot',
      'Maintain a neutral spine throughout the movement',
      'Breathe in at the top, hold during descent, exhale on the way up',
      'Warm up thoroughly before heavy sets'
    ],
    commonMistakes: [
      'Knees caving inward',
      'Rounding the lower back',
      'Rising onto toes',
      'Looking down instead of forward'
    ],
    xpValue: 15
  },

  'Deadlift': {
    id: 'deadlift',
    name: 'Deadlift',
    category: 'compound',
    equipment: ['barbell'],
    primaryMuscles: ['hamstrings', 'glutes', 'lower back'],
    secondaryMuscles: ['quads', 'core', 'traps', 'forearms'],
    difficulty: 'advanced',
    videoId: 'op9kVnSso6Q', // Alan Thrall
    alternativeVideos: [
      { id: 'wYREQkVtvEc', channel: 'AthleanX', title: 'Deadlift Form' },
      { id: 'ytGaGIn3SjE', channel: 'Jeff Nippard', title: 'Deadlift Tutorial' },
      { id: 'hCDzSR6bW10', channel: 'Starting Strength', title: 'Deadlift Setup' },
    ],
    instructions: [
      'Stand with feet hip-width apart, bar over mid-foot',
      'Bend at hips and knees to grip the bar just outside your legs',
      'Flatten your back and engage your lats',
      'Take a deep breath and brace your core',
      'Drive through your feet to lift the bar',
      'Keep the bar close to your body as you stand',
      'Lock out hips and knees at the top',
      'Lower by hinging at hips first, then bending knees'
    ],
    tips: [
      'The bar should travel in a straight vertical line',
      'Push the floor away rather than pulling the bar',
      'Keep your chest up throughout',
      'Squeeze glutes at lockout'
    ],
    commonMistakes: [
      'Rounding the back',
      'Bar drifting forward',
      'Hips rising too fast',
      'Not locking out properly'
    ],
    xpValue: 20
  },

  'Romanian Deadlift': {
    id: 'romanian-deadlift',
    name: 'Romanian Deadlift',
    category: 'compound',
    equipment: ['barbell', 'dumbbells'],
    primaryMuscles: ['hamstrings', 'glutes'],
    secondaryMuscles: ['lower back', 'core'],
    difficulty: 'intermediate',
    videoId: 'jEy_czb3RKA', // Squat University
    alternativeVideos: [
      { id: '2SHsk9AzdjA', channel: 'Jeff Nippard', title: 'RDL Guide' },
      { id: 'hCDzSR6bW10', channel: 'AthleanX', title: 'RDL Tutorial' },
      { id: 'JCXUYuzwNrM', channel: 'Renaissance Periodization', title: 'RDL Form' },
    ],
    instructions: [
      'Stand with feet hip-width apart, holding the barbell at hip level',
      'Maintain a slight bend in your knees throughout',
      'Push your hips back while lowering the bar along your legs',
      'Keep the bar close to your body the entire time',
      'Lower until you feel a stretch in your hamstrings',
      'Drive your hips forward to return to standing',
      'Squeeze your glutes at the top'
    ],
    tips: [
      'Think "hips back" not "bend forward"',
      'Keep your shoulder blades retracted',
      'The bar should travel in a straight line',
      'Control the eccentric portion'
    ],
    commonMistakes: [
      'Rounding the back',
      'Bending the knees too much',
      'Bar drifting away from legs',
      'Not feeling the hamstring stretch'
    ],
    xpValue: 12
  },

  'Front Squat': {
    id: 'front-squat',
    name: 'Front Squat',
    category: 'compound',
    equipment: ['barbell', 'squat rack'],
    primaryMuscles: ['quadriceps', 'core'],
    secondaryMuscles: ['glutes', 'upper back'],
    difficulty: 'advanced',
    videoId: 'v-mQm_droHg', // Squat University
    alternativeVideos: [
      { id: 'uYumuL_G_V0', channel: 'Alan Thrall', title: 'Front Squat Guide' },
      { id: 'wyDbagLaFlE', channel: 'AthleanX', title: 'Front Squat Form' },
    ],
    instructions: [
      'Position barbell across front deltoids',
      'Use clean grip or crossed-arm grip',
      'Keep elbows high throughout the movement',
      'Descend with an upright torso',
      'Drive up through your whole foot'
    ],
    tips: [
      'Elbows must stay high to keep bar in place',
      'Work on wrist and ankle mobility',
      'Keep core tight throughout'
    ],
    commonMistakes: [
      'Elbows dropping',
      'Forward lean',
      'Coming onto toes'
    ],
    xpValue: 15
  },

  'Leg Press': {
    id: 'leg-press',
    name: 'Leg Press',
    category: 'compound',
    equipment: ['leg press machine'],
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['hamstrings'],
    difficulty: 'beginner',
    videoId: 'IZxyjW7MPJQ', // Jeff Nippard
    alternativeVideos: [
      { id: 'GvRgijoJ2xY', channel: 'Renaissance Periodization', title: 'Leg Press Guide' },
      { id: 'yZmx_Ac3880', channel: 'AthleanX', title: 'Leg Press Mistakes' },
    ],
    instructions: [
      'Sit in the leg press machine with back flat against the pad',
      'Place feet hip-width apart on the platform',
      'Release the safety handles and lower the platform',
      'Lower until knees are at 90 degrees',
      'Press through your heels to extend your legs',
      'Do not lock out knees completely at the top'
    ],
    tips: [
      'Keep your lower back pressed against the pad',
      'Dont let knees cave inward',
      'Control the weight throughout',
      'Adjust foot position to target different muscles'
    ],
    commonMistakes: [
      'Lowering too deep (butt lifting off pad)',
      'Locking out knees',
      'Using too much weight',
      'Bouncing at the bottom'
    ],
    xpValue: 10
  },

  'Hip Thrust': {
    id: 'hip-thrust',
    name: 'Hip Thrust',
    category: 'compound',
    equipment: ['barbell', 'bench'],
    primaryMuscles: ['glutes'],
    secondaryMuscles: ['hamstrings', 'core'],
    difficulty: 'intermediate',
    videoId: 'LM8XHLYJoYs', // Bret Contreras
    alternativeVideos: [
      { id: 'SEdqd1n0cvg', channel: 'Jeff Nippard', title: 'Hip Thrust Guide' },
      { id: 'Zp26q4BY5HE', channel: 'AthleanX', title: 'Hip Thrust Form' },
    ],
    instructions: [
      'Sit with upper back against a bench',
      'Roll barbell over hips with pad',
      'Plant feet flat, hip-width apart',
      'Drive through heels to lift hips',
      'Squeeze glutes at the top',
      'Lower with control'
    ],
    tips: [
      'Keep chin tucked throughout',
      'Full lockout at the top',
      'Dont hyperextend your lower back'
    ],
    commonMistakes: [
      'Hyperextending lower back',
      'Feet too far forward/back',
      'Not squeezing at top'
    ],
    xpValue: 12
  },

  'Lunges': {
    id: 'lunges',
    name: 'Lunges',
    category: 'compound',
    equipment: ['dumbbells', 'barbell', 'bodyweight'],
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['hamstrings', 'core'],
    difficulty: 'beginner',
    videoId: 'QOVaHwm-Q6U', // AthleanX
    alternativeVideos: [
      { id: 'L8fvypPrzzs', channel: 'Jeff Nippard', title: 'Lunge Guide' },
      { id: 'wrwwXE_x-pQ', channel: 'Squat University', title: 'Lunge Form' },
    ],
    instructions: [
      'Stand tall with feet hip-width apart',
      'Step forward with one leg',
      'Lower until both knees are at 90 degrees',
      'Push through front heel to return',
      'Alternate legs or complete one side first'
    ],
    tips: [
      'Keep torso upright',
      'Front knee tracks over toes',
      'Control the descent'
    ],
    commonMistakes: [
      'Knee going past toes',
      'Leaning forward',
      'Short stride'
    ],
    xpValue: 10
  },

  // === COMPOUND UPPER BODY ===
  'Bench Press': {
    id: 'bench-press',
    name: 'Bench Press',
    category: 'compound',
    equipment: ['barbell', 'bench'],
    primaryMuscles: ['chest'],
    secondaryMuscles: ['shoulders', 'triceps'],
    difficulty: 'beginner',
    videoId: 'rT7DgCr-3pg', // Alan Thrall
    alternativeVideos: [
      { id: '4Y2ZdHCOXok', channel: 'Jeff Nippard', title: 'Bench Press Form' },
      { id: 'gRVjAtPip0Y', channel: 'AthleanX', title: 'Bench Press Guide' },
      { id: 'esQi683XR44', channel: 'Renaissance Periodization', title: 'Bench Tutorial' },
    ],
    instructions: [
      'Lie on the bench with eyes directly under the bar',
      'Grip the bar slightly wider than shoulder width',
      'Retract your shoulder blades and arch your upper back slightly',
      'Plant your feet firmly on the ground',
      'Unrack the bar and position it over your chest',
      'Lower the bar to your mid-chest with control',
      'Press the bar back up in a slight arc toward your face',
      'Lock out your elbows at the top'
    ],
    tips: [
      'Keep your wrists straight and stacked over elbows',
      'Drive your feet into the ground for leg drive',
      'Touch the same spot on your chest each rep',
      'Use a spotter for heavy sets'
    ],
    commonMistakes: [
      'Bouncing the bar off chest',
      'Flaring elbows too wide',
      'Losing back arch',
      'Not touching chest'
    ],
    xpValue: 15
  },

  'Overhead Press': {
    id: 'overhead-press',
    name: 'Overhead Press',
    category: 'compound',
    equipment: ['barbell', 'dumbbells'],
    primaryMuscles: ['shoulders'],
    secondaryMuscles: ['triceps', 'core', 'upper chest'],
    difficulty: 'intermediate',
    videoId: '_RlRDWO2jfg', // AthleanX
    alternativeVideos: [
      { id: 'wol7Hko8RhY', channel: 'Alan Thrall', title: 'OHP Tutorial' },
      { id: 'QAQ64hK4Xxs', channel: 'Jeff Nippard', title: 'Shoulder Press' },
      { id: 'F3QY5vMz_6I', channel: 'Starting Strength', title: 'Press Form' },
    ],
    instructions: [
      'Stand with feet shoulder-width apart',
      'Hold the bar at shoulder height, hands just outside shoulders',
      'Brace your core and squeeze your glutes',
      'Press the bar straight up, moving your head back slightly',
      'Lock out overhead with the bar over your midfoot',
      'Lower with control back to the starting position'
    ],
    tips: [
      'Keep your elbows slightly in front of the bar at the start',
      'Exhale as you press',
      'Avoid excessive back lean',
      'Full lockout at the top'
    ],
    commonMistakes: [
      'Excessive back arch',
      'Pressing forward instead of up',
      'Not locking out',
      'Flaring elbows'
    ],
    xpValue: 12
  },

  'Barbell Row': {
    id: 'barbell-row',
    name: 'Barbell Row',
    category: 'compound',
    equipment: ['barbell'],
    primaryMuscles: ['lats', 'upper back'],
    secondaryMuscles: ['biceps', 'rear delts', 'core'],
    difficulty: 'intermediate',
    videoId: 'FWJR5Ve8bnQ', // AthleanX
    alternativeVideos: [
      { id: '6FZHJGzMFEc', channel: 'Jeff Nippard', title: 'Row Variations' },
      { id: 'G8l_8chR5BE', channel: 'Alan Thrall', title: 'Pendlay Row' },
    ],
    instructions: [
      'Stand with feet hip-width apart, holding the barbell',
      'Hinge at the hips until torso is roughly 45 degrees',
      'Let arms hang straight down, grip slightly wider than shoulders',
      'Pull the bar toward your lower chest/upper abs',
      'Squeeze your shoulder blades together at the top',
      'Lower with control to the starting position'
    ],
    tips: [
      'Keep your core braced throughout',
      'Lead with your elbows',
      'Maintain a flat back',
      'Full stretch at the bottom'
    ],
    commonMistakes: [
      'Using momentum/swinging',
      'Rounding the back',
      'Not pulling high enough',
      'Standing too upright'
    ],
    xpValue: 12
  },

  'Pull-ups': {
    id: 'pull-ups',
    name: 'Pull-ups',
    category: 'compound',
    equipment: ['pull-up bar'],
    primaryMuscles: ['lats', 'biceps'],
    secondaryMuscles: ['upper back', 'rear delts', 'core'],
    difficulty: 'intermediate',
    videoId: 'eGo4IYlbE5g', // AthleanX
    alternativeVideos: [
      { id: 'HRV5YKKaeVw', channel: 'Jeff Nippard', title: 'Pull-up Guide' },
      { id: 'sIvJTfGxdFo', channel: 'Calisthenicmovement', title: 'Pull-up Tutorial' },
    ],
    instructions: [
      'Grip the bar slightly wider than shoulder width, palms facing away',
      'Hang with arms fully extended',
      'Engage your lats by pulling shoulder blades down',
      'Pull yourself up until chin clears the bar',
      'Lower with control to full arm extension',
      'Repeat without swinging'
    ],
    tips: [
      'Initiate the pull with your lats, not biceps',
      'Keep core engaged to prevent swinging',
      'Full range of motion each rep',
      'Use assistance if needed'
    ],
    commonMistakes: [
      'Kipping/swinging',
      'Not going to full extension',
      'Chin not clearing bar',
      'Shrugging shoulders up'
    ],
    xpValue: 15
  },

  'Dips': {
    id: 'dips',
    name: 'Dips',
    category: 'compound',
    equipment: ['dip station', 'parallel bars'],
    primaryMuscles: ['chest', 'triceps'],
    secondaryMuscles: ['shoulders'],
    difficulty: 'intermediate',
    videoId: 'dX_nSOOJIsE', // Calisthenicmovement
    alternativeVideos: [
      { id: '2z8JmcrW-As', channel: 'AthleanX', title: 'Dip Form' },
      { id: 'yN6Q1UI_xkE', channel: 'Jeff Nippard', title: 'Dip Guide' },
    ],
    instructions: [
      'Grip parallel bars and lift yourself up',
      'Lower your body by bending elbows',
      'Descend until upper arms are parallel to ground',
      'Press back up to starting position',
      'Keep core engaged throughout'
    ],
    tips: [
      'Lean forward for more chest activation',
      'Stay upright for more tricep focus',
      'Control the descent'
    ],
    commonMistakes: [
      'Going too deep',
      'Flaring elbows too much',
      'Swinging'
    ],
    xpValue: 12
  },

  'Lat Pulldown': {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    category: 'compound',
    equipment: ['cable machine', 'lat pulldown bar'],
    primaryMuscles: ['lats'],
    secondaryMuscles: ['biceps', 'upper back', 'rear delts'],
    difficulty: 'beginner',
    videoId: '0oeIB6wi3es', // Jeff Nippard
    alternativeVideos: [
      { id: 'CAwf7n6Luuc', channel: 'AthleanX', title: 'Lat Pulldown Guide' },
      { id: 'lueEJGjTuPQ', channel: 'Renaissance Periodization', title: 'Pulldown Form' },
    ],
    instructions: [
      'Sit at the machine with thighs secured under pad',
      'Grip the bar wider than shoulder width',
      'Pull the bar down to upper chest',
      'Squeeze your lats at the bottom',
      'Control the bar back up',
      'Full stretch at the top'
    ],
    tips: [
      'Lead with your elbows',
      'Slight lean back is okay',
      'Dont swing or use momentum'
    ],
    commonMistakes: [
      'Pulling behind the neck',
      'Using too much momentum',
      'Not full range of motion'
    ],
    xpValue: 10
  },

  // === ISOLATION EXERCISES ===
  'Leg Curl': {
    id: 'leg-curl',
    name: 'Leg Curl',
    category: 'isolation',
    equipment: ['leg curl machine'],
    primaryMuscles: ['hamstrings'],
    secondaryMuscles: ['calves'],
    difficulty: 'beginner',
    videoId: '1Tq3QdYUuHs', // Jeff Nippard
    alternativeVideos: [
      { id: 'ELOCsoDSmrg', channel: 'AthleanX', title: 'Leg Curl Form' },
      { id: 'n4zI5IFjUco', channel: 'Renaissance Periodization', title: 'Leg Curl Guide' },
    ],
    instructions: [
      'Lie face down on the leg curl machine',
      'Position the pad just above your heels',
      'Grip the handles and keep hips pressed into the bench',
      'Curl your heels toward your glutes',
      'Squeeze at the top of the movement',
      'Lower with control to the starting position'
    ],
    tips: [
      'Dont let your hips rise off the bench',
      'Focus on the squeeze at the top',
      'Control the negative portion',
      'Point toes to increase hamstring activation'
    ],
    commonMistakes: [
      'Using too much weight',
      'Hips lifting off bench',
      'Not full range of motion',
      'Going too fast'
    ],
    xpValue: 8
  },

  'Leg Extension': {
    id: 'leg-extension',
    name: 'Leg Extension',
    category: 'isolation',
    equipment: ['leg extension machine'],
    primaryMuscles: ['quadriceps'],
    secondaryMuscles: [],
    difficulty: 'beginner',
    videoId: 'YyvSfVjQeL0', // Jeff Nippard
    alternativeVideos: [
      { id: 'm0FOpMEgero', channel: 'AthleanX', title: 'Leg Extension Guide' },
    ],
    instructions: [
      'Sit on the machine with back against pad',
      'Position pad on lower shins',
      'Extend legs until straight',
      'Squeeze quads at the top',
      'Lower with control'
    ],
    tips: [
      'Dont lock out knees violently',
      'Control both phases',
      'Full contraction at top'
    ],
    commonMistakes: [
      'Using momentum',
      'Partial range of motion',
      'Too much weight'
    ],
    xpValue: 8
  },

  'Bicep Curls': {
    id: 'bicep-curls',
    name: 'Bicep Curls',
    category: 'isolation',
    equipment: ['dumbbells', 'barbell', 'ez-bar'],
    primaryMuscles: ['biceps'],
    secondaryMuscles: ['forearms'],
    difficulty: 'beginner',
    videoId: 'ykJmrZ5v0Oo', // Jeff Nippard
    alternativeVideos: [
      { id: 'kwG2ipFRgfo', channel: 'AthleanX', title: 'Bicep Curl Guide' },
      { id: 'av7-8igSXTs', channel: 'Renaissance Periodization', title: 'Curl Variations' },
    ],
    instructions: [
      'Stand with dumbbells at sides',
      'Keep elbows pinned to sides',
      'Curl weights up to shoulders',
      'Squeeze biceps at top',
      'Lower with control'
    ],
    tips: [
      'Dont swing your body',
      'Full range of motion',
      'Control the negative'
    ],
    commonMistakes: [
      'Using momentum',
      'Elbows moving forward',
      'Partial reps'
    ],
    xpValue: 8
  },

  'Tricep Extensions': {
    id: 'tricep-extensions',
    name: 'Tricep Extensions',
    category: 'isolation',
    equipment: ['dumbbells', 'cable machine', 'ez-bar'],
    primaryMuscles: ['triceps'],
    secondaryMuscles: [],
    difficulty: 'beginner',
    videoId: 'YbX7Wd8jQ-Q', // Jeff Nippard
    alternativeVideos: [
      { id: '2-LAMcpzODU', channel: 'AthleanX', title: 'Tricep Guide' },
      { id: 'vB5OHsJ3EME', channel: 'Renaissance Periodization', title: 'Tricep Training' },
    ],
    instructions: [
      'Use cable or dumbbell',
      'Keep elbows fixed in position',
      'Extend arms fully',
      'Squeeze triceps at lockout',
      'Control the return'
    ],
    tips: [
      'Dont let elbows drift',
      'Full lockout each rep',
      'Control the weight'
    ],
    commonMistakes: [
      'Elbows moving',
      'Using momentum',
      'Partial range of motion'
    ],
    xpValue: 8
  },

  'Lateral Raises': {
    id: 'lateral-raises',
    name: 'Lateral Raises',
    category: 'isolation',
    equipment: ['dumbbells', 'cables'],
    primaryMuscles: ['shoulders'],
    secondaryMuscles: [],
    difficulty: 'beginner',
    videoId: '3VcKaXpzqRo', // Jeff Nippard
    alternativeVideos: [
      { id: 'q5sNYB1Q6aM', channel: 'AthleanX', title: 'Lateral Raise Form' },
      { id: 'v_ZkxWzYnII', channel: 'Renaissance Periodization', title: 'Side Delts' },
    ],
    instructions: [
      'Stand with dumbbells at sides',
      'Raise arms out to sides',
      'Lift until parallel to ground',
      'Lower with control',
      'Keep slight bend in elbows'
    ],
    tips: [
      'Dont go too heavy',
      'Lead with elbows not hands',
      'Control the movement'
    ],
    commonMistakes: [
      'Using momentum',
      'Going too heavy',
      'Shrugging shoulders'
    ],
    xpValue: 8
  },

  'Face Pulls': {
    id: 'face-pulls',
    name: 'Face Pulls',
    category: 'isolation',
    equipment: ['cable machine', 'rope attachment'],
    primaryMuscles: ['rear delts', 'upper back'],
    secondaryMuscles: ['rotator cuff'],
    difficulty: 'beginner',
    videoId: 'rep-qVOkqgk', // AthleanX
    alternativeVideos: [
      { id: 'V8dZ3pyiCBo', channel: 'Jeff Nippard', title: 'Face Pull Guide' },
    ],
    instructions: [
      'Set cable at face height',
      'Grip rope with palms facing in',
      'Pull toward your face',
      'Separate the rope at the end',
      'Squeeze rear delts',
      'Return with control'
    ],
    tips: [
      'External rotate at the end',
      'Keep elbows high',
      'Squeeze shoulder blades'
    ],
    commonMistakes: [
      'Using too much weight',
      'Not pulling far enough back',
      'Elbows dropping'
    ],
    xpValue: 8
  },

  'Calf Raises': {
    id: 'calf-raises',
    name: 'Calf Raises',
    category: 'isolation',
    equipment: ['calf raise machine', 'dumbbells', 'smith machine'],
    primaryMuscles: ['calves'],
    secondaryMuscles: [],
    difficulty: 'beginner',
    videoId: 'wxwY7GXxL4k', // Jeff Nippard
    alternativeVideos: [
      { id: 'zB9y2P9_Rzw', channel: 'AthleanX', title: 'Calf Training' },
    ],
    instructions: [
      'Position balls of feet on platform',
      'Lower heels below platform level',
      'Rise up onto toes',
      'Squeeze at the top',
      'Lower with control'
    ],
    tips: [
      'Full range of motion',
      'Pause at the top',
      'Control the negative'
    ],
    commonMistakes: [
      'Bouncing',
      'Partial range of motion',
      'Going too fast'
    ],
    xpValue: 6
  },

  // === EXERCISES FROM WORKOUT PAGE ===
  'DB Good Morning': {
    id: 'db-good-morning',
    name: 'DB Good Morning',
    category: 'compound',
    equipment: ['dumbbells'],
    primaryMuscles: ['hamstrings', 'lower back'],
    secondaryMuscles: ['glutes', 'core'],
    difficulty: 'intermediate',
    videoId: 'YA-h3n9L4YU', // Good Morning Tutorial
    alternativeVideos: [
      { id: 'vKPGe8zb2S4', channel: 'Jeff Nippard', title: 'Good Morning Guide' },
      { id: 'Iml2poLiaXY', channel: 'AthleanX', title: 'Good Morning Form' },
    ],
    instructions: [
      'Hold dumbbells at shoulders or hanging at sides',
      'Stand with feet shoulder-width apart, slight knee bend',
      'Hinge at hips, pushing butt back',
      'Lower torso until parallel to ground (or feel hamstring stretch)',
      'Keep back flat throughout',
      'Drive hips forward to return to start'
    ],
    tips: [
      'Think "push hips back" not "bend forward"',
      'Keep weight in mid-foot to heels',
      'Maintain neutral spine throughout',
      'Start light to master the movement'
    ],
    commonMistakes: [
      'Rounding the lower back',
      'Bending knees too much (turning it into a squat)',
      'Not hinging at hips properly',
      'Going too heavy too soon'
    ],
    xpValue: 12
  },

  'Split Stance DB RDL': {
    id: 'split-stance-db-rdl',
    name: 'Split Stance DB RDL',
    category: 'compound',
    equipment: ['dumbbells'],
    primaryMuscles: ['hamstrings', 'glutes'],
    secondaryMuscles: ['lower back', 'core'],
    difficulty: 'intermediate',
    videoId: 'BxS6J3xjr6M', // Single Leg RDL Tutorial
    alternativeVideos: [
      { id: 'cYKYGwcg0U8', channel: 'Squat University', title: 'RDL Variations' },
      { id: '59pWTh0Y1B4', channel: 'Mind Pump TV', title: 'Split Stance RDL' },
    ],
    instructions: [
      'Hold dumbbells in front of thighs',
      'Stagger stance: one foot forward, back foot on toe',
      'Keep 80% of weight on front leg',
      'Hinge at hips, lowering dumbbells along front leg',
      'Feel stretch in front leg hamstring',
      'Drive through front heel to return'
    ],
    tips: [
      'Back leg is for balance only',
      'Keep front knee slightly bent',
      'Lower until you feel hamstring stretch',
      'Squeeze glute at the top'
    ],
    commonMistakes: [
      'Too much weight on back leg',
      'Rounding lower back',
      'Not hinging properly',
      'Rushing the movement'
    ],
    xpValue: 12
  },

  'Bulgarian Split Squat': {
    id: 'bulgarian-split-squat',
    name: 'Bulgarian Split Squat',
    category: 'compound',
    equipment: ['dumbbells', 'bench', 'barbell'],
    primaryMuscles: ['quadriceps', 'glutes'],
    secondaryMuscles: ['hamstrings', 'core'],
    difficulty: 'intermediate',
    videoId: '2C-uNgKwPLE', // Bulgarian Split Squat Tutorial
    alternativeVideos: [
      { id: 'hPlKPjohFS0', channel: 'Jeff Nippard', title: 'BSS Guide' },
      { id: 'hbpN_eCzHcg', channel: 'Squat University', title: 'BSS Form' },
      { id: 'JawPBvtf8mA', channel: 'AthleanX', title: 'Bulgarian Split Squat' },
    ],
    instructions: [
      'Stand 2-3 feet in front of a bench',
      'Place rear foot on bench, laces down',
      'Hold dumbbells at sides or barbell on back',
      'Lower until front thigh is parallel to ground',
      'Keep front knee tracking over toes',
      'Drive through front heel to stand'
    ],
    tips: [
      'Find the right distance from bench for your mobility',
      'Keep torso upright',
      'Front knee should track over toes, not cave in',
      'Control the descent'
    ],
    commonMistakes: [
      'Standing too close to bench',
      'Front knee caving inward',
      'Leaning too far forward',
      'Not going deep enough'
    ],
    xpValue: 12
  },

  'Seated Calf Raise': {
    id: 'seated-calf-raise',
    name: 'Seated Calf Raise',
    category: 'isolation',
    equipment: ['seated calf raise machine', 'smith machine'],
    primaryMuscles: ['calves'],
    secondaryMuscles: [],
    difficulty: 'beginner',
    videoId: 'JbyjNymZOt0', // Seated Calf Raise Tutorial
    alternativeVideos: [
      { id: 'zB9y2P9_Rzw', channel: 'AthleanX', title: 'Calf Training' },
      { id: 'Y5PYoD_XqSk', channel: 'Jeff Nippard', title: 'Calf Growth Guide' },
    ],
    instructions: [
      'Sit in the machine with thighs under the pad',
      'Position balls of feet on platform',
      'Release safety and lower heels below platform',
      'Press up onto toes, lifting the weight',
      'Squeeze at the top for 1-2 seconds',
      'Lower with control'
    ],
    tips: [
      'Seated position targets the soleus muscle',
      'Use full range of motion',
      'Pause and squeeze at the top',
      'Control the negative'
    ],
    commonMistakes: [
      'Bouncing the weight',
      'Partial range of motion',
      'Going too fast',
      'Not pausing at top'
    ],
    xpValue: 8
  },

  // === WARMUP EXERCISES ===
  'Ankle Stretch w/ KB': {
    id: 'ankle-stretch-kb',
    name: 'Ankle Stretch w/ KB',
    category: 'warmup',
    equipment: ['kettlebell'],
    primaryMuscles: ['calves'],
    secondaryMuscles: ['ankles'],
    difficulty: 'beginner',
    videoId: 'IikP_teeLkI',
    alternativeVideos: [
      { id: 'XISJxsccN1E', channel: 'Squat University', title: 'Ankle Mobility' },
    ],
    instructions: [
      'Hold a kettlebell in front of you for balance',
      'Step one foot forward into a deep lunge position',
      'Drive your knee forward over your toes while keeping heel down',
      'Hold for 30 seconds, then switch sides'
    ],
    tips: ['Keep heel firmly planted', 'Use weight to help drive knee forward'],
    xpValue: 3
  },

  '90/90 Breathing': {
    id: '90-90-breathing',
    name: '90/90 Breathing',
    category: 'warmup',
    equipment: ['wall', 'box'],
    primaryMuscles: ['core'],
    secondaryMuscles: ['diaphragm'],
    difficulty: 'beginner',
    videoId: 'uA2IxmMqE0M',
    alternativeVideos: [
      { id: 'YtNHpWW6qbI', channel: 'Postural Restoration', title: '90/90 Hip Lift' },
    ],
    instructions: [
      'Lie on your back with hips and knees at 90 degrees',
      'Feet on a wall or box',
      'Exhale fully and tuck your pelvis',
      'Inhale deeply through your nose focusing on rib expansion',
      'Perform 10 breaths'
    ],
    tips: ['Feel your low back press into the floor', 'Breathe into your sides and back'],
    xpValue: 3
  },

  'T-Spine Rotation': {
    id: 't-spine-rotation',
    name: 'T-Spine Rotation',
    category: 'warmup',
    equipment: ['none'],
    primaryMuscles: ['upper back'],
    secondaryMuscles: ['core'],
    difficulty: 'beginner',
    videoId: 'gHTE5SaKQkY',
    alternativeVideos: [
      { id: 'MQG3sWIJVl8', channel: 'FitnessFAQs', title: 'Thoracic Mobility' },
    ],
    instructions: [
      'Start on all fours, place one hand behind your head',
      'Rotate your elbow toward the opposite arm',
      'Then rotate up toward the ceiling',
      'Keep hips square and move from mid-back only',
      'Perform 10 reps each side'
    ],
    tips: ['Move slowly and controlled', 'Follow your elbow with your eyes'],
    xpValue: 3
  },

  'World\'s Greatest Stretch': {
    id: 'worlds-greatest-stretch',
    name: 'World\'s Greatest Stretch',
    category: 'warmup',
    equipment: ['none'],
    primaryMuscles: ['hip flexors', 'hamstrings'],
    secondaryMuscles: ['upper back', 'glutes'],
    difficulty: 'beginner',
    videoId: 'S5HcDJT9yMI',
    alternativeVideos: [],
    instructions: [
      'Step into a deep lunge position',
      'Place both hands inside your front foot',
      'Rotate your torso and reach to the ceiling',
      'Return and repeat on other side'
    ],
    tips: ['Keep back leg straight', 'Drive hip toward floor'],
    xpValue: 3
  },

  'Cat-Cow': {
    id: 'cat-cow',
    name: 'Cat-Cow',
    category: 'warmup',
    equipment: ['none'],
    primaryMuscles: ['spine'],
    secondaryMuscles: ['core'],
    difficulty: 'beginner',
    videoId: 'kqnua4rHVVA',
    alternativeVideos: [],
    instructions: [
      'Start on all fours, hands under shoulders, knees under hips',
      'Inhale: arch your back, lift chest and tailbone (Cow)',
      'Exhale: round your spine, tuck chin and tailbone (Cat)',
      'Flow between positions with breath'
    ],
    tips: ['Move with your breath', 'Feel each vertebra move'],
    xpValue: 3
  },

  // === FINISHER EXERCISES ===
  'Assisted Hip Airplanes': {
    id: 'hip-airplanes',
    name: 'Assisted Hip Airplanes',
    category: 'finisher',
    equipment: ['wall', 'pole'],
    primaryMuscles: ['glutes'],
    secondaryMuscles: ['hip rotators', 'core'],
    difficulty: 'intermediate',
    videoId: 'FyJMSP2n53Q',
    alternativeVideos: [],
    instructions: [
      'Stand on one leg, holding a wall or pole for support',
      'Hinge at the hip, extending free leg behind you',
      'Rotate your hips open and closed while maintaining balance',
      'Keep standing leg slightly bent'
    ],
    tips: ['Move slowly and controlled', 'Focus on hip rotation not trunk rotation'],
    xpValue: 5
  },

  'Rolling Plank': {
    id: 'rolling-plank',
    name: 'Rolling Plank',
    category: 'finisher',
    equipment: ['none'],
    primaryMuscles: ['core'],
    secondaryMuscles: ['shoulders', 'obliques'],
    difficulty: 'intermediate',
    videoId: 'Oyw9O7K_1tQ',
    alternativeVideos: [],
    instructions: [
      'Start in a forearm plank position',
      'Rotate to side plank on one arm',
      'Return to center, then rotate to other side',
      'Keep hips level throughout'
    ],
    tips: ['Don\'t let hips sag', 'Stack feet or stagger for stability'],
    xpValue: 5
  },

  'Dead Bug': {
    id: 'dead-bug',
    name: 'Dead Bug',
    category: 'finisher',
    equipment: ['none'],
    primaryMuscles: ['core'],
    secondaryMuscles: ['hip flexors'],
    difficulty: 'beginner',
    videoId: 'g_BYB0R-4Ws',
    alternativeVideos: [
      { id: 'I5xbsA71vxE', channel: 'Squat University', title: 'Dead Bug Progression' },
    ],
    instructions: [
      'Lie on your back, arms pointing to ceiling',
      'Lift legs to 90 degrees at hips and knees',
      'Lower opposite arm and leg toward floor',
      'Return and repeat with other side',
      'Keep lower back pressed into floor'
    ],
    tips: ['Exhale as you extend', 'Only go as far as you can maintain back position'],
    xpValue: 5
  },

  'Bird Dog': {
    id: 'bird-dog',
    name: 'Bird Dog',
    category: 'finisher',
    equipment: ['none'],
    primaryMuscles: ['core', 'lower back'],
    secondaryMuscles: ['glutes', 'shoulders'],
    difficulty: 'beginner',
    videoId: 'wiFNA3sqjCA',
    alternativeVideos: [],
    instructions: [
      'Start on all fours, hands under shoulders, knees under hips',
      'Extend opposite arm and leg simultaneously',
      'Hold for 2 seconds at full extension',
      'Return and repeat with other side'
    ],
    tips: ['Keep hips level', 'Think about pushing heel back not up'],
    xpValue: 5
  },
};

// Get exercise by name (case-insensitive)
export const getExercise = (name) => {
  const normalizedName = Object.keys(exerciseDatabase).find(
    key => key.toLowerCase() === name.toLowerCase()
  );
  return normalizedName ? exerciseDatabase[normalizedName] : null;
};

// Get all exercises by category
export const getExercisesByCategory = (category) => {
  return Object.values(exerciseDatabase).filter(ex => ex.category === category);
};

// Get all exercises by muscle group
export const getExercisesByMuscle = (muscle) => {
  return Object.values(exerciseDatabase).filter(
    ex => ex.primaryMuscles.includes(muscle) || ex.secondaryMuscles.includes(muscle)
  );
};

// Get all exercises as array
export const getAllExercises = () => Object.values(exerciseDatabase);

// Search exercises
export const searchExercises = (query) => {
  const q = query.toLowerCase();
  return Object.values(exerciseDatabase).filter(ex =>
    ex.name.toLowerCase().includes(q) ||
    ex.primaryMuscles.some(m => m.toLowerCase().includes(q)) ||
    ex.category.toLowerCase().includes(q)
  );
};

// Muscle group display names and icons
export const muscleGroups = {
  quadriceps: { name: 'Quadriceps', icon: '🦵' },
  hamstrings: { name: 'Hamstrings', icon: '🦵' },
  glutes: { name: 'Glutes', icon: '🍑' },
  chest: { name: 'Chest', icon: '💪' },
  shoulders: { name: 'Shoulders', icon: '🦾' },
  triceps: { name: 'Triceps', icon: '💪' },
  biceps: { name: 'Biceps', icon: '💪' },
  lats: { name: 'Lats', icon: '🔙' },
  'upper back': { name: 'Upper Back', icon: '🔙' },
  'lower back': { name: 'Lower Back', icon: '🔙' },
  'rear delts': { name: 'Rear Delts', icon: '🦾' },
  core: { name: 'Core', icon: '🎯' },
  calves: { name: 'Calves', icon: '🦵' },
  forearms: { name: 'Forearms', icon: '💪' },
  traps: { name: 'Traps', icon: '🦾' },
};

export default exerciseDatabase;
