import mongoose from "mongoose";

const githubSchema =
  new mongoose.Schema(
    {
      id: {
        type: String,
        required: true,
      },

      username: {
        type: String,
        required: true,
      },

      avatarUrl: {
        type: String,
        default: "",
      },

      accessToken: {
        type: String,
        required: true,
      },

      refreshToken: {
        type: String,
        default: null,
      },

      tokenExpiresAt: {
        type: Date,
        default: null,
      },

      scopes: {
        type: [String],
        default: [],
      },
    },
    {
      _id: false,
    }
  );

const userSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      loginId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },

      password: {
        type: String,
        required: true,
      },

      github: {
        type: githubSchema,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

const User =
  mongoose.model("User", userSchema);

export default User;