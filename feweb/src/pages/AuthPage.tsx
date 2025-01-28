import axiosInstance from "../lib/axiosInstance";
import { Textarea } from "../components/ui/textarea";
import { jwtDecode } from "jwt-decode";

import { Eye, EyeOff, Lock, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "../hooks/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../slices/authSlice";
import { setUser } from "../slices/userSlice";
import { RootState } from "@/store/store";
import { useNavigate } from "react-router-dom";

const placeholderTexts = [
  "What’s your dream role in tech?",
  "Which skills are you looking to master?",
  "Tell me your field of interest – Python, Frontend, Node.js, or something else?",
  "Preparing for a job? Let’s map your learning path!",
  "Need guidance on where to start? Ask Dr. Athena!",
];

const AuthPage = () => {
  const { toast } = useToast();
  const dispatch = useDispatch()
  const [isLoginPage, setIsLoginPage] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [currentText, setCurrentText] = useState<string>("");
  const [textIndex, setTextIndex] = useState<number>(0);
  const [charIndex, setCharIndex] = useState<number>(0);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const navigate = useNavigate()

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (charIndex < placeholderTexts[textIndex].length) {
        setCurrentText((prev) => prev + placeholderTexts[textIndex][charIndex]);
        setCharIndex((prev) => prev + 1);
      } else {

        setTimeout(() => {
          setCurrentText("");
          setCharIndex(0);
          setTextIndex((prev) => (prev + 1) % placeholderTexts.length);
        }, 2000);
      }
    }, 20);

    return () => clearTimeout(timeout);
  }, [charIndex, textIndex]);


  const getUserDetails = async (token: string) => {
    try {
      const res = await axiosInstance.get("/auth/get-user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // if(res.status=== 400){
      //   // dispatch(logout())
      //   navigate("/")
      //   return;
      // }
      if (res.status === 200) {
        return {
          username: res.data.username,
          avatar: res.data.avatar,
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


  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!email || !password) {
        toast({
          title: "Error",
          description: "All fields are required",
          className: "bg-red-200 text-black",
        })
        return;
      }
      toast({
        title: "Creating your account....",
        description: "Please wait",
        className: "bg-blue-200 text-black",
      })
      console.log(email, password);
      const res = await axiosInstance.post("/auth/sign-in", {
        email,
        password
      })
      if (res.status === 201) {
        toast({
          title: "Account created successfully",
          description: "You can now login",
          className: "bg-green-200 text-black",
        })
        setIsLoginPage(true);
      }


    } catch (error) {
      console.error("Error in register", error);
      toast({
        title: "Error",
        description: "Internal Server Error",
        className: "bg-red-200 text-black",
      })
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(email, password);
    try {
      if (!email || !password) {
        toast({
          title: "Error",
          description: "All fields are required",
          className: "bg-red-200 text-black"
        })
        return;
      }
      const res = await axiosInstance.post("/auth/login", {
        email,
        password
      })
      console.log("res in login", res.data.token);
      if (res.status === 200) {
        dispatch(login(res.data.token))
        console.log("decoded", jwtDecode(res.data.token))
        const decoded = jwtDecode(res.data.token) as { email: string, }
        const userDetails = await getUserDetails(res.data.token as string)
        console.log("after calls", userDetails)
        dispatch(setUser({
          username: userDetails?.username === null || userDetails?.username === undefined ? "" : userDetails?.username,
          email: decoded.email,
          avatar: userDetails?.avatar === null || userDetails?.avatar === undefined ? "" : userDetails?.avatar
        }))
        toast({
          title: "Login successful",
          description: "You are now logged in",
          className: "bg-green-200 text-black"
        })
      }
    } catch (err) {
      console.error("error in login", err)
      toast({
        title: "Error",
        description: "Internal Server Error",
        className: "bg-red-200 text-black"
      })
    }
  }


  
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/chat-bot")
    }
  }, [isAuthenticated, navigate])


  useEffect(() => {
    if (isAuthenticated) {
      navigate("/chat-bot")
    }
  }, [])

  return (
    <div className="w-screen h-screen overflow-hidden">
      <div className="container mx-auto w-full h-full px-3 py-4 flex">
        <>
          {!isLoginPage ? (
            <div className="w-[50%] h-full flex flex-col justify-center">
              <h1 className="text-white font-semibold capitalize">
                Create a free account.
              </h1>
              <p className="text-slate-400 text-sm">
                Your Smart Assistance For Learning.
              </p>
              <form className="mt-10 pr-32 flex flex-col gap-4" onSubmit={handleRegister}>
                <div className="flex items-center gap-2 bg-slate-900/65 w-full px-5 py-4 rounded-full">
                  <User size={20} />
                  <input
                    type="email"
                    id="email"
                    placeholder="xyz@example.com"
                    className="outline-none bg-transparent w-full"
                    value={email || ""}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2 bg-slate-900/65 w-full px-5 py-4 rounded-full">
                  <Lock size={20} />
                  <div className="flex items-center justify-between w-full">
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      id="password"
                      placeholder="Enter your password."
                      className="outline-none bg-transparent w-full"
                      value={password || ""}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {isPasswordVisible ? (
                      <button
                        type="button"
                        onClick={() => setIsPasswordVisible(false)}
                        className="text-slate-400 text-sm"
                      >
                        <Eye size={20} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsPasswordVisible(true)}
                        className="text-slate-400 text-sm"
                      >
                        <EyeOff size={20} />
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <button className="w-full bg-[#23304e] text-white py-2 rounded-full hover:scale-105 transition-transform font-semibold" type="submit">
                    Sign up
                  </button>
                </div>
                <p>
                  Already have an account?
                  <span
                    className="text-blue-500 cursor-pointer"
                    onClick={() => setIsLoginPage(true)}
                  >
                    {!isLoginPage && " Login"}
                  </span>
                </p>
              </form>
            </div>
          ) : (
            <div className="w-[50%] h-full flex flex-col justify-center">
              <h1 className="text-white font-semibold capitalize">
                Login To Your Account.
              </h1>
              <p className="text-slate-400 text-sm">
                Your Smart Assistance For Learning.
              </p>
              <form className="mt-10 pr-32 flex flex-col gap-4" onSubmit={handleLogin}>
                <div className="flex items-center gap-2 bg-slate-900/65 w-full px-5 py-4 rounded-full">
                  <User size={20} />
                  <input
                    type="email"
                    id="email"
                    value={email || ""}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="xyz@example.com"
                    className="outline-none bg-transparent w-full"
                  />
                </div>
                <div className="flex items-center gap-2 bg-slate-900/65 w-full px-5 py-4 rounded-full">
                  <Lock size={20} />
                  <div className="flex items-center justify-between w-full">
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      id="password"
                      value={password || ""}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password."
                      className="outline-none bg-transparent w-full"
                    />
                    {isPasswordVisible ? (
                      <button
                        type="button"
                        onClick={() => setIsPasswordVisible(false)}
                        className="text-slate-400 text-sm"
                      >
                        <Eye size={20} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsPasswordVisible(true)}
                        className="text-slate-400 text-sm"
                      >
                        <EyeOff size={20} />
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <button className="w-full bg-[#23304e] text-white py-2 rounded-full hover:scale-105 transition-transform font-semibold" type="submit">
                    Log in
                  </button>
                </div>
                <p>
                  Don&apos;t have an account?
                  <span
                    className="text-blue-500 cursor-pointer"
                    onClick={() => setIsLoginPage(false)}
                  >
                    {isLoginPage && " Sign up"}
                  </span>
                </p>
              </form>
            </div>
          )}
          <div className="w-[50%] h-full bg-[#23304e] rounded-xl z-50">
            <div className="container mx-auto w-full h-full relative">
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-white font-thin capitalize px-3">
                  Welcome to Dr. Athena, your AI-powered career mentor designed to guide you toward your dream job in tech. Whether you aspire to excel in Frontend Development, Node.js, Python, or other fields, Dr. Athena offers personalized learning paths, dynamic skill assessments, and actionable feedback to help you grow. With curated resources, quizzes, and coding challenges tailored to your goals, you’ll receive all the support you need to master new skills and advance your career. Let Dr. Athena be your trusted companion on the journey to unlocking your full potential!
                </p>
              </div>
              <div className="absolute bottom-3 w-full flex justify-end items-center px-4">
                <Textarea
                  placeholder={currentText}
                  className="text-black bg-white"
                />
              </div>
            </div>
          </div>
        </>
      </div>
    </div>
  );
};

export default AuthPage;
