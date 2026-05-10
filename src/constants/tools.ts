import { 
  Code, ShieldCheck, Repeat, Terminal, FileCode, Palette, Zap, Shield, Globe, Cpu 
} from 'lucide-react';

export const TOOLS = [
  { id: 'json-formatter', icon: Code, category: 'text' },
  { id: 'json-to-csv', icon: FileCode, category: 'text' },
  { id: 'csv-to-json', icon: FileCode, category: 'text' },
  { id: 'xml-formatter', icon: Code, category: 'text' },
  { id: 'yaml-validator', icon: FileCode, category: 'text' },
  { id: 'toml-validator', icon: FileCode, category: 'text' },
  { id: 'markdown-previewer', icon: FileCode, category: 'text' },
  { id: 'code-diff-checker', icon: Code, category: 'text' },
  { id: 'word-counter', icon: FileCode, category: 'text' },
  { id: 'lorem-ipsum', icon: FileCode, category: 'text' },
  { id: 'case-converter', icon: FileCode, category: 'text' },
  { id: 'slug-generator', icon: FileCode, category: 'text' },
  { id: 'string-reverse', icon: FileCode, category: 'text' },
  { id: 'duplicate-remover', icon: FileCode, category: 'text' },
  { id: 'whitespace-remover', icon: FileCode, category: 'text' },
  { id: 'ascii-art', icon: Palette, category: 'text' },
  { id: 'emoji-picker', icon: Palette, category: 'text' },
  { id: 'text-sorter', icon: FileCode, category: 'text' },
  { id: 'line-number-adder', icon: FileCode, category: 'text' },
  { id: 'find-replace', icon: FileCode, category: 'text' },
  { id: 'jwt-decoder', icon: ShieldCheck, category: 'data' },
  { id: 'base64-encoder', icon: Repeat, category: 'data' },
  { id: 'env-checker', icon: Terminal, category: 'data' },
  { id: 'regex-tester', icon: Terminal, category: 'dev' },
  { id: 'timestamp-converter', icon: Terminal, category: 'dev' },
  { id: 'api-tester', icon: Terminal, category: 'dev' },
  { id: 'curl-generator', icon: Terminal, category: 'dev' },
  { id: 'uuid-generator', icon: Terminal, category: 'dev' },
  { id: 'color-palette-generator', icon: Palette, category: 'design' },
  { id: 'image-to-base64', icon: Palette, category: 'design' },
  { id: 'css-gradient-generator', icon: Palette, category: 'design' },
  { id: 'sql-formatter', icon: FileCode, category: 'web' },
  { id: 'html-previewer', icon: Code, category: 'web' },
];

export const CATEGORIES = ['all', 'text', 'data', 'dev', 'design', 'web'];
