import { Response } from "express";
import { getFirstTimePersonaPrompt } from "./persona";
import { client } from "./openAi";
import { getLearningFormPrompt, getModuleGeneratedPrompt } from "./prompts/utilsPrompts";

export const learningInitialze = async (
  username: string,
  message: string,
  res: Response
) => {
  try {

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const promptString: string = getFirstTimePersonaPrompt(username);

    const chatbotResponses = await client.chat.completions.create({
      stream: true,
      model: "gpt-4",
      messages: [
        { role: "system", content: promptString },
        { role: "user", content: message },
      ],
    });

    const stream = chatbotResponses.toReadableStream();
    const reader = stream.getReader();
    const decoder = new TextDecoder();


    let completeMessage = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        const shouldShowForm = isFormTriggerMessage(completeMessage);
        res.write(JSON.stringify({ 
          done: true,
          isLearningForm: shouldShowForm 
        }) + "\n");
        res.end();
        break;
      }
      const chunk = decoder.decode(value);
      const parsedChunk = JSON.parse(chunk);
      if (parsedChunk.choices[0]?.delta?.content) {
        const content = parsedChunk.choices[0].delta.content;
        completeMessage += content;
        res.write(JSON.stringify({ content }) + "\n");
      }
    }
  } catch (error) {
    console.error("error in learningInitialze", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const learningFormSubmit = async(userName:string, message:string, res:Response)=>{
  try {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const enhancedPrompt =  getLearningFormPrompt(userName, message);

    const chatBotResponse = await client.chat.completions.create({
      model: "gpt-4",
      messages: [{role: "user", content: enhancedPrompt}],
      temperature: 0.5,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: true,
    });
    const stream = chatBotResponse.toReadableStream();
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let completeMessage = "";
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        const shouldShowForm = isFormTriggerMessage(completeMessage);
        res.write(JSON.stringify({ 
          done: true,
          isLearningForm: shouldShowForm 
        }) + "\n");
        res.end();
        break;
      }
      const chunk = decoder.decode(value);
      const parsedChunk = JSON.parse(chunk);
      if (parsedChunk.choices[0]?.delta?.content) {
        const content = parsedChunk.choices[0].delta.content;
        completeMessage += content;
        res.write(JSON.stringify({ content }) + "\n");
      }
    }


  } catch (error) {
    console.error("error in learningInitialze", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export const learningModuleGenerated = async(userName:string, message:string, res:Response)=>{
  try {
    console.log("in learningModuleGenerated")
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const enhancedPrompt =  getModuleGeneratedPrompt(userName, message );
    console.log("enhancedPrompt", enhancedPrompt)

    const chatBotResponse = await client.chat.completions.create({
      model: "gpt-4",
      messages: [{role: "user", content: enhancedPrompt}],
      temperature: 0.5,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: true,
    });
    const stream = chatBotResponse.toReadableStream();
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let completeMessage = "";
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        const shouldModuleButton = isModuleButtonTrigger(completeMessage);
        res.write(JSON.stringify({ 
          done: true,
          isModuleButton: shouldModuleButton
        }) + "\n");
        res.end();
        break;
      }
      const chunk = decoder.decode(value);
      const parsedChunk = JSON.parse(chunk);
      if (parsedChunk.choices[0]?.delta?.content) {
        const content = parsedChunk.choices[0].delta.content;
        completeMessage += content;
        res.write(JSON.stringify({ content }) + "\n");
      }
    }
  } catch (error) {
    console.error("error in learningInitialze", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}


function isFormTriggerMessage(message: string): boolean {
  const formTriggerPhrases = [
    "fill out the form",
    "left side of your dashboard",
    "Let's get started on your learning journey",
    "perfectly tailored experience"
  ];
  
  return formTriggerPhrases.some(phrase => 
    message.toLowerCase().includes(phrase.toLowerCase())
  );
}


function isModuleButtonTrigger(message: string): boolean {
  const isModuleButtonPhrases = [
    "You can view your syllabus in left panel.",
    "syllabus has been generated"
  ];
  
  return isModuleButtonPhrases.some(phrase => 
    message.toLowerCase().includes(phrase.toLowerCase())
  );
}




