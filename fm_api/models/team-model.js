import mongoose from "mongoose";

const Schema = mongoose.Schema;

const teamSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    level: {
        type: String,
        enum: ['vui vẻ', 'yếu', 'trung bình', 'khá', 'bán chuyên', 'chuyên nghiệp'],
        default: 'vui vẻ'
    },
    age: {
        minAge: { type: Number, min: 0 },
        maxAge: { type: Number, min: 0 },
    },
    competitionHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Matchs"
        }
    ],
    kits: {
        type: String,
        required: false
    },
    logo: {
        type: String,
        required: false
    },
    area: {
        type: String,
        required: false
    },
    time: {
        type: Date,
        required: false,
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comments"
        }
    ]
});

export default mongoose.model('Team', teamSchema);