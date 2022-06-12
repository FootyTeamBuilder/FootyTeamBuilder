import teamModel from "../models/team-model.js";
import memberModel from "../models/member-model.js";
import jwt from "jsonwebtoken";


class TeamController {

	//[POST] /team/create
	create = async (req, res, next) => {
		try {
			let decodedToken = req.get("authorization").split(" ")[1];
			let user = jwt.verify(decodedToken, process.env.SECRET_JWT);
			const userId = user.id
			//create new user
			const newTeam = await teamModel.create({
				name: req.body.name,
				description: req.body.description,
				level: req.body.level,
				age: {
					minAge: req.body.minAge,
					maxAge: req.body.maxAge
				}
			});
			const newMember = await memberModel.create({
				teamId: newTeam._id,
				userId: userId,
				role: "đội trưởng"
			});
			return res.status(201).json({
				message: "Create New Team Successful",
				id: newTeam._id,
				name: newTeam.name,
			});
		} catch (error) {
			if (!error.statusCode) {
				error.statusCode = 500;
			}
			next(error);
		}
	};


	// [PUT] /team/edit
	edit = async (req, res, next) => {
		let decodedToken = req.get("authorization").split(" ")[1];
		let user = jwt.verify(decodedToken, process.env.SECRET_JWT);
		const userId = user.id

		const data = req.body;
		const teamId = req.params["teamId"];
		try {
			const foundMember = await memberModel.findOne({ userId: userId, teamId: teamId });
			console.log(foundMember);

			if (foundMember.role != "đội trưởng") {
				return res.status(403).json({
					message: "Not permitted",
				});
			}

			const foundTeam = await teamModel.findById(teamId);


			Object.keys(data).reduce((team, key) => {
				if (!team[key]) {
					console.log(team["age"][key]);
					team["age"][key] = data[key];
					return team;
				}
				team[key] = data[key];

				return team;
			}, foundTeam);

			console.log(foundTeam);
			await foundTeam.save();
			return res.status(201).json({
				message: "Update info successful",
				id: foundTeam._id,
			});
		} catch (error) {
			if (!error.statusCode) {
				error.statusCode = 500;
			}
			next(error);
		}
	};
}

export default TeamController;
