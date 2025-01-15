import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {useSharedValue} from "react-native-reanimated"


const ATouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity) 
interface MessageInputProps{
    prompt:string;
    setPrompt:(prompt:string) => void
    setIsSendClicked:(isSendClicked:boolean) => void
}
const MessageInput = ({prompt, setPrompt, setIsSendClicked}: MessageInputProps) => {
    const {bottom} = useSafeAreaInsets()
    const expanded = useSharedValue(0)
  return (
    <View className="flex-1 flex-row items-center gap-2 px-5">
        <TextInput
        autoFocus
        value={prompt}
        placeholder='Type your message here'
            multiline={true}
            numberOfLines={2}
            onChange={(event) => setPrompt(event.nativeEvent.text)}
            className="bg-white w-[94%] rounded-full py-2 px-2 text-gray-500 flex items-center justify-start"        
        />
        <TouchableOpacity onPress={() => setIsSendClicked(true)}>
        <AntDesign name="right" size={24} color="white" />
        </TouchableOpacity>
    </View>
  )
}

export default MessageInput