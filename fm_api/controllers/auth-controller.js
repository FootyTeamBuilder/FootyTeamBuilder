import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import userModel from "../models/user-model.js";

dotenv.config();

class AuthController {
	//[POST] /auth/login
	login = async (req, res, next) => {
		const { email, password } = req.body;

		try {
			//check email exist
			const existUser = await userModel.findOne({ email });
			if (!existUser) {
				return res.status(400).json({
					message: "Invalid email",
				});
			}

			//check password
			const passwordVerify = await bcryptjs.compare(
				password,
				existUser.password
			);
			if (!passwordVerify) {
				throw new Error("Wrong password");
			}
			//generate token
			const token = jwt.sign(
				{
					email: existUser.email,
					id: existUser._id.toString(),
				},
				process.env.SECRET_JWT,
				{
					expiresIn: "5h",
				}
			);

			return res.status(200).json({
				message: "Login successful",
				id: existUser._id,
				token,
				data: existUser,
			});
		} catch (error) {
			if (!error.statusCode) {
				error.statusCode = 500;
			}
			next(error);
		}
	};

	//[POST] /auth/register
	register = async (req, res, next) => {
		//attract register info
		const { name, password, email } = req.body;
		// check if email exist
		try {
			const existUser = await userModel.findOne({ email });
			if (existUser) {
				return res.status(400).json({
					message: "Email already exist",
				});
			}

			// hash password
			const hashPassword = await bcryptjs.hash(password, 12);

			//create new user
			const newUser = await userModel.create({
				name: name,
				password: hashPassword,
				email: email,
			});
			return res.status(201).json({
				message: "Create New User Successful",
				id: newUser._id,
				name: newUser.name,
			});
		} catch (error) {
			if (!error.statusCode) {
				error.statusCode = 500;
			}
			next(error);
		}
	};
}

export default AuthController;
