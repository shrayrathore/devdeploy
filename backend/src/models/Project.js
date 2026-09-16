import mongoose from "mongoose";

const githubRepositorySchema =
  new mongoose.Schema(
    {
      repositoryId: {
        type: String,
        required: true,
      },

      repositoryName: {
        type: String,
        required: true,
      },

      fullName: {
        type: String,
        required: true,
      },

      cloneUrl: {
        type: String,
        required: true,
      },

      defaultBranch: {
        type: String,
        default: "main",
      },
    },
    {
      _id: false,
    }
  );

const projectSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      github: {
        type: githubRepositorySchema,
        required: true,
      },

      environments: {
        type: [
          mongoose.Schema.Types.Mixed,
        ],
        default: [],
      },
    },
    {
      timestamps: true,
    }
  );

const Project =
  mongoose.model(
    "Project",
    projectSchema
  );

export default Project;