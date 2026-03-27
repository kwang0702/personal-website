import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const GITHUB_USERNAME = "kwang0702";

export type GitHubRepo = {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
  topics: string[];
  pushed_at: string;
  created_at: string;
};

export async function GET() {
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&per_page=50&type=owner`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          ...(process.env.GITHUB_TOKEN
            ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
            : {}),
        },
        next: { revalidate: 300 }, // cache 5 min
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "GitHub API error" }, { status: 502 });
    }

    const repos: GitHubRepo[] = await res.json();

    // Filter: only non-fork, public repos (owner type already filtered by API)
    const personal = repos.filter((r) => !r.fork);

    return NextResponse.json({ repos: personal });
  } catch {
    return NextResponse.json({ error: "Failed to fetch repos" }, { status: 500 });
  }
}
