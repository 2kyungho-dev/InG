import { createSlice } from '@reduxjs/toolkit';


const loadGoalsState = () => {
  try {
    const serialized = localStorage.getItem('InGState');
    if (!serialized) return { lifeGoals: [], dailyGoals: [] };
    const fullState = JSON.parse(serialized);
    return fullState.goals || { lifeGoals: [], dailyGoals: [] };
  } catch (e) {
    console.warn("Failed to load goals from localStorage:", e);
    return { lifeGoals: [], dailyGoals: [] };
  }
};

const initialState = loadGoalsState();

const goalSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    setLifeGoals: (state, action) => {
      state.lifeGoals = action.payload.slice(0, 3); // Limit to 3 goals
    },
    addLifeGoal: (state, action) => {
      if (state.lifeGoals.length < 3) {
        state.lifeGoals.push(action.payload);
      }
    },
    addDailyGoal: (state, action) => {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const goalIndex = state.dailyGoals.findIndex(goal => goal.date === today);

      if (goalIndex !== -1) {
        // Update existing quote
        state.dailyGoals[goalIndex].quote = action.payload;
      } else {
        // Add new quote
        state.dailyGoals.push({ date: today, quote: action.payload });

        // Keep only the most recent 7 goals
        if (state.dailyGoals.length > 7) {
          state.dailyGoals.sort((a, b) => new Date(a.date) - new Date(b.date));
          state.dailyGoals = state.dailyGoals.slice(-7);
        }
      }
    },
  },
});

export const { setLifeGoals, addLifeGoal, addDailyGoal } = goalSlice.actions;
export default goalSlice.reducer;