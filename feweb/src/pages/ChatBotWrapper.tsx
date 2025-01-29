import ChatBotDashboard from '../components/chatbot/ChatBotDashboard'
import ChatBot from '../components/chatbot/ChatBot'
import { useState } from 'react'

const ChatBotWrapper = () => {
  const [isLearningFormSubmitSuccessFully, setIsLearningFormSubmitSuccessFully] = useState<boolean>(false)

  return (
    <div className='w-full h-screen overflow-hidden p-4'>
      <div className="container mx-auto h-full w-full flex">
        <div className='flex-1'>
          <ChatBotDashboard setIsLearningFormSubmitSuccessFully={setIsLearningFormSubmitSuccessFully}/>
        </div>
        <ChatBot isLearningFormSubmitSuccessFully={isLearningFormSubmitSuccessFully} setIsLearningFormSubmitSuccessFully={setIsLearningFormSubmitSuccessFully} />
      </div>
    </div>
  )
}

export default ChatBotWrapper 