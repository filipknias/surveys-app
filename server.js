if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// Server config
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// MongoDB config
const mongoose = require("mongoose");
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const db = mongoose.connection;
db.on("error", (err) => console.error(err));
db.once("open", () => console.log("Connected to DB"));

// Routes imports
const usersRouter = require("./routes/users");
const surveysRouter = require("./routes/surveys");
const votesRouter = require("./routes/votes");

// Routes
app.use("/api/users", usersRouter);
app.use("/api/surveys", surveysRouter);
app.use("/api/votes", votesRouter);

app.listen(process.env.PORT || 3000);
