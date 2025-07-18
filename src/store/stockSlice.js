import { createSlice } from '@reduxjs/toolkit';

// Helper: Load state from localStorage
const loadState = () => {
  try {
    const serialized = localStorage.getItem('InGState');
    if (!serialized) return undefined;
    const fullState = JSON.parse(serialized);
    return fullState.stocks || undefined;
  } catch (e) {
    console.warn("Failed to load from localStorage:", e);
    return undefined;
  }
};

// Initial state: load from localStorage if available
const initialState = loadState() || {
  list: [],
};

const stockSlice = createSlice({
  name: 'stocks',
  initialState,
  reducers: {
    addStock: (state, action) => {
      if (state.list.length < 5) {
        state.list.push(action.payload);
      }
    },
    removeStock: (state, action) => {
      state.list.splice(action.payload, 1);
    },
    setStocks: (state, action) => {
      state.list = action.payload;
    },
  },
});

export const { addStock, removeStock, setStocks } = stockSlice.actions;
export default stockSlice.reducer;