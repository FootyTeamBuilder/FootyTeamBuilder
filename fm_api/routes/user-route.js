import express from "express";

import isAuth from "../middlewares/verifyToken.js";
import UserController from "../controllers/user-controller.js";

import uploadFile from "../functions/upload-file.js";

const userController = new UserController();
const route = express.Router();

route.get("/view-information/:userId", userController.getInformation);
route.get("/notification-list", isAuth, userController.fetchUserNoti);
route.put(
	"/edit-information",
	isAuth,
	uploadFile.single("avatar"),
	userController.updateInformation
);
route.put("/request-to-join/:teamId", isAuth, userController.requestToJoinTeam);
route.put(
	"/accept-member-to-team/:notiId",
	isAuth,
	userController.acceptMemberToTeam
);
route.put(
	"/accept-invitation/:notiId",
	isAuth,
	userController.acceptInvitation
);
route.delete("/leave-team/:teamId", isAuth, userController.leaveTeam);
route.get("/user-team-list/:userId/:isCaptain", userController.getUserTeamList);
route.post("/add-comment/:teamId", isAuth, userController.addComment);

export default route;
