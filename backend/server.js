const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Test route
app.get("/", (req, res) => {
res.send("Backend is running 🚀");
});

// ✅ USER API (FIXED)
app.get("/user", async (req, res) => {
const username = req.query.username;

if (!username) {
return res.status(400).json({ error: "Username required" });
}

try {
const response = await axios.get(
`https://api.github.com/users/${username}`,
{
headers: { "User-Agent": "request" },
}
);

```
const userData = {
  name: response.data.name,
  avatar: response.data.avatar_url,
  repos: response.data.public_repos,
  followers: response.data.followers,
  following: response.data.following,
  bio: response.data.bio,
};

res.json(userData);
```

} catch (error) {
console.log("User API error:", error.message);
res.json({ error: "Could not fetch user data" });
}
});

// ✅ REPO API (OK)
app.get("/repo", async (req, res) => {
const repo = req.query.repo;

if (!repo) {
return res.status(400).json({ error: "Repository name required" });
}

try {
const response = await axios.get(
`https://api.github.com/repos/${repo}`,
{
headers: { "User-Agent": "request" },
}
);

```
const repoData = {
  name: response.data.name,
  stars: response.data.stargazers_count,
  forks: response.data.forks_count,
  language: response.data.language,
  issues: response.data.open_issues_count,
  size: response.data.size,
  description: response.data.description,
  avatar: response.data.owner.avatar_url,
};

res.json(repoData);
```

} catch (error) {
console.log("Repo API error:", error.message);
res.json({ error: "Could not fetch repository data" });
}
});

// ✅ CONTRIBUTORS API (FIXED)
app.get("/contributors", async (req, res) => {
const repo = req.query.repo;

if (!repo) {
return res.status(400).json({ error: "Repository name required" });
}

try {
const contributorsRes = await axios.get(
`https://api.github.com/repos/${repo}/contributors`,
{
headers: { "User-Agent": "request" },
}
);

```
const contributors = Array.isArray(contributorsRes.data)
  ? contributorsRes.data.slice(0, 5).map((c) => ({
      username: c.login,
      contributions: c.contributions,
    }))
  : [];

res.json({ contributors });
```

} catch (error) {
console.log("Contributors API error:", error.message);
res.json({ contributors: [] }); // safe fallback
}
});

app.listen(5000, () => {
console.log("Server running on port 5000");
});
