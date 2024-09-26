import authRouter from './authRoutes.js';
import userRouter from './userRoutes.js';
import contentRouter from './contentRoutes.js';

export default (app) => {
  app.use("/api/auth", authRouter);
  app.use("/api/user", userRouter);
  app.use("/api/content", contentRouter);
};