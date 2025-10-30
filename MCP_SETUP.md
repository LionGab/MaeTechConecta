# MCP Setup Guide for LionNath

## Overview

This guide explains how to set up Model Context Protocol (MCP) servers with GitHub Copilot Coding Agent in the LionNath repository.

## What is MCP?

Model Context Protocol (MCP) is a standard protocol that enables Large Language Models (like GitHub Copilot) to safely interact with external tools and data sources in a controlled manner.

## Repository Configuration

### 1. Environment Setup

To enable MCP servers for Copilot in this repository:

#### Step 1: Create a Copilot Environment

1. Go to repository **Settings** → **Environments**
2. Click **New environment**
3. Name it `copilot`
4. Click **Configure environment**

#### Step 2: Add Environment Secrets

Create secrets with the prefix `COPILOT_MCP_`:

- `COPILOT_MCP_GITHUB_PERSONAL_ACCESS_TOKEN` - For GitHub API access
- `COPILOT_MCP_SENTRY_ACCESS_TOKEN` - For Sentry integration (if using)
- `COPILOT_MCP_API_KEY` - For custom API integrations

**Important:** Only secrets prefixed with `COPILOT_MCP_` are available to MCP configurations.

### 2. MCP Configuration in GitHub

Navigate to **Settings** → **Code & automation** → **Copilot** → **Coding agent**

Add your MCP servers in the **MCP configuration** section:

```json
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/readonly",
      "tools": ["*"]
    }
  }
}
```

### 3. Local MCP Configuration (VS Code)

This repository includes `.vscode/mcp.json` for local development. Configure MCP servers here for development before deploying to GitHub.

## Recommended MCP Servers

### 1. GitHub MCP Server

- **Type:** HTTP (Remote)
- **Access:** Read-only repository data
- **Tools:** Repository, issues, pull requests, discussions
- **Configuration:**

```json
{
  "github": {
    "type": "http",
    "url": "https://api.githubcopilot.com/mcp/readonly",
    "tools": ["*"]
  }
}
```

### 2. Sentry MCP Server (Error Tracking)

- **Type:** Local
- **Access:** Exception tracking and analysis
- **Setup:**

```bash
npm install @sentry/mcp-server
```

- **Configuration:**

```json
{
  "sentry": {
    "type": "local",
    "command": "npx",
    "args": ["@sentry/mcp-server@latest", "--host=$SENTRY_HOST"],
    "tools": ["get_issue_details", "get_issue_summary"],
    "env": {
      "SENTRY_HOST": "https://your-sentry-instance.sentry.io",
      "SENTRY_ACCESS_TOKEN": "COPILOT_MCP_SENTRY_ACCESS_TOKEN"
    }
  }
}
```

### 3. Filesystem MCP Server

- **Type:** Local
- **Access:** Safe file system operations
- **Tools:** Read files, list directories, search files
- **Configuration:**

```json
{
  "filesystem": {
    "type": "local",
    "command": "node",
    "args": ["mcp-server-filesystem.js"],
    "tools": ["read_file", "list_directory", "search_files"]
  }
}
```

## Best Practices

### Security

- ✅ Always use read-only tools when possible
- ✅ Use secrets with `COPILOT_MCP_` prefix for sensitive data
- ✅ Limit tool access to what Copilot needs
- ✅ Regularly rotate access tokens
- ❌ Never commit secrets to version control

### Performance

- Use specific tools instead of `"*"` when possible
- Enable only necessary MCP servers
- Cache data when feasible
- Monitor MCP server logs for bottlenecks

### Reliability

- Test MCP configurations locally before deploying
- Have fallback manual processes
- Monitor Copilot session logs
- Keep MCP servers updated

## Testing Your MCP Setup

### 1. Local Testing (VS Code)

```bash
# Ensure .vscode/mcp.json is properly configured
# Reload VS Code: Ctrl+Shift+P → Developer: Reload Window
```

### 2. Validation on GitHub

1. Create an issue in the repository
2. Assign it to Copilot (add a comment like `@copilot-preview build this`)
3. Copilot will:
   - React with 👀 emoji
   - Create a pull request
4. View session logs:
   - Click the PR → "Copilot started work"
   - Click "View session"
   - Check "Start MCP Servers" step
   - Verify tools are listed

## Troubleshooting

### MCP Server Not Starting

```bash
# Check if Node.js is available
node --version

# Install dependencies
npm install

# Verify MCP server command
npm run mcp:validate
```

### Authentication Issues

- Verify `COPILOT_MCP_*` secrets are set correctly
- Check token expiration
- Ensure token has required scopes

### Tool Not Available

1. Verify tool name is correct
2. Check MCP server documentation
3. Ensure tool is whitelisted in `"tools"` array

## Configuration Files

### .github/workflows/copilot-setup-steps.yml

Workflow that runs setup steps before Copilot processes tasks. Use this for:

- Installing dependencies
- Setting up databases
- Compiling code
- Running linters/formatters

### .vscode/settings.json

Workspace settings for all developers:

- Formatting rules (Prettier)
- Linting configuration (ESLint)
- TypeScript settings
- File exclusions

### .vscode/extensions.json

Recommended extensions:

- GitHub Copilot & Chat
- ESLint & Prettier
- GitLens
- TypeScript

### .vscode/launch.json

Debug configurations for local development

### .vscode/mcp.json

Local MCP server configurations (for development)

## Environment Variables

Use environment variables for configuration:

```bash
# .env.example
COPILOT_MCP_GITHUB_TOKEN=ghp_xxxxxxxxxxxx
COPILOT_MCP_SENTRY_HOST=https://sentry.example.com
COPILOT_MCP_SENTRY_TOKEN=xxxxxxxxxxxxx
```

Never commit actual tokens - only `.env.example` template.

## Resources

- [GitHub Copilot Docs](https://docs.github.com/en/copilot)
- [MCP Specification](https://modelcontextprotocol.io)
- [MCP GitHub Server](https://docs.github.com/en/copilot/customizing-copilot/using-model-context-protocol/using-the-github-mcp-server)
- [Custom Agents Configuration](https://docs.github.com/en/enterprise-cloud@latest/copilot/reference/custom-agents-configuration#mcp-server-configuration-details)

## Next Steps

1. ✅ Create `copilot` environment in GitHub Settings
2. ✅ Add required secrets
3. ✅ Configure `.github/workflows/copilot-setup-steps.yml`
4. ✅ Update MCP servers in GitHub Copilot settings
5. ✅ Test with an issue assignment
6. ✅ Review session logs for validation

---

**Last Updated:** October 30, 2025  
**Maintainer:** LionNath Team
