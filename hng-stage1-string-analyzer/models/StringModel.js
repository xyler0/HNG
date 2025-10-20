import mongoose from "mongoose";

const StringSchema = new mongoose.Schema(
  {
    value: {
      type: String,
      required: true,
      unique: true,
    },
    properties: {
      length: Number,
      is_palindrome: Boolean,
      unique_characters: Number,
      word_count: Number,
      sha256_hash: String,
      character_frequency_map: Object,
    },
  },
  { timestamps: { createdAt: "created_at" } }
);

export default mongoose.model("AnalyzedString", StringSchema);
