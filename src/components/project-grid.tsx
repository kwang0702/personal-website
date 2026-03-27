"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/language-provider";
import type { GitHubRepo } from "@/app/api/projects/route";

/* ── Language color mapping ── */
const langColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#dea584",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Ruby: "#701516",
  Dart: "#00B4AB",
};

function formatRelativeDate(dateStr: string, locale: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return locale === "zh" ? "今天" : "today";
  if (diffDays === 1) return locale === "zh" ? "昨天" : "yesterday";
  if (diffDays < 7)
    return locale === "zh" ? `${diffDays} 天前` : `${diffDays}d ago`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return locale === "zh" ? `${weeks} 周前` : `${weeks}w ago`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return locale === "zh" ? `${months} 个月前` : `${months}mo ago`;
  }
  const years = Math.floor(diffDays / 365);
  return locale === "zh" ? `${years} 年前` : `${years}y ago`;
}

export default function ProjectGrid() {
  const { t, locale } = useLanguage();
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data) => {
        setRepos(data.repos ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-sm border border-charcoal/5 bg-cream-dark/40 p-6"
          >
            <div className="mb-3 h-5 w-1/3 rounded bg-charcoal/5" />
            <div className="mb-2 h-3 w-full rounded bg-charcoal/5" />
            <div className="h-3 w-2/3 rounded bg-charcoal/5" />
          </div>
        ))}
      </div>
    );
  }

  if (repos.length === 0) {
    return (
      <p className="py-20 text-center text-sm text-warm-gray">
        {t("projects.no_projects")}
      </p>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {repos.map((repo) => (
        <article
          key={repo.name}
          className="group relative flex flex-col justify-between rounded-sm border border-charcoal/6 bg-cream-dark/30 p-6 transition-all duration-300 hover:border-purple/20 hover:bg-cream-dark/60"
        >
          {/* Top row: name + language */}
          <div>
            <div className="mb-3 flex items-center gap-3">
              <h3 className="font-serif text-lg font-medium tracking-tight text-charcoal transition-colors group-hover:text-purple">
                {repo.name}
              </h3>
              {repo.language && (
                <span className="flex items-center gap-1.5 text-xs text-warm-gray">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor: langColors[repo.language] ?? "#8A8279",
                    }}
                  />
                  {repo.language}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed text-charcoal-light">
              {repo.description || "\u2014"}
            </p>

            {/* Topics */}
            {repo.topics.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {repo.topics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-sm bg-purple/8 px-2 py-0.5 text-[11px] font-medium text-purple/70"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Bottom row: meta + links */}
          <div className="mt-5 flex items-center justify-between border-t border-charcoal/5 pt-4">
            <div className="flex items-center gap-4 text-xs text-warm-gray">
              {repo.stargazers_count > 0 && (
                <span className="flex items-center gap-1">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                  {repo.stargazers_count}
                </span>
              )}
              <span>{formatRelativeDate(repo.pushed_at, locale)}</span>
            </div>

            <div className="flex items-center gap-3">
              {repo.homepage && (
                <a
                  href={repo.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-medium text-purple transition-colors hover:text-purple-light"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                  {t("projects.view_live")}
                </a>
              )}
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs font-medium text-charcoal-light transition-colors hover:text-purple"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                {t("projects.view_source")}
              </a>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
