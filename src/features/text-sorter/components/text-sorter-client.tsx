"use client"

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { SortAsc, SortDesc, Shuffle } from 'lucide-react';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';

export function TextSorterClient() {
  const t = useTranslations('tools.text-sorter');
  const commonT = useTranslations('common');
  const [input, setInput] = useState('');

  const sort = (type: 'asc' | 'desc' | 'shuffle') => {
    let lines = input.split('\n').filter(l => l.trim() !== '');
    if (type === 'asc') lines.sort();
    else if (type === 'desc') lines.sort().reverse();
    else for (let i = lines.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [lines[i], lines[j]] = [lines[j], lines[i]]; }
    setInput(lines.join('\n'));
  };

  const loadSample = () => setInput('Zebra\nApple\nMonkey\nBanana\nGrape\nOrange');

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2">
        <ToolCard
          title={<StatsDisplay title={t('input')} stats={{ chars: input.length, lines: input.trim() ? input.split('\n').filter(l => l.trim()).length : 0 }} />}
          action={
            <div className="flex items-center gap-1">
              <ToolActions onSample={loadSample} onClear={() => setInput('')} />
              <CopyButton text={input} type="input" />
            </div>
          }
          contentClassName="p-0 flex flex-col h-[500px]"
        >
          <CodeTextarea placeholder={t('placeholder')} value={input} onChange={setInput} />
        </ToolCard>
      </div>

      <div className="md:col-span-1 space-y-4">
        <ToolCard title={commonT('ui.customization')} icon={SortAsc} contentClassName="p-4 space-y-2">
          {([['asc', SortAsc, t('asc')], ['desc', SortDesc, t('desc')], ['shuffle', Shuffle, t('shuffle')]] as const).map(([type, Icon, label]) => (
            <Button key={type} onClick={() => sort(type)} disabled={!input} className="w-full h-8 text-[11px] justify-start px-3 bg-muted/20 hover:bg-muted/40 border-border/50" variant="outline">
              <Icon className="h-3 w-3 mr-2 text-muted-foreground" />{label}
            </Button>
          ))}
        </ToolCard>
        <InfoBox>{t('article').split('.')[0]}.</InfoBox>
      </div>
    </div>
  );
}
