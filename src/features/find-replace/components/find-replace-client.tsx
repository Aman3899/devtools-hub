"use client"

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Search, ArrowRightLeft, Type, Settings2 } from 'lucide-react';
import { toast } from 'sonner';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';

export function FindReplaceClient() {
  const t = useTranslations('tools.find-replace');
  const commonT = useTranslations('common');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [useRegex, setUseRegex] = useState(false);

  const handleReplace = () => {
    if (!input || !findText) return;
    try {
      let result = '';
      if (useRegex) {
        result = input.replace(new RegExp(findText, caseSensitive ? 'g' : 'gi'), replaceText);
      } else {
        const escaped = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        result = input.replace(new RegExp(escaped, caseSensitive ? 'g' : 'gi'), replaceText);
      }
      setOutput(result); toast.success(commonT('success'));
    } catch (e: any) { toast.error(e.message); }
  };

  const loadSample = () => { setInput('The quick brown fox jumps over the lazy dog.'); setFindText('quick'); setReplaceText('slow'); };

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">
        <ToolCard
          title={<StatsDisplay title={t('input')} stats={{ chars: input.length, lines: input.split('\n').length }} />}
          action={<ToolActions onSample={loadSample} onClear={() => setInput('')} />}
          contentClassName="p-0 flex flex-col h-[500px]"
        >
          <CodeTextarea placeholder={t('placeholder')} value={input} onChange={setInput} />
          <div className="p-2 border-t bg-muted/5">
            <Button className="w-full h-8 text-xs" onClick={handleReplace} disabled={!input || !findText}>
              <Type className="h-3.5 w-3.5 mr-2" />{t('replaceAll')}
            </Button>
          </div>
        </ToolCard>

        <ToolCard
          title={<StatsDisplay title={t('output')} stats={output ? { chars: output.length } : undefined} />}
          action={<CopyButton text={output} type="output" />}
          contentClassName="p-0 flex flex-col h-[500px] bg-muted/20 relative"
        >
          <CodeTextarea value={output} onChange={() => {}} disabled />
          {!output && <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground opacity-30 pointer-events-none"><ArrowRightLeft className="h-10 w-10 mb-2" /><p className="text-[10px]">{t('output')}</p></div>}
        </ToolCard>
      </div>

      <div className="md:col-span-1 space-y-4">
        <ToolCard title={commonT('ui.customization')} icon={Settings2} contentClassName="p-4 space-y-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{t('find')}</Label>
            <div className="relative"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" /><Input placeholder="Text to find..." className="pl-8 h-8 text-xs bg-muted/20 border-border" value={findText} onChange={(e) => setFindText(e.target.value)} /></div>
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{t('replace')}</Label>
            <div className="relative"><ArrowRightLeft className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" /><Input placeholder="Replace with..." className="pl-8 h-8 text-xs bg-muted/20 border-border" value={replaceText} onChange={(e) => setReplaceText(e.target.value)} /></div>
          </div>
          <div className="pt-2 space-y-3">
            {([['Case Sensitive', caseSensitive, setCaseSensitive, 'Match exact casing'], ['Use Regex', useRegex, setUseRegex, 'Match by pattern']] as const).map(([label, val, setter, desc]) => (
              <div key={label} className="flex items-center justify-between border-t first:border-t-0 pt-3 first:pt-0">
                <div className="space-y-0.5"><Label className="text-xs">{label}</Label><p className="text-[10px] text-muted-foreground leading-tight">{desc}</p></div>
                <Switch checked={val} onCheckedChange={setter} className="scale-75 origin-right" />
              </div>
            ))}
          </div>
          <InfoBox className="mt-4">{t('article').split('.')[0]}.</InfoBox>
        </ToolCard>
      </div>
    </div>
  );
}
