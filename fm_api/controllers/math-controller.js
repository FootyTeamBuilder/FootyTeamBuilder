import matchModel from "../models/match-model.js";

class MatchController {
	// [GET] /match/match-history:teamId
	getMatchHistory = async (req, res, next) => {
		const teamId = req.params.teamId;

		//fetch Team
		const matchList = await matchModel.find({
			$or: [{ "team1.teamId": teamId }, { "team2.teamId": teamId }],
		});

		console.log("matchList ", matchList);

		return res.status(200).json({
			message: "Fetch match history successful",
			data: matchList,
		});
	};
}

export default MatchController;
