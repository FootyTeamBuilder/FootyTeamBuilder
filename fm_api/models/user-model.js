const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: date,
        required: false
    },
    avatar: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true,
        max: 255,
        min: 6,
    },
    achivements: {
        type: Number,
        required: false,
        default: 0
    },
    phonenumber: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: false,
        unique: true
    }
});

module.exports = mongoose.model('User', userSchema);