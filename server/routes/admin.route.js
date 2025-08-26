import express from "express";
import {
  adminDashboard,
  adminLogin,
  getAdminRegister,
  getAllApprovedUsers,
  getSingleUser,
  statusApproved,
  statusRejected,
  getAllPendingUsers,
} from "../../controller/admin.controller.js";
import { registerController } from "../../auth/auth.controller.js";
import { isAdmin } from "../../middleware/admin.middleware.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { logout } from "../../controller/admin.controller.js";
import { adminLoginController } from "../../auth/admin.loginController.js";
const Router = express.Router();

// register
Router.route("/register")
  .get(authMiddleware, isAdmin, getAdminRegister)
  .post(registerController);

// login
Router.route("/login").get(adminLogin).post(adminLoginController);

// to get all. the pending students
Router.route("/dashboard").get(authMiddleware, isAdmin, adminDashboard);

// to get a single student
Router.route("/getuser/:id").get(authMiddleware, isAdmin, getSingleUser);

Router.route("/getAllApprovedUsers").get(
  authMiddleware,
  isAdmin,
  getAllApprovedUsers
);

Router.route("/getAllPendingUsers").get(
  authMiddleware,
  isAdmin,
  getAllPendingUsers
);
//to approve students
Router.route("/statusapproved/:id").post(
  authMiddleware,
  isAdmin,
  statusApproved
);

//to reject students
Router.route("/statusrejected/:id").post(
  authMiddleware,
  isAdmin,
  statusRejected
);
Router.route("/logout").post(logout);

export default Router;
