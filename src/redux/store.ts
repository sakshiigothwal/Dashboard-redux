import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slice/authSlice';
import userReducer from './slice/userSlice';

export const store = configureStore({
    //all the reducers from slices
  reducer: {
    auth: authReducer,
    user: userReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
