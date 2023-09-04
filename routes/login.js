//More Readable Login.js
const express = require("express");
const { redirect } = require("express/lib/response");
const { MongoClient } = require("mongodb");
const router = express.Router();
const bcrypt = require("bcrypt");
const { connect, getCollection } = require("../db");
const path = require("path");

(async () => {
  try {
    // Get a reference to the users collection
    const userCollection = await getCollection("users");

    // Define the /login endpoint for GET requests
    router.get("/login", (req, res) => {
      // Display the login File
      res.sendFile(path.join(__dirname, "..", "public", "pages", "login.html"));
    });

    // Define the /login endpoint for POST requests
    router.post("/login", async (req, res) => {
      const data = req.body;
      const user = await userCollection.findOne({ name: data.name });
    
      if (user && (await bcrypt.compare(data.password, user.password))) {
        console.log(true);
        if (user.role == "admin") {
          console.log(`Admin account redirected to dashboard ${user.role}`);
          res.redirect("/dashboard");
        } else if (user.role == "visitor") {
          console.log(`Visitor account redirected to landing ${user.role}`);
          res.redirect("/");
        } else if (user.role == "company") {
          console.log(`Company account redirected to landing ${user.role}`);
          res.redirect("/");
        }
      } else {
        console.log("User not found", data);
      }
    });
  } finally {
  }
})();

module.exports = router;