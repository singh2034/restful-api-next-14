import { Schema, model, models } from "mongoose";

// user name and email
const UserSchema = new Schema(
  {
    email: { type: "string", required: true, unique: true },
    userName: { type: "string", required: true, unique: true },
    password: { type: "string", required: true, unique: false },
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);
export default User;
