const express = require("express");
const app = express();
const registerRouter = require("./routes/register");
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
// Connect to MongoDB
connect();
// Use the register router to handle requests to /register
app.use(registerRouter);

// Use the login router to handle requests to /login
app.use(loginRouter);

// Use the user router to handle requests to /users
app.use(userRouter);

// Use the user router to handle requests to /users
app.use(dashboardRouter);

// Use the user router to handle requests to /users
app.use(landingRouter);

// Use the user router to handle requests to /users
app.use(servicesRouter);

// Use the user router to handle requests to /users
app.use(aboutusRouter);

// Use the user router to handle requests to /users
app.use(careerRouter);

// Use the user router to handle requests to /users
app.use(contactusRouter);




app.get("/visitor", (req, res) => {
  res.send("<h1>Successfully logged in With Visitor</h1>");
});



app.get("/useradded", (req, res) => {
  res.send("<h1>Successfully Registered New User</h1>");
});

app.listen(7000, () => {
  console.log("Server listening on port 7000");
});