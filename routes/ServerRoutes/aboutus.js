const express = require("express");
const router = express.Router();
const { connect, getCollection } = require("../../db");
const { ObjectId } = require("mongodb");

(async () => {
  try {
    // Get a reference to the users collection
    const userCollection = await getCollection("users");
    const productsCollection = await getCollection("products");
    router.get("/aboutus", async (req, res) => {
      const products = await productsCollection.find().toArray();
      const companyUsers = await userCollection.find({}).toArray();
      const companies = companyUsers.filter((user) => user.role === "company");
      const users = await userCollection
        .find({}, { cover: 1, logo: 1 })
        .toArray();
      const covers = users
        .filter((user) => user.role === 'company' && user.cover)
        .map((user) => user.cover);

      const logos = users.
      filter((user) => user.role === 'company' && user.logo)
      .map((user) => user.logo);
      let loggedInUser = await userCollection.findOne({
        _id: new ObjectId(req.session.username),
      });
      let cartItemCount = 0;
      if (req.session.role == "visitor") {
        cartItemCount = loggedInUser.cart.length;
      }

      
      

      res.render("server/about", {
        loggedIn: req.session.username ? true : false,
        user: req.session,
        companies: companies,
        logos: logos,
        covers: covers,
        logo: loggedInUser,
        cartCount: cartItemCount,
        products: products,
      });
    });
  } finally {
  }
})();
module.exports = router;
