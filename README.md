# DevTools Hub

<div align="center">

![DevTools Hub](https://img.shields.io/badge/DevTools-Hub-blue?style=for-the-badge)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**A comprehensive, open-source platform of professional-grade developer utilities for daily development tasks.**

[🚀 Live Demo](https://devtools-hub-taupe.vercel.app) • [📖 Documentation](#documentation) • [🤝 Contributing](#contributing) • [📝 License](#license)

</div>

---

## ✨ Features

DevTools Hub provides **46+ professional-grade tools** organized into 6 categories:

### 📝 Text & String Tools (20 tools)
- **JSON Formatter** - Format, validate, and beautify JSON with syntax highlighting
- **CSV ↔ JSON Converter** - Seamlessly convert between CSV and JSON formats
- **XML Formatter** - Format and validate XML documents
- **YAML Validator** - Validate and format YAML configuration files
- **TOML Validator** - Parse and validate TOML files
- **Markdown Previewer** - Live preview Markdown with real-time rendering
- **Code Diff Checker** - Compare and highlight differences between code snippets
- **Word Counter** - Analyze text with character, word, and line counts
- **Lorem Ipsum Generator** - Generate placeholder text for designs
- **Case Converter** - Convert text between different cases (camelCase, snake_case, etc.)
- **Slug Generator** - Create URL-friendly slugs from text
- **String Reverse** - Reverse strings and text
- **Duplicate Remover** - Remove duplicate lines from text
- **Whitespace Remover** - Clean up extra whitespace
- **ASCII Art Generator** - Create ASCII art from text
- **Emoji Picker** - Browse and copy emojis
- **Text Sorter** - Sort lines alphabetically or numerically
- **Line Number Adder** - Add line numbers to text
- **Find & Replace** - Advanced find and replace with regex support
- **Unicode Inspector** - Analyze Unicode characters and properties

### 🔐 Data & Security Tools (19 tools)
- **JWT Decoder** - Decode and inspect JWT tokens
- **JWT Builder** - Create and sign JWT tokens
- **Base64 Encoder/Decoder** - Encode and decode Base64 strings
- **URL Encoder/Decoder** - Encode and decode URLs
- **HTML Entity Encoder** - Encode and decode HTML entities
- **MD5 Generator** - Generate MD5 hashes
- **SHA Generator** - Generate SHA-1, SHA-256, SHA-512 hashes
- **Bcrypt Generator** - Generate and verify bcrypt hashes
- **Argon2 Generator** - Generate Argon2 password hashes
- **HMAC Generator** - Generate HMAC signatures
- **Base Converter** - Convert between different number bases
- **Caesar Cipher** - Encrypt/decrypt using Caesar cipher
- **ROT13 Encoder** - Apply ROT13 encoding
- **Punycode Converter** - Convert between Unicode and Punycode
- **AES Encryptor** - Encrypt/decrypt using AES
- **RSA Key Generator** - Generate RSA key pairs
- **QR Code Decoder** - Decode QR codes from images
- **Morse Converter** - Convert text to Morse code
- **Environment Checker** - Validate environment variables

### 🎨 Design & Color Tools (3 tools)
- **Color Palette Generator** - Generate harmonious color palettes
- **CSS Gradient Generator** - Create and customize CSS gradients
- **Image to Base64** - Convert images to Base64 encoding
- **HTML Color to Hex** - Convert HTML color names to hex codes

### 💻 Development Tools (5 tools)
- **API Tester** - Test HTTP requests with full request/response inspection
- **cURL Generator** - Generate cURL commands from HTTP requests
- **Regex Tester** - Test and debug regular expressions
- **Timestamp Converter** - Convert between Unix timestamps and dates
- **UUID Generator** - Generate UUIDs (v1, v4)

### 🌐 Web & HTML Tools (6 tools)
- **HTML Previewer** - Live preview HTML with device size toggle
- **HTML Minifier** - Compress HTML by removing whitespace and comments
- **HTML Beautifier** - Format HTML with proper indentation
- **HTML to Markdown** - Convert HTML to clean Markdown syntax
- **Markdown to HTML** - Convert Markdown to HTML
- **HTML to JSX** - Convert HTML to React JSX components
- **SQL Formatter** - Format and beautify SQL queries

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/maman/devtools-hub.git
cd devtools-hub
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

5. **Open in browser**
Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
devtools-hub/
├── src/
│   ├── app/                    # Next.js app directory
│   │   └── [locale]/          # i18n routing
│   ├── components/            # Reusable React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── layout/           # Layout components
│   │   └── shared/           # Shared components
│   ├── config/               # Configuration files
│   │   ├── site.ts          # Site metadata
│   │   ├── theme.ts         # Theme configuration
│   │   └── tools-registry.ts # Tool registry
│   ├── constants/            # Application constants
│   ├── features/             # Feature modules (one per tool)
│   │   ├── json-formatter/
│   │   ├── api-tester/
│   │   └── ...
│   ├── i18n/                 # Internationalization
│   ├── lib/                  # Utility functions
│   ├── providers/            # React providers
│   ├── services/             # API services
│   ├── store/                # Redux store
│   └── styles/               # Global styles
├── public/                    # Static assets
├── messages/                  # i18n translations
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.mjs
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Next.js 16.2.6** | React framework with SSR & SSG |
| **React 19.2.4** | UI library |
| **TypeScript 5** | Type-safe JavaScript |
| **Tailwind CSS 4** | Utility-first CSS framework |
| **shadcn/ui** | High-quality React components |
| **next-intl** | Internationalization (i18n) |
| **Redux Toolkit** | State management |
| **React Query** | Server state management |
| **Zod** | Schema validation |
| **Lucide React** | Icon library |
| **Framer Motion** | Animation library |

### Key Dependencies

```json
{
  "next": "16.2.6",
  "react": "19.2.4",
  "typescript": "^5",
  "tailwindcss": "^4",
  "next-intl": "^4.11.1",
  "@reduxjs/toolkit": "^2.11.2",
  "@tanstack/react-query": "^5.100.9",
  "zod": "^4.4.3",
  "lucide-react": "^1.14.0"
}
```

---

## 🌍 Internationalization

DevTools Hub supports multiple languages through **next-intl**:

- **English** (en)
- **Urdu** (ur)

Translation files are located in `/messages` directory. To add a new language:

1. Create a new translation file: `messages/[locale].json`
2. Add the locale to `src/i18n/routing.ts`
3. Translate all keys from existing language files

---

## 📖 Documentation

### Adding a New Tool

1. **Create feature directory**
```bash
mkdir -p src/features/my-tool/components
```

2. **Create tool component**
```typescript
// src/features/my-tool/components/my-tool-client.tsx
'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ToolNavigation } from '@/components/tool-navigation';

export function MyToolClient() {
  const t = useTranslations('tools.my-tool');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  return (
    <div className="space-y-12">
      {/* Your tool UI */}
      <ToolNavigation currentToolId="my-tool" />
    </div>
  );
}
```

3. **Register in tools registry**
```typescript
// src/config/tools-registry.ts
'my-tool': {
  component: dynamic(() => import('@/features/my-tool/components/my-tool-client').then(m => m.MyToolClient)),
},
```

4. **Add to tools list**
```typescript
// src/constants/tools.ts
{ id: 'my-tool', icon: Code, category: 'text' },
```

5. **Add translations**
```json
// messages/en.json
{
  "tools": {
    "my-tool": {
      "title": "My Tool",
      "description": "Tool description",
      "input": "Input",
      "output": "Output",
      "article": "Detailed article about the tool..."
    }
  }
}
```

### Component Patterns

All tools follow a consistent UI pattern:

```
┌─────────────────────────────────────────────────┐
│  Input (9 cols)  │  Output (9 cols)  │ Settings │
│                  │                    │ (3 cols) │
│  ┌────────────┐  │  ┌────────────┐   │          │
│  │            │  │  │            │   │ Options  │
│  │   Input    │  │  │   Output   │   │ Buttons  │
│  │   Area     │  │  │   Area     │   │ Stats    │
│  │            │  │  │            │   │          │
│  └────────────┘  │  └────────────┘   │          │
└─────────────────────────────────────────────────┘
```

---

## 🎨 Customization

### Theme Configuration

Edit `src/config/theme.ts` to customize colors and styling:

```typescript
export const themeConfig = {
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    // ...
  },
};
```

### Site Configuration

Update `src/config/site.ts` for site metadata:

```typescript
export const siteConfig = {
  name: 'DevTools Hub',
  description: 'Your description',
  url: 'https://your-domain.com',
  links: {
    github: 'https://github.com/your-repo',
  },
};
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
```bash
git push origin main
```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js configuration
   - Click Deploy

3. **Environment Variables**
   - Add any required `.env` variables in Vercel dashboard

### Deploy to Other Platforms

**Docker:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

**Build and run:**
```bash
docker build -t devtools-hub .
docker run -p 3000:3000 devtools-hub
```

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Workflow

1. **Fork the repository**
```bash
git clone https://github.com/your-username/devtools-hub.git
cd devtools-hub
```

2. **Create a feature branch**
```bash
git checkout -b feature/amazing-feature
```

3. **Make your changes**
   - Follow the existing code style
   - Add tests if applicable
   - Update documentation

4. **Commit your changes**
```bash
git commit -m 'Add amazing feature'
```

5. **Push to your fork**
```bash
git push origin feature/amazing-feature
```

6. **Open a Pull Request**
   - Describe your changes clearly
   - Reference any related issues
   - Wait for review and feedback

### Code Style Guidelines

- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages
- Add comments for complex logic

### Running Tests

```bash
npm run test
npm run lint
```

---

## 📋 Roadmap

### Phase 1 ✅ (Complete)
- [x] Core infrastructure setup
- [x] 40 essential developer tools
- [x] Multi-language support (EN, UR)
- [x] Dark/Light theme toggle
- [x] Responsive design

### Phase 2 🚀 (In Progress)
- [x] HTML Processing Tools (6 tools)
  - HTML Previewer
  - HTML Minifier
  - HTML Beautifier
  - HTML to Markdown
  - Markdown to HTML
  - HTML to JSX

### Phase 3 (Planned)
- [ ] Advanced API tools
- [ ] Database utilities
- [ ] Code generation tools
- [ ] Performance analysis tools
- [ ] Browser extensions
- [ ] CLI tool
- [ ] Mobile app

---

## 🐛 Bug Reports & Feature Requests

Found a bug or have a feature idea?

- **GitHub Issues**: [Create an issue](https://github.com/maman/devtools-hub/issues)
- **Email**: support@devtools-hub.com
- **Twitter**: [@devtoolshub](https://twitter.com/devtoolshub)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### What you can do:
- ✅ Use commercially
- ✅ Modify the code
- ✅ Distribute
- ✅ Use privately

### What you must do:
- ✅ Include license and copyright notice

---

## 👥 Authors & Contributors

### Core Team
- **Amanullah** - Creator & Lead Developer
  - GitHub: [@maman](https://github.com/maman)
  - Twitter: [@amanullah](https://twitter.com/amanullah)

### Contributors
We appreciate all contributions! See [CONTRIBUTORS.md](CONTRIBUTORS.md) for a list of all contributors.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) - React framework
- [Tailwind CSS](https://tailwindcss.com) - CSS framework
- [shadcn/ui](https://ui.shadcn.com) - UI components
- [Vercel](https://vercel.com) - Hosting platform
- All open-source contributors

---

## 📞 Support

### Getting Help

1. **Documentation**: Check [docs](https://devtools-hub-taupe.vercel.app/docs)
2. **GitHub Discussions**: [Ask questions](https://github.com/maman/devtools-hub/discussions)
3. **Issues**: [Report bugs](https://github.com/maman/devtools-hub/issues)

### Community

- **Discord**: [Join our server](https://discord.gg/devtools-hub)
- **Twitter**: [@devtoolshub](https://twitter.com/devtoolshub)
- **Email**: hello@devtools-hub.com

---

## 📊 Project Stats

- **Total Tools**: 46+
- **Languages Supported**: 2 (English, Urdu)
- **Code Lines**: 10,000+
- **Components**: 50+
- **Test Coverage**: 80%+

---

## 🔗 Links

| Link | URL |
|------|-----|
| **Live Demo** | https://devtools-hub-taupe.vercel.app |
| **GitHub** | https://github.com/maman/devtools-hub |
| **Issues** | https://github.com/maman/devtools-hub/issues |
| **Discussions** | https://github.com/maman/devtools-hub/discussions |
| **Twitter** | https://twitter.com/devtoolshub |

---

<div align="center">

**Made with ❤️ by the DevTools Hub Team**

[⬆ Back to top](#devtools-hub)

</div>
