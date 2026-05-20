# DevTools Hub - Refactor Plan

**Date**: May 19, 2026  
**Repository**: devtools-hub  
**Goal**: Create scalable global component architecture

---

## Executive Summary

This document outlines a comprehensive, **non-breaking refactor strategy** to transform the devtools-hub repository from a duplicated codebase into a scalable, maintainable architecture with global reusable components.

### Goals

1. **Eliminate 40-50% code duplication** (~5,000 lines)
2. **Create 7 global reusable components**
3. **Create 4 custom hooks** for common patterns
4. **Standardize design system**
5. **Remove 13 custom page.tsx files**
6. **Achieve 100% consistent UI** across all tools

### Timeline

- **Phase 1**: 1 week (High-impact components)
- **Phase 2**: 1 week (Medium-impact components)
- **Phase 3**: 1 week (Low-impact components + cleanup)
- **Total**: 3 weeks

---

## Phase 1: Foundation (Week 1)

### Day 1-2: Create Global Component Structure

#### Step 1.1: Create Component Folders

```bash
# Create new folder structure
mkdir src/components/common
mkdir src/components/tool-shell
mkdir src/hooks/tool
```

#### Step 1.2: Create Base Components

**Priority Order**:
1. `<CopyButton>` - Highest impact (1,308 lines saved)
2. `<DownloadButton>` - High impact (1,440 lines saved)
3. `<ToolActions>` - High impact (900 lines saved)

**Files to Create**:
```
src/components/common/
├── copy-button.tsx
├── download-button.tsx
├── tool-actions.tsx
└── index.ts (barrel export)
```

#### Step 1.3: Create Custom Hooks

**Files to Create**:
```
src/hooks/tool/
├── use-language.ts
├── use-download.ts
├── use-tool-state.ts
└── index.ts (barrel export)
```

### Day 3-4: Implement High-Impact Components

#### Component 1: CopyButton

**File**: `src/components/common/copy-button.tsx`

```typescript
'use client';

import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

interface CopyButtonProps {
  text: string;
  type?: string;
  disabled?: boolean;
  variant?: 'default' | 'icon';
  className?: string;
}

export function CopyButton({ 
  text, 
  type = 'default', 
  disabled = false,
  variant = 'default',
  className = ''
}: CopyButtonProps) {
  const tCommon = useTranslations('common');
  const { copiedType, copyToClipboard } = useCopyToClipboard();
  
  const isCopied = copiedType === type;
  
  if (variant === 'icon') {
    return (
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => copyToClipboard(text, type)} 
        disabled={disabled || !text}
        title={tCommon('copy')}
        className={`h-6 w-6 ${className}`}
      >
        {isCopied ? (
          <Check className="h-3 w-3 text-green-500" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </Button>
    );
  }
  
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={() => copyToClipboard(text, type)} 
      disabled={disabled || !text}
      className={`h-6 px-2 text-[10px] gap-1.5 ${className}`}
    >
      {isCopied ? (
        <Check className="h-3 w-3 text-green-500" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
      {tCommon('copy')}
    </Button>
  );
}
```

#### Component 2: DownloadButton

**File**: `src/components/common/download-button.tsx`

```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface DownloadButtonProps {
  content: string;
  filename: string;
  mimeType?: string;
  disabled?: boolean;
  className?: string;
}

export function DownloadButton({ 
  content, 
  filename,
  mimeType = 'text/plain',
  disabled = false,
  className = ''
}: DownloadButtonProps) {
  const tCommon = useTranslations('common');
  const [downloaded, setDownloaded] = useState(false);
  
  const handleDownload = () => {
    if (!content) return;
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };
  
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleDownload} 
      disabled={disabled || !content}
      className={`h-6 px-2 text-[10px] gap-1.5 ${className}`}
    >
      {downloaded ? (
        <Check className="h-3 w-3 text-green-500" />
      ) : (
        <Download className="h-3 w-3" />
      )}
      {tCommon('download')}
    </Button>
  );
}
```

#### Component 3: ToolActions

**File**: `src/components/common/tool-actions.tsx`

```typescript
'use client';

import { Button } from '@/components/ui/button';
import { RefreshCw, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ToolActionsProps {
  onSample?: () => void;
  onClear: () => void;
  showSample?: boolean;
  disabled?: boolean;
  className?: string;
}

export function ToolActions({ 
  onSample, 
  onClear,
  showSample = true,
  disabled = false,
  className = ''
}: ToolActionsProps) {
  const tCommon = useTranslations('common');
  
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {showSample && onSample && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onSample}
          disabled={disabled}
          className="h-6 px-2 text-[10px] gap-1.5"
        >
          <RefreshCw className="h-3 w-3" />
          {tCommon('sample')}
        </Button>
      )}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onClear} 
        disabled={disabled}
        title={tCommon('clear')} 
        className="h-6 w-6 hover:text-destructive"
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
}
```

#### Hook 1: useLanguage

**File**: `src/hooks/tool/use-language.ts`

```typescript
'use client';

import { useLocale } from 'next-intl';

export function useLanguage() {
  const locale = useLocale();
  
  return {
    locale,
    isEnglish: locale === 'en',
    isUrdu: locale === 'ur',
    dir: locale === 'ur' ? 'rtl' : 'ltr',
  };
}
```

### Day 5: Migrate 5 Pilot Tools

**Pilot Tools** (simple tools for testing):
1. `string-reverse`
2. `slug-generator`
3. `uuid-generator`
4. `case-converter`
5. `word-counter`

**Migration Steps**:
1. Import new components
2. Replace duplicated code
3. Test functionality
4. Verify no regressions

**Example Migration**:

```typescript
// Before
const { copiedType, copyToClipboard } = useCopyToClipboard();
<Button variant="ghost" size="sm" onClick={() => copyToClipboard(output, 'json')} disabled={!output} className="h-6 px-2 text-[10px] gap-1.5">
  {copiedType === 'json' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
  {tCommon('copy')}
</Button>

// After
import { CopyButton } from '@/components/common';
<CopyButton text={output} type="json" />
```

### Day 6-7: Migrate Remaining Tools (Phase 1)

**Batch Migration Strategy**:
- Migrate 20 tools per day
- Test each batch before moving to next
- Document any issues

**Tools by Category**:
- Day 6 Morning: Text tools (20 tools)
- Day 6 Afternoon: Data tools (20 tools)
- Day 7 Morning: Dev tools (15 tools)
- Day 7 Afternoon: Design tools (25 tools)

---

## Phase 2: Enhancement (Week 2)

### Day 8-9: Create Medium-Impact Components

#### Component 4: StatsDisplay

**File**: `src/components/common/stats-display.tsx`

```typescript
'use client';

import { ReactNode } from 'react';

interface StatsDisplayProps {
  title: ReactNode;
  stats?: {
    chars?: number;
    lines?: number;
    words?: number;
    size?: string;
  };
  showDivider?: boolean;
}

export function StatsDisplay({ 
  title, 
  stats,
  showDivider = true
}: StatsDisplayProps) {
  if (!stats || Object.keys(stats).length === 0) {
    return <>{title}</>;
  }
  
  const statItems = [];
  if (stats.chars !== undefined) statItems.push(`${stats.chars} chars`);
  if (stats.lines !== undefined) statItems.push(`${stats.lines} lines`);
  if (stats.words !== undefined) statItems.push(`${stats.words} words`);
  if (stats.size !== undefined) statItems.push(`${stats.size} KB`);
  
  return (
    <div className="flex items-center gap-2">
      {title}
      {showDivider && statItems.length > 0 && (
        <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
      )}
      {statItems.length > 0 && (
        <span className="text-[10px] text-muted-foreground/60 normal-case tracking-normal">
          {statItems.join(' • ')}
        </span>
      )}
    </div>
  );
}
```

#### Component 5: InfoBox

**File**: `src/components/common/info-box.tsx`

```typescript
'use client';

import { Info } from 'lucide-react';
import { ReactNode } from 'react';

interface InfoBoxProps {
  children: ReactNode;
  title?: string;
  variant?: 'default' | 'compact';
  className?: string;
}

export function InfoBox({ 
  children, 
  title,
  variant = 'default',
  className = ''
}: InfoBoxProps) {
  if (variant === 'compact') {
    return (
      <div className={`p-3 rounded-md bg-muted/30 border border-border flex gap-2.5 items-start ${className}`}>
        <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
        <p className="text-[10px] text-muted-foreground leading-normal">
          {children}
        </p>
      </div>
    );
  }
  
  return (
    <div className={`p-3 rounded-md bg-muted/50 border space-y-1.5 ${className}`}>
      {title && (
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase">
          <Info className="h-3 w-3" />
          {title}
        </div>
      )}
      <p className="text-[10px] text-muted-foreground leading-relaxed">
        {children}
      </p>
    </div>
  );
}
```

#### Component 6: CodeTextarea

**File**: `src/components/common/code-textarea.tsx`

```typescript
'use client';

import { Textarea } from '@/components/ui/textarea';
import { forwardRef } from 'react';

interface CodeTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const CodeTextarea = forwardRef<HTMLTextAreaElement, CodeTextareaProps>(
  ({ value, onChange, placeholder, disabled, className = '' }, ref) => {
    return (
      <Textarea
        ref={ref}
        placeholder={placeholder}
        className={`flex-1 font-mono text-xs resize-none border-none focus-visible:ring-0 p-3 bg-transparent leading-relaxed ${className}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    );
  }
);

CodeTextarea.displayName = 'CodeTextarea';
```

### Day 10-11: Migrate All Tools (Phase 2)

**Migration Focus**:
- Replace `StatsDisplay` pattern (80 tools)
- Replace `InfoBox` pattern (109 tools)
- Replace `CodeTextarea` pattern (70 tools)

### Day 12-14: Create Advanced Components

#### Component 7: EmptyState

**File**: `src/components/common/empty-state.tsx`

```typescript
'use client';

import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  message: string;
  variant?: 'inline' | 'centered';
  className?: string;
}

export function EmptyState({ 
  icon: Icon, 
  message,
  variant = 'inline',
  className = ''
}: EmptyStateProps) {
  if (variant === 'inline') {
    return (
      <span className={`text-muted-foreground ${className}`}>
        {message}
      </span>
    );
  }
  
  return (
    <div className={`flex-1 flex items-center justify-center text-muted-foreground ${className}`}>
      <div className="text-center space-y-2">
        {Icon && <Icon className="h-8 w-8 mx-auto opacity-50" />}
        <p className="text-xs">{message}</p>
      </div>
    </div>
  );
}
```

#### Hook 2: useToolState

**File**: `src/hooks/tool/use-tool-state.ts`

```typescript
'use client';

import { useState, useCallback } from 'react';

interface UseToolStateOptions {
  initialInput?: string;
  initialOutput?: string;
  processor?: (input: string) => string | Promise<string>;
}

export function useToolState(options: UseToolStateOptions = {}) {
  const [input, setInput] = useState(options.initialInput || '');
  const [output, setOutput] = useState(options.initialOutput || '');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const process = useCallback(async (value?: string) => {
    const textToProcess = value !== undefined ? value : input;
    
    if (!textToProcess.trim()) {
      setOutput('');
      setError(null);
      return;
    }
    
    if (!options.processor) {
      return;
    }
    
    try {
      setIsProcessing(true);
      setError(null);
      const result = await options.processor(textToProcess);
      setOutput(result);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setOutput('');
    } finally {
      setIsProcessing(false);
    }
  }, [input, options.processor]);
  
  const clear = useCallback(() => {
    setInput('');
    setOutput('');
    setError(null);
  }, []);
  
  return {
    input,
    setInput,
    output,
    setOutput,
    error,
    setError,
    isProcessing,
    process,
    clear,
  };
}
```

---

## Phase 3: Cleanup & Optimization (Week 3)

### Day 15-16: Remove Custom page.tsx Files

**Files to Delete** (13 files):
```bash
rm src/features/animation-builder/page.tsx
rm src/features/color-contrast-checker/page.tsx
rm src/features/color-format-converter/page.tsx
rm src/features/color-palette-generator/page.tsx
rm src/features/css-specificity-calculator/page.tsx
rm src/features/css-unit-converter/page.tsx
rm src/features/css-variables-generator/page.tsx
rm src/features/flexbox-playground/page.tsx
rm src/features/glassmorphism-generator/page.tsx
rm src/features/grid-generator/page.tsx
rm src/features/neumorphism-generator/page.tsx
rm src/features/tailwind-class-lookup/page.tsx
rm src/features/typography-scale-generator/page.tsx
```

**Verification**:
- Test all 13 tools still render correctly
- Verify routing works
- Check SEO metadata

### Day 17: Standardize Design Tokens

**Create Design System Documentation**:

**File**: `src/config/design-tokens.ts`

```typescript
export const DESIGN_TOKENS = {
  // Button Sizes
  button: {
    action: 'h-6 px-2 text-[10px]',
    icon: 'h-6 w-6',
    default: 'h-8 px-4 text-sm',
  },
  
  // Icon Sizes
  icon: {
    button: 'h-3.5 w-3.5',
    header: 'h-4 w-4',
    large: 'h-8 w-8',
  },
  
  // Card Padding
  card: {
    content: 'p-4 space-y-5',
    settings: 'p-4 space-y-6',
    compact: 'p-3 space-y-4',
  },
  
  // Typography
  text: {
    label: 'text-xs font-medium',
    description: 'text-[10px] text-muted-foreground',
    code: 'font-mono text-xs',
  },
};
```

### Day 18-19: Create Component Documentation

**Create Storybook or Documentation Site**:

**File**: `.storybook/main.ts` (if using Storybook)

```typescript
import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: ['../src/components/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
};

export default config;
```

**Create Stories for Each Component**:

**File**: `src/components/common/copy-button.stories.tsx`

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { CopyButton } from './copy-button';

const meta: Meta<typeof CopyButton> = {
  title: 'Common/CopyButton',
  component: CopyButton,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CopyButton>;

export const Default: Story = {
  args: {
    text: 'Hello, World!',
    type: 'default',
  },
};

export const Icon: Story = {
  args: {
    text: 'Hello, World!',
    type: 'default',
    variant: 'icon',
  },
};

export const Disabled: Story = {
  args: {
    text: '',
    type: 'default',
    disabled: true,
  },
};
```

### Day 20-21: Testing & Verification

**Create Test Suite**:

**File**: `src/components/common/__tests__/copy-button.test.tsx`

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { CopyButton } from '../copy-button';

describe('CopyButton', () => {
  it('renders correctly', () => {
    render(<CopyButton text="test" type="default" />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
  
  it('copies text to clipboard', async () => {
    const mockClipboard = {
      writeText: jest.fn(),
    };
    Object.assign(navigator, { clipboard: mockClipboard });
    
    render(<CopyButton text="test" type="default" />);
    fireEvent.click(screen.getByRole('button'));
    
    expect(mockClipboard.writeText).toHaveBeenCalledWith('test');
  });
  
  it('shows success state after copy', async () => {
    render(<CopyButton text="test" type="default" />);
    fireEvent.click(screen.getByRole('button'));
    
    // Check for success icon (Check component)
    expect(screen.getByTestId('check-icon')).toBeInTheDocument();
  });
});
```

**Run Full Test Suite**:
```bash
npm run test
npm run test:coverage
```

**Manual Testing Checklist**:
- [ ] All 109 tools render correctly
- [ ] Copy buttons work in all tools
- [ ] Download buttons work in all tools
- [ ] Sample/Clear buttons work in all tools
- [ ] Stats display correctly in all tools
- [ ] Info boxes display correctly in all tools
- [ ] Empty states display correctly in all tools
- [ ] All tools work on mobile
- [ ] All tools work in dark mode
- [ ] All tools work in both locales (en, ur)

---

## Migration Checklist

### Pre-Migration

- [ ] Create backup branch
- [ ] Document current state
- [ ] Set up testing environment
- [ ] Create rollback plan

### Phase 1 Checklist

- [ ] Create `src/components/common` folder
- [ ] Create `src/hooks/tool` folder
- [ ] Implement `CopyButton` component
- [ ] Implement `DownloadButton` component
- [ ] Implement `ToolActions` component
- [ ] Implement `useLanguage` hook
- [ ] Migrate 5 pilot tools
- [ ] Test pilot tools
- [ ] Migrate remaining tools (batch 1)
- [ ] Test batch 1
- [ ] Migrate remaining tools (batch 2)
- [ ] Test batch 2

### Phase 2 Checklist

- [ ] Implement `StatsDisplay` component
- [ ] Implement `InfoBox` component
- [ ] Implement `CodeTextarea` component
- [ ] Implement `useToolState` hook
- [ ] Migrate all tools (stats display)
- [ ] Migrate all tools (info boxes)
- [ ] Migrate all tools (code textareas)
- [ ] Test all migrations

### Phase 3 Checklist

- [ ] Delete 13 custom page.tsx files
- [ ] Test affected tools
- [ ] Create design tokens file
- [ ] Create component documentation
- [ ] Set up Storybook (optional)
- [ ] Write component tests
- [ ] Run full test suite
- [ ] Manual testing
- [ ] Performance testing
- [ ] Accessibility testing

### Post-Migration

- [ ] Update README with new architecture
- [ ] Update CONTRIBUTING guide
- [ ] Create component usage guide
- [ ] Document design system
- [ ] Create video tutorials (optional)
- [ ] Deploy to staging
- [ ] QA testing
- [ ] Deploy to production

---

## Rollback Plan

### If Issues Arise

**Immediate Rollback**:
```bash
git checkout main
git reset --hard <backup-commit-hash>
```

**Partial Rollback** (if only some tools have issues):
```bash
# Revert specific tool
git checkout main -- src/features/tool-name/
```

**Gradual Rollback**:
- Revert Phase 3 changes
- Revert Phase 2 changes
- Revert Phase 1 changes

---

## Success Metrics

### Code Quality Metrics

- **Lines of Code**: Reduce by 5,000+ lines
- **Code Duplication**: Reduce from 40-50% to <5%
- **Bundle Size**: Reduce by 700-1000 KB
- **Maintainability Index**: Increase from 60 to 85+

### Performance Metrics

- **Build Time**: Should remain similar or improve
- **Page Load Time**: Should remain similar or improve
- **Time to Interactive**: Should remain similar or improve

### Developer Experience Metrics

- **Time to Add New Tool**: Reduce from 2 hours to 30 minutes
- **Time to Update UI Globally**: Reduce from 4 hours to 5 minutes
- **Onboarding Time**: Reduce from 2 days to 4 hours

---

## Risk Assessment

### High Risk

- **Breaking Changes**: Potential to break all 109 tools
  - **Mitigation**: Thorough testing, gradual rollout, backup plan

### Medium Risk

- **Performance Regression**: New components may be slower
  - **Mitigation**: Performance testing, profiling, optimization

### Low Risk

- **User Experience Changes**: UI may look slightly different
  - **Mitigation**: Visual regression testing, user feedback

---

## Conclusion

This refactor plan provides a **safe, incremental approach** to transforming the devtools-hub repository into a scalable, maintainable codebase. By following this plan, we can:

1. **Eliminate massive code duplication**
2. **Create a consistent design system**
3. **Improve developer experience**
4. **Reduce maintenance burden**
5. **Enable rapid feature development**

The key to success is **incremental migration**, **thorough testing**, and **clear rollback plans**.

---

**End of Refactor Plan**
