import mongoose from "mongoose";

const githubPendingSchema =
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

      name: {
        type: String,
        default: "",
      },

      email: {
        type: String,
        default: "",
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

const oauthPendingSchema =
  new mongoose.Schema(
    {
      token: {
        type: String,
        required: true,
        unique: true,
      },

      github: {
        type: githubPendingSchema,
        required: true,
      },

      createdAt: {
        type: Date,
        default: Date.now,

        // Automatically remove
        // pending OAuth records after 10 minutes.
        expires: 600,
      },
    }
  );

const OAuthPending =
  mongoose.model(
    "OAuthPending",
    oauthPendingSchema
  );

export default OAuthPending;