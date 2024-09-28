const validator = require("validator");
const validateSignupData = (req)=>{
    const {firstName,lastName,email,password} = req.body;
    if(!firstName || !lastName) {
        throw new Error("Invalid username");
    }else if(! validator.isEmail(email)) {
        throw new Error("Invalid Email");
    }else if(!validator.isStrongPassword(password)) {
        throw new Error("Password is not strong");
    }
}
module.exports={validateSignupData};