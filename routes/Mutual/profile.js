const express = require("express");
const { MongoClient } = require("mongodb");
const router = express.Router();
const bcrypt = require("bcrypt");
const { connect, getCollection } = require("../../db");
const { ObjectId } = require("mongodb");

(async () => {
  try {
    const userCollection = await getCollection("users");

    // Define the /edit/:id endpoint for GET requests
    router.get("/profile/:id", async (req, res) => {
      // Get the user id from the request parameters
      const id = req.params.id;
      let idString = id.toString();
      // Check if id is a valid 24-character hex string
      if (!ObjectId.isValid(id)) {
        return res.status(400).send("Invalid id");
      }
      const user = await userCollection.findOne({ _id: new ObjectId(id) });
      user._id = idString;
      // Render the 'cover' view and pass the user data and id to it
      res.render("profile", { user: user });
    });

    // Define the /edit/:id endpoint for POST requests
    router.post("/profile/:id", async (req, res) => {
      // Get the data from the request body
      const data = req.body;

      // Get the user id from the request parameters
      const id = req.params.id;

      // Hash the password if it was provided
      let update = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        companyName: data.companyname,
        domainName: data.domainname,
      };
      if (data.password) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        update.password = hashedPassword;
      }

      // Update the user in the collection
      await userCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: update }
      );

      // Redirect to /users
      res.redirect("/");
    });

    // Define the /delete/:id endpoint for GET requests
    router.get("/delete/:id", async (req, res) => {
      // Get the user id from the request parameters
      const id = req.params.id;

      // Find the user in the collection
      const user = await userCollection.findOne({ _id: new ObjectId(id) });

      // Prompt the user for confirmation
      res.send(`
      <h2>Are you sure you want to delete ${user.name}?</h2>
      <form id="delete-form" method="POST" action="/delete/${id}">
        <input type="submit" value="Yes, delete">
      </form>
      <a href="/">No, cancel</a>
  
      <style>
      body{
        display:flex;
        justify-content:center;
        align-items:center;
      }
        form {
          font-family: Arial, sans-serif;
          margin: 20px;
        }
        input[type="submit"] {
          background-color: #f44336;
          color: white;
          padding: 12px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        a {
            background-color: green;
            color: white;
            padding: 12px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            text-decoration:none;
        }
      </style>
    `);
    });

    // Define the /delete/:id endpoint for POST requests
    router.post("/delete/:id", async (req, res) => {
      // Get the user id from the request parameters
      const id = req.params.id;

      // Delete the user from the collection
      await userCollection.deleteOne({ _id: new ObjectId(id) });

      // Redirect to /users
      res.redirect("/users");
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
})();

module.exports = router;
