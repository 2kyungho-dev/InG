import { configureStore } from '@reduxjs/toolkit';
import stockReducer from './stockSlice';
import goalReducer from './goalSlice';

const store = configureStore({
  reducer: {
    stocks: stockReducer,
    goals: goalReducer,
  },
});

store.subscribe(()=>{
  const state = store.getState();
  localStorage.setItem('InGState', JSON.stringify(state))
})

export default store;