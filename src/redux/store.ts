import { configureStore } from '@reduxjs/toolkit';

import authReducer from './slice/authSlice';

export const store = configureStore({
    //all the reducers from slices
  reducer: {
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
