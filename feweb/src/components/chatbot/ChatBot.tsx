import React, { useEffect, useRef, useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { ArrowDown, Bot, Send, Sparkles, User } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { cn } from '../../lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { setLearningForm, setLearningFormSubmitSuccessFullyGlobal, setModuleGenerated, setModuleGeneratedButton } from '../../slices/chatBotSlice';
import { RootState } from '@/store/store';

// Enhanced useChat hook with form trigger handling
const useChat = () => {
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showLearningForm, setShowLearningForm] = useState(false);
    const dispatch = useDispatch()

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const submitMessage = async (messageContent: string , isFormSubmit?: boolean, isModuleGenerated?: boolean) => {
        if (!messageContent.trim()) return;

        setMessages(prev => [...prev, { role: 'user', content: messageContent }]);
        setIsLoading(true);
            let payload = {

            }
        try {
            if(isFormSubmit === true ){
                payload={
                    message: messageContent,
                    isFormSubmit: true
                }
                dispatch(setLearningFormSubmitSuccessFullyGlobal(false))
            }else if(isModuleGenerated === true){
                payload={
                    message: messageContent,
                    isModuleGenerated: true
                }
                dispatch(setModuleGenerated(false))
            }else{
                payload={
                    message: messageContent
                }
            }
            
            const response = await fetch('http://localhost:3000/chatbot/respond', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(payload)
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
                            if (data.isLearningForm) {
                                dispatch(setLearningForm(true))
                                setShowLearningForm(true);
                            }
                            if(data.isModuleButton === true){
                                dispatch(setModuleGeneratedButton(true))
                            }
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
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        submitMessage(input);
        setInput('');
    }

    return {
        messages,
        input,
        handleInputChange,
        handleSubmit: handleFormSubmit,  // Rename to avoid confusion
        submitMessage,
        isLoading,
        showLearningForm,
        setShowLearningForm
    };
};

interface ChatBotProps {
    isLearningFormSubmitSuccessFully: boolean
    setIsLearningFormSubmitSuccessFully: React.Dispatch<React.SetStateAction<boolean>>
}
const ChatBot = ({ isLearningFormSubmitSuccessFully, setIsLearningFormSubmitSuccessFully }: ChatBotProps) => {
    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        submitMessage,
        isLoading,
        showLearningForm
    } = useChat();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [lastMessageRef, setLastMessageRef] = useState<HTMLDivElement | null>(null);
    const isModuleGenerated = useSelector((state: RootState) => state.chatBot.isModuleGenerated);
    const isLearningFormSubmitSuccessFullyGlobal = useSelector((state: RootState) => state.chatBot.isLearningFormSubmitSuccessFullyGlobal);
    console.log("value in chatbot", isLearningFormSubmitSuccessFullyGlobal, isModuleGenerated)
    useEffect(() => {
        if (isLearningFormSubmitSuccessFullyGlobal === true ) {  
            console.log("value in chatbot of isLearningFormSubmitSuccessFullyGlobal", isLearningFormSubmitSuccessFullyGlobal)
            
            submitMessage('Form submitted successfully', true, false);
            setIsLearningFormSubmitSuccessFully(false);
        }
    }, [isLearningFormSubmitSuccessFullyGlobal]);
    
    useEffect(()=>{
        if(isModuleGenerated === true){
            console.log("value in chatbot ofisModuleGenerated ", isModuleGenerated)
            submitMessage('Module generated successfully',false , true);
        }
    },[isModuleGenerated])

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
            setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
        }
    };

    useEffect(() => {
        if (lastMessageRef && !isLoading) {
            lastMessageRef.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isLoading, lastMessageRef]);


    useEffect(() => {
        document.documentElement.classList.add('dark');
        return () => document.documentElement.classList.remove('dark');
    }, []);

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                const form = document.querySelector('form');
                if (form) form.requestSubmit();
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);


    useEffect(() => {
        if (showLearningForm) {
            window.dispatchEvent(new CustomEvent('showLearningForm'));
        }
    }, [showLearningForm]);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    };
    return (
        <TooltipProvider>
            <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
                <Card className="max-w-4xl h-[95%] mx-auto bg-gray-900/50 border-blue-500/20 backdrop-blur-sm">
                    <CardHeader className="border-b border-blue-500/20">
                        <CardTitle className="flex items-center gap-2 text-blue-400">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
                            >
                                <Sparkles className="w-5 h-5" />
                            </motion.div>
                            AI Learning Assistant
                        </CardTitle>
                    </CardHeader>
                    <ScrollArea
                        className="h-[60vh] md:h-[70vh] relative scroll-smooth"
                        ref={scrollRef}
                        onScroll={handleScroll}
                    >
                        <CardContent className="space-y-4 w-[600px]">
                            <AnimatePresence mode="popLayout" >
                                {messages.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-center space-y-4 my-8 "
                                    >
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.1, 1],
                                                rotate: [0, 5, -5, 0],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Number.POSITIVE_INFINITY,
                                                repeatType: 'reverse',
                                            }}
                                            className="w-20 h-20 mx-auto bg-blue-500/10 rounded-full flex items-center justify-center"
                                        >
                                            <Bot className="w-10 h-10 text-blue-400" />
                                        </motion.div>
                                        <div className="space-y-2">
                                            <h3 className="text-lg font-semibold text-blue-400">Welcome to Skill Sync!</h3>
                                            <p className="text-gray-400 max-w-sm mx-auto">
                                                Ready to embark on an exciting journey of growth and discovery? Let's get started!
                                                Just say "Hi", and we'll dive right in! 🚀✨                      </p>

                                        </div>
                                    </motion.div>
                                ) : (
                                    messages.map((message, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className={cn(
                                                '',
                                            )}
                                            ref={i === messages.length - 1 ? setLastMessageRef : undefined}
                                        >
                                            <div
                                                className={cn(
                                                    'flex gap-2 rounded-lg   transition-all duration-200',
                                                    message.role === 'user'
                                                        ? ' text-white  '
                                                        : ' text-gray-100 '
                                                )}
                                            >
                                                <div className="flex-shrink-0">
                                                    {message.role === 'user' ? (
                                                        <motion.div
                                                            whileHover={{ scale: 1.1 }}
                                                            className="w-8 h-8 rounded-full  flex items-center justify-center"
                                                        >
                                                            <User className="w-5 h-5" />
                                                        </motion.div>
                                                    ) : (
                                                        <motion.div
                                                            whileHover={{ scale: 1.1 }}
                                                            className="w-8 h-8 rounded-full flex items-center justify-center"
                                                        >
                                                            <Bot className="w-5 h-5" />
                                                        </motion.div>
                                                    )}
                                                </div>
                                                <div className="prose prose-invert max-w-none">
                                                    <div className="whitespace-pre-wrap">{message.content}</div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                                {isLoading && (
                                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                                        <div className=" text-gray-100 rounded-lg flex gap-1 items-center">
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center">
                                                <Bot className="w-5 h-5" />
                                            </div>
                                            <div className="flex gap-2">
                                                <motion.div
                                                    animate={{ y: [0, -8, 0] }}
                                                    transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
                                                    className="w-2 h-2 bg-blue-400 rounded-full"
                                                />
                                                <motion.div
                                                    animate={{ y: [0, -8, 0] }}
                                                    transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
                                                    className="w-2 h-2 bg-blue-400 rounded-full"
                                                />
                                                <motion.div
                                                    animate={{ y: [0, -8, 0] }}
                                                    transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, delay: 0.4 }}
                                                    className="w-2 h-2 bg-blue-400 rounded-full"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </CardContent>
                    </ScrollArea>
                    <AnimatePresence>
                        {showScrollButton && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute bottom-20 right-4"
                            >
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="icon"
                                            variant="secondary"
                                            onClick={scrollToBottom}
                                            className="rounded-full shadow-lg bg-blue-600 hover:bg-blue-700"
                                        >
                                            <ArrowDown className="w-4 h-4" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Scroll to bottom</p>
                                    </TooltipContent>
                                </Tooltip>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <CardFooter className=" border-t border-blue-500/20">
                        <form onSubmit={handleSubmit} className="flex gap-2 w-full">
                            <Input
                                value={input}
                                onChange={handleInputChange}
                                placeholder="Ask anything to learn..."
                                className="flex-1 bg-gray-800 border-blue-500/20 text-white placeholder:text-gray-400 focus-visible:ring-blue-400 transition-all duration-200"
                            />
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        type="submit"
                                        disabled={isLoading || !input.trim()}
                                        className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200"
                                    >
                                        <Send className="w-4 h-4" />
                                        <span className="sr-only">Send message</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Send message (⌘ + Enter)</p>
                                </TooltipContent>
                            </Tooltip>
                        </form>
                    </CardFooter>
                </Card>
            </div>
        </TooltipProvider>
    );
};

export default ChatBot;