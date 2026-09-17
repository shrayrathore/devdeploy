import api from "./api";

/*
 * Get repositories of authenticated GitHub user
 */
export async function getGithubRepositories() {
  const response = await api.get("/projects/github-repositories");

  return response.data;
}


/*
 * Get branches of a repository
 */
export async function getGithubBranches(owner, repo) {
  const response = await api.get(
    `/projects/github-repositories/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/branches`
  );

  return response.data;
}
