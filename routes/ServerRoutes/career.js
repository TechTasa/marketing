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
    router.get("/career", (req, res) => {
      // Display the Career File
      res.sendFile(
        path.join(__dirname, "..", "../", "public", "pages", "career.html")
      );
    });
  } finally {
  }
})();
module.exports = router;
