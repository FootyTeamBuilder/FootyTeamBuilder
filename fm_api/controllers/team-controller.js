import teamModel from "../models/team-model.js";
import memberModel from "../models/member-model.js";
import userModel from "../models/user-model.js";
import matchModel from "../models/match-model.js";
import commentModel from "../models/comment-model.js";
import jwt from "jsonwebtoken";

import ROLE, { MATCH_STATUS_ENUMS, NOTI_TYPE_ENUMS } from "../utils/enums.js";
import notiModel from "../models/noti-model.js";
import moment from "moment";
import { ObjectId } from "mongodb";

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
				area: req.body.area,
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
		try {
			const foundMember = await memberModel.findOne({
				userId: userId,
				teamId: teamId,
			});

			if (foundMember.role != ROLE.CAPTAIN) {
				return res.status(403).json({
					message: "Not permitted",
				});
			}

			const foundTeam = await teamModel.findById(teamId);

			Object.keys(data).reduce((team, key) => {
				//update embedded minAge maxAge
				if (!team[key]) {
					team["age"][key] = data[key];
					return team;
				}
				team[key] = data[key];

				return team;
			}, foundTeam);

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
			const foundCaptain = await userModel.findById(userId);

			if (data.isExistUser) {
				const existMember = await userModel.findOne({
					email: data.email,
				});
				data.userId = existMember._id;
				await notiModel.create({
					type: NOTI_TYPE_ENUMS.INVITE,
					sendedTeamId: teamId,
					senderId: userId,
					recievedId: existMember._id,
					content: `${foundCaptain.name} mời bạn gia nhập ${foundTeam.name}`,
				});
			}
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
		const { teamId, opponentId, area, time } = req.body;
		try {
			const foundCaptain = await memberModel.findOne({
				teamId: teamId,
				userId: userId,
			});
			const foundOpponentCaptain = await memberModel.findOne({
				teamId: opponentId,
			});
			const foundTeam = await teamModel.findById(teamId);
			const foundOpponent = await teamModel.findById(opponentId);

			if (foundCaptain.role != ROLE.CAPTAIN) {
				return res.status(403).json({
					message: "Not permitted",
				});
			} else {
				const newNoti = await notiModel.create({
					type: NOTI_TYPE_ENUMS.OPPONENT,
					sendedTeamId: teamId,
					senderId: userId,
					recievedId: foundOpponentCaptain.userId,
					recievedTeamId: opponentId,
					area: area,
					time: time,
					content: `${foundTeam.name} đã mời ${
						foundOpponent.name
					} giao lưu tại ${area} vào lúc ${moment(time)
						.locale("vi")
						.format("h:mm, dddd, [ngày] Do MMMM YYYY")}`,
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

	acceptOpponent = async (req, res, next) => {
		const userId = req.userId;
		try {
			const foundNoti = await notiModel.findById(req.params.notiId);
			const foundTeam = await teamModel.findById(
				foundNoti.recievedTeamId
			);
			const foundOpponent = await teamModel.findById(
				foundNoti.sendedTeamId
			);

			const newMatch = await matchModel.create({
				team1: {
					teamId: foundNoti.sendedTeamId,
				},
				team2: {
					teamId: foundNoti.recievedTeamId,
				},
				time: foundNoti.time,
				area: foundNoti.area,
			});

			const newNoti = await notiModel.create({
				type: NOTI_TYPE_ENUMS.SYSTEM,
				sendedTeamId: foundNoti.recievedTeamId,
				senderId: foundNoti.recievedId,
				recievedId: foundNoti.senderId,
				recievedTeamId: foundNoti.sendedTeamId,
				area: foundNoti.area,
				time: foundNoti.time,
				content: `${foundTeam.name} chấp nhận lời mời thi đấu với ${
					foundOpponent.name
				} của bạn tại ${foundNoti.area} vào lúc ${moment(foundNoti.time)
					.locale("vi")
					.format("h:mm, dddd, [ngày] Do MMMM YYYY")}`,
			});

			await notiModel.findById(foundNoti._id).remove();

			return res.status(201).json({
				message: "Accept opponent successful!!",
				matchId: newMatch._id,
			});
		} catch (error) {
			if (!error.statusCode) {
				error.statusCode = 500;
			}
			next(error);
		}
	};

	updateMatch = async (req, res, next) => {
		const matchId = req.params.matchId;
		const captainId = req.userId;
		const { team1Score, team2Score, matchRecord } = req.body;
		try {
			const foundMatch = await matchModel.findById(matchId);
			const team1Captain = await memberModel.findOne({
				teamId: foundMatch.team1.teamId,
			});
			let isTeam1Captain = false;
			if (captainId == team1Captain.userId) {
				isTeam1Captain = true;
			}
			//xóa các record upate từ trước
			await matchModel.updateOne(
				{
					_id: ObjectId(matchId),
				},
				{
					$pull: {
						matchRecord: { isTeam1: isTeam1Captain },
					},
				}
			);
			//foundMatch.matchRecord.pull({isTeam1: true});
			//captain team 1 update score 1
			if (isTeam1Captain) {
				foundMatch.team1.score1 = team1Score;
				foundMatch.team2.score1 = team2Score;
			} else {
				//captain team 2 update score 2
				foundMatch.team1.score2 = team1Score;
				foundMatch.team2.score2 = team2Score;
			}
			//re-format matchRecord
			matchRecord.map((record) => {
				foundMatch.matchRecord.push({
					...record,
					memberId: ObjectId(record.memberId),
				});
				// return { ...record, memberId: ObjectId(record.memberId) }
			});
			//push match record

			if (foundMatch.status == MATCH_STATUS_ENUMS.NONE) {
				foundMatch.status = MATCH_STATUS_ENUMS.PENDING;
			} else {
				if (this.verifySCore(foundMatch.team1, foundMatch.team2)) {
					foundMatch.status = MATCH_STATUS_ENUMS.CONFIRM;
				} else {
					foundMatch.status = MATCH_STATUS_ENUMS.CONFLICT;
				}
			}
			await foundMatch.save();

			return res.status(201).json({
				message: "Update match successful!!",
				match: foundMatch,
			});
		} catch (error) {
			if (!error.statusCode) {
				error.statusCode = 500;
			}
			next(error);
		}
	};

	verifySCore = (team1, team2) => {
		if (team1.score1 == team1.score2 && team2.score1 == team2.score2) {
			return true;
		} else {
			return false;
		}
	};

	getCommentList = async (req, res, next) => {
		const teamId = req.params.teamId;
		try {
			const commentList = await commentModel
				.find({
					teamId: teamId,
				})
				.sort({
					createdAt: -1,
				});

			return res.status(201).json({
				message: "Get comment list successful",
				comments: commentList,
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
