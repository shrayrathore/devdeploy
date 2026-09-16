import express from "express";

import authMiddleware
  from "../middleware/auth.middleware.js";

import User from "../models/User.js";
import Project from "../models/Project.js";

import {
  getGithubRepositories,
} from "../services/github.service.js";

const router =
  express.Router();

/* =========================================================
   GET USER GITHUB REPOSITORIES
   ========================================================= */

router.get(
  "/github-repositories",
  authMiddleware,
  async (req, res) => {
    try {
      const user =
        await User.findById(
          req.userId
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      if (
        !user.github?.accessToken
      ) {
        return res.status(400).json({
          success: false,
          message:
            "GitHub account is not connected.",
        });
      }

      const repositories =
        await getGithubRepositories(
          user.github.accessToken
        );

      return res.json({
        success: true,

        repositories:
          repositories.map(
            (repo) => ({
              id: String(repo.id),

              name: repo.name,

              fullName:
                repo.full_name,

              private:
                repo.private,

              cloneUrl:
                repo.clone_url,

              sshUrl:
                repo.ssh_url,

              htmlUrl:
                repo.html_url,

              defaultBranch:
                repo.default_branch,

              owner: {
                login:
                  repo.owner?.login,

                id:
                  repo.owner?.id,
              },
            })
          ),
      });
    } catch (error) {
      console.error(
        "GitHub repositories error:",
        error.response?.data ||
          error.message
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to fetch GitHub repositories.",
      });
    }
  }
);

/* =========================================================
   CREATE PROJECT
   ========================================================= */

router.post(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        name,
        github,
      } = req.body;

      if (!name || !github) {
        return res.status(400).json({
          success: false,
          message:
            "Project name and GitHub repository are required.",
        });
      }



      const existingProject = await Project.findOne({
  owner: req.userId,
  "github.repositoryId": String(github.repositoryId),
});

if (existingProject) {
  return res.status(409).json({
    success: false,
    message: "This repository has already been added as a project.",
  });
}
      const project =
        await Project.create({
          name: name.trim(),

          owner:
            req.userId,

          github: {
            repositoryId:
              String(
                github.repositoryId
              ),

            repositoryName:
              github.repositoryName,

            fullName:
              github.fullName,

            cloneUrl:
              github.cloneUrl,

            defaultBranch:
              github.defaultBranch ||
              "main",
          },
        });

      return res.status(201).json({
        success: true,
        project,
      });
    } catch (error) {
      console.error(
        "Create project error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to create project.",
      });
    }
  }
);

/* =========================================================
   GET USER PROJECTS
   ========================================================= */

router.get(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      const projects =
        await Project.find({
          owner: req.userId,
        }).sort({
          createdAt: -1,
        });

      return res.json({
        success: true,
        projects,
      });
    } catch (error) {
      console.error(
        "Get projects error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to fetch projects.",
      });
    }
  }
);

export default router;