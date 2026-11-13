import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 80,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, 
    },
   
    preferredLanguage: {
      type: String,
      enum: ["hi", "en"],
      default: "hi",
    },
    // Used by the "alert family" feature
    trustedContact: {
      name: { type: String, trim: true, maxlength: 80 },
      phone: {
        type: String,
        trim: true,
        match: [/^[6-9]\d{9}$/, "Enter a valid 10 digit Indian mobile number"],
      },
    },
  },
  { timestamps: true }
);

// Hash password only when it was set or changed
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

// Strip sensitive/internal fields from JSON responses
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;