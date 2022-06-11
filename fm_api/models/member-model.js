import mongoose from "mongoose";

const Schema = mongoose.Schema;

const memberSchema = new Schema({
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false     //captain can create virtual member and add user later
    },
    role: {
        type: String,
        enum: ['đội trưởng', 'thành viên']
    },
    number: {
        type: Number,
    }
});

export default mongoose.model('Member', memberSchema);