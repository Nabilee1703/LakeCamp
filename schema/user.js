const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please give a appropriate email']
    },
    username:{
        type: String,
        required: [true, 'Please give a appropriate usename'],
        unique: true
    },
    password:{
        type: String,
    }
})
UserSchema.plugin(passportLocalMongoose)
module.exports = mongoose.model('User', UserSchema)

