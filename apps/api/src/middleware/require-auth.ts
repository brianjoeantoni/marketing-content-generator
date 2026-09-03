import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

function getJwtSecret() {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not set");
  }

  return jwtSecret;
}

type AuthenticatedUser = {
  id: string;
  email: string;
  created_at: Date;
};

type AuthenticatedRequest = Request & {
  user: AuthenticatedUser;
};

async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({
      message: "Not authenticated.",
    });
    return;
  }

  try {
    const payload = jwt.verify(token, getJwtSecret()); // checks if token is valid (not tampered, not expired)

    if (
      typeof payload !== "object" ||
      payload === null ||
      !("userId" in payload) ||
      typeof payload.userId !== "string"
    ) {
      res.status(401).json({
        message: "Invalid auth token.",
      });
      return;
    }

    const result = await pool.query(
      `
      SELECT id, email, created_at
      FROM users
      WHERE id = $1
      `,
      [payload.userId],
    );

    const user = result.rows[0];

    if (!user) {
      res.status(401).json({
        message: "User no longer exists.",
      });
      return;
    }

    // Add the authenticated user information onto the request object so the next route handler can use it.
    const authenticatedReq = req as AuthenticatedRequest;

    authenticatedReq.user = {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
    };
    next();
  } catch {
    res.status(401).json({
      message: "Invalid auth token.",
    });
  }
}

export { requireAuth };
export type { AuthenticatedRequest };
