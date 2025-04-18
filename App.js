const express = require("express");
const { connectToDB } = require("./src/db");
require("dotenv").config();
const helmet = require("helmet");
const app = express();
const passport = require('passport');
const session = require("express-session")
const oauthController = require('./src/controller/outh-controller');
const userRouter = require('./src/router/user-router');
const userOauthRouter = require("./src/router/userOauth-router")
const cors = require('cors');
const studentProfile = require('./src/router/studentProfile-router');
const teacherProfile = require('./src/router/teacherProfile-router');
const libraryRouter = require('./src/router/library-router');
const subjectRouter = require('./src/router/subject-router');

const corsOptions = {
    credentials: true,
    origin: [
      `http://localhost:${process.env.PORT_ORIGIN}`,
      'https://edureach-psi.vercel.app',
      'http://localhost:3000',
      ]
  };

app.use(cors(corsOptions));

app.use(express.json());


app.use(session({
  secret: process.env.SESSION_SECRETE,
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false,
    httpOnly: true
   }
}));


app.use(passport.initialize());
app.use(passport.session());

app.use('/create', userRouter);
app.use('/auth', userOauthRouter);
app.use('/student', studentProfile);
app.use('/teacher', teacherProfile);
app.use('/api', libraryRouter);
app.use('/api', subjectRouter);

//preventing API from cross site scripting attacks

const helmetConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],

      scriptSrc: [
        "'self'",
        "'unsafe-inline'", // Allow inline scripts
        "'unsafe-eval'",  // For local debugging
        "https://accounts.google.com",
        "https://apis.google.com",
      ],

      styleSrc: [
        "'self'",
        "'unsafe-inline'", // Google styling needs this
        "https://fonts.googleapis.com",
        "https://accounts.google.com",
      ],

      imgSrc: [
        "'self'",
        "data:",  // Allow inline images (base64)
        "https://lh3.googleusercontent.com", // Google profile pics
      ],

      connectSrc: [
        "'self'",
        "https://accounts.google.com",
        "https://oauth2.googleapis.com",
         "http://localhost:3000",
        "http://localhost:5173", // Local Frontend
        "https://edureach-psi.vercel.app", // Production Frontend
      ],

      frameSrc: [
        "'self'",
        "https://accounts.google.com", // Allow embedding Google login
      ],
    },
  },

  frameguard: {
    action: "sameorigin",
  },

  referrerPolicy: { policy: "strict-origin-when-cross-origin" },

  dnsPrefetchControl: { allow: false },

  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },

  xssFilter: true,
  noSniff: true,
};

// Apply Helmet Middleware
app.use(helmet(helmetConfig));
// app.use(helmet({ contentSecurityPolicy: false }));



app.listen(process.env.PORT_NUMBER, () => {
    console.log(`http://localhost:${process.env.PORT_NUMBER}`);
    connectToDB()
});