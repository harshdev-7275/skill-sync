import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface ChatBotState {
    isLearningForm: boolean;
    isResponding: boolean;
    isModuleGenerated:boolean;
    isLearningFormSubmitSuccessFullyGlobal:boolean;
    isModuleButton:boolean;
}

const initialState: ChatBotState={
    isLearningForm:false,
    isResponding:false,
    isLearningFormSubmitSuccessFullyGlobal:false,
    isModuleGenerated:false,
    isModuleButton:false,
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
        },
        setModuleGenerated:(state, action:PayloadAction<boolean>)=>{
            state.isModuleGenerated = action.payload
        },
        setModuleGeneratedButton:(state, action:PayloadAction<boolean>)=>{
            state.isModuleButton = action.payload
        },
        setLearningFormSubmitSuccessFullyGlobal:(state, action:PayloadAction<boolean>)=>{
            state.isLearningFormSubmitSuccessFullyGlobal = action.payload
        }
    }
})


export const {setLearningForm, setResponding, setModuleGenerated, setModuleGeneratedButton, setLearningFormSubmitSuccessFullyGlobal} = chatBotSlice.actions
export default chatBotSlice.reducer