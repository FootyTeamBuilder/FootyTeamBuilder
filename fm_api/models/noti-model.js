import mongoose from "mongoose";

const Schema = mongoose.Schema;

const notiSchema = new Schema({
    type :{
        type: String,
        enum: ['User', 'Team', 'System']
    },
    sendedTeamId: {
        type: String,
    },
    recievedTeamId: {
        type: String,
    },
    senderId: {
        type: String,
    },
    recievedId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true   
    },
    content: {
        type: String
    },
    message: {
        type: String
    },
});

notiSchema.set('timestamps', true);
export default mongoose.model('Noti',notiSchema)