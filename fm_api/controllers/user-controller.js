import userModel from "../models/user-model.js";

class UserController {
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

	// [DELETE] /user/delete-information
	deleteInformation = (req, res, next) => {
		res.send("delete info");
	};
}

export default UserController;
