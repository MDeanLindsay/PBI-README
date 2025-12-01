# ReadMe - A Power BI Markdown Visual

ReadMe is a custom Power BI visual for displaying familiar, GitHub-styled **markdown** content. Perfect for creating documentation dashboards, formatted release notes, and searchable data dictionaries in your Power BI reports.

### Current Release

* Current .pbiviz and example .pbix available [**here**](https://github.com/MDeanLindsay/PBI-README/tree/main/README/dist).
* Current release on AppSource can be found [**here**](appsource.microsoft.com/en-us/product/saas/michaellindsay1750536687927.readme?tab=overview).

## Table of Contents
- [Current Release](#current-release)
- [Table of Contents](#table-of-contents)
- [Getting Started](#getting-started)
  - [Quick Start](#quick-start)
  - [Importing Markdown](#importing-markdown)
- [Supported Markdown Features](#supported-markdown-features)
- [Formatting Options](#formatting-options)
- [Development](#development)
- [Contributing](#contributing)
- [Changelog](#changelog)
  - [v1.0.0.0](#v1000)
- [Support](#support)
- [License](#license)

## Getting Started

While there are many ways to import your markdown, the sections below outlines best practices to import your raw markdown into PowerBi.

<details>
<summary><strong>Option 1: Connect Power BI to Private GitHub README</strong></summary>

### How to Connect a Private GitHub README to Power BI

This guide outlines the steps to securely connect Power BI to a `README.md` file hosted in a private GitHub repository.

#### Step 1: Create a New Query in Power BI

1.  In Power BI Desktop, navigate to **Get Data** > **Blank Query**. This will open the Power Query Editor.
2.  With the new query selected, click on **Advanced Editor** from the ribbon.

#### Step 2: Add the Power Query (M) Code

Copy and paste the following M code into the Advanced Editor window.

```m
let
    Source = Web.Contents(
        "https://api.github.com/repos/USER/REPO/contents/PATH-TO/README.md",
        [
            Headers=[Accept="application/vnd.github.v3.raw"]
        ]
    ),
    Content = Text.FromBinary(Source),
    Table = #table({"Content"}, {{Content}})
in
    Table
```

> **Note:** Remember to replace `USER`, `REPO`, and `PATH/TO/README.md` with your specific GitHub username, repository name, and the full path to your README file.

#### Step 3: Configure Credentials

After you save the code, Power BI will prompt you to enter credentials.

1.  Click the **Edit Credentials** button.
2.  In the dialog box, select the **Basic** authentication type.
3.  **User name:** Enter your GitHub username.
4.  **Password:** Paste your GitHub Personal Access Token (PAT).
5.  **Select which level to apply these settings to:** Ensure this is set to the base URL, `https://api.github.com/`.
6.  Click **Connect**.

---

### How to Generate a GitHub Fine-Grained PAT

If you need a new Personal Access Token (PAT), it's best to create a fine-grained one with limited scope.

1.  Navigate to your GitHub **Settings** > **Developer settings**.
2.  Go to **Personal access tokens** > **Fine-grained tokens**.
3.  Click **Generate new token**.
4.  **Repository access:** Select **Only select repositories** and choose the repository you need to access.
5.  **Permissions:** Click on **Repository permissions** and find the **Contents** permission. Set it to **Read-only**. This is the only permission needed.
6.  Click **Generate token**, and copy the token immediately.

---

### Troubleshooting

**Error:** *"A web API key can only be specified when a web API key name is provided."* or other credential issues.

This usually means Power BI has cached old or incorrect credentials.

1. In Power BI, go to **File** > **Options and settings** > **Data source settings**.
2. Find any entries for `https://api.github.com` in the list.
3. Select the entry and click **Clear Permissions** / **Delete**.
4. Go back to the Power Query Editor and **Refresh Preview**. You will be prompted to enter the credentials again from a clean slate.

</details>

<details>
<summary><strong>Option 2: Copy/Paste Markdown Into Power BI</strong></summary>

### How to Copy and Paste Markdown into Power BI

Not interested in using a repository? I get it.
This guide shows you how to create a simple data source by copying and pasting your markdown content directly into Power BI.

## Option 1: Measures
Create a measure that returns markdown text and drag it to the **Text Measure** input.

```m
Markdown_Measure = "

# Sales Dashboard

## Executive Summary
Our Q4 performance shows **strong growth** across all regions.

### Key Highlights
1. Revenue increased by 15%
2. Customer retention at 95%
3. New market expansion successful

"
```
> Note: Make sure to escape any double quotes within your markdown by doubling them (e.g., ""quoted text"").

## Option 2: Create a New Query in Power BI

#### Step 1: Create A New Blank Query

1. In Power BI Desktop, navigate to **Get Data** > **Blank Query**. This will open the Power Query Editor.
2. With the new query selected, click on **Advanced Editor** from the ribbon.

#### Step 2: Add the Power Query (M) Code

Copy and paste the following M code into the Advanced Editor window.

```m
let
    Source = #table({"Content"}, {{"# Sales Dashboard

## Executive Summary
Our Q4 performance shows **strong growth** across all regions.

### Key Highlights
1. Revenue increased by 15%
2. Customer retention at 95%
3. New market expansion successful

> **Note:** All figures are preliminary and subject to final audit.

| Metric | Q3 | Q4 | Change |
|--------|----|----|--------|
| Revenue | $1.2M | $1.4M | +17% |
| Customers | 1,250 | 1,380 | +10% |

For more details, see our documentation."}})
in
    Source
```

> **Note:** Replace the markdown content between the double quotes with your own markdown text. Again, make sure to escape any double quotes within your markdown by doubling them (e.g., `""quoted text""`).

#### Step 3: Save and Apply

1. Click **Done** to save the query.
2. The query will create a table with a single row containing your markdown content.
3. Close the Power Query Editor and return to your report.

---

### Troubleshooting

**Error:** *"Expression.Error: The name 'Content' wasn't recognized."*

This usually means there's a syntax error in your M code. Check that:
1. All quotes are properly paired
2. Double quotes within your markdown are escaped. Use `""` instead of `"`
3. The table structure is correct: `#table({"Content"}, {{"your markdown"}})`
</details>

## Supported Markdown Features

### Headers
Create hierarchical document structure with headers.

```markdown
# Main Title (H1)
## Section Title (H2)
### Subsection (H3)
#### Sub-subsection (H4)
##### Small Header (H5)
###### Tiny Header (H6)
```

### Text Formatting
Emphasize text with bold, italic, and other formatting.

```markdown
**Bold text** and *italic text*
***Bold and italic***
~~Strikethrough text~~
<u>Underlined text</u>
```

### Lists
Create ordered and unordered lists with proper nesting.

```markdown
- Unordered list item
- Another item
  - Nested item

1. Ordered list item
2. Second item
   1. Nested numbered item
```

### Linked Indexes
Create internal navigation links in your documentation. 

```markdown
## Table of Contents
* [Getting Started](#getting-started)
* [Key Metrics](#key-metrics)
* [Troubleshooting](#troubleshooting)

## Getting Started
This section explains how to begin...

## Key Metrics
Here are our important numbers...

## Troubleshooting
Common issues and solutions...
```
> Note: The link #getting-started matches the header ## Getting Started (lowercase, spaces become hyphens).

### Images
Embed images in your markdown content.

```markdown
![Alt text](https://example.com/image.png)
```

### Tables
Create structured data tables with alignment.

```markdown
| Header 1 | Header 2 | Header 3 |
|----------|:--------:|---------:|
| Left     | Center   | Right    |
| Data     | Data     | Data     |
| More     | Content  | Here     |
```

### Blockquotes
Highlight important information or quotes.

```markdown
> This is a blockquote
> 
> It can span multiple lines
> 
> > And can be nested
```

### Code Blocks
Display code with syntax highlighting.

```markdown
    ```js
    function example() {
        return "Hello World";
    }
    ```
```

### Details/Summary Dropdowns
Create collapsible content sections.

```markdown
<details>
<summary><strong>Click to expand</strong></summary>
### Hidden Content
This content is hidden by default and can be expanded by clicking the summary.
</details>
```

### Footnotes
Add reference notes to your content.

```markdown
This is a sentence with a footnote[^1].

[^1]: This is the footnote content.
```

### Task Lists
Create interactive checkboxes.

```markdown
- [x] Completed task
- [ ] Incomplete task
```

## Formatting Options

Access these settings in Power BI's formatting pane:

| Setting | Description | Default |
|---------|-------------|---------|
| Font Size | Base font size, scales titles accordingly | 16px |
| Padding | Internal spacing | 8px |
| Background Color | Visual background color | Transparent |
| Font Family | Choose from 8 font options | System Default |

## Development

### Prerequisites

- Node.js (v18+)
- Power BI Visual Tools: `npm install -g powerbi-visuals-tools`

### Dependencies

- **marked** (^15.0.12) - Markdown parsing
- **github-markdown-css** (^5.8.1) - GitHub-style formatting
- **dompurify** (^3.2.6) - XSS protection
- **d3** (7.9.0) - Data visualization utilities
- **powerbi-visuals-api** (~5.11.0) - Power BI integration
- **powerbi-visuals-utils-formattingmodel** (6.1.1) - Formatting utilities
- **powerbi-visuals-utils-interactivityutils** (^6.0.4) - Interaction utilities
- **powerbi-visuals-utils-tooltiputils** (^6.0.4) - Tooltip utilities

### Setup

```bash
# Clone the repository
git clone https://github.com/MDeanLindsay/PBI-README.git

cd PBI-README/README

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run start
# or
pbiviz start
```


### Build for Production

```bash
# Create .pbiviz package
npm run package
# or 
pbiviz package
```

### Project Structure

```
README/
├── src/
│   ├── visual.ts          # Main visual logic
│   └── settings.ts        # Formatting settings
├── style/
│   └── visual.less        # CSS styling
├── capabilities.json      # Visual capabilities
├── pbiviz.json           # Visual metadata
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript configuration
└── eslint.config.mjs     # ESLint configuration
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Open a pull request

## Changelog

### v1.1.0.1
- Added support for measure based markdown
- Added landing page for supported features
- Added styling for summary/detail drop downs
### v1.0.0.0
- Initial release

## Support

For questions, issues, or feature requests:
1. Check existing [GitHub issues](https://github.com/mdeanlindsay/PBI-README/issues)
2. Create a new issue with detailed description
3. Include markdown sample and expected vs actual behavior

## License

MIT License

### Third-Party Licenses

This project includes:
- `github-markdown-css` (MIT) - Copyright (c) Sindre Sorhus
- `marked` (MIT) - Copyright (c) 2011-2018, Christopher Jeffrey
- `dompurify` (Apache-2.0 OR MPL-2.0) - Copyright (c) Cure53

---

**Made for those who hate native Power BI text tools.** 