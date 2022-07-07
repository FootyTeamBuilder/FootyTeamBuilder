import mongoose from "mongoose";

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true   
    },
    content: {
        type: String
    },
});

commentSchema.set('timestamps', true);
export default mongoose.model('Comment',commentSchema)