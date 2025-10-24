import express from "express";
import axios from "axios";
import fs from "fs";
import { createCanvas } from "canvas";
import { Country } from "../models/country.js";

const router = express.Router();

// POST /countries/refresh
router.post("/refresh", async (req, res) => {
  try {
    const [countriesRes, ratesRes] = await Promise.all([
      axios.get("https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies"),
      axios.get("https://open.er-api.com/v6/latest/USD"),
    ]);

    const rates = ratesRes.data.rates;
    const countries = countriesRes.data;

    for (const c of countries) {
      const currency = c.currencies?.[0]?.code || null;
      const rate = currency && rates[currency] ? rates[currency] : null;
      const randomMultiplier = Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;
      const gdp = rate ? (c.population * randomMultiplier) / rate : 0;

      await Country.upsert({
        name: c.name,
        capital: c.capital,
        region: c.region,
        population: c.population,
        currency_code: currency,
        exchange_rate: rate,
        estimated_gdp: gdp,
        flag_url: c.flag,
        last_refreshed_at: new Date(),
      });
    }

    // generate summary image
    const top = await Country.findAll({
      order: [["estimated_gdp", "DESC"]],
      limit: 5,
    });
    const total = await Country.count();
    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, 800, 600);
    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText(`Total Countries: ${total}`, 50, 50);
    ctx.fillText("Top 5 Countries by GDP:", 50, 100);
    top.forEach((t, i) => {
      ctx.fillText(`${i + 1}. ${t.name} - ${t.estimated_gdp.toFixed(2)}`, 70, 150 + i * 40);
    });
    ctx.fillText(`Last Refreshed: ${new Date().toISOString()}`, 50, 400);
    fs.mkdirSync("cache", { recursive: true });
    const out = fs.createWriteStream("cache/summary.png");
    const stream = canvas.createPNGStream();
    stream.pipe(out);

    res.json({ message: "Countries refreshed successfully", total });
  } catch (err) {
    console.error(err);
    res.status(503).json({
      error: "External data source unavailable",
      details: err.message,
    });
  }
});

// GET /countries
router.get("/", async (req, res) => {
  const { region, currency, sort } = req.query;
  const where = {};
  if (region) where.region = region;
  if (currency) where.currency_code = currency;

  const order = sort === "gdp_desc" ? [["estimated_gdp", "DESC"]] : undefined;

  const countries = await Country.findAll({ where, order });
  res.json(countries);
});

// GET /countries/image
router.get("/image", (req, res) => {
  if (!fs.existsSync("cache/summary.png")) {
    return res.status(404).json({ error: "Summary image not found" });
  }
  res.sendFile("summary.png", { root: "cache" });
});

// GET /countries/:name
router.get("/:name", async (req, res) => {
  const country = await Country.findOne({
    where: { name: req.params.name },
  });
  if (!country) return res.status(404).json({ error: "Country not found" });
  res.json(country);
});

// DELETE /countries/:name
router.delete("/:name", async (req, res) => {
  const deleted = await Country.destroy({
    where: { name: req.params.name },
  });
  if (!deleted) return res.status(404).json({ error: "Country not found" });
  res.json({ message: "Country deleted successfully" });
});


export default router;
