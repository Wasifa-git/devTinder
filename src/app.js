const express = require("express");
const app = express();
app.use("/login",(req,res)=>{
    res.send("You are successfully logged in,congrats ");
});
app.use((req,res)=>{
    res.send("hello our server is listening");
});
app.listen(9999,()=>{
    console.log("Our server running");
});