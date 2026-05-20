'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Type } from 'lucide-react';
import { toast } from 'sonner';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, ToolActions, InfoBox, StatsDisplay } from '@/components/common';

export function CaseConverterClient() {
  const t = useTranslations('tools.case-converter');
  const commonT = useTranslations('common');
  const [input, setInput] = useState('');

  const convert = (type: string) => {
    const text = input.trim();
    if (!text) return;
    let result = '';
    switch (type) {
      case 'upper': result = text.toUpperCase(); break;
      case 'lower': result = text.toLowerCase(); break;
      case 'camel': result = text.replace(/(?:^\w|[A-Z]|\b\w)/g, (w, i) => i === 0 ? w.toLowerCase() : w.toUpperCase()).replace(/\s+/g, ''); break;
      case 'snake': result = text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)?.map(x => x.toLowerCase()).join('_') || ''; break;
      case 'pascal': result = text.replace(/(?:^\w|[A-Z]|\b\w)/g, (w) => w.toUpperCase()).replace(/\s+/g, ''); break;
      case 'kebab': result = text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)?.map(x => x.toLowerCase()).join('-') || ''; break;
      default: result = text;
    }
    setInput(result);
    toast.success(commonT('success'));
  };

  const loadSample = () => { setInput('Hello World! This is a sample text for case conversion.'); };

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2">
        <ToolCard
          title={<StatsDisplay title={t('input')} stats={{ chars: input.length, words: input.trim() ? input.trim().split(/\s+/).length : 0 }} />}
          action={
            <div className="flex items-center gap-1">
              <ToolActions onSample={loadSample} onClear={() => setInput('')} />
              <CopyButton text={input} type="text" />
            </div>
          }
          contentClassName="p-0 flex flex-col h-[500px]"
        >
          <Textarea
            placeholder={t('placeholder')}
            className="flex-1 font-mono text-xs resize-none border-none focus-visible:ring-0 p-3 bg-transparent leading-relaxed"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </ToolCard>
      </div>

      <div className="md:col-span-1 space-y-4">
        <ToolCard title={commonT('ui.customization')} icon={Type} contentClassName="p-4 space-y-2">
          {(['upper', 'lower', 'camel', 'snake', 'pascal', 'kebab'] as const).map((mode) => (
            <Button key={mode} variant="outline" size="sm" onClick={() => convert(mode)} disabled={!input}
              className="w-full h-8 text-[11px] justify-start px-3 bg-muted/20 hover:bg-muted/40 border-border/50">
              <Type className="h-3 w-3 mr-2 text-muted-foreground" />{t(mode)}
            </Button>
          ))}
          <InfoBox className="mt-4">{t('article').split('.')[0]}.</InfoBox>
        </ToolCard>
      </div>
    </div>
  );
}
