const express = require("express");
const router = express.Router();
const { getCollection } = require("../../db");
const { ObjectId } = require("mongodb");
const multer = require("multer");
const fs = require("fs");
const zlib = require("zlib");

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

      // Convert image to base64
      // const logoImageBase64 = fs.readFileSync(logoImage, {
      //   encoding: "base64",
      // });
      // const compressedImage = zlib
      //   .deflateSync(Buffer.from(logoImageBase64))
      //   .toString("base64");
      const result = await userCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { logo: logoImage } }
      );
      res.redirect(`/logo/${id}`);
    });

    router.get("/logo/:id", async (req, res) => {
      const id = req.params.id;
      let idString = id.toString();
      const user = await userCollection.findOne({ _id: new ObjectId(id) });
      user._id = idString;
      res.render("company/logo", { user: user });
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
})();

module.exports = router;
