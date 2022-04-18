const express = require("express");
const mongoose = require("mongoose");
// const url = "mongodb://localhost/SamparkDBex";
const fileUpload = require("express-fileupload");
const app = express();
const bodyParser = require("body-parser");
require("./config/passportConfig");
const passport = require("passport");
port = process.env.PORT || 8080;
mongoose.connect(
  "mongodb+srv://kundan:LqMrRFz4EGPogyzl@cluster0.mxihh.mongodb.net/login&registeration?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
const con = mongoose.connection;

con.on("open", () => {
  console.log("Connected to Database");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use(fileUpload());
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");
app.use("/admin", adminRouter);
app.use("/user", userRouter);

app.listen(port, () => {
  console.log("Server started", port);
});
