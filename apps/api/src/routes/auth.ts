import { Response, Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";
import {
  AuthenticatedRequest,
  requireAuth,
} from "../middleware/require-auth.js";

const authRouter = Router();

function getJwtSecret() {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not set");
  }

  return jwtSecret;
}

function setAuthCookie(res: Response, userId: string) {
  const token = jwt.sign(
    {
      userId,
    },
    getJwtSecret(),
    {
      expiresIn: "7d",
    },
  );

  res.cookie("token", token, {
    httpOnly: true, // cookie is only accessible from the server
    sameSite: "lax",
    secure: false, // Allows cookies over http://localhost. In production, this should become true because production should use HTTPS
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

authRouter.post("/register", async (req, res) => {
  const { email, password, confirmPassword } = req.body ?? {};

  if (!email || !password || !confirmPassword) {
    res.status(400).json({
      message: "Email, password, and confirm password are required.",
    });
    return;
  }

  if (password !== confirmPassword) {
    res.status(400).json({
      message: "Passwords do not match.",
    });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({
      message: "Password must be at least 8 characters.",
    });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      `
    INSERT INTO users (email, password_hash)
    VALUES ($1, $2)
    RETURNING id, email, created_at
    `,
      [email, passwordHash],
    );

    const user = result.rows[0];

    setAuthCookie(res, user.id);

    res.status(201).json({
      // 201 Created
      user,
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "23505"
    ) {
      res.status(409).json({
        // 409 Conflict with existing data
        message: "An account with this email already exists.",
      });
      return;
    }

    console.error(error);

    res.status(500).json({
      message: "Something went wrong while creating your account.",
    });
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    res.status(400).json({
      message: "Email and password are required.",
    });
    return;
  }

  const result = await pool.query(
    `
    SELECT id, email, password_hash, created_at
    FROM users
    WHERE email = $1
    `,
    [email],
  );

  const user = result.rows[0];

  if (!user) {
    res.status(401).json({
      // 401 Unauthorized
      message: "Invalid email or password.",
    });
    return;
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatches) {
    res.status(401).json({
      message: "Invalid email or password.",
    });
    return;
  }

  setAuthCookie(res, user.id);

  res.json({
    user: {
      id: user.id,
      email: user.email,
      createdAt: user.created_at,
    },
  });
});

authRouter.get("/me", requireAuth, (req, res) => {
  const authenticatedReq = req as AuthenticatedRequest;

  res.json({
    user: authenticatedReq.user,
  });
});

authRouter.post("/logout", (_req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });

  res.json({
    message: "Logged out successfully.",
  });
});

export { authRouter };
