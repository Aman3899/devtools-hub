"use client"

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Settings2, Search } from 'lucide-react';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, ToolActions, InfoBox, CodeTextarea } from '@/components/common';

export function UnicodeInspectorClient() {
  const t = useTranslations('tools.unicode-inspector');
  const commonT = useTranslations('common');
  const [input, setInput] = useState('');

  const loadSample = () => setInput('A 🚀 ü 漢字');

  const data = [...input].map(char => {
    const cp = char.codePointAt(0);
    return { char, hex: cp?.toString(16).toUpperCase().padStart(4, '0'), dec: cp };
  });

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 space-y-4">
        <ToolCard
          title={t('text_input')}
          action={<ToolActions onSample={loadSample} onClear={() => setInput('')} />}
          contentClassName="p-0 flex flex-col h-[150px]"
        >
          <CodeTextarea placeholder="Enter string to inspect characters..." value={input} onChange={setInput} />
        </ToolCard>

        <div className="flex flex-col gap-2 mt-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1">{t('character_details')}</p>
          <div className="space-y-2">
            {data.length > 0 ? data.map((item, idx) => (
              <ToolCard
                key={idx}
                title={
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center h-10 w-10 bg-background border border-border rounded shrink-0 shadow-sm text-lg font-bold">{item.char}</div>
                    <div className="flex gap-6">
                      <div className="flex flex-col"><span className="text-[9px] text-muted-foreground uppercase tracking-widest">{t('code_point')}</span><span className="font-mono text-xs font-semibold">U+{item.hex}</span></div>
                      <div className="flex flex-col"><span className="text-[9px] text-muted-foreground uppercase tracking-widest">{t('decimal')}</span><span className="font-mono text-xs font-semibold">{item.dec}</span></div>
                    </div>
                  </div>
                }
                action={<CopyButton text={`U+${item.hex}`} type={`U-${item.hex}`} />}
                contentClassName="p-0 border-none shadow-none"
              >{null}</ToolCard>
            )) : (
              <div className="flex flex-col h-[200px] items-center justify-center border border-border rounded-md bg-muted/20">
                <Search className="h-8 w-8 text-muted-foreground opacity-50 mb-2" />
                <p className="text-sm text-muted-foreground opacity-50">Type something to inspect.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="md:col-span-1 space-y-4">
        <ToolCard title={commonT('ui.customization')} icon={Settings2} contentClassName="p-4 space-y-6">
          <InfoBox title="Info" variant="default">{t('info')}</InfoBox>
        </ToolCard>
      </div>
    </div>
  );
}
