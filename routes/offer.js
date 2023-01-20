const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload"); // On importe `express-fileupload` et on choisit de nommer l'import `fileUpload`

const app = express();
const Offer = require("../models/Offer");
const cloudinary = require("cloudinary").v2; //On met bien le v2 comme mentionné dans la doc
const isAuthenticated = require("../middlewares/isAuthenticated");
const User = require("../models/User");
const { find } = require("../models/Offer");
//ma config cloudinary :
cloudinary.config({
  cloud_name: "dg8eoc9io",
  api_key: "581346678434931",
  api_secret: "NCaz6n1AwG5r8su3XOYyy6IcotE",
  secure: true,
});

const convertToBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
};

const queryToFilter = {};
const querySortPrice = { price: -1 };

router.post(
  "/offer/publish",
  isAuthenticated,
  fileUpload(),
  async (req, res) => {
    try {
      console.log(req.files);

      const newOffer = new Offer({
        product_name: req.body.title,
        product_description: req.body.description,
        product_price: req.body.price,
        product_details: [
          { MARQUE: req.body.brand },
          { TAILLE: req.body.size },
          { ETAT: req.body.condition },
          { COULEUR: req.body.color },
          { EMPLACEMENT: req.body.city },
        ],
        // product_image: result,
        owner: req.user,
      });
      const picSent = convertToBase64(req.files.picture);
      const result = await cloudinary.uploader.upload(picSent, {
        folder: "/vinted/offers/",
        public_id: newOffer._id,
      });
      newOffer.product_image = result;
      newOffer.save();
      res.status(200).json(newOffer);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

router.put("/offer/update", isAuthenticated, fileUpload(), async (req, res) => {
  try {
    console.log("req.body :", req.body);
    res.status(200).json({ message: "test de reponse put" });
    offerToModify = await Offer.findOne({ _id: req.body.id });

    console.log(
      "VOICI l'offerToModify et ses product details AVANT modification: ",
      offerToModify.product_details
    );
    console.log("couleur a modifier : ", req.body.color);
    console.log(
      "offerToModify.product_details[0] : ",
      offerToModify.product_details[0].MARQUE
    );
    console.log("couleur a modifier :", offerToModify.product_details[3]);
    console.log("la modif couleur : ", req.body.color);

    if (offerToModify.product_name !== req.body.title) {
      offerToModify.product_name = req.body.title;
    }
    if (offerToModify.product_description !== req.body.description) {
      offerToModify.product_description = req.body.description;
    }
    if (offerToModify.product_price !== req.body.price) {
      offerToModify.product_price = req.body.price;
    }
    if (offerToModify.product_details[0].MARQUE !== req.body.brand) {
      offerToModify.product_details[0].MARQUE = req.body.brand;
    }
    if (offerToModify.product_details[1].TAILLE !== req.body.size) {
      offerToModify.product_details[1].TAILLE = req.body.size;
    }
    if (offerToModify.product_details[2].ETAT !== req.body.condition) {
      offerToModify.product_details[2].ETAT = req.body.condition;
    }
    console.log("COULEUR EN [3] : ", offerToModify.product_details[3].COULEUR);
    console.log("COULEUR EN BODY COLOR : ", req.body.color);
    if (offerToModify.product_details[3].COULEUR !== req.body.color) {
      offerToModify.product_details[3].COULEUR = req.body.color;
    }
    if (offerToModify.product_details[4].EMPLACEMENT !== req.body.city) {
      offerToModify.product_details[4].EMPLACEMENT = req.body.city;
    }
    if (req.body.picture) {
      const convertToBase64 = (file) => {
        return `data:${file.mimetype};base64,${file.data.toString("base64")}`;
      };
      const destroyThePic = await cloudinary.uploader
        .destroy({
          public_id: offerToModify._id,
        })
        .then((result) => console.log("resultat de la suppression:", result));
      const picSent = convertToBase64(req.files.picture);
      const result = await cloudinary.uploader.upload(picSent, {
        folder: "/vinted/offers/",
        public_id: offerToModify._id,
      });
    }

    console.log(
      "VOICI l'offerToModify et les product detail APRES modification: ",
      offerToModify.product_details
    );
    // offerToModify.product_details.forEach((element) => {
    //   element.save();
    // });
    offerToModify.markModified("product_details");
    await offerToModify.save();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/offers", async (req, res) => {
  try {
    console.log("ma REQ QUERY :", req.query);
    /**const query = {
  title: "",
  priceMin: 0,
  priceMax: 0,
  sort: "price-desc",
  page: 0,
}; */

    const { title, priceMin, priceMax, sort, page } = req.query; //Je destructure ma variable
    //console.log("initialement", queryToFilter);
    if (title) {
      queryToFilter.product_name = new RegExp(title, "i");
      //console.log("Après le if de title:", queryToFilter);
    }
    if (priceMin) {
      queryToFilter.product_price = { $gte: Number(priceMin) };
      //console.log("Après le if de priceMin :", queryToFilter);
    }

    //console.log("clg de priceMax :", priceMax);
    // console.log("queryTofilter product price:", queryToFilter.product_price);
    if (priceMax) {
      if (queryToFilter.product_price) {
        queryToFilter.product_price.$lte = Number(priceMax);
        // console.log("Après le if priceMax 1 :", queryToFilter);
      } else {
        queryToFilter.product_price = { $lte: Number(priceMax) };
        //console.log("Apres le else priceMAx 2 :", queryToFilter);
      }
    }
    if (sort === "price-asc") {
      querySortPrice = { price: 1 };
    }

    //console.log("queryToFilter donne : ", queryToFilter);

    const limit = 5;
    let pageRequired = 1;
    if (page) pageRequired = Number(page);
    const skip = (pageRequired - 1) * limit;
    const offers = await Offer.find(queryToFilter)
      .sort(querySortPrice)
      .skip(skip)
      .limit(limit)
      .populate("owner", "account");
    // .select("product_price product_name");
    const count = await Offer.countDocuments(queryToFilter);

    const response = { count: count, offers: offers };

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
