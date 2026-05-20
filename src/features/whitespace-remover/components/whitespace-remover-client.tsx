"use client"

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Eraser, AlignJustify, Settings2 } from 'lucide-react';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';
import { useLanguage } from '@/hooks/tool';

export function WhitespaceRemoverClient() {
  const t = useTranslations('tools.whitespace-remover');
  const commonT = useTranslations('common');
  const { isEnglish } = useLanguage();

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [options, setOptions] = useState({
    all: false,
    trim: true,
    extra: true,
    lines: true
  });

  const processText = () => {
    if (!input) return;

    let result = input;

    if (options.all) {
      result = result.replace(/\s+/g, '');
    } else {
      if (options.trim) {
        result = result.split('\n').map(line => line.trim()).join('\n').trim();
      }
      if (options.extra) {
        result = result.replace(/[ \t]+/g, ' ');
      }
      if (options.lines) {
        result = result.split('\n').filter(line => line.trim() !== '').join('\n');
      }
    }

    setOutput(result);
  };

  const loadSample = () => {
    setInput('   Too many    spaces    here.   \n\n   And some empty lines below.   \n\n   ');
  };

  const stats = {
    chars: input.length,
    lines: input.split('\n').length
  };

  const outputStats = {
    chars: output.length,
    lines: output.split('\n').length
  };

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">
        {/* Input Area */}
        <ToolCard 
          title={<StatsDisplay title={t('input')} stats={{ chars: stats.chars, lines: stats.lines }} />}
          action={<ToolActions onSample={loadSample} onClear={() => setInput('')} />}
          contentClassName="p-0 flex flex-col h-[500px]"
        >
          <CodeTextarea
            placeholder={t('placeholder')}
            value={input}
            onChange={(val) => setInput(val)}
          />
          <div className="p-2 border-t bg-muted/5">
            <Button className="w-full h-8 text-xs" onClick={processText} disabled={!input}>
              <Eraser className="h-3.5 w-3.5 mr-2" />
              {t('title').split(' ')[0]} {commonT('format')}
            </Button>
          </div>
        </ToolCard>

        {/* Output Area */}
        <ToolCard 
          title={
            output ? (
              <StatsDisplay title={t('output')} stats={{ chars: outputStats.chars }} />
            ) : (
              t('output')
            )
          }
          action={<CopyButton text={output} type="output" disabled={!output} />}
          contentClassName="p-0 flex flex-col h-[500px] bg-muted/20"
        >
          <div className="flex-1 relative">
            <CodeTextarea
              value={output}
              onChange={() => {}}
              disabled
            />
            {!output && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground opacity-30 pointer-events-none">
                <AlignJustify className="h-10 w-10 mb-2" />
                <p className="text-[10px]">{t('output')}</p>
              </div>
            )}
          </div>
        </ToolCard>
      </div>

      {/* Sidebar Settings */}
      <div className="md:col-span-1 space-y-4">
        <ToolCard title={commonT('ui.customization')} icon={Settings2} contentClassName="p-4 space-y-5">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-xs">{t('trim')}</Label>
              <p className="text-[10px] text-muted-foreground leading-tight">Remove line padding</p>
            </div>
            <Switch checked={options.trim} onCheckedChange={(v) => setOptions(prev => ({ ...prev, trim: v }))} disabled={options.all} className="scale-75 origin-right" />
          </div>
          <div className="flex items-center justify-between border-t pt-4">
            <div className="space-y-0.5">
              <Label className="text-xs">{t('extra')}</Label>
              <p className="text-[10px] text-muted-foreground leading-tight">Normalize internal spaces</p>
            </div>
            <Switch checked={options.extra} onCheckedChange={(v) => setOptions(prev => ({ ...prev, extra: v }))} disabled={options.all} className="scale-75 origin-right" />
          </div>
          <div className="flex items-center justify-between border-t pt-4">
            <div className="space-y-0.5">
              <Label className="text-xs">{t('lines')}</Label>
              <p className="text-[10px] text-muted-foreground leading-tight">Remove empty lines</p>
            </div>
            <Switch checked={options.lines} onCheckedChange={(v) => setOptions(prev => ({ ...prev, lines: v }))} disabled={options.all} className="scale-75 origin-right" />
          </div>
          <div className="flex items-center justify-between border-t pt-4">
            <div className="space-y-0.5">
              <Label className="text-xs font-bold text-destructive">{t('all')}</Label>
              <p className="text-[10px] text-muted-foreground leading-tight text-destructive/70">Strip ALL whitespace</p>
            </div>
            <Switch checked={options.all} onCheckedChange={(v) => setOptions(prev => ({ ...prev, all: v }))} className="scale-75 origin-right" />
          </div>
        </ToolCard>

        <InfoBox>
          {t('article').split('.')[0]}.
        </InfoBox>
      </div>
    </div>
  );
}
