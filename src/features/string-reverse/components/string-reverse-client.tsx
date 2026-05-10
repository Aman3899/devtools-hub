'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Trash2, RotateCcw, Shuffle, RefreshCw, Info } from 'lucide-react';
import { toast } from 'sonner';
import { ToolNavigation } from '@/components/tool-navigation';

export function StringReverseClient() {
  const t = useTranslations('tools.string-reverse');
  const commonT = useTranslations('common');
  const [input, setInput] = useState('');

  const reverseChars = () => {
    setInput(input.split('').reverse().join(''));
    toast.success(commonT('copied')); 
  };

  const reverseWords = () => {
    setInput(input.split(/\s+/).reverse().join(' '));
    toast.success(commonT('copied'));
  };

  const stats = {
    chars: input.length,
    words: input.trim() ? input.trim().split(/\s+/).length : 0
  };

  const loadSample = () => {
    setInput('The quick brown fox jumps over the lazy dog');
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
              <span className="text-[10px] text-muted-foreground/60">{stats.chars} chars • {stats.words} words</span>
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
          <Card className="flex flex-col h-[400px] border border-border shadow-none rounded-md overflow-hidden bg-background focus-within:border-foreground/20 transition-colors">
            <Textarea
              placeholder={t('placeholder')}
              className="flex-1 font-mono text-xs resize-none border-none focus-visible:ring-0 p-3 bg-transparent leading-relaxed"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </Card>
        </div>

        {/* Sidebar Settings */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="border border-border shadow-none rounded-md bg-background">
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-xs font-semibold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-3.5 w-3.5" />
                  {commonT('ui.customization')}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              <Button onClick={reverseChars} disabled={!input} className="w-full h-8 text-[11px] justify-start px-3 bg-muted/20 hover:bg-muted/40 border-border/50" variant="outline">
                <RotateCcw className="h-3 w-3 mr-2 text-muted-foreground" />
                {t('reverseChars')}
              </Button>
              <Button onClick={reverseWords} disabled={!input} className="w-full h-8 text-[11px] justify-start px-3 bg-muted/20 hover:bg-muted/40 border-border/50" variant="outline">
                <Shuffle className="h-3 w-3 mr-2 text-muted-foreground" />
                {t('reverseWords')}
              </Button>
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
      <ToolNavigation currentToolId="string-reverse" />
    </div>
  );
}
