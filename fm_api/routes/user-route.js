import express from "express";

import isAuth from "../middlewares/verifyToken.js";
import UserController from "../controllers/user-controller.js";

const userController = new UserController();
const route = express.Router();

route.put("/edit-information", isAuth, userController.updateInformation);

export default route;
