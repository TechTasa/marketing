const express = require("express");
const { MongoClient } = require("mongodb");
const router = express.Router();
const bcrypt = require("bcrypt");
const { connect, getCollection } = require("../db");

(async () => {
  try {
    // Get a reference to the users collection
    const userCollection = await getCollection("users");
    router.get("/dashboard", (req, res) => {
      res.send(`<h1>ADMIN DASHBOARD</h1>`);
    });
  } finally {
  }
})();
module.exports = router