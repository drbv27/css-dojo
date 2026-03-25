import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IPlayground extends Document {
  userId: Types.ObjectId;
  title: string;
  html: string;
  css: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PlaygroundSchema = new Schema<IPlayground>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    html: { type: String, default: "" },
    css: { type: String, default: "" },
    isPublic: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Playground: Model<IPlayground> =
  mongoose.models.Playground ||
  mongoose.model<IPlayground>("Playground", PlaygroundSchema);

export default Playground;
