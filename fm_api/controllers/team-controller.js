import teamModel from "../models/team-model.js";
import memberModel from "../models/member-model.js";
import userModel from "../models/user-model.js";
import jwt from "jsonwebtoken";

import ROLE from "../utils/enums.js";
import notiModel from "../models/noti-model.js";

class TeamController {
	//[POST] /team/create
	create = async (req, res, next) => {
		try {
			const userId = req.userId;
			//create new user
			const newTeam = await teamModel.create({
				name: req.body.name,
				description: req.body.description,
				level: req.body.level,
				age: {
					minAge: req.body.minAge,
					maxAge: req.body.maxAge,
				},
			});
			const newMember = await memberModel.create({
				teamId: newTeam._id,
				userId: userId,
				role: ROLE.CAPTAIN,
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
		const userId = req.userId;

		const data = req.body;
		const teamId = req.params.teamId;
		console.log(userId);
		try {
			const foundMember = await memberModel.findOne({
				userId: userId,
				teamId: teamId,
			});
			console.log(foundMember);

			if (foundMember.role != ROLE.CAPTAIN) {
				return res.status(403).json({
					message: "Not permitted",
				});
			}

			const foundTeam = await teamModel.findById(teamId);

			Object.keys(data).reduce((team, key) => {
				//update embedded minAge maxAge
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

	// [GET] /team/list
	listTeamOfUser = async (req, res, next) => {
		const userId = req.userId;
		//fetch team that have team
		const teamList = memberModel.find({ userId: userId });
		console.log("teamList ", teamList);

		return res.status(200).json({
			message: "Fetch user team list",
			data: teamList,
		});
	};

	// [GET] /team/list/:keyword?
	listTeam = async (req, res, next) => {
		// attract keyword
		const keyword = req.params.keyword;
		// res.send({ message: "list team", keyword });
		let allTeam = [];
		// if no keyword provided -> findAll
		if (!keyword) {
			allTeam = await teamModel.find({});
		} else {
			allTeam = await teamModel.find({
				name: { $regex: keyword, $options: "i" },
			});
		}

		res.status(201).send({
			message: "Fetch list team successful",
			data: allTeam,
		});
	};
	viewTeam = async (req, res, next) => {
		try {
			const teamId = req.params.teamId;
			const foundTeam = await teamModel.findById(teamId);
			//search in member
			const captain = await memberModel.findOne({
				teamId: teamId,
				role: ROLE.CAPTAIN,
			});
			const members = await memberModel.find({
				teamId: teamId,
				role: ROLE.MEMBER,
			});
			//search member in user
			const captainUser = await userModel.findById(captain.userId);
			let memberUsers = [];
			for (var member of members) {
				if (member.isExistUser) {
					let memberUser = await userModel.findById(member.userId);
					memberUsers.push({
						member: member,
						info: memberUser,
					});
				} else {
					memberUsers.push({
						member: member,
					});
				}
			}
			return res.status(201).json({
				team: foundTeam,
				captain: captainUser,
				members: memberUsers,
			});
		} catch (error) {
			if (!error.statusCode) {
				error.statusCode = 500;
			}
			next(error);
		}
	};

	createMember = async (req, res, next) => {
		const userId = req.userId;

		const data = req.body;
		const teamId = req.params.teamId;
		try {
			const foundMember = await memberModel.findOne({
				userId: userId,
				teamId: teamId,
			});
			if (foundMember.role != ROLE.CAPTAIN) {
				return res.status(403).json({
					message: "Not permitted!!",
				});
			}
			data.teamId = teamId;
			const foundTeam = await teamModel.findById(teamId);

			if (data["isExistUser"]) {
				const existMember = await userModel.findOne({
					email: data.email,
				});
				data.userId = existMember._id;
			}
			console.log(data);
			const newMember = await memberModel.create(data);

			return res.status(201).json({
				message: "Create member successful!",
				member: newMember,
			});
		} catch (error) {
			if (!error.statusCode) {
				error.statusCode = 500;
			}
			next(error);
		}
	};

	viewMember = async (req, res, next) => {
		const memberId = req.params.memberId;
		try {
			const foundMember = await memberModel.findById(memberId);
			let userInfo;
			if (foundMember.isExistUser) {
				userInfo = await userModel.findById(foundMember.userId);
			}

			return res.status(201).json({
				member: foundMember,
				info: userInfo,
			});
		} catch (error) {
			if (!error.statusCode) {
				error.statusCode = 500;
			}
			next(error);
		}
	};

	updateMember = async (req, res, next) => {
		const userId = req.userId;
		const data = req.body;
		const memberId = req.params.memberId;
		const teamId = req.params.teamId;
		try {
			const foundCaptain = await memberModel.findOne({
				userId: userId,
				teamId: teamId,
			});

			if (foundCaptain.role != ROLE.CAPTAIN) {
				return res.status(403).json({
					message: "Not permitted",
				});
			}

			const foundMember = await memberModel.findById(memberId);

			Object.keys(data).reduce((member, key) => {
				member[key] = data[key];
				return member;
			}, foundMember);

			console.log(foundMember);
			await foundMember.save();
			return res.status(201).json({
				message: "Update info successful",
				member: foundMember,
			});
		} catch (error) {
			if (!error.statusCode) {
				error.statusCode = 500;
			}
			next(error);
		}
	};

	deleteMember = async (req, res, next) => {
		const userId = req.userId;
		const memberId = req.params.memberId;
		const teamId = req.params.teamId;
		try {
			const foundCaptain = await memberModel.findOne({
				userId: userId,
				teamId: teamId,
			});

			if (foundCaptain.role != ROLE.CAPTAIN) {
				return res.status(403).json({
					message: "Not permitted",
				});
			}
			await memberModel.deleteOne({ _id: memberId });
			return res.status(201).json({
				message: "Delete member successful!!",
			});
		} catch (error) {
			if (!error.statusCode) {
				error.statusCode = 500;
			}
			next(error);
		}
	};

	addOpponent = async (req, res, next) => {
		const userId = req.userId;
		const data = req.body;
		try {
			console.log(data);
			const foundCaptain = await memberModel.findOne({
				teamId: data.teamId,
				userId: userId,
			});
			const foundOpponentCaptain = await memberModel.findOne({
				teamId: data.opponentId,
			});
			const foundTeam = await teamModel.findById(data.teamId);
			const foundOpponent = await teamModel.findById(data.opponentId);

			if (foundCaptain.role != ROLE.CAPTAIN) {
				return res.status(403).json({
					message: "Not permitted",
				});
			} else {
				const newNoti = await notiModel.create({
					type: ROLE.TEAM,
					senderId: data.teamId,
					recievedId: foundOpponentCaptain.userId,
					teamId: data.opponentId,
					content: `${foundTeam.name} want to play with ${foundOpponent.name} at ${data.area} on ${data.time} `,
				});
			}

			return res.status(201).json({
				message: "Add opponent successful!!",
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
