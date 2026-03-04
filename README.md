# GitHub Profile Analyzer

A React-based web application that visualizes GitHub user profiles, repository activity, commit history, and language statistics. Supports side-by-side user comparison.

## Features

- **Profile Overview** — avatar, bio, location, website, followers/following
- **Repository Browser** — scrollable repo list with language tags, descriptions, and detailed view on click
- **Commit Heatmap** — visualizes commit activity over the last 3 months, 6 months, or 1 year
- **Language Distribution** — donut chart with percentage breakdown across all repos
- **Activity Stats** — total commits, repos, stars, forks, current streak, longest streak
- **User Comparison** — side-by-side comparison of two profiles with color-coded stats
- **In-memory Caching** — repeated searches skip API calls for 15 minutes
- **Refresh Button** — force re-fetch and cache invalidation for the current user

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS v4
- shadcn/ui (chart components)
- Recharts
- @uiw/react-heat-map

Check out the demo [here](https://github-profile-analyzer-ashy.vercel.app/)!

## Getting Started

### Prerequisites

- Node.js 18+
- A GitHub Personal Access Token with `public_repo` scope

### Installation
```bash
git clone https://github.com/your-username/github-profile-analyzer.git
cd github-profile-analyzer
npm install
```

### Environment Setup

Create a `.env` file in the project root:
```
VITE_GITHUB_TOKEN=your_token_here
```

> ⚠️ Never commit your `.env` file. It is already included in `.gitignore`.

### Running Locally
```bash
npm run dev
```

## Notes

- The GitHub API has a rate limit of **60 requests/hour** unauthenticated and **5,000/hour** with a token
- Commit data is capped at 50 commits per repo to stay within rate limits
- The GitHub token is embedded in the client bundle — for a production app, move API calls to a backend to keep the token server-side

## License

MIT
