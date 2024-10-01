const express = require("express");
const profileRoute = express.Router();
const {userAuth} = require("../middlewares/auth");
const {validateEditProfileData} = require("../utils/validation");
const bcrypt = require("bcrypt");
// Profile API - GET/profile - to get your profile
profileRoute.get("/profile", userAuth,async (req, res) => {
    try {
      //get tokens
      // const cookie = req.cookies;
      // const { token } = cookie;
      // if(! token) {
      //     throw new Error("Invalid token");
      // }
      //validate JWT tokens
      // const dcodedMessage = await jwt.verify(token, "wasifa360");
      // console.log("msg",dcodedMessage);
      // const {_id} = dcodedMessage;
      // console.log("id",_id);
      // const data = await User.findById({_id:_id});
      const data = req.user;
      console.log(data);
      res.send(data);
    } catch (err) {
      res.status(404).send("not found");
    }
  });
  
  profileRoute.patch("/profile/edit",userAuth,async (req,res)=>{
      
        try{
          const isValidUpdatedField = validateEditProfileData(req);
          if(!isValidUpdatedField) {
            throw new Error("Invalid Edit");
          }
          const loggedUser = req.user;
          const updatedUser = req.body;
          Object.keys(updatedUser).forEach((k)=>{
                loggedUser.k = updatedUser.k;
          });
          loggedUser.save();
          res.send(`${loggedUser.firstName}Data updated successfully`);
        }catch(err) {
          res.status(500).send("ERROR:" + err.message);
        }
       
  });

  profileRoute.patch("/profile/password",userAuth,async (req,res)=>{
      
    try{
      const {newPassword,confirmPassword} = req.body;
      if(newPassword !== confirmPassword) {
         throw new Error(" not matched");
      }
      //Encrypt the password
      const passHash = await bcrypt.hash(newPassword, 10);
      req.user.password = passHash;
      req.user.save();
      res.send("Password updated successfully");      
    }catch(err) {
      res.status(500).send("ERROR:" + err.message);
    }
   
});

  module.exports=profileRoute;