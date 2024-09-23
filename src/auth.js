const auth = (req,res,next)=>{
    var authentication = false;
    if(authentication) {
        next();
    } else {
        res.status(401).send("authentication failed");
    }
}

module.exports = {auth}