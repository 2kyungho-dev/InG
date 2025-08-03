import { configureStore } from '@reduxjs/toolkit';
import stockReducer from './stockSlice';
import goalReducer from './goalSlice';
import quoteReducer from './quoteSlice';

const store = configureStore({
  reducer: {
    stocks: stockReducer,
    goals: goalReducer,
    likedQuotes: quoteReducer,
  },
});

store.subscribe(()=>{
  const state = store.getState();
  localStorage.setItem('InGState', JSON.stringify(state))
})

export default store;