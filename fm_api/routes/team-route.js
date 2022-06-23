import express from "express";

import isAuth from "../middlewares/verifyToken.js";
import TeamController from "../controllers/team-controller.js";

const teamController = new TeamController();
const route = express.Router();

route.get('/list/:keyword', teamController.listTeam)
route.put("/create", isAuth, teamController.create);
route.put("/edit/:teamId", isAuth, teamController.edit);
route.get('/view-team/:teamId', teamController.viewTeam);
route.post('/create-member/:teamId', isAuth, teamController.createMember);
route.get('/view-member/:memberId', teamController.viewMember);
route.put('/update-member/:teamId/:memberId', isAuth, teamController.updateMember);
route.delete('/delete-member/:teamId/:memberId', isAuth, teamController.deleteMember);





export default route;
