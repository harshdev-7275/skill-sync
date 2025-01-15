import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, Image, ActivityIndicator, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axiosInstance from "./utils/axiosInstanc";
import { useGlobalContext, User } from "./utils/globalProvider";
import { getToken, saveToken } from "./utils/token";
import { Feather, AntDesign } from '@expo/vector-icons';
import { useRouter } from "expo-router";


const AVATAR_OPTIONS = [
  { id: 1, name: 'avatar-1', source: require('../app/assets/avatar/avatar-1.png') },
  { id: 2, name: 'avatar-2', source: require('../app/assets/avatar/avatar-2.png') },
  { id: 3, name: 'avatar-3', source: require('../app/assets/avatar/avatar-3.png') },
  { id: 4, name: 'avatar-4', source: require('../app/assets/avatar/avatar-4.png') },
  { id: 5, name: 'avatar-5', source: require('../app/assets/avatar/avatar-5.png') },
  { id: 6, name: 'avatar-6', source: require('../app/assets/avatar/avatar-6.png') },
  { id: 7, name: 'avatar-7', source: require('../app/assets/avatar/avatar-7.png') },
  { id: 8, name: 'avatar-8', source: require('../app/assets/avatar/avatar-8.png') },
];

const SignIn = () => {
  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoginScreen, setIsLoginScreen] = useState<boolean>(true);
  const [isAvatar, setIsAvatar] = useState<boolean>(false);
  const [selectedAvatar, setSelectedAvatar] = useState<{
    id: number;
    name: string;
    source: any;
  } | null>(null);
  const [username, setUsername] = useState('');
  const [isAvailable, setIsAvailable] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isUserName, setIsUserName] = useState<boolean>(false);
  const router = useRouter()
  const { isLoggedIn, user, refetch } = useGlobalContext();
const [userNamecheckMessage, setUserNamecheckMessage] =useState<string>("")
const [isLoading, setIsLoading] = useState<boolean>(false)
  const handleAvatarSelect = (avatar: typeof AVATAR_OPTIONS[0]) => {
    setSelectedAvatar(avatar);
    setIsAvatar(true);
    console.log(`Avatar selected: ${avatar.name}`);
  };
  const checkeUserName = async(value: string) => {
    try {
      const token = await getToken();
      const response = await axiosInstance.post(
        '/auth/check-username',  // Fixed the quote in URL
        { username: value },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if(response.status === 200) {
        setIsAvailable(true);
      } else {
        setUserNamecheckMessage(response.data.message);
        setIsAvailable(false);
      }
      setIsChecking(false);
    } catch (error) {
      console.error(error);
      setIsAvailable(false);
      setIsChecking(false);
    }
  };

  const checkUsername = (value: string) => {
    setIsChecking(true);
    setUsername(value);
    
    // Basic validation before making API call
    if (value.length >= 3 && !value.includes(' ')) {
      checkeUserName(value);  // Call the API check function
    } else {
      setUserNamecheckMessage("Username should be at least 3 characters long and should not contain spaces.");
      setIsAvailable(false);
      setIsChecking(false);
    }
  };

  const completeProfile = async () => {
    if (!selectedAvatar || !username || !isAvailable) {
      Alert.alert('Error', 'Please select an avatar and provide a valid username');
      return;
    }
    setIsLoading(true)

    try {
      const token = await getToken();

      const response = await axiosInstance.patch("/auth/update-profile", {
        username,
        avatar: selectedAvatar.name // Sending just the avatar name to backend
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Profile completed successfully');
        router.push("/")
        // Handle successful profile completion (e.g., update global context, redirect)
      }
    } catch (error) {
      console.error('Error completing profile:', error);
      Alert.alert('Error', 'Failed to complete profile');
    }finally{
      setIsLoading(false)
    }
  };

  // Rest of your existing code for signInHandler, loginHandler, etc.
  
  const signInHandler = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }

    try {
      const response = await axiosInstance.post("/auth/sign-in", {
        
        email,
        password,
      });

      if (response.status === 201) {
        Alert.alert("Success", "Account Created Successfully");
      }
    } catch (error) {
      console.error("Sign-in error:", error.message);
      Alert.alert("Error", "Failed to create account");
    }
  };

  const loginHandler = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }

    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      if (response.status === 200) {
        Alert.alert("Success", "Login Successful");
        saveToken(response.data.token);
        refetch()
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Failed to login");
    }
  };

  const checkUserProfile = async (user: User) => {
    console.log("in check", user);
    if (user.avatar && user.username) {
      router.push("/");
      return;
    }
    setIsAvatar(!!user.avatar);
    setIsUserName(!!user.username);
  };
  

  useEffect(() => {
    console.log("in use", isLoggedIn, user);
    if (!isLoggedIn &&user === null) {
      return
       // Trigger the refetch only when `isLoggedIn` is false
    } else {
      console.log("in else")
      const checkToken = async () => {
        try {
          const token = await getToken();
          if (token) {
            router.push("/");
          }
        } catch (error) {
          console.error("Error retrieving token:", error);
        }
      };
  
      checkToken();
  
      if (user!== null) {
        console.log("in")
        checkUserProfile(user);
      }
    }
  }, [isLoggedIn, user]);
  
  

  return (
    <>
      {isLoggedIn && (!isUserName || !isAvatar) ? (
        <SafeAreaView className="flex-1 bg-[#060706]">
          <View className="px-4">
            <Text className="text-white text-2xl font-semibold text-center mt-20 uppercase tracking-tighter">
              Complete your profile
            </Text>
            <Text className="text-gray-500 text-sm text-center mt-2">
              Set up your avatar and username to get started
            </Text>
            
            <View className="mt-8 flex items-center">
              <FlatList
                data={AVATAR_OPTIONS}
                keyExtractor={(item) => item.id.toString()}
                numColumns={4}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => handleAvatarSelect(item)}
                    className="m-2"
                  >
                    <Image
                      source={item.source}
                      className={`w-16 h-16 rounded-full border-2 ${
                        selectedAvatar?.id === item.id
                          ? "border-purple-600"
                          : "border-gray-300"
                      }`}
                    />
                  </TouchableOpacity>
                )}
              />
            </View>

            <View className="mt-8">
              <Text className="text-white text-lg mb-2">Username</Text>
              <View className="flex-row items-center border border-gray-700 rounded-lg px-3 py-2 bg-[#1A1A1A]">
                <TextInput
                  className="flex-1 text-base text-white"
                  placeholder="Choose a unique username"
                  placeholderTextColor="#666"
                  value={username}
                  onChangeText={checkUsername}
                />
                <View>
                  {isChecking ? (
                    <ActivityIndicator size="small" color="#666" />
                  ) : username && isAvailable ? (
                    <AntDesign name="checkcircle" size={20} color="#22C55E" />
                  ) : null}
                </View>
              </View>
              {username && !isChecking && (
                <Text
                  className={`mt-1 text-xs ${
                    isAvailable ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {isAvailable ? 'Username is available' : userNamecheckMessage}
                </Text>
              )}
            </View>

            <TouchableOpacity
              className={`bg-purple-600 p-4 rounded-lg mt-8 ${
                (!selectedAvatar || !isAvailable) ? 'opacity-50' : 'opacity-100'
              }`}
              onPress={completeProfile}
              disabled={!selectedAvatar || !isAvailable}
            >
              <Text className="text-center text-white text-lg font-bold">

                {
                  isLoading ? <ActivityIndicator  size="small" color="green" /> :"Complete Profile"
                }
                
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      ) : (
        <SafeAreaView className="flex-1 bg-[#1E1E1E]">
          {/* Your existing login/signup UI code */}
          <View className="flex-1 items-center justify-center">
            <Text className="text-slate-400 text-6xl font-extrabold mt-5 uppercase tracking-widest">
              SkillSync
            </Text>
            <Text className="text-gray-400 text-sm mt-2">
              Your Skills, Evolving in Sync.
            </Text>
          </View>
          
          <View className="flex-2 bg-[#282828] rounded-t-3xl px-5 py-8">
            <Text className="text-white text-xl font-bold text-center">
              {isLoginScreen ? "Login to an Account" : "Create an Account"}
            </Text>
            <Text className="text-white text-sm text-center mt-2">Or</Text>
            <Text
              className="text-blue-400 text-center mt-2 underline"
              onPress={() => setIsLoginScreen(!isLoginScreen)}
            >
              {isLoginScreen ? "Don't have an account?" : "Already have an account?"}
            </Text>

            <TextInput
              placeholder="Email"
              placeholderTextColor="#A1A1A1"
              keyboardType="email-address"
              className="bg-[#3A3A3A] text-white py-3 px-4 rounded-md mt-4"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#A1A1A1"
              secureTextEntry
              className="bg-[#3A3A3A] text-white py-3 px-4 rounded-md mt-4"
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              className="bg-blue-500 py-4 rounded-md mt-6"
              onPress={isLoginScreen ? loginHandler : signInHandler}
            >
              <Text className="text-white text-lg font-semibold text-center">
                {isLoginScreen ? "Log In" : "Sign In"}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}
    </>
  );
};

export default SignIn;