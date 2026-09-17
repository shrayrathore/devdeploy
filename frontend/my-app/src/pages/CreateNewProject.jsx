import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  CircleAlert,
  Globe2,
  LoaderCircle,
  Lock,
  RefreshCw,
  Search,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import { getGithubBranches, getGithubRepositories } from "../services/github.api";
import { createProject } from "../services/project.api";
import "./CreateNewProject.css";

const repositoryOwner = (repository) =>
  repository.owner?.login || repository.fullName?.split("/")[0] || "";

const repositoryFullName = (repository) =>
  repository.fullName || `${repositoryOwner(repository)}/${repository.name}`;

const GitHubIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.18c-3.2.69-3.87-1.54-3.87-1.54-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.71 1.25 3.37.95.1-.74.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.21-1.5 3.18-1.18 3.18-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.35.77 1.04.77 2.1v3.11c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
  </svg>
);

export default function CreateNewProject() {
  const navigate = useNavigate();
  const branchRequest = useRef(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [repositories, setRepositories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [projectName, setProjectName] = useState("");
  const [environment, setEnvironment] = useState("development");
  const [loadingRepos, setLoadingRepos] = useState(true);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const [creating, setCreating] = useState(false);
  const [repositoryError, setRepositoryError] = useState("");
  const [branchError, setBranchError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [githubConnectionMissing, setGithubConnectionMissing] = useState(false);

  const filteredRepositories = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return repositories;

    return repositories.filter((repository) =>
      [repository.name, repositoryFullName(repository), repositoryOwner(repository)]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [repositories, search]);

  const loadRepositories = async () => {
    try {
      setLoadingRepos(true);
      setRepositoryError("");
      setGithubConnectionMissing(false);
      const data = await getGithubRepositories();
      setRepositories(Array.isArray(data.repositories) ? data.repositories : []);
    } catch (error) {
      setRepositoryError(
        error.response?.data?.message ||
          "Unable to load your GitHub repositories. Please try again."
      );
      setGithubConnectionMissing(error.response?.status === 400);
    } finally {
      setLoadingRepos(false);
    }
  };

  useEffect(() => {
    loadRepositories();
  }, []);

  const selectRepository = async (repository) => {
    const requestId = ++branchRequest.current;
    const owner = repositoryOwner(repository);

    setSelectedRepo(repository);
    setProjectName(repository.name);
    setBranches([]);
    setSelectedBranch("");
    setBranchError("");
    setSubmitError("");
    setLoadingBranches(true);

    try {
      const data = await getGithubBranches(owner, repository.name);
      if (requestId !== branchRequest.current) return;

      const names = (Array.isArray(data.branches) ? data.branches : [])
        .map((branch) => (typeof branch === "string" ? branch : branch.name))
        .filter(Boolean);
      setBranches(names);
      setSelectedBranch(
        names.includes(repository.defaultBranch)
          ? repository.defaultBranch
          : names[0] || ""
      );

      if (names.length === 0) {
        setBranchError("No branches are available for this repository.");
      }
    } catch (error) {
      if (requestId !== branchRequest.current) return;
      setBranchError(
        error.response?.data?.message ||
          "Unable to load repository branches. Select the repository again to retry."
      );
    } finally {
      if (requestId === branchRequest.current) setLoadingBranches(false);
    }
  };

  const handleCreateProject = async (event) => {
    event.preventDefault();
    if (!projectName.trim() || !selectedRepo || !selectedBranch) return;

    try {
      setCreating(true);
      setSubmitError("");
      await createProject({
        name: projectName.trim(),
        github: {
          repositoryId: selectedRepo.id,
          repositoryName: selectedRepo.name,
          fullName: repositoryFullName(selectedRepo),
          cloneUrl: selectedRepo.cloneUrl,
          defaultBranch: selectedBranch,
        },
        environments: [{ name: environment }],
      });

      // No project-detail route exists in the current app, so use its
      // authenticated landing page after a successful creation.
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setSubmitError(
        error.response?.data?.message || "Unable to create this project."
      );
    } finally {
      setCreating(false);
    }
  };

  const canCreate =
    projectName.trim() && selectedRepo && selectedBranch && !loadingBranches && !creating;

  return (
    <div className="app">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="main-content create-project-main-content">
        <div className="create-project-page">
          <header className="create-project-header">
            <button className="create-project-back" type="button" onClick={() => navigate("/dashboard")}>
              <ArrowLeft size={16} /> Projects
            </button>
            <h1>Create New Project</h1>
            <p>Connect a GitHub repository and configure its first environment.</p>
          </header>

          <form className="create-project-layout" onSubmit={handleCreateProject}>
            <div className="create-project-primary-column">
              <section className="create-project-card">
                <div className="create-project-section-heading">
                  <div>
                    <h2>Project Information</h2>
                    <p>Choose a clear name for this deployment project.</p>
                  </div>
                </div>
                <label className="create-project-field">
                  <span>Project Name</span>
                  <input value={projectName} onChange={(event) => setProjectName(event.target.value)} placeholder="my-project" autoComplete="off" />
                </label>
              </section>

              <section className="create-project-card repository-section">
                <div className="create-project-section-heading repository-heading">
                  <div>
                    <h2>GitHub Repository</h2>
                    <p>Select one repository from your connected GitHub account.</p>
                  </div>
                  <span className="github-status"><span />{githubConnectionMissing ? "Connection required" : "Connected"}</span>
                </div>
                <label className="repository-search" htmlFor="repository-search">
                  <Search size={17} />
                  <input id="repository-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search repositories" disabled={loadingRepos || Boolean(repositoryError)} />
                </label>

                {loadingRepos && <div className="repository-skeletons" aria-label="Loading repositories">{[1, 2, 3, 4].map((item) => <span key={item} />)}</div>}

                {!loadingRepos && repositoryError && (
                  <div className="repository-state repository-error" role="alert">
                    <CircleAlert size={20} />
                    <div>
                      <strong>GitHub repositories could not be loaded</strong>
                      <p>{repositoryError}</p>
                      <div className="repository-state-actions">
                        <button type="button" onClick={loadRepositories}><RefreshCw size={14} /> Try again</button>
                        {githubConnectionMissing && <button type="button" onClick={() => window.location.assign(`${api.defaults.baseURL}/auth/github`)}>Connect GitHub</button>}
                      </div>
                    </div>
                  </div>
                )}

                {!loadingRepos && !repositoryError && repositories.length === 0 && (
                  <div className="repository-state"><GitHubIcon size={23} /><div><strong>No repositories found</strong><p>Your connected GitHub account did not return any repositories.</p></div></div>
                )}

                {!loadingRepos && !repositoryError && repositories.length > 0 && (
                  <div className="repository-list" role="radiogroup" aria-label="GitHub repositories">
                    {filteredRepositories.length === 0 ? <div className="repository-no-results">No repositories match “{search}”.</div> : filteredRepositories.map((repository) => {
                      const isSelected = selectedRepo?.id === repository.id;
                      return (
                        <button className={`repository-option${isSelected ? " selected" : ""}`} key={repository.id} type="button" role="radio" aria-checked={isSelected} onClick={() => selectRepository(repository)}>
                          <span className="repository-icon"><GitHubIcon size={19} /></span>
                          <span className="repository-details"><strong>{repository.name}</strong><span>{repositoryFullName(repository)}</span></span>
                          <span className="repository-visibility">{repository.private ? <Lock size={13} /> : <Globe2 size={13} />}{repository.private ? "Private" : "Public"}</span>
                          <span className="repository-check" aria-hidden="true">{isSelected && <Check size={13} />}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>

            <aside className="create-project-sidebar">
              <section className="create-project-card configuration-card">
                <div className="create-project-section-heading"><div><h2>Configuration</h2><p>Configure the initial deployment target.</p></div></div>
                <label className="create-project-field branch-field">
                  <span>Branch</span>
                  <span className="select-control">
                    <select value={selectedBranch} onChange={(event) => setSelectedBranch(event.target.value)} disabled={!selectedRepo || loadingBranches || branches.length === 0}>
                      {!selectedRepo && <option value="">Select a repository first</option>}
                      {loadingBranches && <option value="">Loading branches…</option>}
                      {!loadingBranches && selectedRepo && branches.length === 0 && <option value="">No branches available</option>}
                      {!loadingBranches && branches.map((branch) => <option key={branch} value={branch}>{branch}</option>)}
                    </select>
                    <ChevronDown size={16} />
                  </span>
                  {branchError && <small className="branch-error">{branchError}</small>}
                </label>

                <fieldset className="environment-field">
                  <legend>Environment</legend>
                  <label className={environment === "development" ? "active" : ""}><input type="radio" name="environment" value="development" checked={environment === "development"} onChange={(event) => setEnvironment(event.target.value)} /><span><strong>Development</strong><small>For testing and iteration</small></span></label>
                  <label className={environment === "production" ? "active" : ""}><input type="radio" name="environment" value="production" checked={environment === "production"} onChange={(event) => setEnvironment(event.target.value)} /><span><strong>Production</strong><small>For live applications</small></span></label>
                </fieldset>

                <div className="selected-repository-summary" aria-live="polite">
                  <span>Selected Repository</span>
                  {selectedRepo ? <><strong>{repositoryFullName(selectedRepo)}</strong><small>Branch: {loadingBranches ? "Loading…" : selectedBranch || "Not selected"}</small></> : <small>Select a repository to continue.</small>}
                </div>
                {submitError && <p className="submit-error" role="alert">{submitError}</p>}
                <div className="create-project-actions">
                  <button type="button" className="cancel-button" onClick={() => navigate("/dashboard")} disabled={creating}>Cancel</button>
                  <button type="submit" className="create-button" disabled={!canCreate}>{creating && <LoaderCircle size={16} className="spinning" />}{creating ? "Creating project…" : "Create Project"}</button>
                </div>
              </section>
            </aside>
          </form>
        </div>
      </main>
    </div>
  );
}
