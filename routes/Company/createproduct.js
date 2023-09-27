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
    const productsCollection = await getCollection("products");

    router.get("/product/create/:userId", async (req, res) => {
      const userId = req.params.userId;
      res.render("createProduct", { user: userId });
    });

    router.post(
      "/product/create/:userId",
      upload.fields([
        { name: "logo1", maxCount: 1 },
        { name: "logo2", maxCount: 1 },
        { name: "logo3", maxCount: 1 },
      ]),
      async (req, res) => {
        const userId = req.params.userId;

        // Assuming 'logo' is the name of the form field in your client-side form
        // req.body.logo = req.files.map((file) => file.path);
        if (req.files["logo1"]) {
          req.body.logo1 = req.files["logo1"][0].path;
        }
        if (req.files["logo2"]) {
          req.body.logo2 = req.files["logo2"][0].path;
        }
        if (req.files["logo3"]) {
          req.body.logo3 = req.files["logo3"][0].path;
        }

        // Get the product data from the request body
        const newProductData = req.body;

        let offer = Number(req.body.offer);
        let price = Number(req.body.price);

        newProductData.createdBy = userId; // Add the createdBy field
        newProductData.price = price; // Add the createdBy field
        newProductData.offer = offer; // Add the createdBy field

        // Insert the new product into the database
        const result = await productsCollection.insertOne(newProductData);
        const productId = result.insertedId; // Get the id of the inserted product

        // Redirect to the product page (or wherever you want)
        res.redirect(`/products/${userId}`);
      }
    );

    // router.post(
    //   "/product/create/:userId",
    //   upload.single("logo"),
    //   async (req, res) => {
    //     const userId = req.params.userId;

    //     // Assuming 'logo' is the name of the form field in your client-side form
    //     req.body.logo = req.file.path;

    //     // Get the product data from the request body
    //     const newProductData = req.body;
    //     newProductData.createdBy = userId; // Add the createdBy field

    //     // Insert the new product into the database
    //     const result = await productsCollection.insertOne(newProductData);
    //     const productId = result.insertedId; // Get the id of the inserted product

    //     // Redirect to the product page (or wherever you want)
    //     res.redirect(`/products/${userId}`);
    //   }
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
})();

module.exports = router;
