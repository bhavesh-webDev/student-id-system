import express from "express";
import {
  userLogin,
  userRegister,
  loginRedirectToDashboard,
  getUserDashboard,
} from "../../controller/user.controller.js";

import {
  registerController,
  loginController,
} from "../../auth/auth.controller.js";

import multer from "multer";

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder where files will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // unique filename
  },
});

// File filter (optional: allow only images)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Create upload middleware
const upload = multer({ storage: storage, fileFilter: fileFilter });

const Router = express.Router();
// Router.route("/").get(testRoute).post(postdata);

Router.route("/register")
  .get(userRegister)
  .post(upload.single("profilepic"), registerController);

Router.route("/login")
  .get(userLogin)
  .post(loginController, loginRedirectToDashboard);
Router.route("/dashboard/:id").get(getUserDashboard);
export default Router;
