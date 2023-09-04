const express = require("express");
const session = require("express-session")
const app = express();
const MongoDBStore = require("connect-mongodb-session")(session);

const signUpSelectRouter = require("./routes/signUpSelect");
const registerRouter = require("./routes/register");
const visitorSignUpRouter = require("./routes/visitorSignUp");
const loginRouter = require("./routes/login");
const userRouter = require("./routes/users");
const dashboardRouter = require("./routes/dashboard");
const landingRouter = require("./routes/landing");
const servicesRouter = require("./routes/services");
const aboutusRouter = require("./routes/aboutus");
const careerRouter = require("./routes/career");
const contactusRouter = require("./routes/contactus");


app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
const { connect, getCollection } = require("./db");
app.use(express.json());

// Set up session middleware
const store = new MongoDBStore({
  uri: "mongodb+srv://admin:NbMBPAdnaltxDM92@cluster0.f2l9gud.mongodb.net/?retryWrites=true&w=majority",
  collection: "sessions",
});
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: { secure: false },
  })
);

// Connect to MongoDB
connect();

// Use the signUpSelectRouter router to handle requests to /signUpSelect
app.use(signUpSelectRouter);

// Use the register router to handle requests to /register
app.use(registerRouter);

// Use the visitorSignUp Router  to handle requests to /visitorSignUp
app.use(visitorSignUpRouter);

// Use the login router to handle requests to /login
app.use(loginRouter);

// Use the user router to handle requests to /users
app.use(userRouter);

// Use the user router to handle requests to /Dashboar
app.use(dashboardRouter);

// Use the user router to handle requests to /Landing
app.use(landingRouter);

// Use the user router to handle requests to /Services
app.use(servicesRouter);

// Use the user router to handle requests to /About
app.use(aboutusRouter);

// Use the user router to handle requests to /Career
app.use(careerRouter);

// Use the user router to handle requests to /Contact
app.use(contactusRouter);



app.listen(7000, () => {
  console.log("Server listening on port 7000");
});
