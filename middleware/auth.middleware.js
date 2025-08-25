import jwt from "jsonwebtoken";
import userModel from "../server/models/user.model.js";
export const authMiddleware = async (req, res, next) => {
  try {
    // const token = req.headers["authorization"].split(" ")[1];
    const token = req.cookies.token;
    if (!token) {
      return res.status(404).json({
        status: 404,
        message: "Error Token Not Found...",
        success: false,
      });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decode);
    const user = await userModel.findById(decode.id);
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User Not Found in auth middleware",
        success: false,
      });
    }
    req.user = user;
    // console.log(token);
    next();
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error in Auth Middleware ...",
      success: false,
      error: error.message,
    });
  }
};
