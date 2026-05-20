"use client"

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Check, Settings2, Info, RefreshCw, Braces, Search, Zap } from 'lucide-react';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

export function CssVariablesGeneratorClient() {
  const t = useTranslations('tools.css-variables-generator');
  const commonT = useTranslations('common');
  const { copiedType, copyToClipboard } = useCopyToClipboard();

  const [input, setInput] = useState(':root {\n  --primary: #6366f1;\n  --secondary: #a855f7;\n  --bg-color: #f8fafc;\n}\n\n.button {\n  background: var(--primary);\n  color: var(--white, #fff);\n}');

  const variables = useMemo(() => {
    const defRegex = /--[a-zA-Z0-9_-]+\s*:/g;
    const usageRegex = /var\(\s*(--[a-zA-Z0-9_-]+)/g;
    const found = new Set<string>();
    let match;
    while ((match = defRegex.exec(input)) !== null) found.add(match[0].split(':')[0].trim());
    while ((match = usageRegex.exec(input)) !== null) found.add(match[1]);
    return Array.from(found).sort();
  }, [input]);

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 space-y-6">
        <ToolCard 
          title={t('input')} 
          action={<Button variant="ghost" size="icon" onClick={() => setInput('')} className="h-6 w-6 hover:text-destructive"><RefreshCw className="h-3.5 w-3.5" /></Button>}
          contentClassName="p-0 overflow-hidden focus-within:border-primary/20 transition-colors"
        >
           <Textarea placeholder={t('placeholder')} className="min-h-[250px] font-mono text-xs p-4 border-none focus-visible:ring-0 leading-relaxed resize-none" value={input} onChange={(e) => setInput(e.target.value)} />
        </ToolCard>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('output')}</Label>
            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(variables.join('\n'), 'all')} disabled={variables.length === 0} className="h-6 px-2 text-[10px] gap-1.5"><Copy className="h-3 w-3" />Copy List</Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
             {variables.map((name) => (
               <Card key={name} className="p-3 shadow-none border-border bg-background flex items-center justify-between group hover:border-primary/50 transition-all cursor-pointer" onClick={() => copyToClipboard(`var(${name})`, name)}>
                  <div className="space-y-0.5 overflow-hidden"><code className="text-[11px] font-bold text-primary font-mono truncate block">{name}</code><span className="text-[9px] text-muted-foreground font-mono">var({name})</span></div>
                  <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">{copiedType === name ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3 text-muted-foreground" />}</div>
               </Card>
             ))}
             {variables.length === 0 && (
               <div className="col-span-full py-12 text-center bg-muted/10 rounded-xl border border-dashed border-border"><Braces className="h-10 w-10 text-muted-foreground/20 mx-auto mb-2" /><p className="text-xs text-muted-foreground">No CSS variables detected in the input.</p></div>
             )}
          </div>
        </div>
      </div>

      <div className="md:col-span-1 space-y-4">
        <ToolCard title={commonT('ui.info')} icon={Settings2} contentClassName="p-4 space-y-4">
           <div className="p-3 rounded-md bg-muted/30 border border-border flex gap-2.5 items-start">
            <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-[10px] text-muted-foreground leading-normal">{t('sidebar_desc')}</p>
          </div>
          <div className="space-y-3">
             <Label className="text-[10px] font-bold text-foreground uppercase tracking-widest">Capabilities</Label>
             <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 rounded bg-primary/5 border border-primary/10"><Search className="h-3 w-3 text-primary" /><p className="text-[10px] leading-tight text-muted-foreground">Extracts variables from both definitions (--var) and usage (var()).</p></div>
                <div className="flex items-center gap-2 p-2 rounded bg-blue-500/5 border border-blue-500/10"><Zap className="h-3 w-3 text-blue-500" /><p className="text-[10px] leading-tight text-muted-foreground">Unique variables are sorted alphabetically for easy lookup.</p></div>
             </div>
          </div>
        </ToolCard>
      </div>
    </div>
  );
}
