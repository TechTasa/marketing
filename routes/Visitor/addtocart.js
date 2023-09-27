const express = require("express");
const { MongoClient } = require("mongodb");
const router = express.Router();
const { connect, getCollection } = require("../../db");
const { ObjectId } = require("mongodb");

(async () => {
  try {
    const userCollection = await getCollection("users");
    const productsCollection = await getCollection("products");

    router.post("/add-to-cart/:id", async (req, res) => {
      const productId = new ObjectId(req.params.id);
      const product = await productsCollection.findOne({ _id: productId });

      if (!product) {
        return res.status(404).send({ message: "Product not found" });
      }

      const userId = new ObjectId(req.session.username); // assuming the user id is stored in session
      console.log(userId);

      const user = await userCollection.findOne({ _id: userId });
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      // Initialize cart if it does not exist
      if (!user.cart) {
        user.cart = [];
      }
      console.log(user.cart);
      // Check if product already exists in the cart
      // Check if product already exists in the cart
      if (user.cart.some((cartProductId) => cartProductId.equals(productId))) {
        return res
          .status(400)
          .send({ message: "Product already added to cart" });
      } else {
        await userCollection.updateOne(
          { _id: userId },
          { $push: { cart: product._id } }
        );
      }
    });

    // router.post("/add-to-cart/:id", async (req, res) => {
    //   const productId = new ObjectId(req.params.id);
    //   const product = await productsCollection.findOne({ _id: productId });

    //   if (!product) {
    //     return res.status(404).send({ message: "Product not found" });
    //   }

    //   const userId = new ObjectId(req.session.username); // assuming the user id is stored in session
    //   console.log(userId);

    //   const user = await userCollection.findOne({ _id: userId });
    //   if (!user) {
    //     return res.status(404).send({ message: "User not found" });
    //   }
    //   // Initialize cart if it does not exist
    //   if (!user.cart) {
    //     user.cart = [];
    //   }

    //   // Check if product already exists in the cart
    //   if (user.cart.includes(product._id)) {
    //     return res
    //       .status(400)
    //       .send({ message: "Product already added to cart" });
    //   } else {
    //     await userCollection.updateOne(
    //       { _id: userId },
    //       { $push: { cart: product._id } }
    //     );
    //   }
    // });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
})();

module.exports = router;
