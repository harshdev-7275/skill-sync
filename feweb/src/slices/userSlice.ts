import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  username: string | null;
  email: string | null;
  avatar: string | null;
}

const initialState: UserState = {
  username: localStorage.getItem('username'),
  email: localStorage.getItem('email'),
  avatar: localStorage.getItem('avatar'),
};


const userSlice = createSlice({
  name: 'user', 
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ username: string; email: string; avatar: string }>) => {
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.avatar = action.payload.avatar;
      localStorage.setItem('name', action.payload.username);
      localStorage.setItem('email', action.payload.email);
      localStorage.setItem('avatar', action.payload.avatar);
    },
    clearUser: (state) => {
      state.username = null;
      state.email = null;
      state.avatar = null;
      localStorage.removeItem('username');
      localStorage.removeItem('email');
      localStorage.removeItem('avatar');
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
