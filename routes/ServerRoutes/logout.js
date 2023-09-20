const express = require("express");
const { MongoClient } = require("mongodb");
const router = express.Router();
const bcrypt = require("bcrypt");
const { connect, getCollection } = require("../../db");
const path = require("path");

(async () => {
  try {
    // Get a reference to the users collection
    const userCollection = await getCollection("users");
    router.get("/landing", (req, res) => {
      // Display the login File
      res.sendFile(
        path.join(__dirname, "..", "../", "public", "pages", "landing.html")
      );
    });

    //username and password
    const myusername = "user1";
    const mypassword = "mypassword";

    // a variable to save a session
    var session;
  } finally {
  }
})();
module.exports = router;
