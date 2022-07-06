import userModel from "../models/user-model.js";
import notiModel from "../models/noti-model.js";
import teamModel from "../models/team-model.js";
import memberModel from "../models/member-model.js";

import ROLE from "../utils/enums.js";
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
			let type = ROLE.USER;
			let content;
			if (playerId) {
				if (foundCaptain.userId.toString() !== senderId.toString()) {
					throw new Error("Permission restricted");
				}
				receiveId = playerId;
				type = ROLE.TEAM;
				content = `${foundTeam.name} request you to join`;
			} else {
				const foundUser = await userModel.findById(senderId);
				content = foundUser.name + " request to join " + foundTeam.name;
			}

			const newNoti = await notiModel.create({
				type,
				senderId: senderId,
				recievedId: receiveId,
				teamId: teamId,
				content,
			});
			// await newNoti.save();
			return res.status(201).json({
				message: "Send request successful!!",
				teamId: teamId,
				notiId: newNoti._id,
				content: newNoti.content,
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
			const foundTeam = await teamModel.findById(foundNoti.teamId);
			const foundCaptain = await userModel.findById(captainId);

			const newMember = await memberModel.create({
				userId: foundNoti.senderId,
				teamId: foundNoti.teamId,
				role: ROLE.MEMBER,
				isExistUser: true
			});
			const newNoti = await notiModel.create({
				type: ROLE.USER,
				senderId: captainId,
				recievedId: foundNoti.senderId,
				teamId: foundNoti.teamId,
				content:
					foundCaptain.name +
					" accepted your request to join " +
					foundTeam.name,
			});
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
	acceptCaptainInvitation = async (req, res, next) => { };

	fetchUserNoti = async (req, res, next) => {
		const userId = req.userId;
		//fetch noti list based on receivedId
		const notiList = await notiModel.find({ recievedId: ObjectId(userId) });

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
}

export default UserController;
