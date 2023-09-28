const express = require("express");
const { MongoClient } = require("mongodb");
const router = express.Router();
const bcrypt = require("bcrypt");
const { connect, getCollection } = require("../../db");
const { ObjectId } = require("mongodb");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

(async () => {
  try {
    const userCollection = await getCollection("users");
    const productsCollection = await getCollection("products");
    router.get("/", async (req, res) => {
      const products = await productsCollection.find().toArray();
      const users = await userCollection.find({}, { cover: 1 }).toArray();
      const covers = users
        .filter((user) => user.cover)
        .map((user) => user.cover);
      res.render("landing", {
        loggedIn: req.session.username ? true : false,
        user: req.session,
        products: products,
        covers: covers,
      });
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
})();

module.exports = router;
