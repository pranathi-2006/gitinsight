const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});
app.get("/user", async (req, res) => {
  const username = req.query.username;

  if (!username) {
    return res.status(400).json({ error: "Username required" });
  }

  try {
    const response = await axios.get(
      `https://api.github.com/users/${username}`
    );

    const userData = {
      name: response.data.name,
      avatar: response.data.avatar_url,
      repos: response.data.public_repos,
      followers: response.data.followers,
      following: response.data.following,
      bio: response.data.bio
    };

    res.json(userData);

  } catch (error) {
    console.log("GitHub API error:", error.message);
    res.status(500).json({ error: "Could not fetch user data" });
  }
});

// Repository info API
app.get("/repo", async (req, res) => {
  const repo = req.query.repo;

  if (!repo) {
    return res.status(400).json({ error: "Repository name required" });
  }

  try {
    const githubURL = `https://api.github.com/repos/${repo}`;
    const response = await axios.get(githubURL);

    const repoData = {
   name: response.data.name,
   stars: response.data.stargazers_count,
   forks: response.data.forks_count,
   language: response.data.language,
   issues: response.data.open_issues_count,
   size: response.data.size,
   description: response.data.description,
   avatar: response.data.owner.avatar_url
};

    res.json(repoData);

  } catch (error) {
    console.log("GitHub API error:", error.message);
    res.status(500).json({ error: "Could not fetch repository data" });
  }
});

// Contributors API
app.get("/contributors", async (req, res) => {
  const repo = req.query.repo;

  if (!repo) {
    return res.status(400).json({ error: "Repository name required" });
  }

  try {
    const response = await axios.get(
      `https://api.github.com/repos/${repo}/contributors`
    );

    const contributors = response.data.slice(0, 5).map((c) => ({
      username: c.login,
      contributions: c.contributions
    }));

    res.json(contributors);

  } catch (error) {
    console.log("GitHub API error:", error.message);
    res.status(500).json({ error: "Failed to fetch contributors" });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});