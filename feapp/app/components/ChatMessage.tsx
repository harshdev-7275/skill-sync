import { View, Text, Image } from "react-native";
import React from "react";
import { useGlobalContext } from "../utils/globalProvider";

const ChatMessage = ({
  message,
  role,
  id,
}: {
  message: string | undefined;
  role: string;
  id: number;
}) => {
  const { user } = useGlobalContext();

  const avatarImages: { [key: string]: any } = {
    "avatar-1.png": require("../assets/avatar/avatar-1.png"),
    "avatar-2.png": require("../assets/avatar/avatar-2.png"),
    "avatar-3.png": require("../assets/avatar/avatar-3.png"),
    "avatar-4.png": require("../assets/avatar/avatar-4.png"),
    "avatar-5.png": require("../assets/avatar/avatar-5.png"),
    "avatar-6.png": require("../assets/avatar/avatar-6.png"),
    "avatar-7.png": require("../assets/avatar/avatar-7.png"),
    "avatar-8.png": require("../assets/avatar/avatar-8.png"),
  };

  return (
    <View className={`flex flex-row items-start my-2 px-4`}>
      {role === "bot" ? (
        <View className="w-10 h-10 rounded-full bg-gray-200 justify-center items-center mr-2">
          <Text className="text-sm font-bold text-black">AI</Text>
        </View>
      ) : (
        <View className="w-10 h-10 rounded-full border-2 border-purple-500 overflow-hidden mr-2">
          <Image
            source={
              user?.avatar === null
                ? avatarImages[user?.avatar as string]
                : avatarImages[`${user?.avatar}.png` as string]
            }
            className="w-full h-full"
          />
        </View>
      )}
      <View
        className={`max-w-[80%] p-3 rounded-lg ${
          role === "bot" ? "bg-gray-200" : "bg-purple-500"
        }`}
      >
        <Text className={`text-base ${role === "bot" ? "text-black" : "text-white"}`}>
          {message}
        </Text>
      </View>
    </View>
  );
};

export default ChatMessage;