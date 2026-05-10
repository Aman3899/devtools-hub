# Changelog

All notable changes to DevTools Hub will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- HTML Processing Tools (Phase 2)
  - HTML Previewer with device size toggle
  - HTML Minifier with comment removal
  - HTML Beautifier with indent control
  - HTML to Markdown converter
  - Markdown to HTML converter
  - HTML to JSX converter

### Fixed
- TypeScript compilation errors in Select components
- ES2018 regex flag compatibility
- Duplicate tool entries in registry

### Changed
- Updated tsconfig target to ES2018
- Improved type safety in tool components

## [0.1.0] - 2024-01-15

### Added

#### Core Features
- Next.js 16.2.6 with App Router
- React 19.2.4 with hooks
- TypeScript 5 for type safety
- Tailwind CSS 4 for styling
- Dark/Light theme support
- Multi-language support (English, Urdu)
- Responsive design for all devices

#### Text & String Tools (20 tools)
- JSON Formatter - Format and validate JSON
- CSV ↔ JSON Converter - Convert between formats
- XML Formatter - Format XML documents
- YAML Validator - Validate YAML files
- TOML Validator - Parse TOML files
- Markdown Previewer - Live preview
- Code Diff Checker - Compare code
- Word Counter - Text analysis
- Lorem Ipsum Generator - Placeholder text
- Case Converter - Text case conversion
- Slug Generator - URL-friendly slugs
- String Reverse - Reverse text
- Duplicate Remover - Remove duplicates
- Whitespace Remover - Clean whitespace
- ASCII Art Generator - Create ASCII art
- Emoji Picker - Browse emojis
- Text Sorter - Sort lines
- Line Number Adder - Add line numbers
- Find & Replace - Advanced search
- Unicode Inspector - Analyze Unicode

#### Data & Security Tools (19 tools)
- JWT Decoder - Decode JWT tokens
- JWT Builder - Create JWT tokens
- Base64 Encoder/Decoder - Encode/decode
- URL Encoder/Decoder - URL encoding
- HTML Entity Encoder - Entity encoding
- MD5 Generator - Generate MD5 hashes
- SHA Generator - Generate SHA hashes
- Bcrypt Generator - Generate bcrypt hashes
- Argon2 Generator - Generate Argon2 hashes
- HMAC Generator - Generate HMAC signatures
- Base Converter - Convert number bases
- Caesar Cipher - Caesar cipher encryption
- ROT13 Encoder - ROT13 encoding
- Punycode Converter - Unicode/Punycode
- AES Encryptor - AES encryption
- RSA Key Generator - Generate RSA keys
- QR Code Decoder - Decode QR codes
- Morse Converter - Text to Morse code
- Environment Checker - Validate env vars

#### Design & Color Tools (3 tools)
- Color Palette Generator - Generate palettes
- CSS Gradient Generator - Create gradients
- Image to Base64 - Convert images
- HTML Color to Hex - Color conversion

#### Development Tools (5 tools)
- API Tester - Test HTTP requests
- cURL Generator - Generate cURL commands
- Regex Tester - Test regular expressions
- Timestamp Converter - Convert timestamps
- UUID Generator - Generate UUIDs

#### Web & HTML Tools (1 tool)
- SQL Formatter - Format SQL queries

#### Infrastructure
- Redux Toolkit for state management
- React Query for server state
- next-intl for internationalization
- shadcn/ui for components
- Zod for schema validation
- Framer Motion for animations

### Infrastructure
- GitHub repository setup
- Vercel deployment configuration
- ESLint configuration
- TypeScript strict mode
- Tailwind CSS configuration
- i18n routing setup

### Documentation
- Comprehensive README
- Installation guide
- Contributing guidelines
- API documentation
- Tool-specific guides

## [0.0.1] - 2024-01-01

### Added
- Initial project setup
- Next.js scaffolding
- Basic project structure
- Development environment configuration

---

## Versioning

This project follows [Semantic Versioning](https://semver.org/):

- **MAJOR** version for incompatible API changes
- **MINOR** version for new functionality in a backwards compatible manner
- **PATCH** version for backwards compatible bug fixes

## Release Schedule

- **Major releases**: Quarterly (every 3 months)
- **Minor releases**: Monthly
- **Patch releases**: As needed for bug fixes

## Future Roadmap

### Phase 3 (Q2 2024)
- [ ] Advanced API tools
- [ ] Database utilities
- [ ] Code generation tools
- [ ] Performance analysis tools

### Phase 4 (Q3 2024)
- [ ] Browser extensions
- [ ] CLI tool
- [ ] Mobile app
- [ ] Desktop app

### Phase 5 (Q4 2024)
- [ ] AI-powered tools
- [ ] Collaboration features
- [ ] Team workspaces
- [ ] Advanced analytics

---

## How to Report Issues

Found a bug? Please report it on [GitHub Issues](https://github.com/maman/devtools-hub/issues).

Include:
- Description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details

## How to Request Features

Have a feature idea? Open a [GitHub Discussion](https://github.com/maman/devtools-hub/discussions) or create an [Issue](https://github.com/maman/devtools-hub/issues).

Include:
- Clear description of the feature
- Use case and benefits
- Proposed implementation (optional)
- Related tools or features

---

**Last Updated**: January 2024
