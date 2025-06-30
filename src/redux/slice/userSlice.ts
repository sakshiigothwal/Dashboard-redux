import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const baseURL = "https://685b7af589952852c2d9ab22.mockapi.io/api/users";

export type UserProps = {
  key: number;
  id: string;
  name: string;
  email: string;
};

type UserState = {
  users: UserProps[];
  loading: boolean;
  error: string | null;
};

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

// Thunks
export const fetchUsers = createAsyncThunk("user/fetchUsers", async () => {
  const res = await axios.get(baseURL);
  return res.data;
});

export const addUser = createAsyncThunk(
  "user/addUser",
  async (user: { name: string; email: string }) => {
    const response = await axios.post('https://685b7af589952852c2d9ab22.mockapi.io/api/users', user);
    return response.data;
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ id, name, email }: { id: string; name: string; email: string }) => {
    const response = await axios.put(`https://685b7af589952852c2d9ab22.mockapi.io/api/users/${id}`, {
      name,
      email,
    });
    return response.data;
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (id: string) => {
    await axios.delete(`${baseURL}/${id}`);
    return id;
  }
);

// Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //fetch
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error fetching users";
      })

      //add
      .addCase(addUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })

      //update
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })

      ///delete
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
      });
  },
});

export default userSlice.reducer;
