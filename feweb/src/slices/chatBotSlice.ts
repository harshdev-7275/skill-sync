import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface ChatBotState {
    isLearningForm: boolean;
    isResponding: boolean;
}

const initialState: ChatBotState={
    isLearningForm:false,
    isResponding:false
}

const chatBotSlice = createSlice({
    name: "chatBot",
    initialState,
    reducers:{
        setLearningForm:(state, action:PayloadAction<boolean>)=>{
            state.isLearningForm = action.payload
        },
        setResponding:(state, action:PayloadAction<boolean>)=>{
            state.isResponding = action.payload
        }
    }
})


export const {setLearningForm, setResponding} = chatBotSlice.actions
export default chatBotSlice.reducer