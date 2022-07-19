import mongoose from "mongoose";

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true,
    },
    user: {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        name: {type: String},
        avatar: {type: String},
    },
    content: {
        type: String,
    },
});

commentSchema.set("timestamps", true);
export default mongoose.model("Comment", commentSchema);
