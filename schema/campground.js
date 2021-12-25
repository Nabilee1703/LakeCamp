const mongoose = require('mongoose');
const Review = require('./review')
const opts = { toJSON: {virtuals: true}}
const CampGroundSchema = new mongoose.Schema({
    title:{
        type:  String,
        required: [true, 'Please give a appropriate title']
    },
    price:{
        type: Number,
        required: [true, 'Please give a appropriate price'],
        min: 0
    },
    description:{
        type: String,
        required: [true, 'Please give a appropriate description']
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    location:{
        type: String,
        required: [true, 'Please give a appropriate location']
    },
    images:[{
        path: String,
        filename: String,
    }],
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]

}, opts)

CampGroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `<h6>${this.title}</h6><a href="/campgrounds/${this._id}">Explore more</a>`
})

CampGroundSchema.post('findOneAndDelete', async function (camp){
    if(camp){
       await Review.deleteMany({
            _id: {
                $in: camp.reviews
            }
        })
    }
})
module.exports = mongoose.model('CampGround', CampGroundSchema)