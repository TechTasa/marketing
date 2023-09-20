const express = require("express");
const { MongoClient } = require("mongodb");
const router = express.Router();
const bcrypt = require("bcrypt");
const { connect, getCollection } = require("../../db");
const path = require("path");

(async () => {
  try {
    // Get a reference to the users collection
    const userCollection = await getCollection("users");

    // Define the /register endpoint for GET requests
    router.get("/register", (req, res) => {
      // Display the login File
      res.sendFile(
        path.join(__dirname, "..", "../", "public", "pages", "register.html")
      );
    });

    // Define the /register endpoint for POST requests
    router.post("/register", async (req, res) => {
      // Get the data from the request body
      const data = req.body;

      // Hash the password
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // Insert the data into the collection
      const result = await userCollection.insertOne({
        ...data,
        password: hashedPassword,
      });
      console.log(`Data inserted with _id: ${result.insertedId}`);
      res.redirect("/login");
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
})();

module.exports = router;
