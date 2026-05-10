# Contributing to DevTools Hub

Thank you for your interest in contributing to DevTools Hub! We welcome contributions from everyone, whether it's bug reports, feature requests, or code contributions.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Submitting Changes](#submitting-changes)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git
- A GitHub account

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
```bash
git clone https://github.com/your-username/devtools-hub.git
cd devtools-hub
```

3. Add upstream remote:
```bash
git remote add upstream https://github.com/maman/devtools-hub.git
```

## Development Setup

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

### Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your changes.

### Build for Production

```bash
npm run build
npm start
```

## Making Changes

### Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions
- `chore/` - Maintenance tasks

### Code Style

We use ESLint and Prettier for code formatting. Before committing:

```bash
npm run lint
npm run format
```

### TypeScript

- Always use TypeScript for new code
- Avoid `any` types - use proper type annotations
- Export types and interfaces for reusable components

Example:
```typescript
interface ToolProps {
  input: string;
  onInputChange: (value: string) => void;
}

export function MyTool({ input, onInputChange }: ToolProps) {
  // Component code
}
```

### Component Structure

Follow the established pattern for tool components:

```typescript
'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Check, Trash2, Download, Settings2, Info } from 'lucide-react';
import { ToolNavigation } from '@/components/tool-navigation';

export function MyToolClient() {
  const t = useTranslations('tools.my-tool');
  const tCommon = useTranslations('common');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const processTool = useCallback(() => {
    // Processing logic
    setOutput(result);
  }, [input]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Input/Output sections */}
      </div>
      <ToolNavigation currentToolId="my-tool" />
    </div>
  );
}
```

### Adding Translations

Update translation files for all supported languages:

**messages/en.json:**
```json
{
  "tools": {
    "my-tool": {
      "title": "My Tool",
      "description": "Tool description",
      "input": "Input",
      "output": "Output",
      "placeholder": "Enter your input...",
      "article": "Detailed article about the tool...",
      "faq": [
        {
          "question": "How do I use this tool?",
          "answer": "Answer here..."
        }
      ]
    }
  }
}
```

**messages/ur.json:**
```json
{
  "tools": {
    "my-tool": {
      "title": "میرا ٹول",
      "description": "ٹول کی تفصیل",
      "input": "ان پٹ",
      "output": "آؤٹ پٹ",
      "placeholder": "اپنی ان پٹ درج کریں...",
      "article": "ٹول کے بارے میں تفصیلی مضمون...",
      "faq": [
        {
          "question": "میں اس ٹول کو کیسے استعمال کروں؟",
          "answer": "جواب یہاں..."
        }
      ]
    }
  }
}
```

## Submitting Changes

### Before You Submit

1. **Update your branch**
```bash
git fetch upstream
git rebase upstream/main
```

2. **Run tests and linting**
```bash
npm run lint
npm run build
```

3. **Test your changes**
   - Test in development mode
   - Test in production build
   - Test on different browsers
   - Test on mobile devices

### Commit Your Changes

```bash
git add .
git commit -m "feat: add my new feature"
```

See [Commit Messages](#commit-messages) for guidelines.

### Push to Your Fork

```bash
git push origin feature/your-feature-name
```

## Coding Standards

### TypeScript

- Use strict mode
- Avoid `any` types
- Use proper interfaces and types
- Export types for reusable components

### React

- Use functional components with hooks
- Use `useCallback` for memoized functions
- Use `useState` for local state
- Avoid prop drilling - use context when needed

### Styling

- Use Tailwind CSS classes
- Follow the existing design system
- Use `cn()` utility for conditional classes
- Maintain responsive design

### Accessibility

- Use semantic HTML
- Add ARIA labels where needed
- Ensure keyboard navigation
- Test with screen readers

### Performance

- Lazy load components when possible
- Memoize expensive computations
- Optimize images
- Minimize bundle size

## Commit Messages

Follow the Conventional Commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style changes
- `refactor` - Code refactoring
- `perf` - Performance improvements
- `test` - Test additions
- `chore` - Maintenance

### Examples

```bash
git commit -m "feat(html-minifier): add comment removal option"
git commit -m "fix(api-tester): resolve header encoding issue"
git commit -m "docs: update installation instructions"
git commit -m "refactor(json-formatter): improve performance"
```

## Pull Request Process

### Before Creating a PR

1. Ensure your code follows the coding standards
2. Update documentation if needed
3. Add translations for new strings
4. Test thoroughly

### Creating a PR

1. Go to the original repository
2. Click "New Pull Request"
3. Select your branch
4. Fill in the PR template:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #(issue number)

## Testing
Describe how you tested the changes

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] All tests passing
```

### PR Review Process

1. At least one maintainer review required
2. All CI checks must pass
3. Address feedback and make requested changes
4. Once approved, your PR will be merged

## Reporting Bugs

### Before Reporting

1. Check existing issues
2. Update to the latest version
3. Try to reproduce the issue

### Bug Report Template

```markdown
## Description
Clear description of the bug

## Steps to Reproduce
1. Go to...
2. Click on...
3. See error...

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 120]
- Node version: [e.g., 18.0.0]

## Screenshots
If applicable, add screenshots

## Additional Context
Any other relevant information
```

## Feature Requests

### Feature Request Template

```markdown
## Description
Clear description of the feature

## Use Case
Why is this feature needed?

## Proposed Solution
How should it work?

## Alternatives
Any alternative approaches?

## Additional Context
Any other relevant information
```

## Questions?

- Open a GitHub Discussion
- Check existing documentation
- Ask in our Discord community

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- GitHub contributors page
- Release notes

Thank you for contributing to DevTools Hub! 🎉
