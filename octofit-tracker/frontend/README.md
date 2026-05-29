# Octofit Tracker Frontend

React 19 presentation tier powered by Vite.

## Required environment variable

Define `VITE_CODESPACE_NAME` so the app can call backend endpoints through the public Codespaces URL.

Example `.env.local`:

```bash
VITE_CODESPACE_NAME=your-codespace-name
```

With `VITE_CODESPACE_NAME` set, frontend components call endpoints in this format:

```text
https://${VITE_CODESPACE_NAME}-8000.app.github.dev/api/[component]/
```

Examples:

- `https://${VITE_CODESPACE_NAME}-8000.app.github.dev/api/activities/`
- `https://${VITE_CODESPACE_NAME}-8000.app.github.dev/api/users/`

## Safe fallback behavior

If `VITE_CODESPACE_NAME` is missing, the app falls back to relative API URLs such as `/api/activities/`.
This prevents broken URLs like `https://undefined-8000.app.github.dev/...`.
