import { Schema } from 'mongoose';

export const AuthorSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

AuthorSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});
