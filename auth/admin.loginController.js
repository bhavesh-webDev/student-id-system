import userModel from "../server/models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const adminLoginController = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(404).json({
      status: 404,
      message: "All Fields Are Required...",
      success: false,
    });
  }
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(404).json({
      status: 404,
      message: "User Not Found",
      success: false,
    });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(403).json({
      status: 403,
      message: "Invalid Credentials",
      success: false,
    });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.cookie("token", token, { httpOnly: true });
  res.redirect(`/admin/dashboard`);
};
