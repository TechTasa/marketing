const express = require("express");
const { MongoClient } = require("mongodb");
const router = express.Router();
const bcrypt = require("bcrypt");
const { connect, getCollection } = require("../../db");
const { ObjectId } = require("mongodb");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

(async () => {
  try {
    const userCollection = await getCollection("users");

    router.post("/logo/:id", upload.single("logo"), async (req, res) => {
      const id = req.params.id;
      const user = await userCollection.findOne({ _id: new ObjectId(id) });

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      // Assuming 'cover' is the name of the form field in your client-side form
      const logoImage = req.file.path; // get the path of the uploaded file

      // Update the user document with the cover image path
      const result = await userCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { logo: logoImage } }
      );

      if (result.modifiedCount === 1) {
        res.send({ message: "Logo image uploaded successfully" });
      } else {
        res.status(500).send({ message: "Failed to upload Logo image" });
      }
    });

    router.get("/logo/:id", async (req, res) => {
      // Redirect to /
      // Get the user id from the request parameters
      const id = req.params.id;
      const user = await userCollection.findOne({ _id: new ObjectId(id) });
      res.send(`
      <button><a href="/">Home</a></button> <br>
      <img src="../${user.logo}" alt="logoalt">
      <form action="/logo/${id}" method="post" enctype="multipart/form-data">
      <input type="file" name="logo" />
      <input type="submit" value="Upload" />
    </form>
    `);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
})();

module.exports = router;
