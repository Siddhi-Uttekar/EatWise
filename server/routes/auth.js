import express from "express";
import { registerUser, loginUser } from "../services/authService.js";

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await registerUser({ name, email, password });
    res.status(201).json({
      message: "User registered successfully",
      userId: user.id,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { token, userId } = await loginUser({ email, password });
    res.status(200).json({
      message: "Login successful",
      token,
      userId
    });
  } catch (error) {
    next(error);
  }
});

export default router;
