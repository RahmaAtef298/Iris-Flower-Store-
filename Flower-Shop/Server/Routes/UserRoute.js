var express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

var UserRouter = express.Router();
const mongoose=require('mongoose');

require("../Models/UserModel");

let userSchema = mongoose.model("user");


UserRouter.get('/',(req,res,next)=>{
    res.send("Hello from User Router")
});

//Get Single User 
UserRouter.get('/getUser/:email',(req,res,next)=>{
  userSchema.findOne({email:req.params.email}).then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User not found!" });
      }
    });
});

// Signup Route
UserRouter.post("/signup", (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then(hash => {
      const user = new userSchema({
        username: req.body.username,
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(result => {
          res.status(201).json({
            message: "User created!",
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
            error: err
          });
        });
    });
  });


// Login Route
UserRouter.post("/login", (req, res, next) => {
    let fetchedUser;
    userSchema.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({
            message: "Auth failed1"
          });
        }
        fetchedUser = user;
        console.log("1");
        console.log(req.body.password);
        console.log(user.password);
        return bcrypt.compare(req.body.password, user.password);
      })
      .then(result => {
        if (!result) {
          console.log(result);
          return res.status(401).json({
            message: "Auth failed2"
          });
        } 
        console.log("2");
        const token = jwt.sign(
          { email: fetchedUser.email, userId: fetchedUser._id },
          "secret_this_should_be_longer",
          { expiresIn: "1h" }
        );
        console.log(fetchedUser.email,fetchedUser._id);
        res.status(200).json({
          token: token,
          expiresIn: 3600,
          userId: fetchedUser._id
        });
      })
      .catch(err => {
        console.log(err);
        return res.status(401).json({
          message: "Auth failed3"
        });
      });
  });

module.exports=UserRouter;