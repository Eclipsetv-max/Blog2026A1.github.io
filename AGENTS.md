# Blog 2026 - Memory

## Project Overview
- **Repository**: https://github.com/Eclipsetv-max/Blog2026A1.github.io
- **Owner**: Eclipsetv-max
- **Type**: Personal blog with multiple person pages
- **Last updated**: July 15, 2026

## Project Structure
```
Blog 2026/
├── .github/workflows/opencode.yml
├── andrea/
├── daniel/
├── danna/
├── doris/
├── diego/
├── Fernando/
├── luana/
├── Rihana/
├── selena/
├── thiago/
├── auth.js
├── chat.js
├── chat-styles.css
├── counter-styles.css
├── index.html (main page with all cards)
├── login.html
├── scroll-top.js
├── scroll-top.css
├── visit-counter.js
└── ICON.ico
```

## Person Profiles
| Name | Folder | Color Accent | Images |
|------|--------|--------------|--------|
| Andrea | andrea/ | Morado #9b59b6 | Andrea1.jpeg, Andrea2.jpeg, Andrea3.jpeg |
| Daniel | daniel/ | Amarillo #f1c40f | Daniel1.jpeg, Daniel2.jpeg |
| Danna | danna/ | Lila #9b59b6 | Danna1.jfif, Danna2.jfif, Danna3.jfif, Danna4.jfif |
| Diego | diego/ | — | — |
| Doris | doris/ | Rosa #e91e90 | Doris1.jfif |
| Fernando | Fernando/ | Rojo #c0392b | Fernando1.jfif |
| Luana | luana/ | Celeste #5dade2 | Luana1.jfif |
| Rihana | Rihana/ | Azul marino #1a3a5c | Rihana1.jpeg |
| Selena | selena/ | Verde limon #a8e063 | Selena2.jfif |
| Thiago | thiago/ | Naranja #e67e22 | Thiago1.jpeg |

## Danna Profile Details (COMPLETE)
- **Created**: July 15, 2026
- **Color**: Lila #9b59b6 (also uses Azul Marino #1a3a5c and Celeste #85c1e9)
- **Hero image**: Danna4.jfif
- **Bio image**: Danna2.jfif
- **Class**: 1S 'B'
- **Birthday**: 17 de diciembre del 2013
- **Personality**: Alegre, creativa y empática
- **Position in class**: No sabo xdd
- **Bio**: "Hodaaa mi nombre es Danna. Soy una persona tranquila, responsable y alegre. Me gusta interactuar con los demás y siempre trato de dar lo mejor de mí en todo lo que hago. Me agrada escuchar música, jugar voley, cocinar, leer y pintar. Al inicio puedo parecer tímida o nerviosa pero cuando agarro confianza soy más libre y me gusta hacer reír a las personas. Si necesitan ser escuchados me escriben y pasamos un rato juntos :) xdd"
- **Hobbies**: Jugar voley, cocinar, leer, escuchar música, dormir, pintar
- **Pasatiempos**: Jugar voley con amigos de congregación, conversar con amigos del colegio, dormir, ordenar, pintar
- **Sueños y metas**: Bautizarme, ir a un concierto de Taylor Swift, mejorar en voley, visitar lugares nuevos, apoyar en lengua de señas, tener experiencia en el arte
- **Colors in profile**: Lila, Azul Marino, Celeste

## How to Update a Profile
1. Edit `person/index.html` - update content, colors, images
2. Edit `index.html` - update card color class and description
3. Update `AGENTS.md` with new details
4. Run: `git add . && git commit -m "description" && git push`

## Color Classes for Cards (index.html)
Each person has a color class in index.html:
- `.card-selena` - Verde limon #a8e063
- `.card-luana` - Celeste #5dade2
- `.card-thiago` - Naranja #e67e22
- `.card-rihana` - Azul marino #1a3a5c
- `.card-daniel` - Amarillo #f1c40f
- `.card-fernando` - Rojo #c0392b
- `.card-andrea` - Morado #9b59b6
- `.card-doris` - Rosa #e91e90
- `.card-danna` - Lila #9b59b6

## Profile Page Structure
Each person's index.html has:
- Hero section with name and class
- Photo section
- Biography section
- Personal details (name, class, birthday, personality, position)
- Hobbies section
- Pasatiempos section (optional)
- Colors section
- Sueños y metas section

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
- Always update AGENTS.md when making profile changes
- Each person has their own accent color used in both their page and the main index.html

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
