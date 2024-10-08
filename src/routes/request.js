const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRoute = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRoute.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
     
        try{
                const fromUserId = req.user._id;
                const toUserId = req.params.toUserId;
                const status = req.params.status;
                if( !["interested","ignored"].includes(status)) {
                        return res.status(400).json({
                                message:"invalid request status "+status 
                        });
                }
                   const toUser = await User.findById({_id:toUserId});
                   
                   if(! toUser) {
                        return res.status(401).json({
                                message:"user to connect not found" 
                        });
                   }
                 const isConnection = await ConnectionRequest.findOne({
                        $or:[
                                {fromUserId,toUserId},
                                {fromUserId:toUserId,toUserId:fromUserId}
                        ]
                 })
                 if(isConnection){
                        return res.status(400).json({
                                message:"connection already exists" 
                        });
                 }
                 const connectionRequest = new ConnectionRequest({fromUserId,toUserId,status})
                const data = await connectionRequest.save();
                res.json({
                       message:`${req.body.user.firstName} +${status}+successfully`,
                        data
                });


        }catch(err) {
                res.status(400).send("ERROR:"+err.message);
        }
});

requestRoute.post(
        "/request/review/:status/:requestId",
        userAuth,
        async(req,res)=>{
                //do proper validation
        try {
                const loggedUser = req.user;
        const {status,requestId} = req.params;
        const allowedStatus =["accepted","rejected"];
        //validate status
        if(! allowedStatus.includes(status)) {
                return res.status(400).json({
                        message:"status not valid"
                })
        }
        const checkConnection = await ConnectionRequest.findOne({
                _id:requestId,
                toUserId:loggedUser._id,
                status:"interested"
        })
        if(! checkConnection) {
                return res.status(400).json({
                        message:"connection not valid"
                })
        }
        checkConnection.status = status;
        const data = await checkConnection.save();
        res.status(200).json({
                message:`conn req ${ status} successfully`,
                data
        })

        }catch(err) {
                res.status(400).send("ERROR:"+err.message);
        }
        
        }
);

module.exports=requestRoute;