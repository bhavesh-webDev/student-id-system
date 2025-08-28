import mongoose from "mongoose";

export const connectDb = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Database Connection Established");
    })
    .catch((err) => {
      console.log(err);
    });
};
