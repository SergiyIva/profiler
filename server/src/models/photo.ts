import mongoose from "mongoose";

const { Schema } = mongoose;

const PhotoSchema = new Schema(
  {
    media: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Photo = mongoose.model("Photo", PhotoSchema);
export default Photo;
