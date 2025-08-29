import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [finalName, setFinalName] = useState("");
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [page, setPage] = useState(1);
  const [totalRepos, setTotalRepos] = useState(0);

  
  useEffect(() => {
    const timer = setTimeout(() => {
      setFinalName(username);
    }, 600);
    return () => clearTimeout(timer);
  }, [username]);

  
  useEffect(() => {
    if (!finalName) return;
    fetchGitHubUser(finalName, page);
  }, [finalName, page]);

  const fetchGitHubUser = async (name, pageNo) => {
    setLoading(true);
    setError("");
    setUserData(null);
    setRepos([]);

    try {
      
      const userRes = await axios.get(`https://api.github.com/users/${name}`);
      setUserData(userRes.data);
      setTotalRepos(userRes.data.public_repos);

      
      const repoRes = await axios.get(
        `https://api.github.com/users/${name}/repos?sort=stars&per_page=5&page=${pageNo}`
      );
      setRepos(repoRes.data);
    } catch (err) {
      setError("User not found or API error");
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`container ${darkMode ? "dark" : ""}`}>
      <div className="top-bar">
        <h1>🔍 GitHub User Search</h1>
        <button onClick={toggleDarkMode} className="toggle-btn">
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      
      <form onSubmit={(e) => e.preventDefault()} className="search-form">
        <input
          type="text"
          placeholder="Enter GitHub username..."
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setPage(1); 
          }}
        />
      </form>

      
      {loading && <p className="info">Loading...</p>}

      
      {error && <p className="error">{error}</p>}

     
      {userData && (
        <div className="profile-card">
          <img src={userData.avatar_url} alt={userData.login} />
          <h2>{userData.name}</h2>
          <p className="username">@{userData.login}</p>
          <p>{userData.bio}</p>
          <p className="location">{userData.location}</p>
          <div className="stats">
            <span>👥 {userData.followers} Followers</span>
            <span>⭐ {userData.public_repos} Repos</span>
          </div>
        </div>
      )}

      
      {repos.length > 0 && (
        <div className="repos-section">
          <h3>Repositories (Page {page})</h3>
          <div className="repos-grid">
            {repos.map((repo) => (
              <div key={repo.id} className="repo-card">
                <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                  {repo.name}
                </a>
                <p>{repo.description || "No description"}</p>
                <div className="repo-stats">
                  <span> {repo.stargazers_count}</span>
                  <span> {repo.forks_count}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              ⬅ Prev
            </button>
            <button
              onClick={() =>
                setPage((p) =>
                  p * 5 < totalRepos ? p + 1 : p
                )
              }
              disabled={page * 5 >= totalRepos}
            >
              Next ➡
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;