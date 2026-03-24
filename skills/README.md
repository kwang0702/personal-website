# Skills

Curated collection of Claude Code skills for building the personal website. Each skill folder contains a `SKILL.md` with frontmatter (`name`, `description`) that Claude Code uses to decide when to invoke it.

## Available Skills

### [agent-skills/](agent-skills/)
Meta-collection of individual skills for React/Next.js development and deployment:
- **react-best-practices** — 64 performance optimization rules across 8 categories (async, bundle, server, client, rerender, rendering, JS, advanced)
- **composition-patterns** — React composition patterns to eliminate boolean prop proliferation (compound components, polymorphic APIs, React 19 patterns)
- **deploy-to-vercel** — Vercel deployment automation (git-push and CLI methods)
- **web-design-guidelines** — 100+ UI/UX best practices for design review
- **react-native-skills** — React Native/Expo best practices (performance, animation, UI, state)
- **vercel-cli-with-tokens** — Token-based Vercel CLI deployment and project management

### [design-for-ai/](design-for-ai/)
Visual design principles from *Design for Hackers* by David Kadavy. Two modes:
- **CHECKER** — Audit an existing design against 7 categories (purpose, typography, proportions, composition, hierarchy, color, SEO)
- **APPLIER** — Phased build from wireframe to final polish (6 phases)

Includes comprehensive references on typography, color theory, proportions, composition, motion, interaction, and responsive design.

### [frontend-design/](frontend-design/)
Creative frontend implementation skill. Generates distinctive, production-grade interfaces that avoid generic AI aesthetics. Focuses on bold typography, intentional color, motion, spatial composition, and visual depth.

### [ui-ux-pro-max/](ui-ux-pro-max/)
Comprehensive UI/UX intelligence system with:
- 161 reasoning rules (industry-specific: SaaS, fintech, healthcare, e-commerce, etc.)
- 67 UI styles database
- 57 typography pairings
- 25 chart types
- 10+ framework stacks (React, Next.js, Vue, Svelte, SwiftUI, React Native, Flutter, Tailwind, shadcn/ui)
- CLI tool and Python search engine for querying the knowledge base

### [web-artifacts-builder/](web-artifacts-builder/)
Tooling to create and bundle React/Tailwind/shadcn/ui artifacts into single-file HTML outputs. Includes `init-artifact.sh` and `bundle-artifact.sh` scripts.
