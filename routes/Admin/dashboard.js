const express = require("express");
const { MongoClient } = require("mongodb");
const router = express.Router();
const bcrypt = require("bcrypt");
const { connect, getCollection } = require("../../db");

(async () => {
  try {
    // Get a reference to the users collection
    const userCollection = await getCollection("users");
    router.get("/dashboard", (req, res) => {
      if (req.session.isAuthenticated && req.session.role == "admin") {
        const username = req.session.username;
        // Access session data here, e.g., username
        res.send(`<h1>ADMIN DASHBOARD</h1>`);
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
