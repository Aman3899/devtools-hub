'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Copy, Trash2, ListOrdered, RefreshCw, Settings2, Info } from 'lucide-react';
import { toast } from 'sonner';
import { ToolNavigation } from '@/components/tool-navigation';

export function LineNumberAdderClient() {
  const t = useTranslations('tools.line-number-adder');
  const commonT = useTranslations('common');
  const [input, setInput] = useState('');
  const [startAt, setStartAt] = useState(1);
  const [prefix, setPrefix] = useState('');
  const [delimiter, setDelimiter] = useState('. ');

  const addNumbers = () => {
    const lines = input.split('\n');
    const result = lines.map((line, index) => `${prefix}${index + startAt}${delimiter}${line}`).join('\n');
    setInput(result);
    toast.success(commonT('success')); 
  };

  const stats = {
    chars: input.length,
    lines: input.trim() ? input.split('\n').length : 0
  };

  const loadSample = () => {
    setInput('Apple\nBanana\nCherry\nDate\nElderberry');
    toast.success(commonT('success'));
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('input')}</Label>
              <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
              <span className="text-[10px] text-muted-foreground/60">{stats.chars} chars • {stats.lines} lines</span>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={loadSample} className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground">
                <RefreshCw className="h-3 w-3" />
                {commonT('hero.searchPlaceholder' as any) === 'Find a tool...' ? 'Sample' : 'مثال'}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  navigator.clipboard.writeText(input);
                  toast.success(commonT('copied'));
                }} 
                disabled={!input}
                className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Copy className="h-3 w-3" />
                {commonT('copy')}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setInput('')} title={commonT('clear')} className="h-6 w-6 text-muted-foreground hover:text-destructive">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <Card className="flex flex-col h-[500px] border border-border shadow-none rounded-md overflow-hidden bg-background focus-within:border-foreground/20 transition-colors">
            <Textarea
              placeholder={t('placeholder')}
              className="flex-1 font-mono text-xs resize-none border-none focus-visible:ring-0 p-3 bg-transparent leading-relaxed"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <div className="p-2 border-t bg-muted/5">
              <Button className="w-full h-8 text-xs" onClick={addNumbers} disabled={!input}>
                <ListOrdered className="h-3.5 w-3.5 mr-2" />
                {t('add')}
              </Button>
            </div>
          </Card>
        </div>

        {/* Sidebar Settings */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="border border-border shadow-none rounded-md bg-background">
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-xs font-semibold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings2 className="h-3.5 w-3.5" />
                  {commonT('ui.customization')}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">Start Number</Label>
                <Input 
                  type="number" 
                  value={startAt} 
                  onChange={(e) => setStartAt(parseInt(e.target.value) || 1)}
                  className="h-8 text-xs bg-muted/20 border-border" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">Prefix</Label>
                <Input 
                  placeholder="e.g. Line " 
                  value={prefix} 
                  onChange={(e) => setPrefix(e.target.value)}
                  className="h-8 text-xs bg-muted/20 border-border" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">Delimiter</Label>
                <Input 
                  placeholder="e.g. . " 
                  value={delimiter} 
                  onChange={(e) => setDelimiter(e.target.value)}
                  className="h-8 text-xs bg-muted/20 border-border" 
                />
              </div>
            </CardContent>
          </Card>

          <div className="p-3 rounded-md bg-muted/30 border border-border flex gap-2.5 items-start">
            <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-[10px] text-muted-foreground leading-normal">
              {t('article').split('.')[0]}.
            </p>
          </div>
        </div>
      </div>
      <ToolNavigation currentToolId="line-number-adder" />
    </div>
  );
}
