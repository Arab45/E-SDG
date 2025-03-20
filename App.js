const express = require("express");
const { connectToDB } = require("./src/db");
require("dotenv").config();
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
      'https://edureach-psi.vercel.app'
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
app.use('/api', subjectRouter)



app.listen(process.env.PORT_NUMBER, () => {
    console.log(`http://localhost:${process.env.PORT_NUMBER}`);
    connectToDB()
});