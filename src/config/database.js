const mongoose = require("mongoose");
const dbConnect = async ()=>{
    await mongoose.connect("mongodb+srv://NamasteWasifa:vATuXWBxe8zuvBnp@namastewasifa.ana8b.mongodb.net/");
}
module.exports={dbConnect}




