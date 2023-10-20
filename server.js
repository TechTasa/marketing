const express = require("express");
const session = require("express-session");
const app = express();
const MongoDBStore = require("connect-mongodb-session")(session);

const signUpSelectRouter = require("./routes/ServerRoutes/signUpSelect");
const registerRouter = require("./routes/ServerRoutes/register");
const visitorSignUpRouter = require("./routes/ServerRoutes/visitorSignUp");
const loginRouter = require("./routes/ServerRoutes/login");
const authRouter = require("./routes/ServerRoutes/auth");
const userRouter = require("./routes/Mutual/profile");

const cartRouter = require("./routes/Visitor/cart");

const addtocartRouter = require("./routes/Visitor/addtocart");
const coverRouter = require("./routes/Company/coverPicture");
const logoRouter = require("./routes/Company/logo");
const productRouter = require("./routes/Mutual/product");
const productsRouter = require("./routes/Company/products");
const companyRouter = require("./routes/Company/company");
const createproductsRouter = require("./routes/Company/createproduct");
const editproductsRouter = require("./routes/Company/editproduct");
const deleteproductsRouter = require("./routes/Company/deleteproduct");
const dashboardRouter = require("./routes/Admin/dashboard");
const landingRouter = require("./routes/Mutual/landing");
const servicesRouter = require("./routes/ServerRoutes/services");
const aboutusRouter = require("./routes/ServerRoutes/aboutus");
const careerRouter = require("./routes/ServerRoutes/career");
const contactusRouter = require("./routes/ServerRoutes/contactus");
const logoutRouter = require("./routes/ServerRoutes/logout");
const path = require("path");

// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static("public"));
app.use(express.static("uploads"));
app.use(express.urlencoded({ extended: true }));
const { connect, getCollection } = require("./db");
app.use(express.json());
// Set EJS as the templating engine
app.set("view engine", "ejs");

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

app.post("/user", (req, res) => {
  if (req.body.username == myusername && req.body.password == mypassword) {
    session = req.session;
    session.userid = req.body.username;
    console.log(req.session);
    res.send(`Hey there, welcome <a href=\'/logout'>click to logout</a>`);
  } else {
    res.send("Invalid username or password");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// Use the signUpSelectRouter router to handle requests to /signUpSelect
app.use(signUpSelectRouter);

app.use(coverRouter);

app.use(logoRouter);

app.use(productsRouter);

app.use(productRouter);
app.use(companyRouter);

app.use(cartRouter);

app.use(addtocartRouter);

app.use(createproductsRouter);
app.use(editproductsRouter);
app.use(deleteproductsRouter);

// Use the register router to handle requests to /register
app.use(registerRouter);

// Use the visitorSignUp Router  to handle requests to /visitorSignUp
app.use(visitorSignUpRouter);

// Use the login router to handle requests to /login
app.use(loginRouter);

// Use the auth router to handle requests to /auth
app.use(authRouter);

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

// Use the user router to handle requests to /Contact
app.use(logoutRouter);

app.listen(7000, () => {
  console.log("Server listening on port http://localhost:7000");
});
