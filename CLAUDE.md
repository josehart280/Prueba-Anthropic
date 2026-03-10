# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev         # Dev server (http://localhost:3000)
npm run build       # Production build
npm run start       # Production server
npm run lint        # Run ESLint
npm run test        # Run tests (vitest)
npm run test -- --run file.test.ts  # Single test file
npm run setup       # Install deps, Prisma generate + migrate
npm run db:reset    # Reset database
```

## Architecture

- **Next.js 15** App Router + React 19
- **Prisma + SQLite** (`prisma/dev.db`)
- **Vercel AI SDK** with Anthropic Claude Haiku
- **Virtual file system** - no files written to disk
- **@babel/standalone** for live preview transpilation
- **Tailwind CSS v4**

### Key Directories

- `src/app/` - Pages and API routes
- `src/components/` - UI components (auth, chat, editor, preview, ui)
- `src/lib/` - Core: provider, file-system, prompts, tools
- `src/actions/` - Server actions for DB operations
- `prisma/` - Schema and migrations

### Database

Schema defined in `prisma/schema.prisma`:
- **User**: id, email, password, projects
- **Project**: id, name, userId, messages (chat history), data (virtual files)

### AI Tools

The AI uses two tools for file operations (`src/lib/tools/`):
- **str_replace_editor**: Create files, replace content using string matching
- **file_manager**: Directory operations, file listing

### Mock Provider

When `ANTHROPIC_API_KEY` is not set, `MockLanguageModel` (`src/lib/provider.ts`) returns static component code based on keywords (form/card/counter). Max steps reduced from 40 to 4 for mock mode.

### Environment

Set `ANTHROPIC_API_KEY` in `.env` for AI generation. Without it, static fallback code is returned.
