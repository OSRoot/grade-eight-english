# English Pearls of Kuwait — Grade 8 (Interactive Units)

Interactive, bilingual (EN/AR) static websites for the **English Pearls of Kuwait** Grade 8 coursebook.
Each Learning Unit (5–8) lives on its own GitHub branch and is published to its own URL via GitHub Pages.

## 📚 Units

| Unit | Title | Branch | Live URL (after deploy) |
|------|-------|--------|--------------------------|
| 5 | Community & Volunteering | `cursor/unit-5-community-volunteering-8ef2` | `https://OSRoot.github.io/grade-eight-english/unit-5/` |
| 6 | The Power of Media & Influencers | `cursor/unit-6-...` | `https://OSRoot.github.io/grade-eight-english/unit-6/` |
| 7 | Real Trips & Virtual Voyages | `cursor/unit-7-...` | `https://OSRoot.github.io/grade-eight-english/unit-7/` |
| 8 | Life Lessons | `cursor/unit-8-...` | `https://OSRoot.github.io/grade-eight-english/unit-8/` |

## 🚀 Deployment

The workflow in `.github/workflows/pages.yml` automatically deploys every push on a `cursor/unit-*` branch
to a sub-folder of the `gh-pages` branch. After the first deploy:

1. In **Settings → Pages**, choose source: **Deploy from a branch**, branch: **`gh-pages`** / **`/ (root)`**.
2. Each unit becomes available at `https://<USER>.github.io/<REPO>/unit-<N>/`.

## 🧠 Features per unit

- Fully bilingual UI (English ↔ العربية), language toggle in the header
- Responsive, modern design (mobile + desktop)
- Interactive comprehension quizzes (MCQ + open answers)
- Drag-and-drop matching, sorting, and fill-in-the-blank exercises
- Browser text-to-speech for listening tracks
- Vocabulary cards (flip), word search, and flashcards
- Word-level tooltips for highlighted terms with Arabic meanings
- Exportable writing report (text file)

## 🛠️ Local preview

Just open `index.html` in a browser, or:

```bash
python3 -m http.server 8000
# visit http://localhost:8000
```
