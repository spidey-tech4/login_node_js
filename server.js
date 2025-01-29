import express from "express";
const app = express();
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

import connecttodb from "./config/db.js";

import userModel from "./model/userSchema.js";
import jwt from "jsonwebtoken";
import isloggedin from "./middleware/authUser.js";
connecttodb();

app.get("/", (req, res, next) => {
  res.send("this is Ankit");
});

app.post("/register", async (req, res) => {
  const { name, password, email } = req.body;
  try {
    const userExist = await userModel.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "Already Exist" });
    }

    const hash_password = await bcrypt.hashSync(password, 10);
    const user = await userModel.create({
      name,
      password: hash_password,
      email,
    });
    console.log("user registration is successfully");
    return res.status(201).json({ user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: " There is Internal Server Error", error });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, "mcbc", {
      expiresIn: "4h",
    });
    console.log(token)
    res.status(200).json({ message: "done h " });
  } catch (error) {
    return res
      .status(500)
      .json({ message: " There is Internal Server Error", error });
  }
});

app.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const updatedata = await userModel.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    res.send({ message: "Document updated successfully" });
  } catch (error) {
    console.log(error);
  }
});

app.get('/home',isloggedin,(req,res)=>{
  return res
  .status(200)
  .json({ message: "entered " });}
)

const PORT = 5000;
app.listen(PORT, () => {
  console.log("server is running on the 5000");
});
