"use client"

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Check, Settings2, Info, RefreshCw, Braces, FileCode, Search, Zap } from 'lucide-react';
import { ToolNavigation } from '@/components/tool-navigation';
import { toast } from 'sonner';

export function CssVariablesGeneratorClient() {
  const t = useTranslations('tools.css-variables-generator');
  const commonT = useTranslations('common');

  const [input, setInput] = useState(':root {\n  --primary: #6366f1;\n  --secondary: #a855f7;\n  --bg-color: #f8fafc;\n}\n\n.button {\n  background: var(--primary);\n  color: var(--white, #fff);\n}');
  const [copied, setCopied] = useState<string | null>(null);

  const variables = useMemo(() => {
    // Regex to find --variable-name: value; OR var(--variable-name)
    const defRegex = /--[a-zA-Z0-9_-]+\s*:/g;
    const usageRegex = /var\(\s*(--[a-zA-Z0-9_-]+)/g;

    const found = new Set<string>();

    let match;
    while ((match = defRegex.exec(input)) !== null) {
      found.add(match[0].split(':')[0].trim());
    }

    while ((match = usageRegex.exec(input)) !== null) {
      found.add(match[1]);
    }

    return Array.from(found).sort();
  }, [input]);

  const copyVar = (name: string) => {
    navigator.clipboard.writeText(`var(${name})`);
    setCopied(name);
    toast.success(commonT('copied'));
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(variables.join('\n'));
    toast.success(commonT('success'));
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 space-y-6">
          {/* Input Area */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('input')}</Label>
              <Button variant="ghost" size="icon" onClick={() => setInput('')} className="h-6 w-6 text-muted-foreground hover:text-destructive">
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            </div>
            <Card className="border border-border shadow-none rounded-md bg-background focus-within:border-primary/20 transition-colors overflow-hidden">
               <Textarea 
                 placeholder={t('placeholder')}
                 className="min-h-[250px] font-mono text-xs p-4 border-none focus-visible:ring-0 leading-relaxed resize-none"
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
               />
            </Card>
          </div>

          {/* Results Area */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('output')}</Label>
              <Button variant="ghost" size="sm" onClick={copyAll} disabled={variables.length === 0} className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground">
                <Copy className="h-3 w-3" />
                Copy List
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
               {variables.map((name) => (
                 <Card 
                   key={name} 
                   className="group p-3 flex items-center justify-between bg-background border-border shadow-none hover:border-primary/50 transition-all cursor-pointer"
                   onClick={() => copyVar(name)}
                 >
                    <div className="space-y-0.5 overflow-hidden">
                       <code className="text-[11px] font-bold text-primary font-mono truncate block">{name}</code>
                       <span className="text-[9px] text-muted-foreground font-mono">var({name})</span>
                    </div>
                    <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                       {copied === name ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3 text-muted-foreground" />}
                    </div>
                 </Card>
               ))}
               {variables.length === 0 && (
                 <div className="col-span-full py-12 text-center bg-muted/10 rounded-xl border border-dashed border-border">
                    <Braces className="h-10 w-10 text-muted-foreground/20 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">No CSS variables detected in the input.</p>
                 </div>
               )}
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="border border-border shadow-none rounded-md bg-background">
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-xs font-semibold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings2 className="h-3.5 w-3.5" />
                  {commonT('ui.info')}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
               <div className="p-3 rounded-md bg-muted/30 border border-border flex gap-2.5 items-start">
                <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted-foreground leading-normal">
                  {t('sidebar_desc')}
                </p>
              </div>
              <div className="space-y-3">
                 <Label className="text-[10px] font-bold text-foreground uppercase tracking-widest">Capabilities</Label>
                 <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 rounded bg-primary/5 border border-primary/10">
                       <Search className="h-3 w-3 text-primary" />
                       <p className="text-[10px] leading-tight text-muted-foreground">Extracts variables from both definitions (--var) and usage (var()).</p>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded bg-blue-500/5 border border-blue-500/10">
                       <Zap className="h-3 w-3 text-blue-500" />
                       <p className="text-[10px] leading-tight text-muted-foreground">Unique variables are sorted alphabetically for easy lookup.</p>
                    </div>
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ToolNavigation currentToolId="css-variables-generator" />
    </div>
  );
}
