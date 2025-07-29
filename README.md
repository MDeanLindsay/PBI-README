# ReadMe - A Power BI Markdown Visual

ReadMe is a custom Power BI visual for displaying familiar, GitHub-styled markdown content with full navigation support. Perfect for creating documentation dashboards, formatted release notes, and searchable data dictionaries in your Power BI reports.

### Current Release

Current .pbiviz and example .pbix available [**here**](https://github.com/MDeanLindsay/PBI-README/tree/main/README/dist).

## Table of Contents
- [ReadMe - A Power BI Markdown Visual](#readme---a-power-bi-markdown-visual)
    - [Current Release](#current-release)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
    - [Using the Visual](#using-the-visual)
    - [Data Requirements](#data-requirements)
    - [Linked Indexes](#linked-indexes)
    - [Intended Use Case](#intended-use-case)
    - [How to Connect a Private GitHub README to Power BI](#how-to-connect-a-private-github-readme-to-power-bi)
    - [How to Copy and Paste Markdown into Power BI](#how-to-copy-and-paste-markdown-into-power-bi)
  - [Formatting Options](#formatting-options)
  - [Development](#development)
  - [Contributing](#contributing)
  - [Changelog](#changelog)
    - [v1.0.0.0](#v1000)
  - [Support](#support)
  - [License](#license)

## Getting Started

### Using the Visual

1. **Import the Visual**: Install the `.pbiviz` file in your Power BI report, or find the visual in [AppSource](https://appsource.microsoft.com/en-us/product/power-bi-visuals/michaellindsay1750536687927.readme?tab=Overview) directly in Power BI.
2. **Add Data**: Connect your markdown text data source
3. **Map Fields**: Drag your markdown text field to the "Markdown Text" data role
4. **Customize**: Use the formatting pane to adjust appearance

![ReadMe Visual Example](/README/assets/readme_example.PNG)

### Data Requirements

The visual expects a single text field containing valid markdown. (No you can't use measures. Put it in a single cell in a table.)

```markdown
# My Report

## Table of Contents
* [Overview](#overview)
* [Key Metrics](#key-metrics)
* [Conclusions](#conclusions)

## Overview
This report shows...

## Key Metrics
- Metric 1: 95%
- Metric 2: $1.2M
- Metric 3: 15% increase

## Conclusions
Based on our analysis...
```

### Linked Indexes

The visual supports GitHub-style linked indexes for easy navigation. To create clickable links that jump to specific sections:

1. **Create your headers** with standard markdown syntax (`#`, `##`, `###`, etc.)
2. **Create your links** using the format `[Link Text](#header-text)`
3. **Convert header text to link format** by:
   - Converting to lowercase
   - Replacing spaces with hyphens
   - Removing special characters

**Example:**
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

> **Note:** The link `#getting-started` matches the header `## Getting Started` (lowercase, spaces become hyphens).


### Intended Use Case

With the introduction of .pbip files, Power BI now offers source control capabilities for your reports. Why not extend that same source control approach to your documentation in a format developers are familiar with? Store your markdown in a repository, setup a connection with your report, and ReadMe will render your new data source without any additional tinkering needed. Your documentation evolves with your codebase, teams can update documentation without even opening the report, and everything stays in sync.

If you're planning to write and edit markdown within PowerBI, this is probably not the best visual for you.

While there are many ways to import your markdown, the section below outlines a best practice to import your raw markdown into PowerBi from a private repository.
If your repository is public for some reason, then you won't need any additional keys.

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

#### Step 1: Create a New Query in Power BI

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

> **Note:** Replace the markdown content between the double quotes with your own markdown text. Make sure to escape any double quotes within your markdown by doubling them (e.g., `""quoted text""`).

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