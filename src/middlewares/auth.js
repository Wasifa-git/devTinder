const jwt = require("jsonwebtoken");
const User = require("../models/user");
// const auth = (req,res,next)=>{
//     var authentication = false;
//     if(authentication) {
//         next();
//     } else {
//         res.status(401).send("authentication failed");
//     }
// }
const userAuth = async(req,res,next)=>{
    try{
        //get token from cookies
        const {token} = req.cookies;
        if(!token) {
            throw new Error("Inavalid token");
        }
        console.log(token);      
           //validate JWT tokens
    const dcodedMessage = await jwt.verify(token, "wasifa360");
    const {_id} = dcodedMessage;
    console.log(_id); 
    const user = await User.findById({_id:_id});
    if(!user) {
        throw new Error("User not found");
    }
    console.log(user);
    req.user = user;
    next();
    }catch(err) {
        res.status(400).send("ERROR:"+err.message);
    }
}

module.exports = {userAuth}