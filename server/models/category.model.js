import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
  },
  adminId: {
    type: String,
    required: true,
  },
});

export default mongoose.model("category", categorySchema);
