const express = require("express");
const { redirect } = require("express/lib/response");
const { MongoClient } = require("mongodb");
const router = express.Router();
const bcrypt = require("bcrypt");
const { connect, getCollection } = require("../db");
const path = require('path');

(async () => {
  try {
     // Get a reference to the users collection
     const userCollection = await getCollection("users");

    // Define the /login endpoint for GET requests
    router.get("/login", (req, res) => {
      // Display the login File
      res.sendFile(path.join(__dirname, '..', 'public', 'pages', 'login.html'));
    });

    // Define the /login endpoint for POST requests
    router.post("/login", async (req, res) => {
      // Get the data from the request body
      const data = req.body;

      // Check if the user is present in the system
      const user = await userCollection.findOne({ name: data.name });
      if (user && (await bcrypt.compare(data.password, user.password))) {
        console.log(true);
        if(user.role=="admin"){
            console.log(`This is a Admin Account And Will Be Redirected To Admin Dashboard ${user.role}`)
            res.redirect("/dashboard");
        }
        else{
            if(user.role=="visitor"){
                console.log(`This is a Visitor Account And Will Be Redirected To Visitor Dashboard ${user.role}`)
                res.redirect("/visitor");
            }
        }
      } else {
        console.log("User Is Not Found",data)
        
        
      }
    });
  } finally {
  
  }
})();

module.exports = router;
