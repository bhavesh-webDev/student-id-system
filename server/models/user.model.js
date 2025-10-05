import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    profilepic: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/10337/10337609.png",
    },
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password Is Required "],
    },
    course: {
      type: String,
    },
    semester: {
      type: Number,
      min: 1,
      max: 6,
    },
    rollno: {
      type: String,
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      required: [true, "role is required"],
    },
    status: {
      type: String,
      enum: ["pending", "rejected", "approved"],
      default: "pending",
    },
    answer: {
      type: String,
      required: [true, "Answer for the Question is required..."],
    },
  },
  { timestamps: true }
);
const user = mongoose.model("user", userSchema);
export default user;
