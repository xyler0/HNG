import mongoose from "mongoose";

const evaluationSchema = new mongoose.Schema(
  {
    pitch: { type: String, required: true },
    result: {
      type: Object,
      required: true
    }
  },
  { timestamps: true } // auto-creates createdAt and updatedAt
);

export default mongoose.model("Evaluation", evaluationSchema);
