"use client"

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Check, Settings2, Info, RefreshCw, BoxSelect, Terminal, FileCode } from 'lucide-react';
import { ToolNavigation } from '@/components/tool-navigation';

export function CSSVariablesGeneratorClient() {
  const t = useTranslations('tools.css-variables-generator');
  const commonT = useTranslations('common');

  const [input, setInput] = useState<string>(`body {
  background-color: #ffffff;
  color: #333333;
  margin: 16px;
  padding: 24px;
}

.button {
  background: #6366f1;
  border-radius: 8px;
  padding: 12px 24px;
}`);

  const [copied, setCopied] = useState<string | null>(null);

  const result = useMemo(() => {
    if (!input.trim()) return { variables: '', refactored: '' };

    const colorRegex = /#(?:[0-9a-fA-F]{3}){1,2}|rgb\([^)]+\)|hsl\([^)]+\)/g;
    const colors = Array.from(new Set(input.match(colorRegex) || []));
    
    let variables = ':root {\n';
    let refactored = input;

    colors.forEach((color, i) => {
      const varName = `--color-${i + 1}`;
      variables += `  ${varName}: ${color};\n`;
      // Escape special characters in color for regex
      const escapedColor = color.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      refactored = refactored.replace(new RegExp(escapedColor, 'g'), `var(${varName})`);
    });

    variables += '}';

    return { variables, refactored };
  }, [input]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const reset = () => setInput('');

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-12 space-y-6">
          {/* Input Area */}
          <div className="flex flex-col gap-2">
            <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1">{t('input_label')}</Label>
            <Card className="border border-border shadow-none overflow-hidden">
               <Textarea 
                 placeholder={t('placeholder')}
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 className="min-h-[200px] font-mono text-sm border-none focus-visible:ring-0 resize-y p-4"
               />
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
             {/* Variables Area */}
             <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between px-1">
                   <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('extracted_variables')}</Label>
                   <Button 
                     variant="ghost" 
                     size="sm" 
                     onClick={() => copyToClipboard(result.variables, 'vars')}
                     className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                   >
                     {copied === 'vars' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                     {commonT('copy')}
                   </Button>
                </div>
                <Card className="border border-border shadow-none rounded-md bg-muted/20 p-4 font-mono text-xs overflow-x-auto h-[300px]">
                   <pre className="whitespace-pre-wrap">{result.variables}</pre>
                </Card>
             </div>

             {/* Refactored Area */}
             <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between px-1">
                   <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('refactored_css')}</Label>
                   <Button 
                     variant="ghost" 
                     size="sm" 
                     onClick={() => copyToClipboard(result.refactored, 'refactored')}
                     className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                   >
                     {copied === 'refactored' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                     {commonT('copy')}
                   </Button>
                </div>
                <Card className="border border-border shadow-none rounded-md bg-muted/20 p-4 font-mono text-xs overflow-x-auto h-[300px]">
                   <pre className="whitespace-pre-wrap">{result.refactored}</pre>
                </Card>
             </div>
          </div>

          <div className="p-4 rounded-lg bg-indigo-500/5 border border-indigo-500/10 flex gap-4 items-start">
             <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center shrink-0">
                <Terminal className="h-5 w-5 text-indigo-600" />
             </div>
             <div className="space-y-1 pt-1">
                <h4 className="text-sm font-bold">{t('did_you_know')}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                   {t('did_you_know_desc')}
                </p>
             </div>
          </div>
        </div>
      </div>
      <ToolNavigation currentToolId="css-variables-generator" />
    </div>
  );
}
