import userModel from "../server/models/user.model.js";
import bcrypt from "bcrypt";
//GET USERS REGISTER PAGE
export const userRegister = async (req, res) => {
  res.render("users/userRegister", { hide: true });
};
// TO GET USERS LOGIN PAGE
export const userLogin = (req, res) => {
  res.render("users/userLogin", { hide: true });
};

export const getUpdateUserForm = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("ID : ", id);
    if (!id) {
      return res.status(404).json({
        status: 404,
        message: "ID not found",
        success: false,
      });
    }
    const user = await userModel.findById(id);

    res.render("users/userUpdate", {
      hide: false,
      loggedin: true,
      role: "student",
      user,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error in Get Update Form Controller...",
      success: false,
      error: error.stack,
    });
  }
};
export const updateUserData = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id);
    console.log("REQ iD", req.user.id);
    if (req.user.id !== id) {
      return res.status(401).json({
        status: 401,
        message: "Un-Authorized Access",
        success: false,
      });
    }
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User Not Found...",
        success: false,
      });
    }
    const { email, password, newpassword } = req.body;
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: 401,
        message: "Provided old password Does not match Existing Password",
        success: false,
      });
    }
    const hashpassword = await bcrypt.hash(newpassword, 10);
    if (email) user.email = email;
    if (newpassword) user.password = hashpassword;
    await user.save();
    res.status(200).json({
      status: 200,
      message: "Credentials Updated Successfully...",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error in Update User Data Controller...",
      success: false,
      error: error.stack,
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
  res.render("users/userDashboard", {
    user,
    hide: false,
    loggedin: true,
    role: "student",
  });
};

export const resetPasswordPage = (req, res) => {
  try {
    res.render("users/resetPassword", { hide: true, loggedin: false });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error in Reset Password Page...",
      success: false,
      error: error.stack,
    });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("token"), res.redirect("/user/login");
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error in logout controller...",
      success: false,
      error: error.stack,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newpassword, answer } = req.body;
    console.log(req.body);

    if (!email || !newpassword || !answer) {
      return res.status(401).json({
        status: 401,
        message: "All Fields Are Required ...",
        success: false,
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "No User Found with this Email...",
        success: false,
      });
    }
    if (answer !== user.answer) {
      return res.status(400).json({
        status: 400,
        message: "Answer Does not match...",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(newpassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({
      status: 200,
      message: "User Password Reset Successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error in Reset Password Controller...",
      success: false,
      error: error.stack,
    });
  }
};
