# Power BI Markdown Visual

A custom Power BI visual for displaying beautiful, GitHub-styled markdown content with full navigation support.

## 🌟 Features

- **GitHub-Style Formatting**: Uses authentic GitHub markdown CSS for pixel-perfect rendering
- **Internal Navigation**: Clickable table of contents with smooth scrolling to sections
- **Customizable Appearance**: Configurable font size, padding, background color, and font family
- **Security First**: Built-in XSS protection with DOMPurify sanitization
- **Full Markdown Support**: 
  - Headers, lists, tables, code blocks
  - Links, images, blockquotes
  - GitHub Flavored Markdown (GFM)
- **Responsive Design**: Adapts to different visual sizes in Power BI reports

## 📖 Use Cases

Perfect for creating:
- **Documentation dashboards** - Display project docs, API references, user guides
- **Executive summaries** - Rich-text reports with navigation
- **Release notes** - Formatted changelog displays
- **Process documentation** - Step-by-step guides with internal linking
- **Data dictionaries** - Searchable, navigable field definitions

## 🚀 Getting Started

### Using the Visual

1. **Import the Visual**: Install the `.pbiviz` file in your Power BI report
2. **Add Data**: Connect your markdown text data source
3. **Map Fields**: Drag your markdown text field to the "Markdown Text" data role
4. **Customize**: Use the formatting pane to adjust appearance

### Data Requirements

The visual expects a single text field containing valid markdown:

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

## ⚙️ Formatting Options

Access these settings in Power BI's formatting pane:

| Setting | Description | Default |
|---------|-------------|---------|
| Font Size | Base font size in pixels | 16px |
| Padding | Internal spacing in pixels | 8px |
| Background Color | Visual background color | Transparent |
| Font Family | Choose from 8 font options | System Default |

## 🛠️ Development

### Prerequisites

- Node.js (v14+)
- Power BI Visual Tools: `npm install -g powerbi-visuals-tools`

### Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd PBI-README/README

# Install dependencies
npm install

# Start development server
npm start
```

### Build for Production

```bash
# Create .pbiviz package
npm run package
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
└── package.json          # Dependencies
```

## 🔧 Technical Details

### Dependencies

- **marked** (^15.0.12) - Markdown parsing
- **github-markdown-css** (^5.8.1) - GitHub-style formatting
- **dompurify** (^3.2.6) - XSS protection
- **powerbi-visuals-api** (~5.3.0) - Power BI integration

### Security Features

- Input sanitization with DOMPurify
- Restricted HTML tag allowlist
- Safe attribute filtering
- XSS attack prevention

### Browser Compatibility

- Modern browsers supporting ES6+
- Power BI Desktop and Service
- Mobile Power BI apps

## 🔗 Internal Navigation

The visual automatically generates clickable navigation from markdown headers:

```markdown
## Table of Contents
* [Section 1](#section-1)
* [Section 2](#section-2)

## Section 1
Content here...

## Section 2
More content...
```

Features:
- Smooth scrolling animation
- Visual highlighting of target sections
- Automatic anchor ID generation
- Nested navigation support

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

### Third-Party Licenses

This project includes:
- `github-markdown-css` (MIT) - Copyright (c) Sindre Sorhus
- `marked` (MIT) - Copyright (c) 2011-2018, Christopher Jeffrey
- `dompurify` (Apache-2.0 OR MPL-2.0) - Copyright (c) Cure53

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a pull request

## 📋 Changelog

### v1.0.0
- Initial release
- GitHub-style markdown rendering
- Internal navigation support
- Customizable formatting options
- Security hardening with DOMPurify

## 🐛 Known Issues

- Internal links require exact header text matching
- Some advanced markdown features may not render identically to GitHub
- Large documents may impact performance in older browsers

## 📞 Support

For questions, issues, or feature requests:
1. Check existing [GitHub issues](../../issues)
2. Create a new issue with detailed description
3. Include markdown sample and expected vs actual behavior

---

**Made with ❤️ for the Power BI community** 