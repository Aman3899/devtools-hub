import { 
  Code, ShieldCheck, Repeat, Terminal, FileCode, Palette, Zap, Shield, Globe, Cpu 
} from 'lucide-react';

export const TOOLS = [
  { id: 'json-formatter', icon: Code, category: 'data' },
  { id: 'jwt-decoder', icon: ShieldCheck, category: 'data' },
  { id: 'base64-encoder', icon: Repeat, category: 'data' },
  { id: 'env-checker', icon: Terminal, category: 'data' },
  { id: 'regex-tester', icon: Terminal, category: 'dev' },
  { id: 'timestamp-converter', icon: Terminal, category: 'dev' },
  { id: 'api-tester', icon: Terminal, category: 'dev' },
  { id: 'curl-generator', icon: Terminal, category: 'dev' },
  { id: 'uuid-generator', icon: Terminal, category: 'dev' },
  { id: 'code-diff-checker', icon: Code, category: 'dev' },
  { id: 'color-palette-generator', icon: Palette, category: 'design' },
  { id: 'image-to-base64', icon: Palette, category: 'design' },
  { id: 'css-gradient-generator', icon: Palette, category: 'design' },
  { id: 'sql-formatter', icon: FileCode, category: 'web' },
  { id: 'html-previewer', icon: Code, category: 'web' },
];

export const CATEGORIES = ['all', 'data', 'dev', 'design', 'web'];
