import { Slot, SplashScreen, Stack, useRouter } from "expo-router";
import "./global.css";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import GlobalProvider from "./utils/globalProvider";
import { SafeAreaView, Text, TouchableOpacity } from "react-native";
import { View } from "react-native";

export default function RootLayout() {
  const router = useRouter()
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../app/assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../app/assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../app/assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../app/assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../app/assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../app/assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../app/assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../app/assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../app/assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    } else if (error) {
      console.error("Error loading fonts:", error);
      // You could also display an error UI here
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded || error) {
    return null; // Or show a loading/error screen UI here
  }
  const handlePress = (index:number, route: "/" | "/explore" | "/profile") => {   
    router.push(route);
  };
  const tabs = [
    { label: "Home", route: "/" },
    { label: "Explore", route: "/explore" },
    { label: "Profile", route: "/profile" },
  ];

  return (
    <GlobalProvider>
  {/* <SafeAreaView className="flex-1 bg-white"> */}
        {/* Main Content */}
        <Slot />

        {/* Bottom Navigation */}
        {/* <View className="absolute bottom-6 left-4 right-4 h-14 bg-white flex-row items-center justify-around rounded-full shadow-lg">
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={index}
              className="flex-1 items-center justify-center"
              onPress={() => {
                if (tab.route === "/" || tab.route === "/explore" || tab.route === "/profile") {
                  handlePress(index, tab.route);
                } else {
                  console.error(`Invalid route: ${tab.route}`);
                }
              }}
            >
              <Text className="text-gray-800 font-bold">{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView> */}
    </GlobalProvider>
  );
}
