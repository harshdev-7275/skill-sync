import { createContext, ReactNode, useState, useEffect, useContext } from "react";
import axiosInstance from "./axiosInstanc";
import { useRouter } from "expo-router";
import { getToken } from "./token";

// User interface
export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  
}

// GlobalContext type
interface GlobalContextType {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  refetch: (newParams?: Record<string, string | number>) => Promise<void>;
}

// Creating the context
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// GlobalProvider component
export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Use router to redirect when not logged in

  // Function to fetch current user
  const getCurrentUser = async () => {
    try {
      setLoading(true); // Set loading state to true
      const token = await getToken(); // Replace with your token logic
      console.log("token in curr", token)
      const response = await axiosInstance.get("/auth/get-user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.user) {
        setUser(response.data.user); // Assuming response.data contains a user object
        setIsLoggedIn(true);
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setIsLoggedIn(false);
      setUser(null);
      // Redirect to /sign-in if not logged in
      router.push("/sign-in");
    } finally {
      setLoading(false); // Set loading state to false after the request completes
    }
  };

  // Refetch function to update user data
  const refetch = async (newParams?: Record<string, string | number>) => {
    await getCurrentUser();
  };

  // Initial fetch
  useEffect(() => {
    getCurrentUser();
  }, []);

  // Providing context value
  return (
    <GlobalContext.Provider value={{ isLoggedIn, user, loading, refetch }}>
      {children}
    </GlobalContext.Provider>
  );
};

// Custom hook to use GlobalContext
export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

export default GlobalProvider;
