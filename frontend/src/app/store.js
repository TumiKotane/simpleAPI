import { configureStore } from '@reduxjs/toolkit'; // Import the configureStore function
import authReducer from "../features/authSlice";// Import the slice reducer

export const store = configureStore({ // Create the store
  reducer: {
    auth: authReducer // Add the auth reducer to the store on the auth key
  },
});
