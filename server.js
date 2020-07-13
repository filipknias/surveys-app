if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const expressLayouts = require("express-ejs-layouts");

// Server config
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("layout", "layouts/layout");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

// MongoDB config
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to DB"));

// Routes imports
const indexRouter = require("./routes/index");
const surveysRouter = require("./routes/surveys");
const accountRouter = require("./routes/account");

// Routes
app.use("/", indexRouter);
app.use("/surveys", surveysRouter);
app.use("/account", accountRouter);

app.listen(process.env.PORT || 3000);
