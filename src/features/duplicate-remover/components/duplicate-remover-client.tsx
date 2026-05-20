"use client"

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ListFilter, SortAsc, Settings2 } from 'lucide-react';
import { toast } from 'sonner';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';

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
    if (trimLines) lines = lines.map(l => l.trim());
    lines = lines.filter(l => l !== '');
    let finalLines = caseSensitive
      ? Array.from(new Set(lines))
      : Array.from(new Set(lines.map(l => l.toLowerCase()))).map(lower => lines.find(o => o.toLowerCase() === lower)!);
    if (sortLines) finalLines.sort((a, b) => a.localeCompare(b));
    setOutput(finalLines.join('\n'));
    toast.success(commonT('success'));
  };

  const loadSample = () => setInput('Apple\nBanana\nApple\nOrange\nBanana\nGrape');
  const outputLines = output.trim() ? output.split('\n').length : 0;

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">
        <ToolCard
          title={<StatsDisplay title={t('input')} stats={{ chars: input.length, lines: input.trim() ? input.split('\n').filter(l => l.trim()).length : 0 }} />}
          action={<ToolActions onSample={loadSample} onClear={() => setInput('')} />}
          contentClassName="p-0 flex flex-col h-[500px]"
        >
          <CodeTextarea placeholder={t('placeholder')} value={input} onChange={setInput} />
          <div className="p-2 border-t bg-muted/5">
            <Button className="w-full h-8 text-xs" onClick={processLines} disabled={!input}>
              <ListFilter className="h-3.5 w-3.5 mr-2" />{t('remove')}
            </Button>
          </div>
        </ToolCard>

        <ToolCard
          title={<StatsDisplay title={t('output')} stats={output ? { lines: outputLines } : undefined} />}
          action={<CopyButton text={output} type="output" />}
          contentClassName="p-0 flex flex-col h-[500px] bg-muted/20 relative"
        >
          <CodeTextarea value={output} onChange={() => {}} disabled />
          {!output && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground opacity-30 pointer-events-none">
              <SortAsc className="h-10 w-10 mb-2" /><p className="text-[10px]">{t('output')}</p>
            </div>
          )}
        </ToolCard>
      </div>

      <div className="md:col-span-1 space-y-4">
        <ToolCard title={commonT('ui.customization')} icon={Settings2} contentClassName="p-4 space-y-5">
          {([['caseSensitive', caseSensitive, setCaseSensitive, 'Case Sensitive', 'Match exact casing'],
            ['trimLines', trimLines, setTrimLines, 'Trim Lines', 'Remove leading/trailing spaces'],
            ['sortLines', sortLines, setSortLines, 'Sort A-Z', 'Alphabetize final list']] as const).map(([key, val, setter, label, desc]) => (
            <div key={key} className="flex items-center justify-between border-t first:border-t-0 pt-4 first:pt-0">
              <div className="space-y-0.5"><Label className="text-xs">{label}</Label><p className="text-[10px] text-muted-foreground leading-tight">{desc}</p></div>
              <Switch checked={val} onCheckedChange={setter} className="scale-75 origin-right" />
            </div>
          ))}
          <InfoBox className="mt-4">{t('article').split('.')[0]}.</InfoBox>
        </ToolCard>
      </div>
    </div>
  );
}
