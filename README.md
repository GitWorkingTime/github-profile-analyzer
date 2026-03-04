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

## GitHub Pages Deployment

This app uses a GitHub token stored in `.env` which is **never committed**. For deployment, you will need to provide the token via GitHub Actions secrets.

See the [Deployment](#deployment) section below.

## Deployment

### 1. Add your token as a GitHub secret

Go to your repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

- Name: `VITE_GITHUB_TOKEN`
- Value: your GitHub personal access token

### 2. Install the GitHub Pages plugin for Vite
```bash
npm install --save-dev gh-pages
```

### 3. Update `vite.config.ts`

Add the `base` option so assets resolve correctly on GitHub Pages:
```ts
export default defineConfig({
  base: '/github-profile-analyzer/',
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

Replace `github-profile-analyzer` with your actual repository name.

### 4. Add deploy script to `package.json`
```json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}
```

### 5. Create `.github/workflows/deploy.yml`
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build
        env:
          VITE_GITHUB_TOKEN: ${{ secrets.VITE_GITHUB_TOKEN }}

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 6. Enable GitHub Pages

Go to your repository → **Settings** → **Pages** → set source to **Deploy from a branch** → select `gh-pages` branch.

Your app will be live at:
```
https://your-username.github.io/github-profile-analyzer/
```

## Notes

- The GitHub API has a rate limit of **60 requests/hour** unauthenticated and **5,000/hour** with a token
- Commit data is capped at 50 commits per repo to stay within rate limits
- The GitHub token is embedded in the client bundle — for a production app, move API calls to a backend to keep the token server-side

## License

MIT