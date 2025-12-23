import express = require("express");
import cors = require("cors");
import { pool } from "./db";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", db: "connected" });
  } catch (err: any) {
    console.error("DB ERROR:", err.message);
    res.status(500).json({ status: "error", db: "disconnected" });
  }
});

app.get("/tickets", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT tier, price, available FROM tickets ORDER BY price DESC"
    );
    res.json(result.rows);
  } catch (err: any) {
    console.error("FETCH TICKETS ERROR:", err.message);
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
});

app.post("/book", async (req, res) => {
  const { tier, quantity } = req.body;

  if (!tier || !quantity || quantity <= 0) {
    return res.status(400).json({ error: "Invalid request" });
  }

  try {
    const result = await pool.query(
      `
      UPDATE tickets
      SET available = available - $1
      WHERE tier = $2 AND available >= $1
      RETURNING tier, price, available
      `,
      [quantity, tier]
    );

    if (result.rowCount === 0) {
      return res.status(409).json({
        error: "Not enough tickets available",
      });
    }

    res.json({
      message: "Booking successful",
      ticket: result.rows[0],
    });
  } catch (err: any) {
    console.error("BOOKING ERROR:", err.message);
    res.status(500).json({ error: "Booking failed" });
  }
});


const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
