import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { sequelize } from "./models/index.js";
import countryRoutes from "./routes/countries.js";
import { Country } from "./models/country.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/countries", countryRoutes);

app.get("/status", async (req, res) => {
  try {
    const total = await Country.count();
    const last = await Country.max("last_refreshed_at");

    res.json({
      total_countries: total,
      last_refreshed_at: last,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Internal server error",
      details: err.message,
    });
  }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await sequelize.sync();
  console.log(`Server running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Server is running");
});
