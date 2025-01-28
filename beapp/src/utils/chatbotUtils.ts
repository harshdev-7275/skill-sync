import { Response } from "express";
import { getFirstTimePersonaPrompt } from "./persona";
import { client } from "./openAi";

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

