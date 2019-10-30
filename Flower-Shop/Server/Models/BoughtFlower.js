const mongoose = require('mongoose');

const BoughtFlowerSchema = new mongoose.Schema({
    flowerAmoumt:{
        type:Number,
        required: true
    },
    flowersPrice:{
        type:Number,
        required: true
    },
    name:{
        type:String,
        required: true
    },
    imagePath:{
        type:String,
        required: true
    },
    arrivalDate:{
        type:String,
        required: true
    },
    bloomPrice:{
        type:String,
        required: true
    },
    buyer:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
});

module.exports = mongoose.model('boughtFlower',BoughtFlowerSchema,'boughtFlowers');