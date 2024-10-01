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
};
const validateEditProfileData = (req)=>{
    const data = req.body;
    const validColumns = [
        "userId",
        "lastName",
        "password",
        "skills",
        "about",
        "photoURL",
      ];
      const isValid = Object.keys(data).every((k)=>{
          return validColumns.includes(k);
      });
      return isValid;
}
module.exports={validateSignupData,validateEditProfileData};