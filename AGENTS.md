# Blog 2026 - Memory

## Project Overview
- **Repository**: https://github.com/Eclipsetv-max/Blog2026A1.github.io
- **Owner**: Eclipsetv-max
- **Type**: Personal blog with multiple person pages

## Project Structure
```
Blog 2026/
├── .github/workflows/opencode.yml
├── andrea/
├── daniel/
├── doris/
├── Fernando/
├── luana/
├── Rihana/
├── selena/
├── thiago/
├── auth.js
├── chat.js
├── chat-styles.css
├── counter-styles.css
├── index.html
├── login.html
├── scroll-top.js
├── scroll-top.css
├── visit-counter.js
└── ICON.ico
```

## Git Configuration
- **Local branch**: master
- **Remote branch**: main
- **User**: Eclipsetv-max
- **Email**: eclipsetv-max@users.noreply.github.com

## GitHub Integration (OpenCode)
- **Workflow**: `.github/workflows/opencode.yml`
- **Model**: `opencode/mimo-v2.5-free` (free model)
- **Secret**: `OPENCODE_API_KEY`
- **Usage**: Write `/opencode` or `/oc` in issues or PR comments

## Important Notes
- GitHub Pages does NOT support Git LFS - images must be uploaded as normal files
- To sync local changes to GitHub: `git add . && git commit -m "message" && git push`
- To force sync: `git push origin master:main --force`

## Commands Reference
```bash
# Navigate to project
cd "C:\Users\casa\Desktop\Blog 2026"

# Commit and push changes
git add .
git commit -m "description"
git push

# Force push to sync branches
git push origin master:main --force

# Restore deleted files
git revert HEAD --no-edit
git push origin master:main --force
```
