# English Pearls of Kuwait — Grade 8 (Interactive Units)

Interactive, bilingual (EN/AR) static websites for the **English Pearls of Kuwait** Grade 8 coursebook,
plus a comprehensive **MR Osama Revision** site for English foundations.

## 📚 Sites

| # | Site | Branch | Live URL |
|---|------|--------|----------|
| ⭐ | **MR Osama Revision** | `cursor/revision-mr-osama-8ef2` | `https://OSRoot.github.io/grade-eight-english/revision/` |
| 5 | Community & Volunteering | `cursor/unit-5-community-volunteering-8ef2` | `https://OSRoot.github.io/grade-eight-english/unit-5/` |
| 6 | The Power of Media & Influencers | `cursor/unit-6-media-influencers-8ef2` | `https://OSRoot.github.io/grade-eight-english/unit-6/` |
| 7 | Real Trips & Virtual Voyages | `cursor/unit-7-real-virtual-voyages-8ef2` | `https://OSRoot.github.io/grade-eight-english/unit-7/` |
| 8 | Life Lessons | `cursor/unit-8-...` | `https://OSRoot.github.io/grade-eight-english/unit-8/` |

## 🚀 Deployment

A GitHub Actions workflow at `.github/workflows/pages.yml` deploys every push on a
`cursor/unit-*` or `cursor/revision-*` branch to its own sub-folder of the `gh-pages` branch.

Enable Pages once in **Settings → Pages → Source: `gh-pages` / `/ (root)`**.

## 🛠️ Local preview

```bash
python3 -m http.server 8000
# visit http://localhost:8000
```
