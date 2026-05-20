"use client"

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ListOrdered, Settings2 } from 'lucide-react';
import { toast } from 'sonner';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';

export function LineNumberAdderClient() {
  const t = useTranslations('tools.line-number-adder');
  const commonT = useTranslations('common');
  const [input, setInput] = useState('');
  const [startAt, setStartAt] = useState(1);
  const [prefix, setPrefix] = useState('');
  const [delimiter, setDelimiter] = useState('. ');

  const addNumbers = () => {
    if (!input.trim()) return;
    setInput(input.split('\n').map((line, i) => `${prefix}${i + startAt}${delimiter}${line}`).join('\n'));
    toast.success(commonT('success'));
  };

  const loadSample = () => setInput('Apple\nBanana\nCherry\nDate\nElderberry');

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2">
        <ToolCard
          title={<StatsDisplay title={t('input')} stats={{ chars: input.length, lines: input.trim() ? input.split('\n').length : 0 }} />}
          action={
            <div className="flex items-center gap-1">
              <ToolActions onSample={loadSample} onClear={() => setInput('')} />
              <CopyButton text={input} type="lines" />
            </div>
          }
          contentClassName="p-0 flex flex-col h-[500px]"
        >
          <CodeTextarea placeholder={t('placeholder')} value={input} onChange={setInput} />
          <div className="p-2 border-t bg-muted/5">
            <Button className="w-full h-8 text-xs" onClick={addNumbers} disabled={!input}>
              <ListOrdered className="h-3.5 w-3.5 mr-2" />{t('add')}
            </Button>
          </div>
        </ToolCard>
      </div>

      <div className="md:col-span-1 space-y-4">
        <ToolCard title={commonT('ui.customization')} icon={Settings2} contentClassName="p-4 space-y-4">
          {([['Start Number', startAt, (v: string) => setStartAt(parseInt(v) || 1), 'number', ''],
            ['Prefix', prefix, setPrefix, 'text', 'e.g. Line '],
            ['Delimiter', delimiter, setDelimiter, 'text', 'e.g. . ']] as const).map(([label, val, setter, type, ph]) => (
            <div key={label} className="space-y-2">
              <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{label}</Label>
              <Input type={type} value={val} placeholder={ph} onChange={(e) => (setter as any)(e.target.value)} className="h-8 text-xs bg-muted/20 border-border" />
            </div>
          ))}
          <InfoBox className="mt-4">{t('article').split('.')[0]}.</InfoBox>
        </ToolCard>
      </div>
    </div>
  );
}
