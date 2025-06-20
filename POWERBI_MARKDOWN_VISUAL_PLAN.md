# Plan: GitHub-Style Markdown Viewer for Power BI

## 1. Goal
Build a custom Power BI visual capable of rendering Markdown text (passed via a data field) so that it looks **as close as possible to how GitHub displays README files**.

---

## 2. Prerequisites & Local Setup
1. **Node.js ≥ 18** ‑ Download from <https://nodejs.org>.
2. **Power BI Visual Tools (pbiviz)**
   ```bash
   npm install -g powerbi-visuals-tools
   pbiviz --help   # verify install
   ```
3. **Power BI Desktop (June 2019 or later)** with *Developer Mode* enabled for local testing.
4. **Git** & a GitHub account (for source control and sharing).
5. Optional: **VS Code** with the *Power BI* snippets extension.

---

## 3. Project Skeleton
```bash
pbiviz new MarkdownViewer
cd MarkdownViewer
```
This scaffolds:
* `src/visual.ts` – visual entry point
* `capabilities.json` – data-role & formatting pane definitions
* `pbiviz.json` / `package.json` – project configs

Commit the freshly generated project (`git init && git commit -m "scaffold"`).

---

## 4. Data Roles & Capabilities (`capabilities.json`)
| Role              | Type        | Purpose                           |
|-------------------|------------|-----------------------------------|
| `Markdown` (name) | `Text`     | Holds the Markdown string to render |
| (optional) Theme  | `Text`/`Bool` | Dark/light mode flag              |

Add formatting cards for:
* **Font size / family**
* **Background color**
* **Padding**

---

## 5. Rendering Pipeline (`src/visual.ts`)
1. **Fetch Markdown** from `DataView`:
   ```ts
   const markdown = dataView?.categorical?.categories[0]?.values[0] as string;
   ```
2. **Parse → HTML** using a library such as:
   * `marked` (fast, CommonMark-compliant)
   * Or `markdown-it`
3. **Sanitize** with `dompurify` to prevent XSS.
4. **Inject** into the root `div` created by Power BI (`this.target`).
5. **Apply Styles**:
   * Add class `markdown-body`.
   * Load `github-markdown-css` for authentic GitHub look.
6. **Resize Handling**: Implement `update` + `enumerateObjectInstances` properly so visuals render responsively.

Dependencies to add:
```bash
npm i marked dompurify github-markdown-css
```
Use webpack (already wired) to bundle them.

---

## 6. Styling
1. Import CSS in `visual.less` or `visual.ts`:
   ```ts
   import 'github-markdown-css';
   ```
2. Override background & font via formatting pane values.
3. Ensure styles are **scoped** (prefix `.markdown-viewer` or rely on host-provided iframe isolation).

---

## 7. Security Notes
* **ALWAYS sanitize** rendered HTML (`DOMPurify.sanitize(html)`).
* Restrict image loading (`rel="noopener"` for links) if needed.
* Test with malicious Markdown to confirm.

---

## 8. Build, Debug & Live Reload
```bash
pbiviz start
```
1. Open Power BI Desktop → File → Options → *Preview features* → enable *Developer Mode*.
2. *View* → *Developer Mode* ribbon → *Connect*.
3. Select the running visual from the list.
4. Edits auto-reload.

---

## 9. Packaging & Distribution
```bash
pbiviz package
```
Generates `.pbiviz` in `dist/`. Upload to *Power BI Service* or share.

Consider:
* **Signing** (if deploying to org's visuals repository).
* **Versioning** & **Changelog**.

---

## 10. Automated CI (optional)
* GitHub Actions workflow that:
  1. Installs Node 18 & pbiviz
  2. Runs `npm ci` + `npm test` (unit tests with Jest & jsdom)
  3. Executes `pbiviz package`
  4. Uploads artifact

---

## 11. Future Enhancements
* **Theme support** (GitHub-Dark, Light, High-Contrast).
* **Syntax Highlighting** via `highlight.js` (install + call `hljs.highlightAll()` after render).
* **Images & Attachments** – support base64 or external.
* **Interactive TOC** generation.
* Performance: cache compiled HTML for large markdown.

---

## 12. Key References
* Power BI Visual Tools repo – <https://github.com/microsoft/PowerBI-visuals-tools>
* Markdown parser **marked** – <https://github.com/markedjs/marked>
* GitHub Markdown CSS – <https://github.com/sindresorhus/github-markdown-css>
* Visuals API docs – <https://learn.microsoft.com/power-bi/developer/visuals/>

Happy building! 🎉 


pbiviz package   # creates dist/MarkdownViewer.pbiviz