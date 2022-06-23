import mongoose from "mongoose";
import ROLE from "../utils/enums.js";

const Schema = mongoose.Schema;

const memberSchema = new Schema({
	teamId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Team",
		required: true,
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: false, //captain can create virtual member and add user later
	},
	role: {
		type: String,
		enum: [ROLE.CAPTAIN, ROLE.MEMBER],
	},
	nickname: {
		type: String,
		default: ROLE.Nickname,
	},
	number: {
		type: Number,
	},
	isExistUser: {
		type: Boolean,
		default: false,
	},
});

export default mongoose.model("Member", memberSchema);
