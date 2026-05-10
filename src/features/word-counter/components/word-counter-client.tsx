'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, RefreshCw, Clock, Hash, AlignLeft, FileText, Info } from 'lucide-react';
import { toast } from 'sonner';
import { ToolNavigation } from '@/components/tool-navigation';

export function WordCounterClient() {
  const t = useTranslations('tools.word-counter');
  const commonT = useTranslations('common');
  const [input, setInput] = useState('');

  const stats = useMemo(() => {
    const trimmed = input.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = input.length;
    const charsNoSpaces = input.replace(/\s/g, '').length;
    const lines = input ? input.split('\n').length : 0;
    const readingTime = Math.ceil(words / 200);

    return { words, chars, charsNoSpaces, lines, readingTime };
  }, [input]);

  const loadSample = () => {
    setInput('The quick brown fox jumps over the lazy dog. DevTools Hub provides a wide range of developer tools that run entirely in your browser, ensuring maximum privacy and security for your data.');
    toast.success(commonT('success'));
  };

  const statItems = [
    { label: t('words'), value: stats.words, icon: Hash },
    { label: t('chars'), value: stats.chars, icon: AlignLeft },
    { label: t('charsNoSpaces'), value: stats.charsNoSpaces, icon: AlignLeft },
    { label: t('lines'), value: stats.lines, icon: FileText },
    { label: t('readingTime'), value: stats.readingTime, icon: Clock },
  ];

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
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <Card className="border border-border shadow-none rounded-md bg-background">
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-xs font-semibold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlignLeft className="h-3.5 w-3.5" />
                  {t('output')}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {statItems.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-md bg-muted/20 border border-border">
                  <div className="flex items-center gap-2">
                    <item.icon className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[10px] font-medium text-muted-foreground uppercase">{item.label}</span>
                  </div>
                  <span className="text-sm font-bold font-mono">{item.value}</span>
                </div>
              ))}
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
      <ToolNavigation currentToolId="word-counter" />
    </div>
  );
}
