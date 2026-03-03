# Kids Learning Hub — MCP Server

This directory contains an [MCP (Model Context Protocol)](https://modelcontextprotocol.io) server that exposes Kids Learning Hub domain knowledge as callable **skills** for GitHub Copilot agents and other MCP-compatible clients.

## Available Skills (Tools)

| Tool | Input | Description |
|---|---|---|
| `get_math_problem` | `type?` (`"basic"` \| `"measurement"` \| `"time"`) | Generate a random math problem and its correct answer |
| `get_reading_story` | `index?` (number) | Retrieve a reading story with comprehension questions |
| `get_activity_list` | — | List all learning activities (id, name, description, path) |

## Setup

```bash
cd MCP
npm install
```

## Running

```bash
npm start
# or
node server.js
```

The server communicates over **stdio** (standard input/output), which is the MCP transport used by GitHub Copilot and VS Code extensions.

## Registering with GitHub Copilot

Add the following to your user or workspace MCP settings (e.g. `.vscode/mcp.json`):

```json
{
  "servers": {
    "kids-learning-hub": {
      "type": "stdio",
      "command": "node",
      "args": ["${workspaceFolder}/MCP/server.js"]
    }
  }
}
```

Once registered, GitHub Copilot agent mode will automatically discover the tools and make them available as skills you can invoke with `#get_math_problem`, `#get_reading_story`, or `#get_activity_list` during a conversation.

## Standard Practice for Skills in GHCP

The recommended way to use skills with GitHub Copilot agents is:

1. **Define skills as MCP tools** — each tool has a clear name, description, and typed input schema (using Zod).  
2. **Register the MCP server** — add the server to your MCP configuration so Copilot can discover it automatically.  
3. **Add custom instructions** — create `.github/copilot-instructions.md` to give the agent project-level context and point it to the available skills.  
4. **Invoke skills in agent mode** — in GitHub Copilot Chat, switch to *Agent* mode and reference tools by name (e.g. "Use `#get_math_problem` to generate a basic arithmetic question").
