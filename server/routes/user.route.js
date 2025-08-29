import express from "express";
import {
  userLogin,
  userRegister,
  getUserDashboard,
  logout,
  getUpdateUserForm,
  updateUserData,
} from "../../controller/user.controller.js";

import {
  registerController,
  userLoginController,
} from "../../auth/auth.controller.js";
import multer from "multer";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { isUser } from "../../middleware/user.middleware.js";
import { isApproved } from "../../middleware/isApproved.middleware.js";

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
// USER LOGIN ROUTE
Router.route("/login").get(userLogin).post(userLoginController);
// USER DASHBOARD ROUTE
Router.route("/dashboard/:id").get(
  authMiddleware,
  isUser,
  isApproved,
  getUserDashboard
);
Router.route("/updateprofile/:id")
  .get(authMiddleware, isUser, getUpdateUserForm)
  .patch(authMiddleware, isUser, isApproved, updateUserData);
// USER LOGOUT ROUTE
Router.route("/logout").post(logout);

export default Router;
