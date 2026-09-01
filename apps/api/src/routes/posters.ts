import { Router } from "express";
import { pool } from "../db.js";
import {
  AuthenticatedRequest,
  requireAuth,
} from "../middleware/require-auth.js";

// helper function to check if a value is a non-empty string
function isNonEmptyString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

// helper function to check if a string is a valid UUID
function isValidUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

const postersRouter = Router();

function completePosterAfterDelay(posterId: string) {
  // complete the poster after 3 seconds
  setTimeout(async () => {
    try {
      await pool.query(
        `
        UPDATE posters
        SET status = $1, updated_at = now()
        WHERE id = $2 AND status = $3
        `,
        ["completed", posterId, "processing"],
      );
    } catch (error) {
      console.error(error);
    }
  }, 3000);
}

postersRouter.post("/", requireAuth, async (req, res) => {
  const { brand_name, product_name, product_description, price } =
    req.body ?? {};

  const authenticatedReq = req as AuthenticatedRequest;
  const userId = authenticatedReq.user.id;

  if (
    !isNonEmptyString(brand_name) ||
    !isNonEmptyString(product_name) ||
    !isNonEmptyString(product_description) ||
    !isNonEmptyString(price)
  ) {
    res.status(400).json({
      message: "All poster fields are required.",
    });
    return;
  }

  // normalize the input
  const posterInput = {
    brand_name: brand_name.trim(),
    product_name: product_name.trim(),
    product_description: product_description.trim(),
    price: price.trim(),
  };

  try {
    const result = await pool.query(
      `
    INSERT INTO posters (
      user_id,
      brand_name,
      product_name,
      product_description,
      price,
      status
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING
      id,
      user_id,
      brand_name,
      product_name,
      product_description,
      price,
      status,
      image_path,
      created_at,
      updated_at
    `,
      [
        userId,
        posterInput.brand_name,
        posterInput.product_name,
        posterInput.product_description,
        posterInput.price,
        "processing",
      ],
    );

    const poster = result.rows[0];

    completePosterAfterDelay(poster.id);

    res.status(201).json({
      poster,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong while creating the poster.",
    });
  }
});

postersRouter.get("/", requireAuth, async (req, res) => {
  const authenticatedReq = req as AuthenticatedRequest;
  const userId = authenticatedReq.user.id;

  try {
    const result = await pool.query(
      `
      SELECT
        id,
        user_id,
        brand_name,
        product_name,
        product_description,
        price,
        status,
        image_path,
        created_at,
        updated_at
      FROM posters
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId],
    );

    res.json({
      posters: result.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong while fetching posters.",
    });
  }
});

postersRouter.get("/:id", requireAuth, async (req, res) => {
  const authenticatedReq = req as AuthenticatedRequest;
  const userId = authenticatedReq.user.id;
  const posterId = req.params.id;

  if (typeof posterId !== "string" || !isValidUuid(posterId)) {
    res.status(400).json({
      message: "Poster ID must be a valid UUID.",
    });
    return;
  }

  try {
    const result = await pool.query(
      `
      SELECT
        id,
        user_id,
        brand_name,
        product_name,
        product_description,
        price,
        status,
        image_path,
        created_at,
        updated_at
      FROM posters
      WHERE id = $1 AND user_id = $2
      `,
      [posterId, userId],
    );

    const poster = result.rows[0];

    if (!poster) {
      res.status(404).json({
        message: "Poster not found.",
      });
      return;
    }

    res.json({
      poster,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong while fetching the poster.",
    });
  }
});

export { postersRouter };
