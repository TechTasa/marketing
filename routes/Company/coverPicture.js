const express = require("express");
const router = express.Router();
const { getCollection } = require("../../db");
const { ObjectId } = require("mongodb");
const multer = require("multer");
const fs = require("fs");

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

    router.post("/cover/:id", upload.single("cover"), async (req, res) => {
      const id = req.params.id;
      const user = await userCollection.findOne({ _id: new ObjectId(id) });

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      // Assuming 'cover' is the name of the form field in your client-side form
      const coverImage = req.file.path; // get the path of the uploaded file

      const result = await userCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { cover: coverImage } }
      );
      res.redirect(`/cover/${id}`);
      // if (result.modifiedCount === 1) {
      //
      // } else {
      //   res.status(500).send({ message: "Failed to upload cover image" });
      // }
    });

    router.get("/cover/:id", async (req, res) => {
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
      res.render("company/cover", { user: user });
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
})();

module.exports = router;
