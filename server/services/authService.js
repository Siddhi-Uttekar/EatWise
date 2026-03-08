import pool from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const registerUser = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    const error = new Error("Name, email, and password are required");
    error.statusCode = 400;
    throw error;
  }

  try {
    console.log("📝 Registering user:", email);

    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      const error = new Error("User with this email already exists");
      error.statusCode = 400;
      throw error;
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at",
      [name, email, passwordHash]
    );

    console.log("✓ User registered successfully:", newUser.rows[0].id);
    return newUser.rows[0];
  } catch (err) {
    console.error("❌ Registration error:", err.message);
    console.error("Error code:", err.code);

    // Rethrow with more context
    if (err.statusCode) throw err;
    const error = new Error(err.message || "Registration failed");
    error.code = err.code;
    error.originalError = err;
    throw error;
  }
};

export const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    const error = new Error("Email and password are required");
    error.statusCode = 400;
    throw error;
  }

  try {
    const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userResult.rows.length === 0) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    const user = userResult.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    return { token, userId: user.id };
  } catch (err) {
    if (err.statusCode) throw err;
    const error = new Error(err.message || "Login failed");
    error.originalError = err;
    throw error;
  }
};
