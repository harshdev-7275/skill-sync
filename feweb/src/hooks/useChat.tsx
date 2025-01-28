import { useState } from "react";

// Update your useChat hook
const useChat = () => {
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput(e.target.value);
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim()) return;
      
      // Add user message immediately
      setMessages(prev => [...prev, { role: 'user', content: input }]);
      setInput('');
      setIsLoading(true);
  
      try {
        const response = await fetch('http://localhost:3000/chatbot/respond', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ message: input })
        });
  
        if (!response.body) throw new Error('No response body');
  
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let assistantMessage = { role: 'assistant', content: '' };
  
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
  
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.trim() === '') continue;
            try {
              const data = JSON.parse(line);
              if (data.done) {
                setIsLoading(false);
              } else if (data.content) {
                assistantMessage.content += data.content;
                setMessages(prev => {
                  const lastMessage = prev[prev.length - 1];
                  if (lastMessage?.role === 'assistant') {
                    return [...prev.slice(0, -1), assistantMessage];
                  }
                  return [...prev, assistantMessage];
                });
              }
            } catch (error) {
              console.error('Error parsing chunk:', error);
            }
          }
        }
      } catch (error) {
        console.error("Error in chatbot:", error);
        setIsLoading(false);
      }
    };
  
    return { messages, input, handleInputChange, handleSubmit, isLoading };
  };