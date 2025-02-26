import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cors from 'cors';
import { connectDB } from './database/index.js';
import configureRoutes from './routes/index.js';
import passport from './handlers/passport.js';
import path from 'path';

const app = express();
const port = process.env.PORT || 5000;

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.ENV !== 'production') {
  app.use(cors({credentials: true, origin: process.env.ORIGIN}));
}

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  },
  rolling: true, // Reset the maxAge on every request
  secure: process.env.ENV === 'production',
  httpOnly: true,
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

configureRoutes(app);

if (process.env.ENV === 'development') {  
  app.get("/", (req, res) => {
    res.send("This is the Palabrotas backend/API.");
  });
}

if (process.env.ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  });
}

app.listen(port, () => {
  connectDB();
  console.log(`Server started at http://localhost:${port}`);
});