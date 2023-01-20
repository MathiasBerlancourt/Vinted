const mongoose = require("mongoose"); // J'importe mongoose pour que ma variable offre en dessous ait du sens sinon je peux pas utiliser model

const Offer = mongoose.model("Offer", {
  product_name: String,
  product_description: String,
  product_price: Number,
  product_details: Array,
  product_image: Object,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
module.exports = Offer; // je donne la possibilité d'exporter ce model partout dans mon programme
