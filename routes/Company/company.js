const express = require("express");
const { MongoClient } = require("mongodb");
const router = express.Router();
const bcrypt = require("bcrypt");
const { connect, getCollection } = require("../../db");
const { ObjectId } = require("mongodb");

(async () => {
  try {
    const userCollection = await getCollection("users");
    const productsCollection = await getCollection("products");
    router.get("/company/:id", async (req, res) => {
      try {
        const company = await userCollection.findOne({
          _id: new ObjectId(req.params.id),
        });

        const products = await productsCollection
          .find({
            createdBy: req.params.id,
          })
          .toArray();
        // console.log(products, company);
        let loggedInUser = await userCollection.findOne({
          _id: new ObjectId(req.session.username),
        });
        let cartItemCount = 0;
        if (req.session.role == "visitor") {
          cartItemCount = loggedInUser.cart.length;
        }

        res.render("company", {
          loggedIn: req.session.username ? true : false,
          user: req.session,
          products: products,
          company: company,
          logo: loggedInUser,
          cartCount: cartItemCount,
        });
      } catch (error) {
        res.status(500).send({ message: "Server error" });
      }
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
})();

module.exports = router;
