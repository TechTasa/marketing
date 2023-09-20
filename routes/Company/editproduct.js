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

    router.get("/product/:userId/:productId", async (req, res) => {
      const userId = req.params.userId;
      const productId = req.params.productId;
      console.log(userId, productId);
      // Find the product in the database
      const product = await productsCollection.findOne({
        _id: new ObjectId(productId),
        createdBy: userId,
      });
      // console.log("Logo", product);
      // Render the 'edit-product' view and pass the product data to it
      res.render("editProduct", { product: product, user: userId });
    });

    router.post(
      "/product/:userId/:productId",
      upload.single("logo"),
      async (req, res) => {
        const userId = req.params.userId;
        const productId = req.params.productId;
        // console.log("File PAth", req.file.path);
        // Assuming 'cover' is the name of the form field in your client-side form
        req.body.logo = req.file.path;
        console.log("Body", req.body.logo);
        // Get the updated product data from the request body
        const updatedProductData = req.body;
        console.log(updatedProductData);
        // Update the product in the database
        await productsCollection.updateOne(
          { _id: new ObjectId(productId), createdBy: userId },
          { $set: updatedProductData }
        );

        // Redirect to the product page (or wherever you want)
        res.redirect(`/product/${userId}/${productId}`);
      }
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
})();

module.exports = router;
