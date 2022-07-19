import express from "express";
import MatchController from "../controllers/math-controller.js";
import isAuth from "../middlewares/verifyToken.js";

const matchController = new MatchController();

const route = express.Router();

route.get("/match-history/:teamId", matchController.getMatchHistory);

export default route;
