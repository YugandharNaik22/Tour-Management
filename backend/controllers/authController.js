import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// user registration
export const register = async (req, res) => {
  try {
    // check if the username or email already exists
    const existingUser = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username or email already exists.",
      });
    }

    // hashing password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash,
      photo: req.body.photo,
    });

    await newUser.save();
    res.status(200).json({ success: true, message: "Successfully Created" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to Create, Try again!!!" });
  }
};

// user login
export const login = async (req, res) => {
    const email = req.body.email;
  
    try {
      // find user by username or email
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      // compare passwords
      const checkCorrectPassword = await bcrypt.compare(req.body.password, user.password);
  
      if (!checkCorrectPassword) {
        return res.status(401).json({ success: false, message: "Invalid password" });
      }
  
      const { password, role, ...rest } = user._doc;
  
      // generate JWT token
      const token = jwt.sign(
        { id: user._id, role: user.role },
        "hiuwsmo08kdeargk96uhs3ws",
        {
          expiresIn: "15d",
        }
      );
  
      res.cookie("accessToken", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
      });
  
      res.status(200).json({
        success: true,
        token,
        message: "Successfully Login",
        data: { ...rest },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Login failed, Try again!!!" });
    }
  };
  
