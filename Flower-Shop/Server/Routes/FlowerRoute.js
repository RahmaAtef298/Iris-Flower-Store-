var express = require("express");
const multer = require("multer");
var FlowerRouter = express.Router();
const mongoose=require('mongoose');

require("../Models/FlowerModel");

let FlowerSchema = mongoose.model("flower");

const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg"
  };
  
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const isValid = MIME_TYPE_MAP[file.mimetype];
      let error = new Error("Invalid mime type");
      if (isValid) {
        error = null;
      }
      cb(error, "../Server/Publics/Images");
    },
    filename: (req, file, cb) => {
      const name = file.originalname
        .toLowerCase()
        .split(" ")
        .join("-");
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, name + "-" + Date.now() + "." + ext);
    }
  });

FlowerRouter.get('/',(req,res,next)=>{
    res.send("Hello from FlowerRouter")
});

//Get All Flowers
FlowerRouter.get('/flowers',(req,res,next)=>{
    FlowerSchema.find().then(documents => {
        res.status(200).json({
          message: "Flowers fetch succefully",
          flowers: documents
        });
      });
});

//Get Single Flower 
FlowerRouter.get('/flower/:id',(req,res,next)=>{
    FlowerSchema.findOne({_id:req.params.id}).then(flower => {
        if (flower) {
          res.status(200).json(flower);
        } else {
          res.status(404).json({ message: "Flower not found!" });
        }
      });
});

//Find Specific Flowers By Name
FlowerRouter.get('/searchN/:name',(req,res,next)=>{
    FlowerSchema.find({name :{ $regex : `${req.params.name}`}}).then(flowers => {
        if (flowers) {
          res.status(200).json({
            message: "Flowers fetch succefully",
            flowers: flowers
          });
        } else {
          res.status(404).json({ message: "Flower not found!" });
        }
      });
});

//Find Specific Flowers By Bloom Price
FlowerRouter.get('/searchP/:bloomPrice',(req,res,next)=>{
  FlowerSchema.find({bloomPrice :{ $regex : `${req.params.bloomPrice}`}}).then(flowers => {
      if (flowers) {
        res.status(200).json({
          message: "Flowers fetch succefully",
          flowers: flowers
        });
      } else {
        res.status(404).json({ message: "Flower not found!" });
      }
    });
});


//Add Flower
FlowerRouter.post('/flower',multer({ storage: storage }).single("image"),(req,res,next)=>{
    const url = req.protocol + "://" + req.get("host");
    console.log(req.file.filename);
    console.log(url);
    console.log(req.protocol);
    console.log(req.get("host"));
    var flower = new FlowerSchema({
        name:req.body.name,
        imagePath: url + "/Images/" + req.file.filename,
        arrivalDate:req.body.arrivalDate,
        bloomPrice:req.body.bloomPrice
    })
    console.log(flower.imagePath);
    console.log(flower);
    if(!flower.name || !flower.imagePath || !flower.arrivalDate || !flower.bloomPrice){
        res.status(400);
        res.json({
            "Error":"Bad Data"
        });
    }else{
        flower.save().then(createdflower => {
            res.status(201).json({
              message: "Flower Added Successfully",
              flower:{
                  ...createdflower,
                flowerId: createdflower._id
              }
            });
        });
    }
});

//Delete Flower
FlowerRouter.delete('/flower/:id',(req,res,next)=>{
    FlowerSchema.remove({_id:req.params.id}).then(deletedflower => {
        console.log(deletedflower);
        res.status(200).json({ message: "Flower Deleted!" });
      });
});

//Delete All 
FlowerRouter.delete('/flowers',(req,res,next)=>{
  FlowerSchema.deleteMany().then(deletedflowers => {
      console.log(deletedflowers);
      res.status(200).json({ message: "Flowers Deleted!" });
    });
});

//Update Flower
FlowerRouter.put('/flower/:id',multer({ storage: storage }).single("image"),(req,res,next)=>{
  let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/Images/" + req.file.filename
    }
    var flower = new FlowerSchema({
        _id: req.body.id,
        name:req.body.name,
        imagePath: imagePath,
        arrivalDate:req.body.arrivalDate,
        bloomPrice:req.body.bloomPrice
    })
    var updflower = {};
    
    if(flower.name){
        updflower.name = flower.name;
    }

    if(flower.description){
        updflower.description = flower.description;
    }

    if(!updflower){
        res.status(400);
        res.json({
            "error":"Bad Data"
        });
    } else {
      FlowerSchema.updateOne({_id:req.params.id},flower).then(result => {
        res.status(200).json({ message: "Flower Updated Successful!" });
      });
    }
});
module.exports=FlowerRouter;