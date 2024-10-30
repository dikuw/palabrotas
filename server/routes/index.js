import authRouter from './authRoutes.js';
import userRouter from './userRoutes.js';
import contentRouter from './contentRoutes.js'; 
import flashcardRouter from './flashcardRoutes.js';
import feedbackRouter from './feedbackRoutes.js';
import commentRouter from './commentRoutes.js';
import voteRouter from './voteRoutes.js';
import tagRouter from './tagRoutes.js';

export default (app) => {
  app.use("/api/auth", authRouter);
  app.use("/api/user", userRouter);
  app.use("/api/content", contentRouter);
  app.use("/api/flashcard", flashcardRouter);
  app.use("/api/feedback", feedbackRouter);
  app.use("/api/comment", commentRouter);
  app.use("/api/vote", voteRouter);
  app.use("/api/tag", tagRouter);
};