const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRoute = express.Router();

requestRoute.post("/sendConnectionRequest",userAuth,async(req,res)=>{
        const user = req.user;
        res.send("Request send by"+user.firstName);
})

module.exports=requestRoute;