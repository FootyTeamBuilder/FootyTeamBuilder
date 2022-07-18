import matchModel from "../models/match-model.js";
import teamModel from "../models/team-model.js";

class MatchController {
	// [GET] /match/match-history:teamId
	getMatchHistory = async (req, res, next) => {
		const teamId = req.params.teamId;

		//fetch Team
		const matchList = await matchModel
			.find({
				$or: [{ "team1.teamId": teamId }, { "team2.teamId": teamId }],
			})
			.lean();

		let newFormatList = [];
		for (let match of matchList) {
			match = await this._addNameToTeam(match);
			newFormatList.push(match);
		}

		return res.status(200).json({
			message: "Fetch match history successful",
			data: newFormatList,
		});
	};

	_addNameToTeam = async (match) => {
		let newMatch = { ...match };
		const team1 = await teamModel.findById(newMatch.team1.teamId);
		const team2 = await teamModel.findById(newMatch.team2.teamId);

		//reformat
		newMatch.team1.name = team1.name;
		newMatch.team2.name = team2.name;

		return newMatch;
	};
}

export default MatchController;
