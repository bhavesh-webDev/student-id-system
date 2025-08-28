import userModel from "../server/models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const {
      name,
      surname,
      email,
      rollno,
      semester,
      course,
      profilepic,
      role,
      password,
    } = req.body;
    if (!name || !surname || !email || !role || !password) {
      return res.status(400).json({
        status: 400,
        message: "Please provide all important field",
        success: false,
      });
    }
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 400,
        message: "User Already Exists...",
        success: false,
      });
    }
    const saltRound = 10;
    const hassedPassword = await bcrypt.hash(password, saltRound);

    try {
      const user = await userModel.create({
        name,
        surname,
        email,
        rollno,
        semester,
        course,
        profilepic,
        role,
        password: hassedPassword,
      });
      if (role === "admin" || role === "Admin") {
        return res.render(
          "admin/loginAdmin",
          { hide: true },
          {
            message: `Account Created Successfully UserName = ${name}`,
          }
        );
      }
      res.render("users/userLogin", { hide: true });
      // status(201).json({
      //   status: 201,
      //   message: "User Created Successfully...",
      //   success: true,
      //   user:user
      // });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Error While Creating User",
        success: false,
        error: error.stack,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error in register Controller",
      success: false,
      error: error.stack,
    });
  }
};

export const userLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);

    if (!email || !password) {
      return res.status(400).json({
        status: 400,
        message: "Please Provide All The Fields...",
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
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res.status(500).json({
        status: 500,
        message: "Invalid Credentials...",
        success: false,
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.cookie("token", token, { httpOnly: true });
    res.redirect(`/user/dashboard/${user._id}`);
    // // user.password = undefined;
    // res.status(200).json({
    //   status: 200,
    //   message: "User Logged In successfully",
    //   success: true,
    //   token: token,
    // });
    // .redirect("userLogin");
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error in Login Controller...",
      success: false,
      error: error.stack,
    });
  }
};
