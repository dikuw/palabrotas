import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cors from 'cors';
import { connectDB } from './database/index.js';
import configureRoutes from './routes/index.js';
import passport from './handlers/passport.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({credentials: true, origin: process.env.ORIGIN}));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));

app.use(passport.initialize());
app.use(passport.session());

// pass variables on all requests
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.session = req.session;
  next();
});

app.get("/", (req, res) => {
  res.send("This is the Palabrotas backend/API.");
});

configureRoutes(app);

app.listen(port, () => {
  connectDB();
  console.log(`Server started at http://localhost:${port}`);
});