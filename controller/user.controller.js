import userModel from "../server/models/user.model.js";
//GET USERS REGISTER PAGE
export const userRegister = async (req, res) => {
  res.render("users/userRegister", { hide: true });
};
// TO GET USERS LOGIN PAGE
export const userLogin = (req, res) => {
  res.render("users/userLogin", { hide: true });
};
//TO SEND USER TO THE USERS DASHBOARD PAGE
export const loginRedirectToDashboard = async (req, res) => {
  try {
    res.redirect("/user/dashboard");
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error in User Dashboard controller...",
      success: false,
      error: error.message,
    });
  }
};
export const getUserDashboard = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(404).json({
      status: 404,
      message: "Users ID not found...",
      success: false,
    });
  }
  const user = await userModel.findById(id);
  if (!user) {
    return res.status(404).json({
      status: 404,
      message: "User not Found...",
      success: false,
    });
  }
  res.render("users/userDashboard");
};
