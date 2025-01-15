import express, { Request, Response } from "express";
import authRoutes from "./routes/authRoutes";
import { personaPrompt } from "./utils/persona";
import { client } from "./utils/openAi";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON
app.use("/auth", authRoutes); // Use authentication routes


export const streamChatbotResponse = async (
  userPrompt: string,
  studentName: string,
  res: Response
) => {
  console.log("in stream");
  try {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    });
    const response = await client.chat.completions.create({
      model: "gpt-4",
      stream: true,
      messages: [
        { role: "system", content: personaPrompt },
        {
          role: "assistant",
          content: `Hello ${studentName}, I am Dr. Athena. How can I help you today?`,
        },
        { role: "user", content: userPrompt },
      ],
    });
    for await (const chunk of response) {
      if (chunk.choices[0]?.delta?.content) {
        const message = {
          object: "chat.completion.chunk",
          choices: [
            {
              delta: {
                content: chunk.choices[0].delta.content,
              },
            },
          ],
        };
        console.log(`data: ${JSON.stringify(message)}\n\n`);
        res.write(`data: ${JSON.stringify(message)}\n\n`);
      }
    }
    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (error) {
    console.error("Streaming error:", error);
    const errorMessage = {
      error: "An error occurred while streaming the response.",
    };
    res.write(`data: ${JSON.stringify(errorMessage)}\n\n`);
    res.write(`data: [DONE]\n\n`);
    res.end();
  }
};




app.post("/chat", async (req: Request, res: Response) => {
  try {
    const { text, studentName } = req.body;
    console.log("Received request:", { text, studentName });

    if (!text || !studentName) {
      res.status(400).json({ error: "Missing text or studentName" });
      return;
    }

   
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const response = await client.chat.completions.create({
      model: "gpt-4",
      stream: true,
      messages: [
        { role: "system", content: personaPrompt },
        { role: "user", content: text },
      ],
    });

    for await (const chunk of response) {
      if (chunk.choices[0]?.delta?.content) {
        const content = chunk.choices[0].delta.content;
        // Send each chunk as a complete JSON line
        console.log(JSON.stringify({ content }) + "\n");
        res.write(JSON.stringify({ content }) + "\n");
      } else {
        // Send completion signal
        
      }
    }
    res.write(JSON.stringify({ done: true }) + "\n");
      res.end();
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
