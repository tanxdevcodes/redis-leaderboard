import express from "express";
import cors from "cors";
import Redis from "ioredis";

const app = express();

// 1. CORS Middleware: Cross-Origin requests allow karne ke liye
app.use(cors());

// 2. JSON Parser: Request body (JSON) ko read karne ke liye
app.use(express.json());

// 3. Complete Redis URL Format
// Development / Docker mein: redis://redis:6379
// Local testing mein default: redis://127.0.0.1:6379
const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

console.log(`Connecting to Redis via URL: ${REDIS_URL}`);

// ioredis client direct Full URL pass karke initialize hota hai
const redis = new Redis(REDIS_URL);

redis.on("connect", () =>
  console.log("Successfully connected to Redis Server!"),
);
redis.on("error", (err) => console.error("Redis Connection Error:", err));

/**
 * 1. POST /api/score
 * Command: ZINCRBY key increment member
 * Meaning: Increments user score in sorted set
 */
app.post("/api/score", async (req, res) => {
  try {
    const { username, score } = req.body;
    if (!username || score === undefined) {
      return res.status(400).json({ error: "Username and score are required" });
    }

    // ZINCRBY leaderboard <score> <username>
    const updatedScore = await redis.zincrby(
      "leaderboard",
      Number(score),
      username,
    );
    res.json({ success: true, username, score: parseFloat(updatedScore) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 2. GET /api/leaderboard
 * Command: ZREVRANGE key start stop [WITHSCORES]
 * Meaning: Top scores descending order (0 to 9 -> Top 10)
 */
app.get("/api/leaderboard", async (req, res) => {
  try {
    const rawData = await redis.zrevrange("leaderboard", 0, 9, "WITHSCORES");

    const leaderboard = [];
    for (let i = 0; i < rawData.length; i += 2) {
      leaderboard.push({
        username: rawData[i],
        score: parseFloat(rawData[i + 1]),
      });
    }

    res.json({ leaderboard });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * 3. GET /api/rank/:username
 * Command: ZREVRANK key member
 * Meaning: Zero-based rank of the given user
 */
app.get("/api/rank/:username", async (req, res) => {
  try {
    const { username } = req.params;

    const rank = await redis.zrevrank("leaderboard", username);

    if (rank === null) {
      return res.status(404).json({ message: "User not found in leaderboard" });
    }

    const score = await redis.zscore("leaderboard", username);

    res.json({ username, rank: rank + 1, score: parseFloat(score) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Express server running on http://localhost:${PORT}`),
);
