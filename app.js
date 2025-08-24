import dotenv from "dotenv";
dotenv.config();
import express, { urlencoded } from "express";
import userRoute from "./server/routes/user.route.js";
import adminRoute from "./server/routes/admin.route.js";
import expressEjsLayouts from "express-ejs-layouts";
import { connectDb } from "./server/config/db.connect.js";
import methodOverride from "method-override";

const app = express();
const port = 3000;

//DB connection

connectDb();

// MiddleWare

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use(methodOverride("_method"));

//layouts

app.use(expressEjsLayouts);
app.set("view engine", "ejs");
app.set("layout", "./layouts/main");

// routes

app.use("/uploads", express.static("uploads"));
app.use("/user", userRoute);
app.use("/admin", adminRoute);

app.listen(port, () => {
  console.log(`listening ${port}`);
});
