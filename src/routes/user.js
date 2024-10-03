const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRoute = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
userRoute.get("/user/request",userAuth,async (req,res)=>{
    try{
        const loggedUser = req.user;
        const request = await ConnectionRequest.find({
        toUserId:loggedUser._id,
        status:"interested"
    }).populate("fromUserId",["firstName","lastName"]);
    res.status(200).json({message:"All the requestes",
                       request});
    } catch(err) {
        res.status(400).send("Error:" + err.message);
    }
    
})
userRoute.get("/user/connections",userAuth,async (req,res)=>{
    try{
        const loggedUser = req.user;
        const connection = await ConnectionRequest.find({
          $or:[{
                toUserId:loggedUser._id, status:"accepted"
          },{
                fromUserId:loggedUser._id, status:"accepted"
          }]
    }).populate("fromUserId",["firstName","lastName"])
    .populate("toUserId",["firstName","lastName"]);
    const data = connection.map((row)=>{
        if(row.fromUserId._id.toString() === loggedUser._id.toString()){
            return row.toUserId;
        } else 
              return row.fromUserId;
    })
    res.status(200).json({message:"All the connection",
        data});
    } catch(err) {
        res.status(400).send("Error:" + err.message);
    }
    
})

module.exports=userRoute;