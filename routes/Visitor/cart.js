const express = require("express");
const router = express.Router();
const { connect, getCollection } = require("../../db");
const { ObjectId } = require("mongodb");

(async () => {
  try {
    const userCollection = await getCollection("users");
    const productsCollection = await getCollection("products");
    // Define the /edit/:id endpoint for GET requests
    router.get("/cart/:id", async (req, res) => {
      // Get the user id from the request parameters
      const id = req.params.id;
      let idString = id.toString();
      // Check if id is a valid 24-character hex string
      if (!ObjectId.isValid(id)) {
        return res.status(400).send("Invalid id");
      }
      const user = await userCollection.findOne({ _id: new ObjectId(id) });
      user._id = idString;

      if (!user.cart) {
        user.cart = [];
      }

      // Fetch all products in the user's cart
      const products = await productsCollection
        .find({ _id: { $in: user.cart } })
        .toArray();

      let total = 0;
      products.forEach((product) => (total += Number(product.offer))); // Modified line
      // console.log(total);
      let loggedInUser = await userCollection.findOne({
        _id: new ObjectId(req.session.username),
      });
      let cartItemCount = 0;
      if (req.session.role == "visitor") {
        cartItemCount = loggedInUser.cart.length;
      }
      //  console.log(user);
      // console.log(req.session);
      
      res.render("visitor/cart", {
        user: user,
        products: products,
        total: total,
        loggedIn: req.session.username ? true : false,
        logo: loggedInUser,
        cartCount: cartItemCount,
      });
    });

    router.post("/cart/:userId/:productId/delete", async (req, res) => {
      const userId = new ObjectId(req.params.userId);
      const productId = new ObjectId(req.params.productId);

      // Pull the product from the user's cart
      await userCollection.updateOne(
        { _id: userId },
        { $pull: { cart: productId } }
      );

      res.redirect("/cart/" + userId);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
})();

module.exports = router;
