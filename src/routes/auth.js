const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const cookie = require("cookie");
const { validateSignupData } = require("../utils/validation");
const authRoute = express.Router();
authRoute.post("/signup", async (req, res) => {
  try {
      //validation of data
      validateSignupData(req);
      const { firstName, lastName, email, password } = req.body;
      //const userMock = req.body;
      //Encrypt the password
      const passHash = await bcrypt.hash(password, 10);
      const user = new User({
        firstName,
        lastName,
        email,
        password: passHash,
      });
      await user.save();
      res.send("data saved successfully");
    } catch (err) {
      res.status(500).send("ERROR:" + err.message);
    }
  });
  // Login API- POST /login - to login in the account
  authRoute.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new Error("Invalid credentials");
      }
      const pass = await user.validatePassword(password);
      if (!pass) {
        throw new Error("Invalid credentials");
      } else {
          
        //JWT token creation
        const token = await user.getJWT(password);
        //place token inside cookie
        res.cookie("token", token);
        res.status(200).send("Login successfully");
      }
    } catch (err) {
      res.status(500).send("ERROR:" + err.message);
    }
  });
  authRoute.post('/logout',async(req,res)=>{
    res.cookie("token",{},{expires: new Date(Date.now())});
    res.send("logout successfully");
  })

  module.exports = authRoute;