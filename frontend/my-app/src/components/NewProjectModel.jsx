import React, { useEffect, useState } from "react";
import { X, Lock, Globe, Loader2 } from "lucide-react";
import api from "../services/api";
import "./NewProjectModel.css";



const GitHubIcon = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.02c-3.2.7-3.88-1.36-3.88-1.36-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.95.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.08.78 2.18v3.23c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
  </svg>
);





export default function NewProjectModal({ isOpen, onClose, onCreated }) {
  const [repositories, setRepositories] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);

  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const fetchRepositories = async () => {
      try {
        setLoading(true);
        setError("");
        setSelectedRepo(null);

        const response = await api.get(
          "/projects/github-repositories"
        );

        setRepositories(
          response.data.repositories || []
        );
      } catch (err) {
        console.error(
          "Failed to fetch repositories:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to fetch your GitHub repositories."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!selectedRepo) return;

    try {
      setCreating(true);
      setError("");

      const response = await api.post(
        "/projects",
        {
          name: selectedRepo.name,
          github: {
            repositoryId: selectedRepo.id,
            repositoryName: selectedRepo.name,
            fullName: selectedRepo.fullName,
            cloneUrl: selectedRepo.cloneUrl,
            defaultBranch:
              selectedRepo.defaultBranch || "main",
          },
        }
      );

      if (response.data.success) {
        onCreated?.(response.data.project);
        onClose();
      }
    } catch (err) {
      console.error(
        "Create project error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to create project."
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <div
      className="new-project-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="new-project-modal">

        {/* Header */}
        <div className="new-project-header">
          <div>
            <h2>New Project</h2>
            <p>
              Select a repository from your GitHub account
            </p>
          </div>

          <button
            className="new-project-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={19} />
          </button>
        </div>

        {/* Content */}
        <div className="new-project-content">

          {loading && (
            <div className="repo-loading">
              <Loader2
                size={22}
                className="loading-spinner"
              />
              <span>
                Fetching your repositories...
              </span>
            </div>
          )}

          {!loading && error && (
            <div className="repo-error">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            repositories.length === 0 && (
              <div className="repo-empty">
                <GitHubIcon size={28} />
                <h3>No repositories found</h3>
                <p>
                  We couldn't find any repositories
                  connected to your GitHub account.
                </p>
              </div>
            )}

          {!loading &&
            !error &&
            repositories.length > 0 && (
              <div className="repo-list">
                {repositories.map((repo) => {
                  const selected =
                    selectedRepo?.id === repo.id;

                  return (
                    <button
                      key={repo.id}
                      className={`repo-item ${
                        selected
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        setSelectedRepo(repo)
                      }
                    >
                      <div className="repo-icon">
                        <GitHubIcon size={19} />
                      </div>

                      <div className="repo-info">
                        <div className="repo-name">
                          {repo.name}
                        </div>

                        <div className="repo-full-name">
                          {repo.fullName}
                        </div>
                      </div>

                      <div className="repo-visibility">
                        {repo.private ? (
                          <>
                            <Lock size={13} />
                            Private
                          </>
                        ) : (
                          <>
                            <Globe size={13} />
                            Public
                          </>
                        )}
                      </div>

                      <div className="repo-radio">
                        <span />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
        </div>

        {/* Footer */}
        <div className="new-project-footer">
          <button
            className="project-cancel-btn"
            onClick={onClose}
            disabled={creating}
          >
            Cancel
          </button>

          <button
            className="project-create-btn"
            onClick={handleCreate}
            disabled={
              !selectedRepo || creating
            }
          >
            {creating ? (
              <>
                <Loader2
                  size={16}
                  className="loading-spinner"
                />
                Creating...
              </>
            ) : (
              "Create Project"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}