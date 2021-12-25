const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    content:{
        type: String,
        required: [true, 'Please give a appropriate review']
    },
    belong_campground:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campground'
    },
    rating: {
        type: Number,
        min:1,
        max:5,
        required:[true, 'Please give a appropriate rating']
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

})
module.exports =  mongoose.model('Review', ReviewSchema)