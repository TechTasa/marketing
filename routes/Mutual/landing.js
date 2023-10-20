const express = require("express");
const { MongoClient } = require("mongodb");
const router = express.Router();
const bcrypt = require("bcrypt");
const { connect, getCollection } = require("../../db");
const { ObjectId } = require("mongodb");
const multer = require("multer");
const zlib = require("zlib");

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
      const companyUsers = await userCollection.find({}).toArray();
      const companies = companyUsers.filter((user) => user.role === "company");
      const users = await userCollection
        .find({}, { cover: 1, logo: 1 })
        .toArray();
      const covers = users
        .filter((user) => user.cover)
        .map((user) => user.cover);
      const logos = users.filter((user) => user.logo).map((user) => user.logo);
      let loggedInUser = await userCollection.findOne({
        _id: new ObjectId(req.session.username),
      });
      let cartItemCount = 0;
      if (req.session.role == "visitor") {
        cartItemCount = loggedInUser.cart.length;
      }

      res.render("landing", {
        loggedIn: req.session.username ? true : false,
        user: req.session,
        companies: companies,
        logos: logos,
        covers: covers,
        logo: loggedInUser,
        cartCount: cartItemCount,
      });
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
})();

module.exports = router;
