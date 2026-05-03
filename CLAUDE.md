# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BDT Playground — a personal monorepo for experimentation. AstroJS frontend, WordPress CMS (external, on Hetzner), GraphQL API, AWS CDK infrastructure, Netlify Lambda functions. Deployed at playground.breakfastdinnertea.co.uk.

## Commands

```bash
pnpm install              # Install dependencies (use --frozen-lockfile in CI)
pnpm test                 # Run all tests (root Jest + bdt-components + bdt-cdk)
pnpm lint                 # ESLint across .js/.jsx/.ts/.tsx
pnpm test:coverage        # Jest with coverage
pnpm test:integration     # Integration tests only
pnpm deploy-all           # Build Astro site
pnpm build:lambda         # Build Netlify Lambda functions
pnpm compile              # TypeScript compilation check

# Run tests for a single package
pnpm --filter @tdee/bdt-components test
pnpm --filter @tdee/bdt-cdk test

# Run a single test file with root Jest
pnpm jest -- packages/film-fetcher/src/getFilms.test.ts

# CDK (aws-cdk CLI is a devDependency of bdt-cdk, use pnpm exec to invoke it)
pnpm --filter @tdee/bdt-cdk exec cdk synth
pnpm --filter @tdee/bdt-cdk exec cdk deploy
```

Note: the root Jest config excludes `bdt-components` and `bdt-cdk` (they have their own test setups), so `pnpm test` runs root Jest first, then those two packages separately.

## Architecture

**Monorepo** managed with pnpm workspaces (`pnpm@10.27.0`, Node 22.14.0). Packages live in `packages/`.

**Core packages:**
- `bdt-astro` — Main website (AstroJS 5, React 19, Nanostores)
- `bdt-components` — Shared React component library (Nivo, Recharts)
- `bdt-cdk` — AWS CDK infrastructure (Lambda, SQS, SSM)
- `bdt-customisations` — WordPress PHP plugin
- `data-wranglers` — Data transformation utilities
- `types` — Shared TypeScript types

**Fetcher packages** (`*-fetcher`) — Each ingests data from an external source (Letterboxd, WordPress, podcasts, weight tracking, etc.) using GraphQL or HTTP.

**Other:** `netlify-functions` (Lambda handlers), `overcast` (podcast utilities)

## Conventions

**British English is required** in all documentation and user-facing strings: `customisation` not customization, `centred` not centered, `organisation` not organization.

**TDD** — Follow the Red-Green-Mutate-Kill Mutants-Refactor cycle. Tests use Jest with `ts-jest` preset. HTTP mocking uses `nock`. Test files: `*.test.ts`, `*.spec.ts`, `*.integration.ts`. After tests pass, apply the `mutation-testing` skill to verify test quality on changed source files.

**TypeScript** — Strict mode enabled. Base config in `tsconfig.base.json` (target ES5, React JSX).

## Claude Code Setup

**Skills** — Project-level skills live in `.claude/skills/` and are auto-discovered. The `mutation-testing` skill (adapted from [Paul Hammond's dotfiles](https://github.com/citypaul/.dotfiles)) guides the mutation testing step of the TDD cycle.

**Superpowers** — The [obra/superpowers](https://github.com/obra/superpowers) plugin is enabled via `.claude/settings.json` and provides structured workflow skills (TDD enforcement, task planning, git worktrees, etc.).

**Hooks** — `.claude/settings.json` configures two automatic hooks:
- After editing a `.ts`/`.tsx`/`.js`/`.jsx` file: ESLint auto-fix runs on the changed file.
- After a successful test run: a reminder fires to apply the `mutation-testing` skill to any changed source files.

## CI/CD

GitHub Actions runs `pnpm test` on PRs to master. CodeQL analysis runs weekly and on pushes to master. Deployment is via Netlify (config in `netlify.toml`). WordPress is managed externally via Ansible.
