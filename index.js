const express = require("express"); //J'importe express  I
const mongoose = require("mongoose"); //J'importe mongoose  II
const app = express(); //Je créé mon serveur III
app.use(express.json()); //On veut que nos routes récupèrent les body  IV
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://localhost/vinted"); //Je me connecte à ma bdd Mongo V
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const userRoutes = require("./routes/user"); //Import de mes routes
const offerRoutes = require("./routes/offer");
const cloudinary = require("cloudinary").v2; //On met bien le v2 comme mentionné dans la doc

cloudinary.config({
  cloud_name: "dg8eoc9io",
  api_key: "581346678434931",
  api_secret: "NCaz6n1AwG5r8su3XOYyy6IcotE",
  secure: true,
});
app.use(userRoutes);
app.use(offerRoutes);

app.post("/", async (req, res) => {
  res.status(200).json({ message: "TEST requete Http" });
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "Error 404 not found" });
});

app.listen(3000, () => {
  //Je fais tourner mon serveur sur le port 3000 VI
  console.log("👕 Server started 👕");
});