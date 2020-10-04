//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt =  require("mongoose-encryption");
const app = express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/usersDB",{ useNewUrlParser : true , useUnifiedTopology :true});

const userSchema = new mongoose.Schema({  email : String,
  password : String
});

const secret = "shrayisgreatandwillalwaysbegreat";
userSchema.plugin(encrypt ,{secret : process.env.SECRET , encryptedFields :["password"]});


const User = mongoose.model("User",userSchema);


app.get("/",(req,res) =>{
  res.render("home");
});


app.get("/login",(req,res) =>{
  res.render("login");
});
app.post("/login",(req,res) =>{
  const email = req.body.username;
  const password = req.body.password;
  User.findOne({email : email},(err ,foundUser) =>{
    if(foundUser){
      if(foundUser.password === password){
        res.render("secrets");
      }
      else{
        console.log("password incorrect");
      }
    }
    else{
      console.log(err);
    }
  });
});


   app.get("/register",(req,res) =>{
    res.render("register");
   });
   app.post("/register",(req,res) =>{

   const newUser  = new User({
    email : req.body.username,
    password :  req.body.password
   });
   newUser.save((err)=>{
    if(!err){
      console.log("succesfully created");
      res.render("secrets");
    }
  })
});


app.listen(3000 , ()=>{
  console.log("server just started on port 3000");
})
