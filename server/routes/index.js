import contentRouter from './contentRoutes.js';

export default (app) => {
  app.use("/api/content", contentRouter);
};