import express from "express";
import { registerUser, loginUser } from "../services/authService.js";

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }
    const user = await registerUser({ name, email, password });
    res.status(201).json({ message: "User registered successfully", userId: user.id });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const { token, userId } = await loginUser({ email, password });
    res.status(200).json({ token, userId });
  } catch (error) {
    next(error);
  }
});

export default router;
