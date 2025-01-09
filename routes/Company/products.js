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

    router.get("/products/:id", async (req, res) => {
      // Redirect to /
      // Get the user id from the request parameters
      const id = req.params.id;
      let idString = id.toString();

      const user = await userCollection.findOne({ _id: new ObjectId(id) });
      const products = await productsCollection
        .find({ createdBy: id })
        .toArray();

      //   console.log(products);
      // user._id = idString;
      // console.log(user);
      // console.log(user._id);
      

      res.render("products", { user: user, products: products });
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
})();

module.exports = router;
