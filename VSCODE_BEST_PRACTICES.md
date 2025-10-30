# VS Code Best Practices for LionNath

## Workspace Configuration

This project includes VS Code workspace configurations optimized for development workflow.

### Essential Files

#### `.vscode/settings.json`

- **Auto-formatting** with Prettier on save
- **Linting** with ESLint
- **TypeScript strict mode** enabled
- **File exclusions** for cleaner workspace

#### `.vscode/extensions.json`

- Recommended extensions for the team
- Install with: `Ctrl+Shift+X` → "Show Recommended Extensions"

#### `.vscode/launch.json`

- Debug configurations
- Supports Node.js debugging
- React Native debugging (when available)

#### `.vscode/mcp.json`

- Model Context Protocol server configurations
- Local MCP servers for development

## Setup Steps

### 1. Install Recommended Extensions

```bash
# VS Code will prompt you, or manually run:
# Settings → Extensions → Recommended
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Install dependencies
npm install

# Verify setup
npm run lint
```

### 3. Enable Formatting

- Auto-format on save is enabled
- Format manually: `Ctrl+Shift+Alt+F` (Windows) or `Shift+Option+F` (Mac)

## Development Workflow

### Code Quality Checks

```bash
# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check

# All checks
npm run check
```

### Debugging

#### Node.js Debugging

1. Open `.vscode/launch.json`
2. Select "Node.js" configuration
3. Press `F5` or Run → Start Debugging

#### React Native Debugging

- Requires React Native Tools extension
- Connect to running app
- Set breakpoints as needed

### Git Integration

- GitLens extension for git history
- View blame for each line: `Ctrl+Shift+Alt+B`
- Compare branches/commits
- Browse repository history

## Recommended VS Code Extensions

### Core

- **GitHub Copilot** - AI-powered code completion
- **GitHub Copilot Chat** - Conversational AI assistance
- **GitLens** - Git superpowers

### Code Quality

- **ESLint** - JavaScript linting
- **Prettier** - Code formatting
- **TypeScript** - Enhanced TS support

### Productivity

- **Thunder Client** - HTTP client for API testing
- **REST Client** - Test API endpoints
- **Markdown All in One** - Markdown editing

### Frontend

- **React Native Tools** - React Native development
- **ES7+ React/Redux/React-Native snippets** - Quick templates

### Utilities

- **Better Comments** - Highlight comments
- **Code Spell Checker** - Spell checking
- **Visual Studio Code Counter** - Code statistics

## Keyboard Shortcuts

### Essential

| Action          | Windows            | Mac                  |
| --------------- | ------------------ | -------------------- |
| Quick Open      | `Ctrl+P`           | `Cmd+P`              |
| Command Palette | `Ctrl+Shift+P`     | `Cmd+Shift+P`        |
| Find            | `Ctrl+F`           | `Cmd+F`              |
| Replace         | `Ctrl+H`           | `Cmd+H`              |
| Format          | `Ctrl+Shift+Alt+F` | `Shift+Option+F`     |
| Lint            | `Ctrl+Shift+Alt+L` | `Shift+Option+L`     |
| Debug           | `F5`               | `F5`                 |
| Terminal        | `Ctrl+``           | `Ctrl+``             |
| Multi-cursor    | `Ctrl+Alt+Up/Down` | `Cmd+Option+Up/Down` |

### Git (GitLens)

| Action            | Shortcut           |
| ----------------- | ------------------ |
| Show Blame        | `Ctrl+Shift+Alt+B` |
| Show File History | `Ctrl+Shift+Alt+H` |
| Toggle Git Graph  | `Ctrl+Shift+Alt+G` |

## Project Structure Overview

```
LionNath/
├── .vscode/                    # VS Code workspace config
│   ├── settings.json          # Editor settings
│   ├── extensions.json        # Recommended extensions
│   ├── launch.json           # Debug configurations
│   └── mcp.json              # MCP server configs
├── .github/
│   └── workflows/
│       └── copilot-setup-steps.yml  # Copilot setup workflow
├── src/
│   ├── components/           # React components
│   ├── screens/              # Screen components
│   ├── services/             # API & external services
│   ├── hooks/                # Custom React hooks
│   ├── config/               # Configuration
│   ├── theme/                # Theme & styling
│   └── utils/                # Utility functions
├── docs/                      # Documentation
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
└── babel.config.js           # Babel config
```

## Team Guidelines

### Code Review Checklist

- [ ] Code formatted with Prettier
- [ ] Passes ESLint checks
- [ ] TypeScript strict mode compliance
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No hardcoded secrets

### Commit Guidelines

```bash
# Use conventional commits
git commit -m "feat: add new feature"
git commit -m "fix: resolve issue"
git commit -m "docs: update documentation"
git commit -m "refactor: improve code structure"
```

### Branch Naming

```
feature/short-description
fix/issue-number
docs/update-type
refactor/component-name
```

## Troubleshooting

### ESLint Not Working

```bash
# Reinstall ESLint
npm install --save-dev eslint

# Reload VS Code
Ctrl+Shift+P → Developer: Reload Window
```

### Prettier Conflicts

```bash
# Ensure .prettierrc exists and is correct
npm run format

# Check if ESLint and Prettier work together
npm run lint
```

### TypeScript Errors

```bash
# Verify tsconfig.json
npm run type-check

# Update TS version
npm install --save-dev typescript@latest
```

### Performance Issues

1. Disable unused extensions
2. Reduce file watching exclusions
3. Increase memory: Set `files.watcherExclude`
4. Clear cache: Delete `.vscode/.cache`

## Additional Resources

- [VS Code Docs](https://code.visualstudio.com/docs)
- [VS Code Settings](https://code.visualstudio.com/docs/getstarted/settings)
- [VS Code Extensions](https://marketplace.visualstudio.com/VSCode)
- [Keyboard Shortcuts](https://code.visualstudio.com/docs/getstarted/keyboard-shortcuts)
- [Debugging Guide](https://code.visualstudio.com/docs/editor/debugging)

---

**Last Updated:** October 30, 2025  
**Project:** LionNath
