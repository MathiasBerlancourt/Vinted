const express = require("express"); //J'importe express  I
const User = require("../models/User");
const router = express.Router();
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
router.post("/user/signup", async (req, res) => {
  try {
    console.log("TEST de RECEPTION DE req.body sur /signup:", req.body);
    const { username, email, password, newsletter } = req.body; //je destrucure red.body pour un code plus DRY (don't repeat yourself tmtc)

    if (!username || !email || !password || typeof newsletter !== "boolean") {
      return res.status(400).json({ message: "Missing parameter" });
    }

    const passwordSent = password;
    const salt = uid2(16);
    const hash = SHA256(passwordSent + salt).toString(encBase64);
    const token = uid2(64);

    const newUser = new User({
      email: email,
      account: { username: username, avatar: {} },
      password: hash,
      newletter: newsletter,
      token: token,
      hash: hash,
      salt: salt,
    });

    const isItUniq = await User.findOne({ email: newUser.email });

    if (isItUniq) {
      return res.status(400).json({
        message: "BAD REQUEST THIS MAIL AREADY EXISTS IN OUR DATABASE",
      });
    }
    // if (!newUser.account.username) {
    //   return res
    //     .status(400)
    //     .json({ message: "BAD REQUEST THIS ACCOUNT IS NOT ACCEPTED" });
    // } //Ajouter les controles de missing parameters ----- > j'ai remplacé ce bloc par celui de la correction plus hait

    await newUser.save();
    const response = {
      _id: newUser._id,
      account: newUser.account,
      token: newUser.token,
    };
    res.status(200).json({ response });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    console.log("TEST de RECEPTION DE req.body sur /login:", req.body);
    const { email, password } = req.body; //je destrucure red.body pour un code plus DRY (don't repeat yourself tmtc)
    const mailExistsInThisObject = await User.findOne({ email: email });
    if (mailExistsInThisObject) {
      const passwordSentLogin = password;

      const hash = SHA256(
        passwordSentLogin + mailExistsInThisObject.salt
      ).toString(encBase64);
      if (hash === mailExistsInThisObject.hash) {
        res.status(200).json({ message: "User connected, path to DB is ok" });
      } else {
        res.status(400).json({ message: "THE PASSWORD IS UNCORRECT" });
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
