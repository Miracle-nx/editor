# Feishu-like Rich Text Editor Starter

This workspace is a practical starter for building a Feishu-like rich text editor with Vite, React, TypeScript, and Tiptap.

## Current status

- Vite React project scaffolded successfully
- Tiptap rich text editor demo wired into the homepage
- Collaboration-ready dependencies installed for future Yjs and Hocuspocus integration
- Technical plan documented in `docs/technical-plan.md`
- Consolidated delivery document added in `docs/project-plan-and-execution.md`

## Stack

- Vite 6
- React 19
- TypeScript
- Tailwind CSS v4
- Tiptap 3
- Yjs and Hocuspocus provider
- Zustand, Radix UI, Floating UI

## Run locally

Use Node 20 or newer. This machine currently needs the Node 20 binary managed by `nvm` because Node 12 cannot build the selected stack.

```bash
npm run dev
```

Then open `http://localhost:3000`.

For LAN testing on this machine, you can also run:

```bash
npm run dev -- --host 0.0.0.0 --port 3001
```

Then open `http://192.168.0.4:3001/` from another device on the same network.

## Next implementation steps

1. Add slash command, mention suggestions, and floating toolbar.
2. Wire Yjs document state plus collaboration cursors.
3. Add comments, persistence, document permissions, and version history.
4. Add import/export and media upload pipeline.

## Notes

- Keep editor initialization inside client components.
- Treat collaboration, comments, and AI as extension layers on top of the core editor schema.
- If you continue on this project, the technical direction is documented in `docs/technical-plan.md`.
- Project plan and execution summary are documented in `docs/project-plan-and-execution.md`.
