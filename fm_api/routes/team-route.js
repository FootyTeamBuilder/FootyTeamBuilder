import express from "express";

import isAuth from "../middlewares/verifyToken.js";
import TeamController from "../controllers/team-controller.js";

const teamController = new TeamController();
const route = express.Router();

route.put("/create", isAuth, teamController.create);
route.put("/edit", isAuth, teamController.edit);

export default route;
