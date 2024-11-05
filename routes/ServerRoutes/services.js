const express = require("express");
const router = express.Router();
const { connect, getCollection } = require("../../db");
const { ObjectId } = require("mongodb");

(async () => {
  try {
    // Get a reference to the users collection
    const userCollection = await getCollection("users");
    const productsCollection = await getCollection("products");
    router.get("/services", async (req, res) => {
     
      const id = req.session.username;
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
      products.forEach((product) => (total += product.offer));
      // console.log(total);
      let loggedInUser = await userCollection.findOne({
        _id: new ObjectId(req.session.username),
      });
      let cartItemCount = 0;
      if (req.session.role == "visitor") {
        cartItemCount = loggedInUser.cart.length;
      }
      // console.log(req.session.username);
      // Display the About File
      res.render("server/services", {
        user: user,
        total: total,
        loggedIn: req.session.username ? true : false,
        logo: loggedInUser,
        cartCount: cartItemCount,
      });
    });
  } finally {
  }
})();
module.exports = router;
