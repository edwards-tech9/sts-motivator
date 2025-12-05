import { useState } from 'react';
import { Plus, Minus, GripVertical, Trash2, Copy, Save, ChevronDown, ChevronUp, Search, X } from 'lucide-react';

// Exercise library
const exerciseLibrary = [
  { id: 1, name: 'Barbell Back Squat', category: 'Legs', muscleGroups: ['Quads', 'Glutes'] },
  { id: 2, name: 'Romanian Deadlift', category: 'Legs', muscleGroups: ['Hamstrings', 'Glutes'] },
  { id: 3, name: 'Leg Press', category: 'Legs', muscleGroups: ['Quads', 'Glutes'] },
  { id: 4, name: 'Bulgarian Split Squat', category: 'Legs', muscleGroups: ['Quads', 'Glutes'] },
  { id: 5, name: 'Leg Curl', category: 'Legs', muscleGroups: ['Hamstrings'] },
  { id: 6, name: 'Calf Raise', category: 'Legs', muscleGroups: ['Calves'] },
  { id: 7, name: 'Bench Press', category: 'Chest', muscleGroups: ['Chest', 'Triceps'] },
  { id: 8, name: 'Incline Dumbbell Press', category: 'Chest', muscleGroups: ['Upper Chest', 'Shoulders'] },
  { id: 9, name: 'Cable Fly', category: 'Chest', muscleGroups: ['Chest'] },
  { id: 10, name: 'Pull-Up', category: 'Back', muscleGroups: ['Lats', 'Biceps'] },
  { id: 11, name: 'Barbell Row', category: 'Back', muscleGroups: ['Back', 'Biceps'] },
  { id: 12, name: 'Lat Pulldown', category: 'Back', muscleGroups: ['Lats'] },
  { id: 13, name: 'Seated Cable Row', category: 'Back', muscleGroups: ['Back', 'Biceps'] },
  { id: 14, name: 'Overhead Press', category: 'Shoulders', muscleGroups: ['Shoulders', 'Triceps'] },
  { id: 15, name: 'Lateral Raise', category: 'Shoulders', muscleGroups: ['Side Delts'] },
  { id: 16, name: 'Face Pull', category: 'Shoulders', muscleGroups: ['Rear Delts'] },
  { id: 17, name: 'Bicep Curl', category: 'Arms', muscleGroups: ['Biceps'] },
  { id: 18, name: 'Tricep Pushdown', category: 'Arms', muscleGroups: ['Triceps'] },
  { id: 19, name: 'Skull Crusher', category: 'Arms', muscleGroups: ['Triceps'] },
  { id: 20, name: 'Plank', category: 'Core', muscleGroups: ['Abs', 'Core'] },
];

const ProgramBuilder = () => {
  const [programName, setProgramName] = useState('New Strength Program');
  const [weeks, setWeeks] = useState(4);
  const [days, setDays] = useState([
    {
      id: 1,
      name: 'Day 1 - Lower Body',
      exercises: [
        { id: 1, exerciseId: 1, sets: 4, reps: '6-8', tempo: '3010', rest: 180 },
        { id: 2, exerciseId: 2, sets: 3, reps: '8-10', tempo: '3011', rest: 120 },
        { id: 3, exerciseId: 3, sets: 3, reps: '10-12', tempo: '2010', rest: 90 },
      ],
    },
    {
      id: 2,
      name: 'Day 2 - Upper Body',
      exercises: [
        { id: 1, exerciseId: 7, sets: 4, reps: '6-8', tempo: '3010', rest: 180 },
        { id: 2, exerciseId: 11, sets: 4, reps: '8-10', tempo: '2011', rest: 120 },
        { id: 3, exerciseId: 14, sets: 3, reps: '8-10', tempo: '2010', rest: 90 },
      ],
    },
  ]);

  const [expandedDay, setExpandedDay] = useState(0);
  const [showExerciseLibrary, setShowExerciseLibrary] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDayForExercise, setSelectedDayForExercise] = useState(null);

  const getExerciseName = (exerciseId) => {
    return exerciseLibrary.find((e) => e.id === exerciseId)?.name || 'Unknown';
  };

  const addDay = () => {
    const newDay = {
      id: Date.now(),
      name: `Day ${days.length + 1}`,
      exercises: [],
    };
    setDays([...days, newDay]);
    setExpandedDay(days.length);
  };

  const removeDay = (dayIndex) => {
    setDays(days.filter((_, i) => i !== dayIndex));
  };

  const updateDayName = (dayIndex, name) => {
    const newDays = [...days];
    newDays[dayIndex].name = name;
    setDays(newDays);
  };

  const addExerciseToDay = (dayIndex, exercise) => {
    const newDays = [...days];
    newDays[dayIndex].exercises.push({
      id: Date.now(),
      exerciseId: exercise.id,
      sets: 3,
      reps: '8-10',
      tempo: '2010',
      rest: 90,
    });
    setDays(newDays);
    setShowExerciseLibrary(false);
    setSelectedDayForExercise(null);
    setSearchTerm('');
  };

  const removeExercise = (dayIndex, exerciseIndex) => {
    const newDays = [...days];
    newDays[dayIndex].exercises.splice(exerciseIndex, 1);
    setDays(newDays);
  };

  const updateExercise = (dayIndex, exerciseIndex, field, value) => {
    const newDays = [...days];
    newDays[dayIndex].exercises[exerciseIndex][field] = value;
    setDays(newDays);
  };

  const duplicateDay = (dayIndex) => {
    const dayToCopy = days[dayIndex];
    const newDay = {
      ...dayToCopy,
      id: Date.now(),
      name: `${dayToCopy.name} (Copy)`,
      exercises: dayToCopy.exercises.map((e) => ({ ...e, id: Date.now() + Math.random() })),
    };
    setDays([...days, newDay]);
  };

  const filteredExercises = exerciseLibrary.filter(
    (e) =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.muscleGroups.some((mg) => mg.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSave = () => {
    // TODO: Save to Firestore
    console.log('Saving program:', { programName, weeks, days });
    alert('Program saved! (Demo mode - will save to Firebase when connected)');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black pb-24">
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-lg border-b border-slate-800">
        <div className="flex items-center justify-between p-4">
          <div>
            <p className="text-orange-400 font-bold text-sm tracking-wider">STS M0TIV8R</p>
            <p className="text-gray-400 text-xs">PROGRAM BUILDER</p>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-xl font-semibold"
          >
            <Save size={18} />
            Save
          </button>
        </div>
      </header>

      <div className="p-6">
        {/* Program Details */}
        <div className="bg-slate-800/50 rounded-2xl p-5 mb-6">
          <label className="block text-gray-400 text-sm mb-2">Program Name</label>
          <input
            type="text"
            value={programName}
            onChange={(e) => setProgramName(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-orange-500"
            style={{ fontFamily: 'Oswald, sans-serif' }}
          />

          <div className="mt-4">
            <label className="block text-gray-400 text-sm mb-2">Duration (Weeks)</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setWeeks(Math.max(1, weeks - 1))}
                className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600"
              >
                <Minus size={20} className="text-white" />
              </button>
              <span className="text-2xl font-bold text-white w-12 text-center">{weeks}</span>
              <button
                onClick={() => setWeeks(Math.min(12, weeks + 1))}
                className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600"
              >
                <Plus size={20} className="text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Training Days */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold">Training Days</h2>
          <button
            onClick={addDay}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-3 py-2 rounded-xl text-sm"
          >
            <Plus size={16} />
            Add Day
          </button>
        </div>

        <div className="space-y-4">
          {days.map((day, dayIndex) => (
            <div key={day.id} className="bg-slate-800/50 rounded-2xl overflow-hidden">
              {/* Day Header */}
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-800/70"
                onClick={() => setExpandedDay(expandedDay === dayIndex ? -1 : dayIndex)}
              >
                <div className="flex items-center gap-3">
                  <GripVertical className="text-gray-600" size={20} />
                  <input
                    type="text"
                    value={day.name}
                    onChange={(e) => updateDayName(dayIndex, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-transparent text-white font-semibold focus:outline-none focus:border-b-2 focus:border-orange-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">{day.exercises.length} exercises</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateDay(dayIndex);
                    }}
                    className="p-2 hover:bg-slate-700 rounded-lg"
                    title="Duplicate day"
                  >
                    <Copy size={16} className="text-gray-400" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeDay(dayIndex);
                    }}
                    className="p-2 hover:bg-red-500/20 rounded-lg"
                    title="Remove day"
                  >
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                  {expandedDay === dayIndex ? (
                    <ChevronUp className="text-gray-400" size={20} />
                  ) : (
                    <ChevronDown className="text-gray-400" size={20} />
                  )}
                </div>
              </div>

              {/* Day Exercises */}
              {expandedDay === dayIndex && (
                <div className="px-4 pb-4 space-y-3">
                  {day.exercises.map((exercise, exerciseIndex) => (
                    <div key={exercise.id} className="bg-slate-900/50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500 text-sm">{exerciseIndex + 1}.</span>
                          <span className="text-white font-medium">{getExerciseName(exercise.exerciseId)}</span>
                        </div>
                        <button
                          onClick={() => removeExercise(dayIndex, exerciseIndex)}
                          className="p-1 hover:bg-red-500/20 rounded"
                        >
                          <X size={16} className="text-red-400" />
                        </button>
                      </div>

                      <div className="grid grid-cols-4 gap-3">
                        <div>
                          <label className="block text-gray-500 text-xs mb-1">Sets</label>
                          <input
                            type="number"
                            value={exercise.sets}
                            onChange={(e) =>
                              updateExercise(dayIndex, exerciseIndex, 'sets', parseInt(e.target.value) || 0)
                            }
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-500 text-xs mb-1">Reps</label>
                          <input
                            type="text"
                            value={exercise.reps}
                            onChange={(e) => updateExercise(dayIndex, exerciseIndex, 'reps', e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-500 text-xs mb-1">Tempo</label>
                          <input
                            type="text"
                            value={exercise.tempo}
                            onChange={(e) => updateExercise(dayIndex, exerciseIndex, 'tempo', e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-500 text-xs mb-1">Rest (s)</label>
                          <input
                            type="number"
                            value={exercise.rest}
                            onChange={(e) =>
                              updateExercise(dayIndex, exerciseIndex, 'rest', parseInt(e.target.value) || 0)
                            }
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 px-3 text-white text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => {
                      setSelectedDayForExercise(dayIndex);
                      setShowExerciseLibrary(true);
                    }}
                    className="w-full bg-slate-700/50 hover:bg-slate-700 text-gray-300 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    <Plus size={18} />
                    Add Exercise
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Exercise Library Modal */}
      {showExerciseLibrary && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-end justify-center">
          <div className="bg-slate-900 rounded-t-3xl w-full max-w-lg h-[80vh] flex flex-col">
            <div className="p-6 border-b border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-lg">Exercise Library</h3>
                <button
                  onClick={() => {
                    setShowExerciseLibrary(false);
                    setSelectedDayForExercise(null);
                    setSearchTerm('');
                  }}
                  className="p-2 hover:bg-slate-800 rounded-lg"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search exercises..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-2">
              {filteredExercises.map((exercise) => (
                <button
                  key={exercise.id}
                  onClick={() => addExerciseToDay(selectedDayForExercise, exercise)}
                  className="w-full bg-slate-800/50 hover:bg-slate-800 rounded-xl p-4 text-left transition-colors"
                >
                  <p className="text-white font-medium">{exercise.name}</p>
                  <p className="text-gray-400 text-sm">
                    {exercise.category} · {exercise.muscleGroups.join(', ')}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramBuilder;
