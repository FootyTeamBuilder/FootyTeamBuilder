import userModel from "../models/user-model.js";
import notiModel from "../models/noti-model.js";
import teamModel from "../models/team-model.js";
import memberModel from "../models/member-model.js";

import ROLE, { NOTI_TYPE_ENUMS } from "../utils/enums.js";
import { ObjectId } from "mongodb";

class UserController {
	getInformation = async (req, res, next) => {
		const userId = req.params.userId;
		try {
			const foundUser = await userModel.findById(userId);

			return res.status(201).json({
				user: foundUser,
			});
		} catch (error) {
			if (!error.statusCode) {
				error.statusCode = 500;
			}
			next(error);
		}
	};

	// [PUT] /user/update-information
	updateInformation = async (req, res, next) => {
		const userId = req.userId;
		// console.log("userId ", userId);
		const data = req.body;
		// console.log("data ", data);
		try {
			const foundUser = await userModel.findById(userId);
			if (data.avatar) {
			const url = req.protocol + "://" + req.get("host");
			data.avatar = url + "/public/" + req.file.filename;
			console.log("data.avatar ", data.avatar);
			}
			Object.keys(data).reduce((user, key) => {
				console.log("user[key] ", user[key]);
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
	//? when user want to join a team
	// requestToJoinTeam = async (req, res, next) => {
	// 	const userId = req.userId;
	// 	// const teamId = req.params["teamId"];
	// 	const teamId = req.params.teamId;
	// 	console.log(teamId);
	// 	try {
	// 		const foundTeam = await teamModel.findById(teamId);
	// 		const foundCaptain = await memberModel.findOne({
	// 			teamId: teamId,
	// 			role: ROLE.CAPTAIN,
	// 		});
	// 		const foundUser = await userModel.findById(userId);

	// 		const newNoti = await notiModel.create({
	// 			type: ROLE.USER,
	// 			senderId: userId,
	// 			recievedId: foundCaptain.userId,
	// 			teamId: teamId,
	// 			content: foundUser.name + " request to join " + foundTeam.name,
	// 		});
	// 		// await newNoti.save();
	// 		return res.status(201).json({
	// 			message: "Send request successful!!",
	// 			teamId: teamId,
	// 		});
	// 	} catch (error) {
	// 		if (!error.statusCode) {
	// 			error.statusCode = 500;
	// 		}
	// 		next(error);
	// 	}
	// };
	// [PUT] /user/request-to-join/:teamId
	requestToJoinTeam = async (req, res, next) => {
		//get Id of sender
		const senderId = req.userId;
		//get id of team
		const teamId = req.params.teamId;
		const playerId = req.body.playerId;

		try {
			const foundTeam = await teamModel.findById(teamId);
			const foundCaptain = await memberModel.findOne({
				teamId: teamId,
				role: ROLE.CAPTAIN,
			});

			// receiveId will be captain by default
			let receiveId = foundCaptain.userId.toString();
			let type = NOTI_TYPE_ENUMS.JOIN;
			let content;
			if (playerId) {
				if (foundCaptain.userId.toString() !== senderId.toString()) {
					throw new Error("Permission restricted");
				}
				const foundCaptainUser = await userModel.findById(senderId);
				receiveId = playerId;
				type = NOTI_TYPE_ENUMS.INVITE;
				content = `${foundCaptainUser.name} mời bạn gia nhập ${foundTeam.name}`;
				await notiModel.create({
					type,
					senderId: senderId,
					recievedId: receiveId,
					sendedTeamId: teamId,
					content,
				});
			} else {
				const foundUser = await userModel.findById(senderId);
				content = foundUser.name + " xin gia nhập " + foundTeam.name;
				await notiModel.create({
					type,
					senderId: senderId,
					recievedId: receiveId,
					recievedTeamId: teamId,
					content,
				});
			}

			return res.status(201).json({
				message: "Send request successful!!",
				teamId: teamId,
			});
		} catch (error) {
			if (!error.statusCode) {
				error.statusCode = 500;
			}
			next(error);
		}
	};
	//? captain accept member to join
	acceptMemberToTeam = async (req, res, next) => {
		const captainId = req.userId;
		const notiId = req.params.notiId;
		try {
			const foundNoti = await notiModel.findById(notiId);
			const foundTeam = await teamModel.findById(
				foundNoti.recievedTeamId
			);
			const foundCaptain = await userModel.findById(captainId);

			const newMember = await memberModel.create({
				userId: foundNoti.senderId,
				teamId: foundNoti.recievedTeamId,
				role: ROLE.MEMBER,
				isExistUser: true,
			});
			const newNoti = await notiModel.create({
				type: NOTI_TYPE_ENUMS.SYSTEM,
				senderId: captainId,
				recievedId: foundNoti.senderId,
				sendedTeamId: foundTeam._id,
				content:
					foundCaptain.name +
					" đã chấp nhận yêu cầu gia nhập của bạn vào " +
					foundTeam.name,
			});

			await notiModel.findById(notiId).remove();

			return res.status(201).json({
				message: "Accept request successful!!",
			});
		} catch (error) {
			if (!error.statusCode) {
				error.statusCode = 500;
			}
			next(error);
		}
	};

	// user accept captain invitation
	acceptInvitation = async (req, res, next) => {
		const userId = req.userId;
		const notiId = req.params.notiId;
		try {
			const foundNoti = await notiModel.findById(notiId);
			const foundTeam = await teamModel.findById(foundNoti.sendedTeamId);
			const foundCaptain = await memberModel.findOne({
				teamId: foundTeam._id,
				role: ROLE.CAPTAIN,
			});
			const foundUser = await userModel.findById(userId);

			const existMember = await memberModel.findOne({
				userId: userId,
				teamId: foundTeam._id,
			});

			if (!existMember) {
				await memberModel.create({
					userId: userId,
					teamId: foundTeam._id,
					role: ROLE.MEMBER,
					isExistUser: true,
				});
			}

			const newNoti = await notiModel.create({
				type: NOTI_TYPE_ENUMS.SYSTEM,
				senderId: userId,
				recievedId: foundCaptain.userId,
				recievedTeamId: foundTeam._id,
				content:
					foundUser.name +
					" đã chấp nhận lời mời gia nhập vào " +
					foundTeam.name +
					" của bạn",
			});

			await notiModel.findById(notiId).remove();

			return res.status(201).json({
				message: "Accept invite successful!!",
			});
		} catch (error) {
			if (!error.statusCode) {
				error.statusCode = 500;
			}
			next(error);
		}
	};

	fetchUserNoti = async (req, res, next) => {
		const userId = req.userId;
		//fetch noti list based on receivedId
		const notiList = await notiModel
			.find({ recievedId: ObjectId(userId) })
			.sort({
				createdAt: -1,
			});

		res.status(201).json({
			message: "Fetch notifications list successful",
			data: notiList,
		});
	};

	leaveTeam = async (req, res, next) => {
		const userId = req.userId;
		const teamId = req.params.teamId;
		console.log(teamId);
		console.log(userId);
		try {
			// const foundMember = await memberModel.findOne({
			// 	teamId: teamId,
			// 	userId: userId,
			// });
			await memberModel.deleteOne({
				teamId: teamId,
				userId: userId,
			});
			return res.status(201).json({
				message: "Leave team successful!!",
			});
		} catch (error) {
			if (!error.statusCode) {
				error.statusCode = 500;
			}
			next(error);
		}
	};

	// [DELETE] /user/delete-information
	deleteInformation = (req, res, next) => {
		res.send("delete info");
	};

	getUserTeamList = async (req, res, next) => {
		const userId = req.params.userId;
		const isCaptain = req.params.isCaptain;
		try {
			let foundMembers;
			if (isCaptain == "true") {
				foundMembers = await memberModel.find({
					userId: userId,
					role: ROLE.CAPTAIN,
				});
			} else {
				foundMembers = await memberModel.find({ userId: userId });
			}
			//console.log(foundMembers);
			let foundTeams = [];
			for (var member of foundMembers) {
				const team = await teamModel.findById(member.teamId);
				foundTeams.push({
					team: team,
					role: member.role,
				});
			}

			return res.status(201).json({
				teams: foundTeams,
			});
		} catch (error) {
			if (!error.statusCode) {
				error.statusCode = 500;
			}
			next(error);
		}
	};
}

export default UserController;
