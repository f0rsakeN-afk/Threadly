import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import authRoutes from "./routes/authRoutes";
import postRoutes from "./routes/postRoutes";
import subRedditRoutes from "./routes/subRedditRoutes";
import commentRoutes from "./routes/commentRoutes";
import voteRoutes from "./routes/voteRoutes";
import { globalRateLimiter } from "./middlewares/rateLimiter";

const app = express();

app.use(cors());
app.use(express.json());

app.use(globalRateLimiter);
app.use("/api/subreddits", subRedditRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments/", commentRoutes);
app.use("/api/votes", voteRoutes);
app.use("/api/auth", authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
});
