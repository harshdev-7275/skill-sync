import { useEffect, useState } from 'react'
import { RootState } from '@/store/store'
import { useDispatch, useSelector } from 'react-redux'
import LearningForm from '../forms/LearningForm'
import { ring } from 'ldrs'
import { setLearningForm } from '../../slices/chatBotSlice'

ring.register()

interface ChatBotDashboardProps {
    setIsLearningFormSubmitSuccessFully: React.Dispatch<React.SetStateAction<boolean>>
}


const ChatBotDashboard = ({ setIsLearningFormSubmitSuccessFully }: ChatBotDashboardProps) => {
    const isLearningForm = useSelector((state: RootState) => state.chatBot.isLearningForm);
    const [isFormLoading, setIsFormLoading] = useState<boolean>(false);
    const dispatch = useDispatch();
  
    useEffect(() => {
      if (isLearningForm) {
        setIsFormLoading(true);
        setTimeout(() => {
          setIsFormLoading(false);
        }, 3000); // Show the spinner for 3 seconds
      }
    }, [isLearningForm]);
  
    return (
      <div className="w-full h-full">
        {isFormLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <l-ring size="40" stroke="5" />
          </div>
        ) : (
          isLearningForm && (
            <LearningForm
              setIsLearningFormSubmitSuccessFully={setIsLearningFormSubmitSuccessFully}
              setIsLearningFormOpen={() => {
                // Update Redux state to close the form
                dispatch(setLearningForm(false));
              }}
            />
          )
        )}
      </div>
    );
  };
  
  export default ChatBotDashboard;
  