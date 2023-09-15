const express = require("express");
const session = require("express-session")
const app = express();
const MongoDBStore = require("connect-mongodb-session")(session);

const signUpSelectRouter = require("./routes/signUpSelect");
const registerRouter = require("./routes/register");
const visitorSignUpRouter = require("./routes/visitorSignUp");
const loginRouter = require("./routes/login");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/users");
const dashboardRouter = require("./routes/dashboard");
const landingRouter = require("./routes/landing");
const servicesRouter = require("./routes/services");
const aboutusRouter = require("./routes/aboutus");
const careerRouter = require("./routes/career");
const contactusRouter = require("./routes/contactus");
const logoutRouter = require("./routes/logout");
const profileRouter = require("./routes/profile");
const bigpictureRouter = require("./routes/bigpicture");
const smalllogoRouter = require("./routes/smalllogo");
const companydetailsRouter = require("./routes/companydetails");
const cdashboardRouter = require("./routes/cdashboard");
const companyproductsRouter = require("./routes/companyproducts");
const listeditemRouter = require("./routes/listeditem");
const addpromoterRouter = require("./routes/addpromoter");
const propertiesRouter = require("./routes/properties");
const detailsRouter = require("./routes/details");
const liveproductsRouter = require("./routes/liveproducts");
const communicationRouter = require("./routes/communication");
const revenueRouter = require("./routes/revenue");
const visitordetailsRouter = require("./routes/visitordetails");
const soldRouter = require("./routes/sold");
// visitor
const v_profileRouter = require("./routes/visitor/v_profile");
const v_wishlistRouter = require("./routes/v_wishlist");
const v_ordersRouter = require("./routes/v_orders");
const v_cartRouter = require("./routes/v_cart");
const v_compareproductRouter = require("./routes/v_compareproduct");
const v_communicationRouter = require("./routes/v_communication");
const v_becomesupplierRouter = require("./routes/v_becomesupplier");
const v_referRouter = require("./routes/v_refer");
const v_portaldetailsRouter = require("./routes/v_portaldetails");
const v_todayofferRouter = require("./routes/v_todayoffer");
const v_competitionsRouter = require("./routes/v_competitions");


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


app.post('/user',(req,res) => {
  if(req.body.username == myusername && req.body.password == mypassword){
      session=req.session;
      session.userid=req.body.username;
      console.log(req.session)
      res.send(`Hey there, welcome <a href=\'/logout'>click to logout</a>`);
  }
  else{
      res.send('Invalid username or password');
  }
})


app.get('/logout',(req,res) => {
  req.session.destroy();
  res.redirect('/');
});


// Use the signUpSelectRouter router to handle requests to /signUpSelect
app.use(signUpSelectRouter);

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

// Use the user router to handle requests to /logout
app.use(logoutRouter);

// Use the user router to handle requests to /profile
app.use(profileRouter);

// Use the user router to handle requests to /bigpicture
app.use(bigpictureRouter);

// Use the user router to handle requests to /smalllogo
app.use(smalllogoRouter);

// Use the user router to handle requests to /companydetails
app.use(companydetailsRouter);

// Use the user router to handle requests to /company dashboard
app.use(cdashboardRouter);

// Use the user router to handle requests to /company products
app.use(companyproductsRouter);

// Use the user router to handle requests to /listeditem
app.use(listeditemRouter);

// Use the user router to handle requests to /addpromoter
app.use(addpromoterRouter);

// Use the user router to handle requests to /properties
app.use(propertiesRouter);

// Use the user router to handle requests to /details
app.use(detailsRouter);

// Use the user router to handle requests to /liveproducts
app.use(liveproductsRouter);

// Use the user router to handle requests to /communications
app.use(communicationRouter);

// Use the user router to handle requests to /revenue
app.use(revenueRouter);

// Use the user router to handle requests to /visitordetails
app.use(visitordetailsRouter);

// Use the user router to handle requests to /sold
app.use(soldRouter);

// visitor
// Use the user router to handle requests to /v_profile
app.use(v_profileRouter);

// Use the user router to handle requests to /v_wishlist
app.use(v_wishlistRouter);

// Use the user router to handle requests to /v_orders
app.use(v_ordersRouter);

// Use the user router to handle requests to /v_cart
app.use(v_cartRouter);

// Use the user router to handle requests to /v_compareproduct
app.use(v_compareproductRouter);

// Use the user router to handle requests to /v_communication
app.use(v_communicationRouter);

// Use the user router to handle requests to /v_becomesupplier
app.use(v_becomesupplierRouter);

// Use the user router to handle requests to /v_refer
app.use(v_referRouter);

// Use the user router to handle requests to /v_portaldetails
app.use(v_portaldetailsRouter);

// Use the user router to handle requests to /v_todayoffer
app.use(v_todayofferRouter);

// Use the user router to handle requests to /v_competitions
app.use(v_competitionsRouter);





app.listen(7000, () => {
  console.log("Server listening on port 7000");
});
