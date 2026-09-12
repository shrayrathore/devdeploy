import axios from "axios";

const githubHeaders = (accessToken) => ({
  Authorization: `Bearer ${accessToken}`,
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
});

/* =========================================================
   Exchange OAuth code for access token
   ========================================================= */

export const exchangeCodeForToken = async (
  code
) => {
  const response =
    await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id:
          process.env.GITHUB_CLIENT_ID,

        client_secret:
          process.env.GITHUB_CLIENT_SECRET,

        code,
      },
      {
        headers: {
          Accept:
            "application/json",
        },
      }
    );

  if (response.data.error) {
    throw new Error(
      response.data.error_description ||
        "GitHub token exchange failed."
    );
  }

  return response.data;
};

/* =========================================================
   GitHub user
   ========================================================= */

export const getGithubUser =
  async (accessToken) => {
    const response =
      await axios.get(
        "https://api.github.com/user",
        {
          headers:
            githubHeaders(accessToken),
        }
      );

    return response.data;
  };

/* =========================================================
   GitHub emails
   ========================================================= */

export const getGithubEmails =
  async (accessToken) => {
    const response =
      await axios.get(
        "https://api.github.com/user/emails",
        {
          headers:
            githubHeaders(accessToken),
        }
      );

    return response.data;
  };

/* =========================================================
   GitHub repositories
   ========================================================= */

export const getGithubRepositories =
  async (accessToken) => {
    const response =
      await axios.get(
        "https://api.github.com/user/repos",
        {
          headers:
            githubHeaders(accessToken),

          params: {
            sort: "updated",
            per_page: 100,
          },
        }
      );

    return response.data;
  };