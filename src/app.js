const express = require("express");
const {dbConnect}=require("./config/database");
const User = require("./models/user")
const app = express();
dbConnect().then(()=>{
    console.log("db is connected ");
    app.listen(9999,()=>{
        console.log("Our server running");
    });
}
   
).catch((err)=>{
    console.log(err,"db is  not connected ");
}) ;
app.use(express.json());
app.post("/signup", async(req,res)=>{

    // const userMock ={
    //     "firstName":"Anik",
    //     "lastName":"Barui",
    //     "email":"Anik@gmail.com",
    //     "password":"anik123"
    // };
    const userMock = req.body;
    const user = new User(userMock);
    try{
        await user.save();
        res.send("data saved successfully");
    }catch(err){
        res.status(500).send("data not fetched",err.message);
    };
    
});
// Feed API - GET /feed - to get all the users to the feed

app.get("/feed", async(req,res)=>{
    try {
        const users =  await User.find({});
        res.send(users);
    } catch(err) {
        res.status(404).send("not found");
    }   
})

//delete API -delete /user - delete an entry
app.delete("/user",async(req,res)=>{
    const input = req.body.firstName;
    console.log(input);
    try {       
        await User.deleteOne({firstName:input});
        res.send("item deleted");
    }catch(err) {
        res.status(400).send("something went wrong");
    }
    
}) 

//update API - update /user-update an user
app.patch("/user",async(req,res)=>{
    const userId = req.body._id;
    const data = req.body;
    console.log(userId);
    try{
        await User.findByIdAndUpdate({_id:userId},data);
        res.send("item updated");
    }catch(err) {
        res.status(400).send("something went wrong");
    }
})

// const {auth} = require("./auth.js")
// app.use("/login",(req,res)=>{
//     res.send("You are successfully logged in,congrats ");
// });
// app.get("/user",(req,res)=>{
//     res.send({'name':'wasifa','age':22});
// });
// app.post("/user",(req,res)=>{
//     res.send("Successfully data is submitted");
// })
// //this will match all the HTTP method API calls to /test
// app.use("/test",(req,res)=>{
//     res.send("hello our server is listening");
// });
// //route using ?,*,+, you can group letter also.
// app.get("/a(b)?c+",(req,res)=>{
//     res.send("trying expressions");
// });
// //route regex.
// // any expression containing a
// app.get(/a/,(req,res)=>{
//     res.send("trying regx");
// });

// //anything that ends with fly will work
// app.get(/.*fly$/,(req,res)=>{
//     res.send("ending with fly");
// });
// // get request query
// // send req like this,http://localhost:9999/user?userid=009&pass="09"
// app.get("/querychecking",(req,res)=>{
//     console.log(req.query);
//     res.send("query checking");
// })
// //dynamic API query
// app.get("/dyn/:userid/:possword",(req,res)=>{
//     console.log(req.params);
//     res.send("j");//if we dont send response req will b in loop
// })
// app.get("/log",auth,(req,res)=>{
//     res.send("auth happens");
// })
