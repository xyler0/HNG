import crypto from "crypto";
import AnalyzedString from "../models/StringModel.js";

/**
 * Analyze a string and return its computed properties.
 */
const analyzeString = (value) => {
  const cleanValue = value.trim();
  const length = cleanValue.length;
  const is_palindrome =
    cleanValue.toLowerCase() === cleanValue.toLowerCase().split("").reverse().join("");
  const unique_characters = new Set(cleanValue).size;
  const word_count = cleanValue.split(/\s+/).filter(Boolean).length;
  const sha256_hash = crypto.createHash("sha256").update(cleanValue).digest("hex");

  const character_frequency_map = {};
  for (const char of cleanValue) {
    character_frequency_map[char] = (character_frequency_map[char] || 0) + 1;
  }

  return {
    length,
    is_palindrome,
    unique_characters,
    word_count,
    sha256_hash,
    character_frequency_map,
  };
};
// Create String
export const createString = async (req, res) => {
  try {
    const { value } = req.body;

    if (!value || typeof value !== "string") {
      return res.status(400).json({ error: "Missing or invalid 'value' field" });
    }

    const existing = await AnalyzedString.findOne({ value });
    if (existing) {
      return res.status(409).json({ error: "String already exists" });
    }

    const properties = analyzeString(value);

    const newString = await AnalyzedString.create({
      value,
      properties,
    });

    res.status(201).json({
      id: properties.sha256_hash,
      value,
      properties,
      created_at: newString.created_at,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

// Get Specific String
export const getString = async (req, res) => {
  try {
    const { string_value } = req.params;

    const found = await AnalyzedString.findOne({ value: string_value });
    if (!found) return res.status(404).json({ error: "String not found" });

    res.status(200).json(found);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

// Get All Strings with Filtering
export const getAllStrings = async (req, res) => {
  try {
    const filters = {};
    const {
      is_palindrome,
      min_length,
      max_length,
      word_count,
      contains_character,
    } = req.query;

    if (is_palindrome) filters["properties.is_palindrome"] = is_palindrome === "true";
    if (word_count) filters["properties.word_count"] = parseInt(word_count);
    if (contains_character)
      filters["value"] = { $regex: contains_character, $options: "i" };

    if (min_length || max_length) {
      filters["properties.length"] = {};
      if (min_length) filters["properties.length"].$gte = parseInt(min_length);
      if (max_length) filters["properties.length"].$lte = parseInt(max_length);
    }

    const data = await AnalyzedString.find(filters).sort({ created_at: -1 });

    res.status(200).json({
      data,
      count: data.length,
      filters_applied: req.query,
    });
  } catch (err) {
    res.status(400).json({ error: "Invalid query parameters" });
  }
};

// Delete String
export const deleteString = async (req, res) => {
  try {
    const { string_value } = req.params;

    const deleted = await AnalyzedString.findOneAndDelete({ value: string_value });
    if (!deleted) return res.status(404).json({ error: "String not found" });

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};
// Natural Language Filtering
export const filterByNaturalLanguage = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: "Missing 'query' parameter" });

    const parsed_filters = {};

    const q = query.toLowerCase();

    // simple parsing rules
    if (q.includes("palindromic")) parsed_filters["properties.is_palindrome"] = true;
    if (q.includes("single word")) parsed_filters["properties.word_count"] = 1;

    const longerMatch = q.match(/longer than (\d+)/);
    if (longerMatch) parsed_filters["properties.length"] = { $gt: parseInt(longerMatch[1]) };

    const containsMatch = q.match(/contain(s)?( the letter)? ([a-z])/);
    if (containsMatch) parsed_filters["value"] = { $regex: containsMatch[3], $options: "i" };

    // If nothing was detected
    if (Object.keys(parsed_filters).length === 0)
      return res.status(400).json({ error: "Unable to parse natural language query" });

    const data = await AnalyzedString.find(parsed_filters).sort({ created_at: -1 });

    res.status(200).json({
      data,
      count: data.length,
      interpreted_query: {
        original: query,
        parsed_filters,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};
