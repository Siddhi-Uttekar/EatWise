import pool from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  if (existingUser.rows.length > 0) {
    throw new Error("User with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const newUser = await pool.query(
    "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
    [name, email, passwordHash]
  );

  return newUser.rows[0];
};

export const loginUser = async ({ email, password }) => {
  const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  if (userResult.rows.length === 0) {
    throw new Error("Invalid email or password");
  }

  const user = userResult.rows[0];
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return { token, userId: user.id };
};
