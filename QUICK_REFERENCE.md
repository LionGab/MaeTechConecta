# LionNath Quick Reference - VS Code & MCP Setup

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Install VS Code recommended extensions
# Ctrl+Shift+X → Show Recommended Extensions → Install All

# 3. Copy environment template
cp .env.example .env

# 4. Verify setup
npm run lint && npm run build
```

## 📋 Essential Commands

```bash
# Code Quality
npm run lint              # Check code issues
npm run format            # Auto-format code
npm run type-check        # TypeScript validation

# Build & Run
npm run build             # Build project
npm run dev               # Start development server
npm run start             # Start production server

# Testing
npm run test              # Run tests
npm run test:watch       # Run tests in watch mode
```

## 🎮 Keyboard Shortcuts

| Action          | Shortcut           |
| --------------- | ------------------ |
| Quick Open File | `Ctrl+P`           |
| Command Palette | `Ctrl+Shift+P`     |
| Format Document | `Ctrl+Shift+Alt+F` |
| Find in File    | `Ctrl+F`           |
| Find & Replace  | `Ctrl+H`           |
| Terminal        | `Ctrl+``           |
| Debug/Run       | `F5`               |
| Git Blame       | `Ctrl+Shift+Alt+B` |

## 📁 Project Structure

```
src/
├── components/      # React components
├── screens/         # App screens
├── services/        # API & services
├── hooks/           # Custom hooks
├── config/          # Configuration
├── theme/           # Theme & styling
└── utils/           # Utilities

.vscode/            # VS Code settings
.github/            # GitHub workflows
docs/               # Documentation
```

## 🔐 Environment Variables

**Never commit `.env` files!** Use `.env.example` as template.

```bash
# Required for Copilot MCP
COPILOT_MCP_GITHUB_PERSONAL_ACCESS_TOKEN=ghp_xxxx
```

## 🚀 VS Code Extensions

**Recommended (auto-install):**

- GitHub Copilot
- GitHub Copilot Chat
- ESLint
- Prettier
- TypeScript Tools
- GitLens

**Install from:** `Extensions → Recommended`

## 🔧 MCP Configuration

### Local (VS Code)

File: `.vscode/mcp.json`

- GitHub MCP (read-only)
- Filesystem operations

### GitHub (Copilot)

1. Go to Settings → Environments
2. Create `copilot` environment
3. Add secrets with `COPILOT_MCP_` prefix
4. Configure in Copilot settings

## ⚙️ VS Code Settings

Key settings in `.vscode/settings.json`:

- ✅ Auto-format on save (Prettier)
- ✅ Lint on save (ESLint)
- ✅ TypeScript strict mode
- ✅ Optimized file watching

## 🧪 Testing MCP Setup

```bash
# 1. Verify local config
cat .vscode/mcp.json

# 2. Test GitHub MCP
# Create issue → Assign to Copilot → Check logs

# 3. View session logs
# PR → "Copilot started work" → "View session"
```

## 🐛 Common Issues

### ESLint/Prettier Not Working

```bash
npm install
Ctrl+Shift+P → "Developer: Reload Window"
```

### TypeScript Errors

```bash
npm run type-check
npm install --save-dev typescript@latest
```

### MCP Server Not Found

- Check `COPILOT_MCP_*` secrets are set
- Verify workflow runs successfully
- Check GitHub Actions logs

## 📚 Full Documentation

- `CONFIGURATION_SUMMARY.md` - Complete setup overview
- `MCP_SETUP.md` - Detailed MCP guide
- `VSCODE_BEST_PRACTICES.md` - VS Code tips & tricks
- `CONTRIBUTING.md` - Contribution guidelines

## 🎯 Copilot Workflow

1. **Local Development:** Use Copilot Chat (`Ctrl+Shift+I`)
2. **AI Completions:** Tab through suggestions
3. **GitHub Issues:** Assign to Copilot for coding tasks
4. **PR Review:** Ask Copilot to review code
5. **MCP Access:** Copilot auto-uses configured tools

## 🔗 Useful Links

- [GitHub Copilot](https://github.com/features/copilot)
- [VS Code Docs](https://code.visualstudio.com/docs)
- [MCP Protocol](https://modelcontextprotocol.io)
- [ESLint Rules](https://eslint.org/docs/rules)
- [Prettier Options](https://prettier.io/docs/options)

## ✅ Setup Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] VS Code extensions installed
- [ ] `.env` configured (copy from `.env.example`)
- [ ] Code lints without errors (`npm run lint`)
- [ ] Project builds successfully (`npm run build`)
- [ ] Git configured (name, email)
- [ ] Read `CONTRIBUTING.md`

## 🆘 Need Help?

1. Check documentation files
2. Run `npm run check` for diagnostics
3. Review GitHub Actions logs
4. Check VS Code Problems panel (`Ctrl+Shift+M`)

---

**Quick Setup Time:** ~5 minutes  
**Last Updated:** October 30, 2025
