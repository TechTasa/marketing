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

    router.post("/product/delete/:userId/:productId", async (req, res) => {
      const userId = req.params.userId;
      const productId = req.params.productId;

      // Delete the product from the database
      await productsCollection.deleteOne({
        _id: new ObjectId(productId),
        createdBy: userId,
      });

      // Redirect to the user's products page (or wherever you want)
      res.redirect(`/products/${userId}`);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
})();

module.exports = router;
