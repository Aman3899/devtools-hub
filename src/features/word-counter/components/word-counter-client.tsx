"use client"

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Clock, Hash, AlignLeft, FileText } from 'lucide-react';
import { ToolCard } from '@/components/layout/tool-card';
import { ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';

export function WordCounterClient() {
  const t = useTranslations('tools.word-counter');
  const commonT = useTranslations('common');
  const [input, setInput] = useState('');

  const stats = useMemo(() => {
    const trimmed = input.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    return {
      words,
      chars: input.length,
      charsNoSpaces: input.replace(/\s/g, '').length,
      lines: input ? input.split('\n').length : 0,
      readingTime: Math.ceil(words / 200),
    };
  }, [input]);

  const loadSample = () => setInput('The quick brown fox jumps over the lazy dog. DevTools Hub provides a wide range of developer tools that run entirely in your browser, ensuring maximum privacy and security for your data.');

  const statItems = [
    { label: t('words'), value: stats.words, icon: Hash },
    { label: t('chars'), value: stats.chars, icon: AlignLeft },
    { label: t('charsNoSpaces'), value: stats.charsNoSpaces, icon: AlignLeft },
    { label: t('lines'), value: stats.lines, icon: FileText },
    { label: t('readingTime'), value: stats.readingTime, icon: Clock },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2">
        <ToolCard
          title={<StatsDisplay title={t('input')} stats={{ chars: stats.chars, lines: stats.lines }} />}
          action={<ToolActions onSample={loadSample} onClear={() => setInput('')} />}
          contentClassName="p-0 flex flex-col h-[500px]"
        >
          <CodeTextarea placeholder={t('placeholder')} value={input} onChange={setInput} />
        </ToolCard>
      </div>

      <div className="md:col-span-1 space-y-4">
        <ToolCard title={t('output')} icon={AlignLeft} contentClassName="p-4 space-y-3">
          {statItems.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 rounded-md bg-muted/20 border border-border">
              <div className="flex items-center gap-2">
                <item.icon className="h-3 w-3 text-muted-foreground" />
                <span className="text-[10px] font-medium text-muted-foreground uppercase">{item.label}</span>
              </div>
              <span className="text-sm font-bold font-mono">{item.value}</span>
            </div>
          ))}
        </ToolCard>
        <InfoBox>{t('article').split('.')[0]}.</InfoBox>
      </div>
    </div>
  );
}
