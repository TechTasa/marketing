const express = require("express");
const { MongoClient } = require("mongodb");
const router = express.Router();
const bcrypt = require("bcrypt");
const { connect, getCollection } = require("../db");
const { ObjectId } = require("mongodb");

(async () => {
  try {
    const userCollection = await getCollection("users");
    // Define the /users endpoint for GET requests
    router.get("/users", async (req, res) => {
      // Get all users from the collection
      const users = await userCollection.find().toArray();

      // Create a table to display the users
      let table = `<table>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>`;
      for (const user of users) {
        table += `<tr>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.role}</td>
          <td><a href="/edit/${user._id}">Edit</a></td>
          <td><a href="/delete/${user._id}">Delete</a></td>
        </tr>`;
      }
      table += `</table>`;

      // Send the table to the user
      res.send(table);
    });

    // Define the /edit/:id endpoint for GET requests
    router.get("/edit/:id", async (req, res) => {
      // Get the user id from the request parameters
      const id = req.params.id;

      // Find the user in the collection
      const user = await userCollection.findOne({ _id: new ObjectId(id) });

      // Prompt the user for input
      res.send(`
        <form id="edit-form" method="POST" action="/edit/${id}">
          <label for="name">Name:</label><br>
          <input type="text" id="name" name="name" value="${user.name}"><br>
          <label for="email">Email:</label><br>
          <input type="text" id="email" name="email" value="${user.email}"><br>
          <label for="password">Password:</label><br>
          <input type="password" id="password" name="password"><br><br>
          <input type="submit" value="Update">
        </form>

        <style>
          form {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
          label {
            font-weight: bold;
          }
          input[type="submit"] {
            background-color: #4CAF50;
            color: white;
            padding: 12px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
        </style>
      `);
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
      <a href="/users">No, cancel</a>
  
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

    // Define the /edit/:id endpoint for POST requests
    router.post("/edit/:id", async (req, res) => {
      // Get the data from the request body
      const data = req.body;

      // Get the user id from the request parameters
      const id = req.params.id;

      // Hash the password if it was provided
      let update = { name: data.name ,email:data.email};
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
      res.redirect("/users");
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
