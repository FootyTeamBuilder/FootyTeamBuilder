import express from "express";
import cors from "cors";
import dotenv from 'dotenv'
import loggerMiddleware from "./middlewares/loggerMiddleware.js";

//todo import routers

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

app.listen(PORT, () => {
	console.log("server start - " + PORT);
});
