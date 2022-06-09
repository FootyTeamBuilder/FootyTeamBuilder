import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
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
        required: false,
        // unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
});

export default mongoose.model('User', userSchema);