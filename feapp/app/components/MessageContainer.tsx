import { View, Text, ScrollView } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import axiosInstance from '../utils/axiosInstanc';
import { FlashList } from '@shopify/flash-list';
import ChatMessage from './ChatMessage';

interface Message {
  id: string;
  text: string;
  role:string
}

interface MessageContainerProps {
  prompt: string;
  isSendClicked: boolean;
  setPrompt: (prompt: string) => void;
  setIsSendClicked: (isSendClicked: boolean) => void;
}

const MessageContainer = ({ prompt, setPrompt, isSendClicked, setIsSendClicked }: MessageContainerProps) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingMessage, setTypingMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const getResponse = async () => {
    console.log("in get response");
    try {
      const response = await axiosInstance.post(
        '/chat',
        {
          text: prompt,
          studentName: 'harsh',
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const responseData = response.data;
      // console.log('Response text:', responseData);
      const chunks = responseData.split('\n').filter((chunk: string) => chunk.trim() !== '');

      let botMessage = '';
      for (const chunk of chunks) {
        try {
          const data = JSON.parse(chunk);
          if (data.content) {
            botMessage += data.content; 
          }
        } catch (error) {
          console.error('Error parsing chunk:', error);
        }
      }

      if (botMessage) {
        setIsTyping(true);
        typeMessage(botMessage);
      }
    } catch (error) {
      console.error('Error fetching chat response:', error);
    } finally {
      setPrompt('');
      setIsSendClicked(false);
    }
  };

  const typeMessage = (message: string) => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < message.length) {
        setTypingMessage((prev) => prev + message.charAt(index));
        console.log("typing", typingMessage);
        index++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now()),
            text: message,
            role: "bot",
          },
        ]);
        setTypingMessage('');
      }
    }, 10); 
  };

  useEffect(() => {
    if (isSendClicked && prompt.trim()) {

      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          text: prompt,
          role: "user",
        },
      ]);

      getResponse();
    }
  }, [isSendClicked]);

  return (
    <ScrollView
      ref={scrollViewRef}
      className="flex-1"
      contentContainerStyle={{ paddingVertical: 20 }}
      onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
    >
      <FlashList
              data={messages}
              renderItem={({ item }) => (
                <ChatMessage
                  message={item.text}
                  role={item.role}
                  id={item.id}
                />
              )}
              estimatedItemSize={400}
              keyExtractor={(item, index) => index.toString()}
            />
      {isTyping && (
        <View className="flex-row items-center my-1 px-2">
          <View className="w-10 h-10 rounded-full bg-gray-200 justify-center items-center mr-2">
            <Text className="text-sm font-bold text-black">Bot</Text>
          </View>
          <View className="max-w-[80%] p-2 rounded-lg bg-gray-200">
            <Text className="text-base text-black">
              {typingMessage}
              <Text className="opacity-50">|</Text> {/* Blinking cursor effect */}
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default MessageContainer;