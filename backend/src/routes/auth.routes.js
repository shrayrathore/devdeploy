import express from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import OAuthPending from "../models/OAuthPending.js";

import {
  exchangeCodeForToken,
  getGithubUser,
  getGithubEmails,
} from "../services/github.service.js";

import "dotenv/config";  //bcoz .env is in parent folder

const router = express.Router();

const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173";

const JWT_SECRET = process.env.JWT_SECRET;

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production"
    ? "none"
    : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

/* =========================================================
   JWT
   ========================================================= */

const createJwt = (userId) => {
  return jwt.sign(
    {
      userId,
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

const setAuthCookie = (res, userId) => {
  const token = createJwt(userId);

  res.cookie(
    "token",
    token,
    COOKIE_OPTIONS
  );
};

/* =========================================================
   NORMAL LOGIN
   ========================================================= */

router.post("/login", async (req, res) => {
  try {
    const { loginId, password } = req.body;

    if (!loginId || !password) {
      return res.status(400).json({
        success: false,
        message: "Login ID and password are required.",
      });
    }

    const user = await User.findOne({
      loginId: loginId.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Login ID or password.",
      });
    }

    const passwordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid Login ID or password.",
      });
    }

    setAuthCookie(res, user._id);

    return res.json({
      success: true,
      message: "Login successful.",
      user: {
        id: user._id,
        name: user.name,
        loginId: user.loginId,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
});

/* =========================================================
   GITHUB OAUTH START
   ========================================================= */

router.get("/github", (req, res) => {
  try {
    const state = crypto.randomBytes(32).toString("hex");

    res.cookie(
      "github_oauth_state",
      state,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite:
          process.env.NODE_ENV === "production"
            ? "none"
            : "lax",
        maxAge: 10 * 60 * 1000,
      }
    );

    const params = new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID,
      redirect_uri: process.env.GITHUB_CALLBACK_URL,
      scope: "read:user user:email repo offline_access",
      state,
    });

    const githubUrl =
      `https://github.com/login/oauth/authorize?${params.toString()}`;

    return res.redirect(githubUrl);
  } catch (error) {
    console.error("GitHub OAuth start error:", error);

    return res.status(500).send(
      "Unable to start GitHub authentication."
    );
  }
});

/* =========================================================
   GITHUB CALLBACK
   ========================================================= */

router.get("/github/callback", async (req, res) => {
  try {
    const {
      code,
      state,
      error,
    } = req.query;

    if (error) {
      return res.redirect(
        `${FRONTEND_URL}/login?githubError=cancelled`
      );
    }

    const savedState =
      req.cookies.github_oauth_state;

    if (
      !state ||
      !savedState ||
      state !== savedState
    ) {
      return res.status(403).send(
        "Invalid OAuth state."
      );
    }

    res.clearCookie("github_oauth_state");

    if (!code) {
      return res.redirect(
        `${FRONTEND_URL}/login?githubError=missing_code`
      );
    }

    /* Exchange code for GitHub access token */

    const tokenData =
      await exchangeCodeForToken(code);

    const accessToken =
      tokenData.access_token;

    if (!accessToken) {
      throw new Error(
        "GitHub did not return an access token."
      );
    }

    /* Get GitHub user */

    const githubUser =
      await getGithubUser(accessToken);

    /* Get GitHub emails */

    const emails =
      await getGithubEmails(accessToken);

    const primaryEmail =
      emails.find(
        (email) =>
          email.primary &&
          email.verified
      )?.email ||
      emails.find(
        (email) => email.verified
      )?.email ||
      "";

    /* =====================================================
       CHECK EXISTING USER
       ===================================================== */

    const existingUser =
      await User.findOne({
        "github.id": String(githubUser.id),
      });

    if (existingUser) {
      existingUser.github.accessToken =
        tokenData.access_token;

      existingUser.github.refreshToken =
        tokenData.refresh_token || null;

      if (tokenData.expires_in) {
        existingUser.github.tokenExpiresAt =
          new Date(
            Date.now() +
              tokenData.expires_in * 1000
          );
      }

      existingUser.github.scopes =
        tokenData.scope
          ? tokenData.scope.split(" ")
          : [];

      await existingUser.save();

      setAuthCookie(
        res,
        existingUser._id
      );

      return res.redirect(
        `${FRONTEND_URL}/dashboard`
      );
    }

    /* =====================================================
       NEW USER
       ===================================================== */

    const pendingToken =
      crypto.randomBytes(32).toString("hex");

    const pending =
      await OAuthPending.create({
        token: pendingToken,

        github: {
          id: String(githubUser.id),
          username: githubUser.login,
          name:
            githubUser.name ||
            githubUser.login,
          email: primaryEmail,
          avatarUrl:
            githubUser.avatar_url || "",

          accessToken:
            tokenData.access_token,

          refreshToken:
            tokenData.refresh_token || null,

          tokenExpiresAt:
            tokenData.expires_in
              ? new Date(
                  Date.now() +
                    tokenData.expires_in * 1000
                )
              : null,

          scopes:
            tokenData.scope
              ? tokenData.scope.split(" ")
              : [],
        },
      });

    return res.redirect(
      `${FRONTEND_URL}/github/setup?pending=${pending.token}`
    );
  } catch (error) {
    console.error(
      "GitHub callback error:",
      error.response?.data ||
        error.message ||
        error
    );

    return res.redirect(
      `${FRONTEND_URL}/login?githubError=oauth_failed`
    );
  }
});

/* =========================================================
   COMPLETE NEW GITHUB ACCOUNT
   ========================================================= */

router.post(
  "/github/setup",
  async (req, res) => {
    try {
      const {
        pendingId,
        loginId,
        password,
      } = req.body;

      if (
        !pendingId ||
        !loginId ||
        !password
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Login ID and password are required.",
        });
      }

      if (loginId.trim().length < 3) {
        return res.status(400).json({
          success: false,
          message:
            "Login ID must contain at least 3 characters.",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message:
            "Password must contain at least 6 characters.",
        });
      }

      const pending =
        await OAuthPending.findOne({
          token: pendingId,
        });

      if (!pending) {
        return res.status(400).json({
          success: false,
          message:
            "GitHub session expired. Please login again.",
        });
      }

      const normalizedLoginId =
        loginId.toLowerCase().trim();

      /* Check Login ID */

      const loginIdExists =
        await User.findOne({
          loginId: normalizedLoginId,
        });

      if (loginIdExists) {
        return res.status(409).json({
          success: false,
          message:
            "This Login ID is already taken.",
        });
      }

      /* Check email */

      if (pending.github.email) {
        const emailExists =
          await User.findOne({
            email:
              pending.github.email.toLowerCase(),
          });

        if (emailExists) {
          return res.status(409).json({
            success: false,
            message:
              "An account with this email already exists.",
          });
        }
      }

      const hashedPassword =
        await bcrypt.hash(password, 12);

      const user =
        await User.create({
          name:
            pending.github.name ||
            pending.github.username,

          loginId:
            normalizedLoginId,

          email:
            pending.github.email ||
            `${pending.github.username}@github.local`,

          password:
            hashedPassword,

          github: {
            id:
              pending.github.id,

            username:
              pending.github.username,

            avatarUrl:
              pending.github.avatarUrl,

            accessToken:
              pending.github.accessToken,

            refreshToken:
              pending.github.refreshToken,

            tokenExpiresAt:
              pending.github.tokenExpiresAt,

            scopes:
              pending.github.scopes,
          },
        });

      await OAuthPending.deleteOne({
        _id: pending._id,
      });

      setAuthCookie(
        res,
        user._id
      );

      return res.json({
        success: true,
        message:
          "DevDeploy account created successfully.",

        user: {
          id: user._id,
          name: user.name,
          loginId: user.loginId,
          email: user.email,
        },
      });
    } catch (error) {
      console.error(
        "GitHub setup error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to create your account.",
      });
    }
  }
);

/* =========================================================
   CURRENT USER
   ========================================================= */

router.get("/me", async (req, res) => {
  try {
    const token =
      req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated.",
      });
    }

    const decoded =
      jwt.verify(
        token,
        JWT_SECRET
      );

    const user =
      await User.findById(
        decoded.userId
      ).select(
        "-password -github.accessToken -github.refreshToken"
      );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid session.",
    });
  }
});

/* =========================================================
   LOGOUT
   ========================================================= */

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite:
      process.env.NODE_ENV === "production"
        ? "none"
        : "lax",
  });

  return res.json({
    success: true,
    message: "Logged out successfully.",
  });
});

export default router;