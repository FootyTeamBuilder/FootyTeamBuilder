import mongoose from "mongoose";

const Schema = mongoose.Schema;

const matchSchema = new Schema({
	team1: {
		teamId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Team",
		},
		score: Number,
		verifyScore: Number, // from rival ->
		//check if score === verifyScore -> resolve
		// score !== verifyScore -> conflict
		// verify score === null -> pending input
	},
	team2: {
		teamId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Team",
		},
		score: Number,
		verifyScore: Number, // from rival
		//check if score === verifyScore -> resolve
		// score !== verifyScore -> conflict
		// verify score === null -> pending input
	},
	status: {
		type: String,
		enum: ["none", "pending", "conflict", "confirm"],
	},
	matchRecord: [
		{
			memberId: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Member",
			},
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
