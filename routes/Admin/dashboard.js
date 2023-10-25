const express = require("express");
const { MongoClient } = require("mongodb");
const router = express.Router();
const bcrypt = require("bcrypt");
const { connect, getCollection } = require("../../db");
const { ObjectId } = require("mongodb");

(async () => {
  try {
    // Get a reference to the users collection
    const userCollection = await getCollection("users");
    const productCollection = await getCollection("products");
    router.get("/dashboard", async (req, res) => {
      if (req.session.isAuthenticated && req.session.role == "admin") {
        const user = await userCollection.findOne({
          _id: new ObjectId(req.session.username),
        });

        // Calculate number of users with different roles
        const companyCount = await userCollection.countDocuments({
          role: "company",
        });
        const visitorCount = await userCollection.countDocuments({
          role: "visitor",
        });
        const adminCount = await userCollection.countDocuments({
          role: "admin",
        });

        // Calculate number of products
        const productCount = await productCollection.countDocuments();

        res.render("adminDashboard", {
          user: user,
          companyCount: companyCount,
          visitorCount: visitorCount,
          adminCount: adminCount,
          productCount: productCount,
        });
      } else {
        // Redirect or handle unauthenticated access
        res.redirect("/login");
      }
    });
    router.get("/dashboard/users", async (req, res) => {
      if (req.session.isAuthenticated && req.session.role == "admin") {
        const username = req.session.username;
        const users = await userCollection.find({}).toArray();
        const visitors = users.filter((user) => user.role === "visitor");
        const user = await userCollection.findOne({
          _id: new ObjectId(req.session.username),
        });
        res.render("adminVisitors", { user:user,visitors: visitors });
      } else {
        // Redirect or handle unauthenticated access
        res.redirect("/login");
      }
    });
    router.get("/dashboard/company", async (req, res) => {
      if (req.session.isAuthenticated && req.session.role == "admin") {
        const username = req.session.username;
        const users = await userCollection.find({}).toArray();
        const visitors = users.filter((user) => user.role === "company");
        const user = await userCollection.findOne({
          _id: new ObjectId(req.session.username),
        });
        res.render("adminCompany", { user:user,visitors: visitors });
      } else {
        // Redirect or handle unauthenticated access
        res.redirect("/login");
      }
    });
    router.get("/dashboard/admins", async (req, res) => {
      if (req.session.isAuthenticated && req.session.role == "admin") {
        const username = req.session.username;
        const users = await userCollection.find({}).toArray();
        const visitors = users.filter((user) => user.role === "admin");
        const user = await userCollection.findOne({
          _id: new ObjectId(req.session.username),
        });
        res.render("adminAdmins", { user:user,visitors: visitors });
      } else {
        // Redirect or handle unauthenticated access
        res.redirect("/login");
      }
    });




    router.get('/dashboard/admins/create',async function(req, res) {
      const user = await userCollection.findOne({
        _id: new ObjectId(req.session.username),
      });
      console.log(user.type);
      if (user.type==="master") {
        res.render('createAdmin',{user:user}); 
      }
      else{
        res.send("unauthorized")
      }
     
    });

    router.post('/dashboard/admins/create', async function(req, res) {
      
      // Get the data from the request body
      const data = req.body;
      data.role="admin";
      data.cart=[];
      console.log(data);
      // Hash the password
      const hashedPassword = await bcrypt.hash(data.password, 10);
      // Insert the data into the collection
      const result = await userCollection.insertOne({
        ...data,
        password: hashedPassword,
      });
      console.log(`Data inserted with _id: ${result.insertedId}`);
      res.redirect("/dashboard/admins");
    });









    router.get("/dashboard/products", async (req, res) => {
      if (req.session.isAuthenticated && req.session.role == "admin") {
        const username = req.session.username;
        const products = await productCollection.find({}).toArray();

        for (let product of products) {
          const user = await userCollection.findOne({
            _id: new ObjectId(product.createdBy),
          });
          if (user) {
            product.CreatedByUser = user.name;
          }
        }
        
        const user = await userCollection.findOne({
          _id: new ObjectId(req.session.username),
        });
        res.render("adminProducts", { user:user,products: products });
      } else {
        // Redirect or handle unauthenticated access
        res.redirect("/login");
      }
    });


    router.post("/dashboard/delete/:id", async (req, res) => {
      if (req.session.isAuthenticated && req.session.role == "admin") {
        const userId = req.params.id;
        await userCollection.deleteOne({ _id: new ObjectId(userId) });
        res.redirect('back');
      } else {
        // Redirect or handle unauthenticated access
        res.redirect("/login");
      }
    });
    






  } finally {
  }
})();
module.exports = router;
