'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, RefreshCw, Clock, Hash, AlignLeft, FileText } from 'lucide-react';
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
    setInput(t('sample'));
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
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="input">{t('input')}</Label>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={loadSample}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {commonT('loadSample')}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setInput('')} disabled={!input}>
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
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Label className="px-1 uppercase text-[11px] font-bold tracking-wider text-muted-foreground">
            {t('output')}
          </Label>
          <div className="grid gap-4">
            {statItems.map((item, idx) => (
              <Card key={idx} className="bg-muted/30 border-none shadow-none">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-background border border-border">
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <span className="text-xl font-bold font-mono">{item.value}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <ToolNavigation currentToolId="word-counter" />
    </div>
  );
}
