const express = require("express");
const app = express();
const {auth} = require("./auth.js")
app.use("/login",(req,res)=>{
    res.send("You are successfully logged in,congrats ");
});
app.get("/user",(req,res)=>{
    res.send({'name':'wasifa','age':22});
});
app.post("/user",(req,res)=>{
    res.send("Successfully data is submitted");
})
//this will match all the HTTP method API calls to /test
app.use("/test",(req,res)=>{
    res.send("hello our server is listening");
});
//route using ?,*,+, you can group letter also.
app.get("/a(b)?c+",(req,res)=>{
    res.send("trying expressions");
});
//route regex.
// any expression containing a
app.get(/a/,(req,res)=>{
    res.send("trying regx");
});

//anything that ends with fly will work
app.get(/.*fly$/,(req,res)=>{
    res.send("ending with fly");
});
// get request query
// send req like this,http://localhost:9999/user?userid=009&pass="09"
app.get("/querychecking",(req,res)=>{
    console.log(req.query);
    res.send("query checking");
})
//dynamic API query
app.get("/dyn/:userid/:possword",(req,res)=>{
    console.log(req.params);
    res.send("j");//if we dont send response req will b in loop
})
app.get("/log",auth,(req,res)=>{
    res.send("auth happens");
})
app.listen(9999,()=>{
    console.log("Our server running");
});