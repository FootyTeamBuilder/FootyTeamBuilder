import mongoose from "mongoose";

const Schema = mongoose.Schema;

const notiSchema = new Schema({
    type :{
        type: String,
        enum: ['User', 'Team', 'System']
    },
    teamId: {
        type: String,
        required: true
    },
    senderId: {
        type: String,
        required: true
    },
    recievedId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true   
    },
    content: {
        type: String
    },
});

notiSchema.set('timestamps', true);
export default mongoose.model('Noti',notiSchema)