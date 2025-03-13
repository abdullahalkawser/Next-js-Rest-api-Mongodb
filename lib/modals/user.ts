import { Schema, model, models } from "mongoose";

// Define the User schema
const UserSchema = new Schema(
  {
    title: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    number: { type: String, required: true },
    username: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

// Create the model from the schema or reuse the existing one
const User = models.User || model("User", UserSchema);

export default User;
