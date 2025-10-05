import userModel from "../server/models/user.model.js";
import { sendEmail } from "../public/js/nodemailer.js";
import { name } from "ejs";
//TO GET ADMINS LOGIN PAGE
export const adminLogin = async (req, res) => {
  res.render("admin/loginAdmin", { hide: true });
};

//TO GET ADMINS DASHBOARD
export const adminDashboard = async (req, res) => {
  try {
    const pendingUser = await userModel
      .find({
        role: "student",
        status: "pending",
      })
      .sort({ createdAt: -1 })
      .limit(5);
    if (pendingUser.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "No pending User",
        success: false,
      });
    }
    const allUsers = await userModel
      .find({ status: "approved" })
      .sort({ createdAt: -1 })
      .limit(5);
    if (!allUsers) {
      return res.status(404).json({
        status: 404,
        message: "Users Not Found ",
        success: false,
      });
    }
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    res.setHeader("Pragma", "no-cache");
    // res.setHeader("Expires", "0");
    // res.setHeader("Surrogate-Control", "no-store");
    res.render("admin/adminDashboard", {
      allUsers,
      pendingUser: pendingUser,
      hide: false,
      loggedin: true,
      role: "admin",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error in loading Pending Requests ...",
      success: false,
      error: error.stack,
    });
  }
};

// TO GET ADMINS REGISTER PAGE
export const getAdminRegister = (req, res) => {
  res.render("admin/adminRegister", { hide: true });
};

//TO GET A SINGLE USER
export const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({
        status: 404,
        message: "Users id not found ...",
        success: false,
      });
    }
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User Not Found ...",
        success: false,
      });
    }
    res.render("admin/singlePost", {
      user,
      hide: false,
      loggedin: true,
      role: "admin",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error in Get Single User controller...",
      success: false,
      error: error.stack,
    });
  }
};
// TO APPROVE A STUDENT
export const statusApproved = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({
        status: 404,
        message: "Users id not found or User not found...",
        success: false,
      });
    }
    const updateStatus = await userModel
      .findByIdAndUpdate(
        id,
        {
          status: "approved",
        },
        { new: true }
      )
      .select("-password -_id");
    if (!updateStatus) {
      return res.status(400).json({
        status: 400,
        message: "Erron while updating status...",
        success: false,
      });
    }
    const user = await userModel.findById(id);
    let email = user.email;
    let headMessage = "Application Status Updated ";
    let subject = "Approval of Application";
    let mainMessage = `hello ${user.name} your registration was Approved by the admin you can now login using your login credentials .`;
    sendEmail(email, headMessage, subject, mainMessage);
    res.status(200).json({
      status: 200,
      message: "Student Approved...",
      updatedUser: updateStatus,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error in admins approve status controller...",
      success: false,
      error: error.stack,
    });
  }
};

//TO REJECT A STUDENT
export const statusRejected = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({
        status: 404,
        message: "Users id not found or User not found...",
        success: false,
      });
    }
    const updateStatus = await userModel
      .findByIdAndUpdate(
        id,
        {
          status: "Rejected",
        },
        { new: true }
      )
      .select("-password -_id");
    if (!updateStatus) {
      return res.status(400).json({
        status: 400,
        message: "Error while updating Status ",
        success: false,
      });
    }
    const user = await userModel.findById(id);
    let email = user.email;
    let headMessage = "Application Status Updated ";
    let subject = "Rejection of Application";
    let mainMessage = `hello ${user.name} your registration was rejected by the admin you can re-register after 24 Hours .`;
    sendEmail(email, headMessage, subject, mainMessage);

    setTimeout(async () => {
      try {
        const reApply = await userModel.findByIdAndDelete(id);
        // console.log("RE-APPLY", reApply);
      } catch (error) {
        res.status(500).json({
          status: 500,
          message: "Error while update status to Re-Apply",
          success: false,
          error: error.stack,
        });
      }
    }, 1000 * 60 * 60 * 24);
    res.status(200).json({
      status: 200,
      message: "Student Rejected...",
      updatedUser: updateStatus,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error in admins Reject status controller ...",
      success: false,
      error: error.stack,
    });
  }
};
//TO LOGOUT AS ADMIN
export const logout = (req, res) => {
  try {
    res.clearCookie("token");
    res.redirect("/admin/login");
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error in Logout controller",
      success: false,
      error: error.stack,
    });
  }
};
// TO FETCH ALL THE APPROVED STUDENTS
export const getAllApprovedUsers = async (req, res) => {
  try {
    const allUsers = await userModel.find({
      status: "approved",
      role: "student",
    });
    if (!allUsers) {
      return res.status(404).json({
        status: 404,
        message: "Users Not Found ",
        success: false,
      });
    }
    res.render("admin/getAllApproved", {
      allUsers,
      hide: false,
      loggedin: true,
      role: "admin",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error in get All Approved users Controller",
      success: false,
      error: error.stack,
    });
  }
};
// TO FETCH ALL THE PENDING STUDENTS
export const getAllPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await userModel.find({
      status: "pending",
      role: "student",
    });
    if (pendingUsers.length === 0) {
      return res.status(200).json({
        status: 200,
        message: "No Request Pending",
        success: false,
      });
    }
    res.render("admin/getAllPending", {
      role: "admin",
      loggedin: true,
      hide: false,
      pendingUsers,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error in Get All Pending Requests Controller...",
      success: false,
      error: error.stack,
    });
  }
};

export const searchFilter = async (req, res) => {
  try {
    const { search } = req.query;
    const result = await userModel.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    });
    console.log(result);

    if (result.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "No Record Found",
        success: false,
      });
    }
    res.render("admin/searchUser", {
      loggedin: true,
      hide: false,
      result: result,
      role: "admin",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error in Search filter Controller...",
      success: false,
      error: error.stack,
    });
  }
};
