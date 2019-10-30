var express = require("express");
var BoughtFlowerRouter = express.Router();
const mongoose = require('mongoose');
const checkAuth = require("../middleware/check-auth");

require("../Models/BoughtFlower");

let BoughtFlowerSchema = mongoose.model("boughtFlower");


BoughtFlowerRouter.get('/',(req,res,next)=>{
    res.send("Hello from Bought Flower Router")
});

//Get All Bought Flowers
BoughtFlowerRouter.get('/boughtFlowers',checkAuth,(req,res,next)=>{
    BoughtFlowerSchema.find({buyer: req.userData.userId}).then(documents => {
        res.status(200).json({
          message: "Bought Flowers fetch succefully",
          boughtflowers: documents
        });
      });
});


//Add Bought Flower
BoughtFlowerRouter.post('/boughtFlower',checkAuth,(req,res,next)=>{
    console.log(req.userData.userId);
    var boughtFlower = new BoughtFlowerSchema({
        flowerAmoumt: req.body.flowerAmoumt,
        flowersPrice: req.body.flowersPrice,
        name: req.body.name,
        imagePath: req.body.imagePath,
        arrivalDate: req.body.arrivalDate,
        bloomPrice: req.body.bloomPrice,
        buyer: req.userData.userId
    })
    console.log("1"+req.body.imagePath);
    console.log("2"+boughtFlower);
    if(!boughtFlower.flowerAmoumt || !boughtFlower.flowersPrice || !boughtFlower.name || !boughtFlower.imagePath || !boughtFlower.arrivalDate || !boughtFlower.bloomPrice){
        console.log("3" + res.Error);
        res.status(400);
        res.json({
            "Error":"3 Bad Data"
        });
    }else{
        boughtFlower.save().then(createdboughtflower => {
            res.status(201).json({
              message: "Bought Flower Added Successfully",
              boughtFlower:{
                  ...createdboughtflower
              },
              id: createdboughtflower._id
            });
        });
    }
});

//Delete Bought Flower
BoughtFlowerRouter.delete('/boughtFlower/:id',checkAuth,(req,res,next)=>{
    BoughtFlowerSchema.remove({_id:req.params.id, buyer: req.userData.userId}).then(deletedflower => {
        console.log(deletedflower);
        res.status(200).json({ message: "Bought Flower Deleted!" });
      });
});




module.exports=BoughtFlowerRouter;