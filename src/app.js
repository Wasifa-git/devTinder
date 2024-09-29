const express = require("express");
const { dbConnect } = require("./config/database");
const User = require("./models/user");
const { validateSignupData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const cookieparser = require("cookie-parser");
const app = express();
dbConnect()
  .then(() => {
    console.log("db is connected ");
    app.listen(9999, () => {
      console.log("Our server running");
    });
  })
  .catch((err) => {
    console.log(err, "db is  not connected ");
  });
app.use(express.json());
app.use(cookieparser());
app.post("/signup", async (req, res) => {
  // const userMock ={
  //     "firstName":"Anik",
  //     "lastName":"Barui",
  //     "email":"Anik@gmail.com",
  //     "password":"anik123"
  // };

  try {
    //validation of data
    validateSignupData(req);
    const { firstName, lastName, email, password } = req.body;
    //const userMock = req.body;
    //Encrypt the password
    const passHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: passHash,
    });
    await user.save();
    res.send("data saved successfully");
  } catch (err) {
    res.status(500).send("ERROR:" + err.message);
  }
});
// Login API- POST /login - to login in the account
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const pass = await bcrypt.compare(password, user.password);
    if (!pass) {
      throw new Error("Invalid credentials");
    } else {
      //JWT token creation
      const token = await jwt.sign({ _id: user._id }, "wasifa360");
      //place token inside cookie
      res.cookie("token", token);
      res.status(200).send("Login successfully");
    }
  } catch (err) {
    res.status(500).send("ERROR:" + err.message);
  }
});
// Profile API - GET/profile - to get your profile
app.get("/profile", async (req, res) => {
  try {
    //get tokens
    const cookie = req.cookies;
    const { token } = cookie;
    if(! token) {
        throw new Error("Invalid token");
    }
    //validate JWT tokens
    const dcodedMessage = await jwt.verify(token, "wasifa360");
    console.log("msg",dcodedMessage);
    const {_id} = dcodedMessage;
    console.log("id",_id);
    const data = await User.findById({_id:_id});
    console.log(data);
    res.send(data);
  } catch (err) {
    res.status(404).send("not found");
  }
});
// Feed API - GET /feed - to get all the users to the feed

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(404).send("not found");
  }
});

//delete API -delete /user - delete an entry
app.delete("/user", async (req, res) => {
  const input = req.body.firstName;
  console.log(input);
  try {
    await User.deleteOne({ firstName: input });
    res.send("item deleted");
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

//update API - update /user-update an user
app.patch("/user/:_id", async (req, res) => {
  const userId = req.params._id;
  const data = req.body;
  try {
    const validColumns = [
      "userId",
      "lastName",
      "password",
      "skills",
      "about",
      "photoURL",
    ];
    const isFieldValid = Object.keys(data).every((k) => {
      return validColumns.includes(k);
    });
    console.log(isFieldValid);
    if (!isFieldValid) {
      throw new Error("not a valid type to update");
    }
    if (data?.skills?.length > 10) {
      throw new Error("you can not add more than 10 skills");
    }
    await User.findByIdAndUpdate({ _id: userId }, data, {
      runValidators: true,
    });
    res.send("item updated");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

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
