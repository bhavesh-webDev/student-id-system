import mongoose from "mongoose";

export const connectDb = () => {
  mongoose
    .connect("mongodb://localhost:27017/student_id_system")
    .then(() => {
      console.log("Database Connection Established");
    })
    .catch((err) => {
      console.log(err);
    });
};
