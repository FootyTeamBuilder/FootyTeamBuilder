import mongoose from "mongoose";

const Schema = mongoose.Schema;

const matchSchema = new Schema({
	team1: {
		teamId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Team",
		},
		captainId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		score1: Number,
		score2: Number, // from rival ->
		//check if score === verifyScore -> resolve
		// score !== verifyScore -> conflict
		// verify score === null -> pending input
	},
	team2: {
		teamId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Team",
		},
		captainId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		score1: Number,
		score2: Number, // from rival
		//check if score === verifyScore -> resolve
		// score !== verifyScore -> conflict
		// verify score === null -> pending input
	},
	status: {
		type: String,
		enum: ["none", "pending", "conflict", "confirm"],
		default: "none"
	},
	matchRecord: [
		{
			memberId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Member",
			},
			isTeam1: Boolean,
			minute: Number,
		},
	],
	time: {
		type: Date,
	},
	area: {
		type: String,
	},
});

export default mongoose.model("Match", matchSchema);
