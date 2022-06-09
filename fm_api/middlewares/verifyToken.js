import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

const isAuth = (req, res, next) => {
	// validate errors - implement later

	// check if token is valid
	if (!req.get("authorization")) {
		return res.status(400).json({
			message: "Bad Request",
		});
	}
	try {
		// attract token from request
		let decodedToken = req.get("authorization").split(" ")[1];
		// console.log("decodedToken ", decodedToken);
		let user =  jwt.verify(decodedToken, process.env.SECRET_JWT);
		// console.log("user ", user);
		req.userId = user.id 
        next();
	} catch (error) {
        if(error instanceof jwt.JsonWebTokenError){
            return res.status(401).json({
                message: 'Invalid token'
            });
        }
		if (!error.statusCode) {
			error.statusCode = 500;
		}
		next(error);
	}
};

export default isAuth;
