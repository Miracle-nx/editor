# Feishu-like Rich Text Editor Technical Plan

## Recommended stack

- Framework: Vite + React + TypeScript
- Editor core: Tiptap 3
- Collaboration engine: Yjs
- Collaboration transport: Hocuspocus provider on the client, Hocuspocus server or Liveblocks on the backend
- UI foundation: Tailwind CSS v4 with Radix UI and Floating UI for menus, popovers, and tooltips
- State: Zustand for editor-adjacent client state

## Why this stack

Tiptap gives a product-level abstraction on top of ProseMirror without locking the team into a rigid UI. That matters for a Feishu-like product because the hard part is not bold and italic, it is the combination of block editing, inline formatting, slash commands, comments, tables, embeds, mentions, and collaboration.

Yjs is the right collaboration layer because it is already the default choice across the rich text ecosystem for CRDT-based editing, supports offline-first flows, and works well with both self-hosted and managed transports.

## Suggested roadmap

### Phase 1: single-player editor MVP

- Basic document schema: paragraph, headings, bullet list, ordered list, checklist, blockquote, code block
- Inline marks: bold, italic, underline, highlight, link
- Table support and image/file placeholders
- Toolbar, focus states, responsive layout, and clean paste handling

### Phase 2: Feishu-like authoring interactions

- Slash command menu
- Mention picker for users and docs
- Floating selection toolbar
- Block handles and drag reorder
- Outline navigation and heading anchors

### Phase 3: collaboration

- Shared Yjs document model
- Awareness state for cursors and presence
- Room-based document sessions
- Backend auth and access control
- Conflict-safe persistence and reconnect handling

### Phase 4: business features

- Comments and suggestion mode
- Version history and restore points
- Import/export: Markdown, HTML, DOCX if needed
- Attachments and media pipeline
- AI actions: rewrite, summarize, expand, translate

## Package guidance

### Core packages already installed

- `@tiptap/react`
- `@tiptap/starter-kit`
- `@tiptap/extension-placeholder`
- `@tiptap/extension-link`
- `@tiptap/extension-underline`
- `@tiptap/extension-text-align`
- `@tiptap/extension-task-list`
- `@tiptap/extension-task-item`
- `@tiptap/extension-table`
- `@tiptap/extension-highlight`
- `@tiptap/extension-collaboration`
- `@tiptap/extension-collaboration-cursor`
- `yjs`
- `@hocuspocus/provider`

### Packages to introduce when the corresponding feature starts

- Slash menu and mentions: `@tiptap/suggestion`, `@floating-ui/react`, `fuse.js`
- Upload pipeline: object storage SDK, `react-dropzone`
- Comments and presence UI: Radix primitives + custom business components
- Content transforms: `sanitize-html`, `turndown`, `markdown-it`

## Architecture notes

- Keep the editor instance in a dedicated client component. Do not initialize Tiptap in a server component.
- Separate document schema, UI controls, collaboration glue, and persistence adapters into different modules early.
- Treat comments, mentions, slash commands, and AI as extension layers, not part of the base editor component.
- Design room auth before collaboration rollout; Feishu-like editors fail at the product level when permission checks are bolted on late.

## Current scaffold status

- Vite app created successfully
- Dependency foundation installed for Tiptap and collaboration
- Rich text editor demo page added
- Technical plan documented for follow-up implementation