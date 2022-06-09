import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import loggerMiddleware from "./middlewares/loggerMiddleware.js";
import mongoose from "mongoose";

//todo import routers
import authRoute from "./routes/auth-route.js";
import userRoute from "./routes/user-route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;
//setup cors
app.options("*", cors());
app.use(cors());

// setup to parse info from req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(loggerMiddleware);

//todo using route
app.use("/auth", authRoute);
app.use("/user", userRoute);

// demo purpose only
app.get("/", (req, res) => {
	res.send("My app");
});

// error handlers
app.use((errors, req, res, next) => {
	console.log(errors);
	const { statusCode, message } = errors;
	if (!statusCode) {
		statusCode = 500;
	}
	const data = errors.data;
	res.status(statusCode).json({ message, data });
});

//connect to DB
mongoose
	.connect(process.env.MONGODB_URL)
	.then(() => {
		console.log("Connect to DB successful");
		app.listen(PORT, () => {
			console.log("Server start - " + PORT);
		});
	})
	.catch((err) => {
		console.error("Fail to connect to DB: ", err);
	});
