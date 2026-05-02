# English Pearls of Kuwait — Grade 8 (Interactive Units)

Interactive, bilingual (EN/AR) static websites for the **English Pearls of Kuwait** Grade 8 coursebook.
Each Learning Unit (5–8) lives on its own GitHub branch and is published to its own URL via GitHub Pages.

## 📚 Units

| Unit | Title | Branch | Live URL |
|------|-------|--------|----------|
| 5 | Community & Volunteering | `cursor/unit-5-community-volunteering-8ef2` | `https://OSRoot.github.io/grade-eight-english/unit-5/` |
| 6 | The Power of Media & Influencers | `cursor/unit-6-media-influencers-8ef2` | `https://OSRoot.github.io/grade-eight-english/unit-6/` |
| 7 | Real Trips & Virtual Voyages | `cursor/unit-7-...` | `https://OSRoot.github.io/grade-eight-english/unit-7/` |
| 8 | Life Lessons | `cursor/unit-8-...` | `https://OSRoot.github.io/grade-eight-english/unit-8/` |

## 🚀 Deployment

A GitHub Actions workflow at `.github/workflows/pages.yml` deploys every push on a
`cursor/unit-*` branch to a sub-folder of the `gh-pages` branch.

After the first deploy, in **Settings → Pages**, choose **Deploy from a branch** → branch
**`gh-pages`** / **`/ (root)`**. Each unit is then available at
`https://<USER>.github.io/<REPO>/unit-<N>/`.

## ✨ Features per unit

- Fully bilingual UI (English ↔ العربية), language toggle in the header
- Responsive, modern design (mobile + desktop, RTL when Arabic)
- Comprehension MCQs, drag-and-drop matching/sorting, fill-in-the-blanks
- Browser text-to-speech for listening tracks
- Vocabulary flip cards, search, filters and flashcards
- XP/level gamification system with confetti and toasts
- Auto-saves all open answers in `localStorage`
- Exportable writing report (text file)

## 🛠️ Local preview

```bash
python3 -m http.server 8000
# visit http://localhost:8000
```
