import express from "express";
import authRoutes from "./routes/authRoutes";
import chatBotRoutes from "./routes/chatBotRoutes";
import learningRoutes from "./routes/learningRoutes";
import dotenv from "dotenv";
import cors from "cors"
dotenv.config();

export const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json()); 
app.use(cors())
app.use("/auth", authRoutes); 
app.use("/chatbot", chatBotRoutes);
app.use("/learning", learningRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
