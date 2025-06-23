import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type User = {
  name?: string;
  email: string;
  password?: string;
};

interface AuthState {
  users: User[];
  isLoggedIn: boolean;
  currentUser: User | null;
}

const initialState: AuthState = {
  users: JSON.parse(localStorage.getItem('users') || '[]'),
  isLoggedIn: JSON.parse(localStorage.getItem('isLoggedIn') || 'false'),
  currentUser: JSON.parse(localStorage.getItem('currentUser') || 'null'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    registerUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
      localStorage.setItem('users', JSON.stringify(state.users));
    },
    login: (state, action: PayloadAction<User>) => {
      state.isLoggedIn = true;
      state.currentUser = action.payload;
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.currentUser = null;
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('currentUser');
    },
  },
});

export const { registerUser, login, logout } = authSlice.actions;
export default authSlice.reducer;
