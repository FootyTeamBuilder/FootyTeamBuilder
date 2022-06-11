import teamModel from "../models/team-model.js";
import memberModel from "../models/member-model.js";

class TeamController {

    //[POST] /team/create
	create = async (req, res, next) => {     
        console.log("create");   
		try {
			//create new user
			const newTeam = await teamModel.create({
				name: req.body.name,
                description: req.body.description,
				level: req.body.level,
				age: {
                    min: req.body.minAge,
                    max: req.body.maxAge
                }
			});
			const newMember = await memberModel.create({
				teamId: newTeam._id,
				userId: req.body.userId,
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


	// [PUT] /team/update-information
	updateInformation = async (req, res, next) => {
		const userId = req.userId;
		const data = req.body;
		try {
			const foundUser = await userModel.findById(userId);
			Object.keys(data).reduce((user, key) => {
				user[key] = data[key];
				return user;
			}, foundUser);

			console.log(foundUser);
			await foundUser.save();
			return res.status(201).json({
				message: "Update info successful",
				id: foundUser._id,
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
