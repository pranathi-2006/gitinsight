require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ In-memory cache for API responses (5 minutes TTL) to minimize external API calls
const cache = {};
const CACHE_TTL = 5 * 60 * 1000;

const getCachedData = (key) => {
  const cached = cache[key];
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key, data) => {
  cache[key] = {
    timestamp: Date.now(),
    data: data,
  };
};

// ✅ Helper to identify GitHub rate limit errors
const isRateLimitError = (error) => {
  return (
    error.response?.status === 403 &&
    error.response?.data?.message?.toLowerCase().includes("rate limit")
  );
};

// ✅ Helper to get GitHub request headers with optional authentication
const getGithubHeaders = () => {
  const headers = {
    "User-Agent": "Mozilla/5.0",
    "Accept": "application/vnd.github+json",
  };
  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
};

// ✅ Helper to clean scraped numbers (e.g. "91k", "51,166", "246739 users starred")
const cleanNumber = (val) => {
  if (!val) return 0;
  const numMatch = val.match(/[\d,.]+[km]?/i);
  if (numMatch) {
    const numStr = numMatch[0].trim().toLowerCase();
    if (numStr.endsWith("k")) return parseFloat(numStr) * 1000;
    if (numStr.endsWith("m")) return parseFloat(numStr) * 1000000;
    return parseInt(numStr.replace(/,/g, "")) || 0;
  }
  return 0;
};

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ USER API
app.get("/user", async (req, res) => {
  const username = req.query.username;

  if (!username) {
    return res.status(400).json({ error: "Username required" });
  }

  const cacheKey = `user:${username}`;
  const cached = getCachedData(cacheKey);
  if (cached) {
    console.log(`[Cache Hit] User: ${username}`);
    return res.json(cached);
  }

  try {
    console.log(`Attempting standard REST API query for user: ${username}`);
    const response = await axios.get(
      `https://api.github.com/users/${username}`,
      {
        headers: getGithubHeaders(),
      }
    );

    const userData = {
      name: response.data.name || response.data.login,
      avatar: response.data.avatar_url,
      repos: response.data.public_repos,
      followers: response.data.followers,
      following: response.data.following,
      bio: response.data.bio || "No bio available",
    };

    setCachedData(cacheKey, userData);
    return res.json(userData);

  } catch (error) {
    console.log("User REST API error:", error.response?.data || error.message);

    // Fallback: scrape public profile HTML if rate-limited or error occurs
    console.log(`Attempting public page parsing fallback for user: ${username}`);
    try {
      const publicResponse = await axios.get(
        `https://github.com/${username}`,
        {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
        }
      );
      const html = publicResponse.data;

      const followersMatch = html.match(/href="[^"]+\?tab=followers"[^>]*>[\s\S]*?<span[^>]*class="[^"]*text-bold[^"]*"[^>]*>([^<]+)<\/span>/i) ||
                             html.match(/<span[^>]*class="[^"]*text-bold[^"]*"[^>]*>([^<]+)<\/span>\s*followers/i);
                             
      const followingMatch = html.match(/href="[^"]+\?tab=following"[^>]*>[\s\S]*?<span[^>]*class="[^"]*text-bold[^"]*"[^>]*>([^<]+)<\/span>/i) ||
                             html.match(/<span[^>]*class="[^"]*text-bold[^"]*"[^>]*>([^<]+)<\/span>\s*following/i);

      const avatarMatch = html.match(/class="[^"]*avatar-user[^"]*"[^>]*src="([^"]+)"/i) ||
                          html.match(/property="og:image"\s*content="([^"]+)"/i);

      const nameMatch = html.match(/<span\s+class="p-name[^"]*"[^>]*>([^<]+)<\/span>/i) ||
                        html.match(/<title>([^<]+)\s*\(/i);

      const bioMatch = html.match(/<div\s+class="[^"]*user-profile-bio[^"]*"[^>]*>[\s\S]*?<div>([\s\S]*?)<\/div>/i) ||
                       html.match(/<div\s+class="[^"]*user-profile-bio[^"]*"[^>]*>([\s\S]*?)<\/div>/i);

      const reposMatch = html.match(/href="[^"]+\?tab=repositories"[^>]*>[\s\S]*?<span[^>]*class="Counter[^"]*"[^>]*>([^<]+)<\/span>/i);

      const cleanAvatar = avatarMatch ? avatarMatch[1].replace(/&amp;/g, "&").trim() : "";

      const userData = {
        name: nameMatch ? nameMatch[1].trim() : username,
        avatar: cleanAvatar,
        repos: cleanNumber(reposMatch ? reposMatch[1] : "0"),
        followers: cleanNumber(followersMatch ? followersMatch[1] : "0"),
        following: cleanNumber(followingMatch ? followingMatch[1] : "0"),
        bio: bioMatch ? bioMatch[1].replace(/<[^>]*>/g, "").trim() : "No bio available",
      };

      console.log(`Successfully scraped user data from profile fallback!`);
      setCachedData(cacheKey, userData);
      return res.json(userData);

    } catch (fallbackError) {
      console.log("Scraping user profile fallback error:", fallbackError.message);
    }

    // general fallback
    res.json({
      name: "User not found",
      avatar: "",
      repos: 0,
      followers: 0,
      following: 0,
      bio: "No data available",
    });
  }
});

// ✅ REPO API
app.get("/repo", async (req, res) => {
  const repo = req.query.repo;

  if (!repo) {
    return res.status(400).json({ error: "Repository required" });
  }

  const cacheKey = `repo:${repo}`;
  const cached = getCachedData(cacheKey);
  if (cached) {
    console.log(`[Cache Hit] Repo: ${repo}`);
    return res.json(cached);
  }

  try {
    console.log(`Attempting standard REST API query for repo: ${repo}`);
    const response = await axios.get(
      `https://api.github.com/repos/${repo}`,
      {
        headers: getGithubHeaders(),
      }
    );

    const repoData = {
      name: response.data.name,
      stars: response.data.stargazers_count,
      forks: response.data.forks_count,
      language: response.data.language || "N/A",
      issues: response.data.open_issues_count,
      size: response.data.size,
      description: response.data.description || "No description",
      avatar: response.data.owner.avatar_url,
    };

    setCachedData(cacheKey, repoData);
    return res.json(repoData);

  } catch (error) {
    console.log("Repo REST API error:", error.response?.data || error.message);

    // Fallback: scrape public repo HTML if rate-limited or error occurs
    console.log(`Attempting public page parsing fallback for repo: ${repo}`);
    try {
      const publicResponse = await axios.get(
        `https://github.com/${repo}`,
        {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
        }
      );
      const html = publicResponse.data;

      const starsMatch = html.match(/id="repo-stars-counter-star"[^>]*aria-label="([^"]+)"/) ||
                         html.match(/id="repo-stars-counter-star"[^>]*title="([^"]+)"/) ||
                         html.match(/id="repo-stars-counter-star"[^>]*>([^<]+)</);
                         
      const forksMatch = html.match(/id="repo-network-counter"[^>]*aria-label="([^"]+)"/) ||
                         html.match(/id="repo-network-counter"[^>]*title="([^"]+)"/) ||
                         html.match(/id="repo-network-counter"[^>]*>([^<]+)</);

      const descMatch = html.match(/<meta name="description" content="([^"]+)"/);
      
      const langMatch = html.match(/itemprop="programmingLanguage"[^>]*content="([^"]+)"/) ||
                        html.match(/class="color-fg-default text-bold mr-1">([^<]+)</) ||
                        html.match(/class="[^"]*programming-language[^"]*"[^>]*>([^<]+)</i);

      const avatarMatch = html.match(/property="og:image"\s*content="([^"]+)"/i);

      const cleanAvatar = avatarMatch ? avatarMatch[1].replace(/&amp;/g, "&").trim() : "";
      const repoName = repo.includes("/") ? repo.split("/")[1] : repo;

      const repoData = {
        name: repoName,
        stars: cleanNumber(starsMatch ? starsMatch[1] || starsMatch[0] : "0"),
        forks: cleanNumber(forksMatch ? forksMatch[1] || forksMatch[0] : "0"),
        language: langMatch ? langMatch[1].trim() : "N/A",
        issues: 0,
        size: 0,
        description: descMatch ? descMatch[1].trim() : "No description available",
        avatar: cleanAvatar,
      };

      console.log(`Successfully scraped repo data from public fallback!`);
      setCachedData(cacheKey, repoData);
      return res.json(repoData);

    } catch (fallbackError) {
      console.log("Scraping repo fallback error:", fallbackError.message);
    }

    // general fallback
    res.json({
      name: "Error fetching repo",
      stars: 0,
      forks: 0,
      language: "N/A",
      issues: 0,
      size: 0,
      description: "No data",
      avatar: "",
    });
  }
});

// ✅ CONTRIBUTORS API
app.get("/contributors", async (req, res) => {
  const repo = req.query.repo;

  if (!repo) {
    return res.status(400).json({ error: "Repository required" });
  }

  const cacheKey = `contributors:${repo}`;
  const cached = getCachedData(cacheKey);
  if (cached) {
    console.log(`[Cache Hit] Contributors: ${repo}`);
    return res.json(cached);
  }

  try {
    console.log(`Attempting standard REST API query for contributors: ${repo}`);
    const response = await axios.get(
      `https://api.github.com/repos/${repo}/contributors`,
      {
        headers: getGithubHeaders(),
      }
    );

    const contributors = Array.isArray(response.data)
      ? response.data.slice(0, 5).map((c) => ({
          username: c.login,
          contributions: c.contributions,
        }))
      : [];

    setCachedData(cacheKey, { contributors });
    return res.json({ contributors });

  } catch (error) {
    console.log("Contributors REST API error:", error.response?.data || error.message);

    // Fallback: fetch from public JSON graph endpoint if rate-limited
    console.log(`Attempting public page parsing fallback for contributors: ${repo}`);
    try {
      const publicResponse = await axios.get(
        `https://github.com/${repo}/graphs/contributors-data`,
        {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "application/json",
          },
        }
      );

      if (Array.isArray(publicResponse.data)) {
        const rawContributors = publicResponse.data;
        // Sort by total contributions descending
        rawContributors.sort((a, b) => b.total - a.total);
        const contributors = rawContributors.slice(0, 5).map((c) => ({
          username: c.author?.login || "Unknown",
          contributions: c.total || 0,
        }));

        console.log(`Successfully scraped contributors data from graphs-data fallback!`);
        setCachedData(cacheKey, { contributors });
        return res.json({ contributors });
      }
    } catch (fallbackError) {
      console.log("Scraping contributors fallback error:", fallbackError.message);
    }

    // general fallback
    res.json({ contributors: [] });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});