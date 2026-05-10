'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Copy, Trash2, RefreshCw, ListFilter, ArrowRightLeft, SortAsc } from 'lucide-react';
import { toast } from 'sonner';
import { ToolNavigation } from '@/components/tool-navigation';

export function DuplicateRemoverClient() {
  const t = useTranslations('tools.duplicate-remover');
  const commonT = useTranslations('common');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [trimLines, setTrimLines] = useState(true);
  const [sortLines, setSortLines] = useState(false);

  const processLines = () => {
    if (!input.trim()) return;

    let lines = input.split('\n');
    
    if (trimLines) {
      lines = lines.map(line => line.trim());
    }

    lines = lines.filter(line => line !== '');

    const uniqueLines = Array.from(new Set(
      caseSensitive 
        ? lines 
        : lines.map(l => l.toLowerCase())
    ));

    // If not case sensitive, we need to map back to original casing (first occurrence)
    let finalLines = caseSensitive 
      ? uniqueLines 
      : Array.from(new Set(lines.map(l => l.toLowerCase())))
          .map(lower => lines.find(orig => orig.toLowerCase() === lower)!);

    if (sortLines) {
      finalLines.sort((a, b) => a.localeCompare(b));
    }

    setOutput(finalLines.join('\n'));
    toast.success(commonT('success'));
  };

  const loadSample = () => {
    setInput(t('sample'));
    toast.success(commonT('success'));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg border border-dashed">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="case-toggle" className="text-xs cursor-pointer">Case Sensitive</Label>
              <Switch id="case-toggle" checked={caseSensitive} onCheckedChange={setCaseSensitive} />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="trim-toggle" className="text-xs cursor-pointer">Trim Lines</Label>
              <Switch id="trim-toggle" checked={trimLines} onCheckedChange={setTrimLines} />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="sort-toggle" className="text-xs cursor-pointer">Sort A-Z</Label>
              <Switch id="sort-toggle" checked={sortLines} onCheckedChange={setSortLines} />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="input">{t('input')}</Label>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={loadSample}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {commonT('loadSample')}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setInput('')} className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    {commonT('clear')}
                  </Button>
                </div>
              </div>
              <Textarea
                id="input"
                placeholder={t('placeholder')}
                className="min-h-[400px] font-mono text-sm resize-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button className="w-full" size="lg" onClick={processLines} disabled={!input}>
                <ListFilter className="h-4 w-4 mr-2" />
                {t('remove')}
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="output">{t('output')}</Label>
                <Button variant="outline" size="sm" onClick={() => {
                  navigator.clipboard.writeText(output);
                  toast.success(commonT('copied'));
                }} disabled={!output}>
                  <Copy className="h-4 w-4 mr-2" />
                  {commonT('copy')}
                </Button>
              </div>
              <div className="relative">
                <Textarea
                  id="output"
                  readOnly
                  className="min-h-[400px] font-mono text-sm bg-muted/50 resize-none"
                  value={output}
                />
                {!output && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground opacity-50 pointer-events-none">
                    <SortAsc className="h-12 w-12 mb-2" />
                    <p>{t('output')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <ToolNavigation currentToolId="duplicate-remover" />
    </div>
  );
}
