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
    router.get("/product/:id", async (req, res) => {
      try {
        const product = await productsCollection.findOne({
          _id: new ObjectId(req.params.id),
        });
        // console.log(product);
        const createdBy = product.createdBy;
        const createdByName = await userCollection.findOne({
          _id: new ObjectId(createdBy),
        });
        if (!product) {
          return res.status(404).send({ message: "Product not found" });
        }
        // console.log(req.session.username);
        
        res.render("product", {
          product: product,
          createdBy: createdByName,
          user: req.session,
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
