import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slices/userSlice';
import authReducer from '../slices/authSlice';
import chatBotReducer from "../slices/chatBotSlice"

const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
    chatBot:chatBotReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;