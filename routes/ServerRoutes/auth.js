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
    router.get("/auth", (req, res) => {
      if (req.session.username) {
        // console.log(req.session);
        res.send(req.session);
      }
    });
  } finally {
  }
})();
module.exports = router;
