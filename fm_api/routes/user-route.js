import express from "express";

import isAuth from "../middlewares/verifyToken.js";
import UserController from "../controllers/user-controller.js";

const userController = new UserController();
const route = express.Router();

route.get("/view-information/:userId", userController.getInformation); 
route.put("/edit-information", isAuth, userController.updateInformation);
route.put("/request-to-join/:teamId", isAuth, userController.requestToJoinTeam);
route.put("/accept-member-to-team/:notiId", isAuth, userController.acceptMemberToTeam); 
route.delete("/leave-team/:teamId", isAuth, userController.leaveTeam);




export default route;
