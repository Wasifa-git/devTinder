const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRoute = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
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
    
});
userRoute.get("/user/feed",userAuth,async(req,res)=>{
    try{
        const loggedUser = req.user;
        //pagination
        const page = parseInt(req.query.page)||1;
        const limit = parseInt(req.query.limit)||10;
        limit = (limit > 50 ? 50 :limit);
        const skip = (page - 1) * limit;

        const invalidConnection = await ConnectionRequest.find({
            $or: [
                { fromUserId:loggedUser._id},{toUserId:loggedUser._id}
            ]
        });
        const invalidSet = new Set();
        invalidConnection.forEach((conn)=>{
            invalidSet.add( conn.fromUserId.toString());
            invalidSet.add(conn.toUserId.toString()) ;           
        });
        const validUser = await User.find({
            $and:[ 
                {_id: {$ne:loggedUser._id}
                },
                { _id: {$nin: Array.from(invalidSet) }
                }
            ]
        }).select(["firstName","lastName"]).skip(skip).limit(limit);

        res.status(200).json({
            message:"feed data",
            data: validUser    });

    }catch(err){
        res.status(400).send("Error:" + err.message);
    }
});

module.exports=userRoute;