//More Readable Login.js
const express = require("express");
const { redirect } = require("express/lib/response");
const { MongoClient } = require("mongodb");
const router = express.Router();
const bcrypt = require("bcrypt");
const { connect, getCollection } = require("../../db");
const path = require("path");

(async () => {
  try {
    // Get a reference to the users collection
    const userCollection = await getCollection("users");

    // Define the /login endpoint for GET requests
    router.get("/login", (req, res) => {
      // Display the login File
      res.sendFile(
        path.join(__dirname, "..", "../", "public", "pages", "login.html")
      );
    });

    // Define the /login endpoint for POST requests
    router.post("/login", async (req, res) => {
      const data = req.body;
      const user = await userCollection.findOne({ name: data.name });

      if (!user) {
        return res.status(401).send("Invalid username or password");
      }

      const isPasswordValid = await bcrypt.compare(
        data.password,
        user.password
      );

      if (!isPasswordValid) {
        return res.status(401).send("Invalid username or password");
      }

      console.log("Username and Password validated", data, user);
      req.session.isAuthenticated = true;
      req.session.username = user._id;
      req.session.role = user.role;
      req.session.save((err) => {
        if (err) {
          // handle error
          console.log(err);
        } else {
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
        }
      });
    });
  } catch (error) {
    console.error("Error in login route:", error);
    res.status(500).send("Internal server error");
  } finally {
  }
})();

module.exports = router;
