import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice'; // Import the slice

const store = configureStore({
  reducer: {
    user: userReducer, // Connect the user slice to the store
  },
});

export default store;
