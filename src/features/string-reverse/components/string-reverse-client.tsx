"use client"

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { RotateCcw, Shuffle } from 'lucide-react';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';

export function StringReverseClient() {
  const t = useTranslations('tools.string-reverse');
  const commonT = useTranslations('common');
  const [input, setInput] = useState('');

  const reverseChars = () => setInput(input.split('').reverse().join(''));
  const reverseWords = () => setInput(input.split(/\s+/).reverse().join(' '));
  const loadSample = () => setInput('The quick brown fox jumps over the lazy dog');

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2">
        <ToolCard
          title={<StatsDisplay title={t('input')} stats={{ chars: input.length, words: input.trim() ? input.trim().split(/\s+/).length : 0 }} />}
          action={
            <div className="flex items-center gap-1">
              <ToolActions onSample={loadSample} onClear={() => setInput('')} />
              <CopyButton text={input} type="input" />
            </div>
          }
          contentClassName="p-0 flex flex-col h-[400px]"
        >
          <CodeTextarea placeholder={t('placeholder')} value={input} onChange={setInput} />
        </ToolCard>
      </div>

      <div className="md:col-span-1 space-y-4">
        <ToolCard title={commonT('ui.customization')} icon={RotateCcw} contentClassName="p-4 space-y-2">
          <Button onClick={reverseChars} disabled={!input} className="w-full h-8 text-[11px] justify-start px-3 bg-muted/20 hover:bg-muted/40 border-border/50" variant="outline">
            <RotateCcw className="h-3 w-3 mr-2 text-muted-foreground" />{t('reverseChars')}
          </Button>
          <Button onClick={reverseWords} disabled={!input} className="w-full h-8 text-[11px] justify-start px-3 bg-muted/20 hover:bg-muted/40 border-border/50" variant="outline">
            <Shuffle className="h-3 w-3 mr-2 text-muted-foreground" />{t('reverseWords')}
          </Button>
        </ToolCard>
        <InfoBox>{t('article').split('.')[0]}.</InfoBox>
      </div>
    </div>
  );
}
