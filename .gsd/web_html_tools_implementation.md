# Web & HTML Tools Implementation (Tools 41-60)

## Context
The goal is to implement 20 new tools belonging to the "Web & HTML Tools" category for the DevTools Hub platform. This phase will strictly adhere to the established UI/UX patterns (12-column layout), rigorous translation standards (no hardcoded English strings), and comprehensive FAQ integration.

## Core Requirements
1. **Consistent UI Architecture**: Every tool must utilize the `12-column` responsive grid pattern with an input/output section (spanning 9 columns) and a sidebar (spanning 3 columns) for customization, configurations, and information.
2. **Strict Localization (i18n)**: Absolutely no ternary (`isEnglish ? ... : ...`) text logic. All strings must use `t()` or `commonT()` wrappers. Keys and values must be directly implemented within `messages/en.json` and `messages/ur.json`.
3. **Tool Navigation Integration**: The `<ToolNavigation currentToolId="..." />` component must be rendered at the bottom of every tool component.
4. **FAQ Coverage**: Every tool must have a populated `faqs` object in the JSON translation files so the tool page renders helpful Q&As. Previous tools missing FAQs must also be retroactively populated.

## Tools to Build
- [ ] 41. **HTML Previewer**: Live iframe render, device size toggle
- [ ] 42. **HTML Minifier**: Before/after size comparison, copy
- [ ] 43. **HTML Beautifier**: Indent size selector, attribute order
- [ ] 44. **HTML to Markdown**: Clean semantic output, preserve links
- [ ] 45. **Markdown to HTML**: Raw HTML output, copy button
- [ ] 46. **HTML to JSX**: className, self-closing tag conversion
- [ ] 47. **Meta Tag Generator**: OG + Twitter card + SEO tags, preview
- [ ] 48. **Favicon Generator**: Upload image, export 16/32/48/180px
- [ ] 49. **robots.txt Generator**: Rule builder UI, disallow/allow paths
- [ ] 50. **sitemap.xml Generator**: URL list input, priority + changefreq
- [ ] 51. **.htaccess Generator**: Redirect, HTTPS force, cache rules
- [ ] 52. **iframe Generator**: Width/height/sandbox attribute UI
- [ ] 53. **HTML Table Generator**: Row/col editor, style options, copy
- [ ] 54. **Open Graph Previewer**: URL meta scraper, Facebook/Twitter mock
- [ ] 55. **Link Extractor**: Paste HTML, extract all hrefs as list
- [ ] 56. **HTTP Status Reference**: Searchable 1xx-5xx with descriptions
- [ ] 57. **MIME Type Finder**: Extension lookup, full type list
- [ ] 58. **Cookie String Parser**: Key-value table, expiry display
- [ ] 59. **User Agent Parser**: Browser, OS, device detection table
- [ ] 60. **URL Parser**: Break URL into scheme/host/path/query

## Execution Plan (Checklist)

### Phase 1: Preparation & retroactive fixes
- [x] Review existing "Data & Security" translation entries in `en.json` and `ur.json`.
- [x] Populate missing `faqs` data (questions and answers) for previous Data & Security components.
- [x] Register new tool routes/definitions in the `tools-registry.ts` (if required by current project structure).

### Phase 2: HTML Processing Batch (Tools 41-46)
- [ ] Build 41 HTML Previewer
- [ ] Build 42 HTML Minifier
- [ ] Build 43 HTML Beautifier
- [ ] Build 44 HTML to Markdown
- [ ] Build 45 Markdown to HTML
- [ ] Build 46 HTML to JSX
- [ ] Add translation keys + FAQs for tools 41-46.

### Phase 3: Generators & SEO Batch (Tools 47-53)
- [ ] Build 47 Meta Tag Generator
- [ ] Build 48 Favicon Generator
- [ ] Build 49 robots.txt Generator
- [ ] Build 50 sitemap.xml Generator
- [ ] Build 51 .htaccess Generator
- [ ] Build 52 iframe Generator
- [ ] Build 53 HTML Table Generator
- [ ] Add translation keys + FAQs for tools 47-53.

### Phase 4: Parsers & References Batch (Tools 54-60)
- [ ] Build 54 Open Graph Previewer
- [ ] Build 55 Link Extractor
- [ ] Build 56 HTTP Status Reference
- [ ] Build 57 MIME Type Finder
- [ ] Build 58 Cookie String Parser
- [ ] Build 59 User Agent Parser
- [ ] Build 60 URL Parser
- [ ] Add translation keys + FAQs for tools 54-60.
