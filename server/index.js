import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();

app.use(cors());

app.get("/api/europatipset", async (_req, res) => {
  try {
    const r = await axios.get(
      "https://api.spela.svenskaspel.se/draw/1/europatipset/draws"
    );
    res.json(r.data);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(5000, () =>
  console.log("Proxy running on http://localhost:5000")
);
