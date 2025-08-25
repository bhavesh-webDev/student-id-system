import userModel from "../server/models/user.model.js";
//TO GET ADMINS LOGIN PAGE
export const adminLogin = async (req, res) => {
  res.render("admin/loginAdmin", { hide: true });
};

//TO GET ADMINS DASHBOARD
export const adminDashboard = async (req, res) => {
  try {
    const pendingUser = await userModel.find({
      role: "student",
      status: "pending",
    });
    if (pendingUser.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "No pending User",
        success: false,
      });
    }
    res.render("admin/adminDashboard", {
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
      error: error.message,
    });
  }
};

// TO GET ADMINS REGISTER PAGE
export const getAdminRegister = (req, res) => {
  res.render("admin/adminRegister", { hide: true });
};
// //TO REDIRECT TO THE ADMIN DASHBOARD
// export const redirectDashboard = async (req, res) => {
//   res.redirect("admin/adminDashboard");
// };
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
    res.render("admin/singlePost", { user, hide: false });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error in Get Single User controller...",
      success: false,
      error: error.message,
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
      error: error.message,
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
      error: error.message,
    });
  }
};
// TO REDIRECT TO LOGIN PAGE
// export const redirectToLogin = (req, res) => {
//   res.redirect("admin/loginAdmin", { hide: true });
// };
export const logout = (req, res) => {
  try {
    res.clearCookie("token");
    res.redirect("/admin/login");
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error in Logout controller",
      success: false,
      error: error.message,
    });
  }
};
