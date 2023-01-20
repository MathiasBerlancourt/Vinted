const express = require("express");
const router = express.Router();
const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  try {
    //Je récupere le token qui est dans req.headers.authorization
    console.log(req.headers.authorization);
    //j'enleve la string Bearer de mon token
    const token = req.headers.authorization.replace("Bearer ", "");
    console.log("Mon token reçu par le call : ", token);
    const userWithSameToken = await User.findOne({ token: token });
    console.log("userWithSameToken :", userWithSameToken);
    if (userWithSameToken) {
      req.user = userWithSameToken;
      next();
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = isAuthenticated;
