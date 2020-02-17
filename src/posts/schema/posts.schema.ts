import { Schema } from 'mongoose';

export const PostsSchema = new Schema(
  {
    title: { type: String, required: true },
    votes: { type: Number, required: true, default: 0 },
    authorId: { type: Schema.Types.ObjectId, required: true }
  },
  {
    timestamps: true
  }
);
