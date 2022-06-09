import express from "express";

import AuthController from "../controllers/auth-controller.js";

const authController = new AuthController();

const route = express.Router();

route.post("/login", authController.login);
route.post("/register", authController.register);

export default route;
