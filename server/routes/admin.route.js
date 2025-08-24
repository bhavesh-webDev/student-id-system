import express from "express";
import {
  adminDashboard,
  adminLogin,
  getAdminRegister,
  getSingleUser,
  // redirectDashboard,
  redirectToLogin,
  statusApproved,
  statusRejected,
} from "../../controller/admin.controller.js";
import {
  loginController,
  registerController,
} from "../../auth/auth.controller.js";
const Router = express.Router();

// login
Router.route("/login").get(adminLogin).post(loginController);

// register
Router.route("/register")
  .get(getAdminRegister)
  .post(registerController, redirectToLogin);

// to get all. the pending students
Router.route("/dashboard").get(adminDashboard);

// to get a single student
Router.route("/getuser/:id").get(getSingleUser);

//to approve students
Router.route("/statusapproved/:id").post(statusApproved);

//to reject students
Router.route("/statusrejected/:id").post(statusRejected);

export default Router;
