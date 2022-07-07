import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { IMAGE_TYPE_ENUMS } from "../utils/enums.js";

// create DIR
const DIR = "./public";

// difine storage
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, DIR);
	},
	filename: (req, file, cb) => {
		const fileName = file.originalname.toLowerCase().split(" ").join("-");
		cb(null, uuidv4() + "-" + fileName);
	},
});

const upload = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		if (
			file.mimetype == IMAGE_TYPE_ENUMS.PNG ||
			file.mimetype == IMAGE_TYPE_ENUMS.JPG ||
			file.mimetype == IMAGE_TYPE_ENUMS.JPEG
		) {
			cb(null, true);
		} else {
			cb(null, false);
			return cb(new Error("Only .png .jpg jpeg image format allowed"));
		}
	},
});

export default upload;
