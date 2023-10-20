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
    router.get("/dashboard/users", async (req, res) => {
      if (req.session.isAuthenticated && req.session.role == "admin") {
        const username = req.session.username;
        const users = await userCollection.find({}).toArray();
        const visitors = users.filter((user) => user.role === "visitor");
        res.render("adminVisitors", { visitors: visitors });
        //res.render("dashboard", { username });
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
        res.render("adminCompany", { visitors: visitors });
        //res.render("dashboard", { username });
      } else {
        // Redirect or handle unauthenticated access
        res.redirect("/login");
      }
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
        console.log(products);
        res.render("adminProducts", { products: products });
        //res.render("dashboard", { username });
      } else {
        // Redirect or handle unauthenticated access
        res.redirect("/login");
      }
    });
  } finally {
  }
})();
module.exports = router;
//  <!-- <div class="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
//                 <p class="text-sm leading-6 text-white">Co-Founder / CEO</p>
//                 <p class="mt-1 text-xs leading-5 text-white">Last seen <time datetime="2023-01-23T13:23Z">3h
//                         ago</time></p>
//             </div> -->
