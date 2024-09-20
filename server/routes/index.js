import contentRouter from './contentRoutes.js';
import userRouter from './userRoutes.js';

export default (app) => {
  app.use("/api/content", contentRouter);
  app.use("/api/user", userRouter);
};