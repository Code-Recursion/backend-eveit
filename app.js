const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));

const PORT = process.env.PORT | 4000;

mongoose
  .connect("mongodb://127.0.0.1:27017/usersDB")
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.log("error while connecting to db", err);
  });

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.send("Hello Server is up!");
});

app.get("/api/v1/users", async (req, res) => {
  const allUsers = await User.find();
  console.log("all user", allUsers.length);
  res.status(200).json({
    success: true,
    totalRecords: allUsers.length,
    allUsers,
  });
});

app.post("/api/v1/user", async (req, res) => {
  const newProduct = await User.create(req.body);

  res.status(201).json({
    success: true,
    message: "user created successfully",
    newProduct,
  });
});

app.put("/api/v1/user/:id", async (req, res) => {
  let user = await User.findById(req.params.id);

  if (!user) {
    return res.status(500).json({
      success: false,
      message: "user doesn't exists",
    });
  }
  user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    useFindAndModify: true,
    runValidator: true,
  });

  res.status(200).json({
    success: true,
    user,
  });
});
app.delete("/api/v1/user/:id", async (req, res) => {
  const userToDelete = await User.findById(req.params.id);

  if (!userToDelete) {
    return res.status(500).json({
      success: false,
      message: "user doesn't exists",
    });
  }
  console.log(userToDelete);
  await User.deleteOne({ _id: userToDelete._id });

  res.status(200).json({
    success: true,
    message: `${userToDelete.name} deleted successfully`,
  });
});

app.listen(PORT, () => {
  console.log(`server is running http://localhost:${PORT}`);
});
