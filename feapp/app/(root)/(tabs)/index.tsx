import { useGlobalContext } from "@/app/utils/globalProvider";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import MessageContainer from "@/app/components/MessageContainer";
import MessageInput from "@/app/components/MessageInput";
import { FlashList } from "@shopify/flash-list";
import ChatMessage from "@/app/components/ChatMessage";

const dummyMessages = [
  {
    id: 1,
    role: "user",
    messsage: "hello",
  },
  {
    id: 2,
    role: "assistant",
    messsage: "hello",
  },
  {
    id: 3,
    role: "user",
    message: "what are you doing?",
  },
  {
    id: 4,
    role: "assistant",
    message: "Nothing",
  },
];

export default function Index() {
  const { isLoggedIn, user } = useGlobalContext();
  const [messages, setMEssages] = useState(dummyMessages);
  const router = useRouter();
  const [prompt, setPrompt] = useState<string>("");
  const [isSendClicked, setIsSendClicked] = useState<boolean>(false);

  useEffect(() => {
    if (isLoggedIn) {
      // router.push("/explore");
    }
  }, [isLoggedIn]);
  console.log("is logged in", isLoggedIn);

  const avatarImages: { [key: string]: any } = {
    "avatar-1.png": require("../../assets/avatar/avatar-1.png"),
    "avatar-2.png": require("../../assets/avatar/avatar-2.png"),
    "avatar-3.png": require("../../assets/avatar/avatar-3.png"),
    "avatar-4.png": require("../../assets/avatar/avatar-4.png"),
    "avatar-5.png": require("../../assets/avatar/avatar-5.png"),
    "avatar-6.png": require("../../assets/avatar/avatar-6.png"),
    "avatar-7.png": require("../../assets/avatar/avatar-7.png"),
    "avatar-8.png": require("../../assets/avatar/avatar-8.png"),
  };

  return (
    <SafeAreaView className="flex-1">
      {!isLoggedIn ? (
        <View className="flex-1 justify-center items-center bg-[#060706]">
          <Text className="text-lg font-bold text-white">
            Welcome to the Skill Sync
          </Text>

          <View className="mt-4">
            Link to Sign-in Page
            <Link href="/sign-in" className="text-blue-500">
              Go to Sign In
            </Link>
          </View>
        </View>
      ) : (
        <LinearGradient
          colors={["#4B0082", "#060706"]}
          style={{ flex: 1 }}
          className="h-full"
        >
          <View className="flex flex-row items-center justify-end gap-16 p-4">
            <Text className="text-white text-lg font-semibold ml-4 text-center">
              SkiLL SYNC <Text className="text-gray-600">ASSISTANT</Text>
            </Text>
            <View className="flex items-end">
              <Image
                source={
                  user?.avatar === null
                    ? avatarImages[user?.avatar as string]
                    : avatarImages[`${user?.avatar}.png` as string]
                }
                className="p-2 border-2 border-purple-500"
                style={{ width: 40, height: 40, borderRadius: 50 }}
              />
              <Text>
                {user?.avatar !== null
                  ? avatarImages[user?.avatar as string]
                  : avatarImages["avatar-1.png"]}
              </Text>
            </View>
          </View>

          <View className="flex-1">
            {/* <FlashList
              data={messages}
              renderItem={({ item }) => (
                <ChatMessage
                  message={item.message}
                  role={item.role}
                  id={item.id}
                />
              )}
              estimatedItemSize={400}
              keyExtractor={(item, index) => index.toString()}
            /> */}
            <MessageContainer prompt={prompt} setPrompt={setPrompt} isSendClicked={isSendClicked} setIsSendClicked={setIsSendClicked}  />
          </View>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={70}
          >
            <View className="h-10 a">
              <MessageInput
                prompt={prompt}
                setPrompt={setPrompt}
                setIsSendClicked={setIsSendClicked}
              />
            </View>
          </KeyboardAvoidingView>
        </LinearGradient>
      )}
    </SafeAreaView>
  );
}
