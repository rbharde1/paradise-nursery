import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './CartSlice';

// configureStore wires up the reducer, the Redux DevTools and the default
// middleware (including thunk) in a single call.
const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

export default store;
