const mongoose = require('mongoose');
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
        min: { type: Number, min: 0 },
        max: { type: Number, min: 0 },
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

module.exports = mongoose.model('Team', teamSchema);