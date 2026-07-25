import mongoose, { Schema, Document, Model, Types } from "mongoose";

// Lista de espera generica (p.ej. cursos gratuitos "avisame cuando salga").
export interface IWaitlist extends Document {
  userId: Types.ObjectId;
  itemSlug: string; // que curso/producto
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WaitlistSchema = new Schema<IWaitlist>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    itemSlug: { type: String, required: true },
    comment: { type: String },
  },
  { timestamps: true }
);

// Un registro por usuario por item.
WaitlistSchema.index({ userId: 1, itemSlug: 1 }, { unique: true });

const Waitlist: Model<IWaitlist> =
  mongoose.models.Waitlist || mongoose.model<IWaitlist>("Waitlist", WaitlistSchema);

export default Waitlist;
