const mongoose = require('mongoose');

const FlowerSchema = new mongoose.Schema({
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
});

module.exports = mongoose.model('flower',FlowerSchema,'Flowers');