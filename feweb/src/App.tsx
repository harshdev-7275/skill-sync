import './App.css';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store/store';
import { setUser, clearUser } from './slices/userSlice';
import { login, logout } from './slices/authSlice';

import AuthPage from './pages/AuthPage';
import { Toaster } from './components/ui/toaster';
import ProtectedRoute from './components/ProtectedRoute';
import CompleteProfile from './pages/CompleteProfile';
import Sidebar from './components/Sidebar';
import axiosInstance from './lib/axiosInstance';
import { toast } from './hooks/use-toast';
import { useEffect } from 'react';
import ChatBotWrapper from './pages/ChatBotWrapper';

// import { Toaster } from 'react-hot-toast';

function App() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const token = useSelector((state: RootState) => state.auth.token);
  const email = useSelector((state: RootState) => state.user.email);
  // const username = useSelector((state: RootState) => state.user.username);
  // const avatar = useSelector((state: RootState) => state.user.avatar);
  const dispatch = useDispatch()
  // const navigate = useNavigate()
  const getUserDetails = async (token: string) => {
    try {
      const res = await axiosInstance.get("/auth/get-user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
     
      if (res.status === 200) {
        console.log("res.data", res.data.user)
        
        return {
          username: res.data.user.username,
          avatar: res.data.user.avatar,
          email : res.data.user.email
        };
      }
      console.log(res.data);
      return null; // Return null if status is not 200
    } catch (error) {
      console.error("Error in getUserDetails", error);
      toast({
        title: "Error",
        description: "Internal Server Error",
        className: "bg-red-200 text-black",
      });
      return null;
    }
  };
  useEffect(() => {
  
    const fetchUserDetails = async () => {
      if(token === null){
        dispatch(logout());
        dispatch(clearUser());
        <Navigate to="/" />
        return
      }
      const userDetails = await getUserDetails(token as string)
      
      // if(userDetails === null){
      //   dispatch(logout());
      //   dispatch(clearUser());
      //   <Navigate to="/" />
      // }
      dispatch(setUser({
        username: userDetails?.username === null || userDetails?.username === undefined ? "" : userDetails?.username,
        email: userDetails?.email === null || userDetails?.email === undefined ? "" : userDetails?.email,
        avatar: userDetails?.avatar === null || userDetails?.avatar === undefined ? "" : userDetails?.avatar
      }))
    }
    fetchUserDetails()
  }, [token])
  return (
    <div className='flex'>
    <BrowserRouter>
      {
        isAuthenticated && (
          <Sidebar />
        )
      }
      <div className={`w-full`}>

        <Routes>

          <Route path='/' element={<AuthPage />} />
          <Route
            path="/chat-bot"
            element={<ProtectedRoute element={<ChatBotWrapper />} />}
          />
          {/* <Route path='/complete-profile' element={<ProtectedRoute element={<CompleteProfile />} />} /> */}
          <Route path='/complete-profile' element={<CompleteProfile />} />

        </Routes>
      </div>
      <Toaster />
    </BrowserRouter>
    </div>
  );
}

export default App;