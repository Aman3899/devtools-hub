"use client"

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Settings2, Share2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';

const formSchema = z.object({
  indent: z.string(),
  minify: z.boolean(),
  sortKeys: z.boolean(),
  escapeUnicode: z.boolean(),
});
type FormValues = z.infer<typeof formSchema>;

const SAMPLE_JSON = {
  id: 1, name: 'DevTools Hub',
  features: ['Security', 'Formatting', 'Transformation'],
  status: 'active', metadata: { version: '1.0.0', secure: true },
};

export function JsonFormatterClient() {
  const t = useTranslations('tools.json-formatter');
  const tCommon = useTranslations('common');

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { watch, setValue } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { indent: '2', minify: false, sortKeys: false, escapeUnicode: false },
  });
  const options = watch();

  const handleFormat = useCallback((val: string = input) => {
    if (!val.trim()) { setOutput(''); setError(null); return; }
    try {
      let parsed = JSON.parse(val);
      if (options.sortKeys) {
        const sortObject = (obj: any): any => {
          if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) return obj;
          return Object.keys(obj).sort().reduce((acc: any, key) => { acc[key] = sortObject(obj[key]); return acc; }, {});
        };
        parsed = sortObject(parsed);
      }
      let result = options.minify
        ? JSON.stringify(parsed)
        : JSON.stringify(parsed, null, options.indent === 'tab' ? '\t' : parseInt(options.indent));
      if (options.escapeUnicode) {
        result = result.replace(/[\u007f-\uffff]/g, (c) => '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4));
      }
      setOutput(result); setError(null);
    } catch (e: any) { setError(e.message); setOutput(''); }
  }, [input, options]);

  useEffect(() => { handleFormat(); }, [handleFormat]);

  const loadSample = () => { const s = JSON.stringify(SAMPLE_JSON, null, 2); setInput(s); handleFormat(s); };

  const stats = { chars: input.length, lines: input.split('\n').length };
  const outputStats = { size: (new TextEncoder().encode(output).length / 1024).toFixed(2) };

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">
        <ToolCard
          title={<StatsDisplay title={t('input')} stats={stats} />}
          action={<ToolActions onSample={loadSample} onClear={() => setInput('')} />}
          contentClassName="p-0 flex flex-col h-[500px]"
        >
          <CodeTextarea
            placeholder={t('placeholder')}
            value={input}
            onChange={setInput}
            onChangeRaw={(e) => handleFormat(e.target.value)}
          />
        </ToolCard>

        <ToolCard
          title={<StatsDisplay title={t('output')} stats={output ? { size: outputStats.size } : undefined} />}
          action={
            <div className="flex items-center gap-1">
              <DownloadButton content={output} filename={`formatted-${Date.now()}.json`} mimeType="application/json" />
              <CopyButton text={output} type="json" />
            </div>
          }
          contentClassName="p-0 flex flex-col h-[500px] bg-muted/20"
        >
          <pre className={cn('flex-1 font-mono text-xs p-3 overflow-auto whitespace-pre-wrap break-all leading-relaxed bg-transparent', error ? 'text-destructive' : 'text-foreground')}>
            {error ? `${tCommon('error')}: ${error}` : (output || tCommon('ui.result'))}
          </pre>
        </ToolCard>
      </div>

      <div className="md:col-span-1 space-y-4">
        <ToolCard
          title={tCommon('ui.customization')}
          icon={Settings2}
          action={<Share2 className="h-3 w-3 text-muted-foreground hover:text-foreground cursor-pointer" />}
          contentClassName="p-4 space-y-5"
        >
          <div className="space-y-2">
            <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{t('custom.indentation')}</Label>
            <Select value={options.indent} onValueChange={(v) => setValue('indent', v || '2')}>
              <SelectTrigger className="h-8 text-xs bg-muted/30 border-border"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="2" className="text-xs">{t('custom.spaces2')}</SelectItem>
                <SelectItem value="4" className="text-xs">{t('custom.spaces4')}</SelectItem>
                <SelectItem value="tab" className="text-xs">{t('custom.tabs')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-4 pt-2">
            {([['minify', t('custom.minify'), t('custom.minifyDesc')], ['sortKeys', t('custom.sortKeys'), t('custom.sortKeysDesc')], ['escapeUnicode', t('custom.escapeUnicode'), t('custom.escapeUnicodeDesc')]] as const).map(([key, label, desc]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="space-y-0.5"><Label className="text-xs">{label}</Label><p className="text-[10px] text-muted-foreground leading-tight">{desc}</p></div>
                <Switch checked={options[key]} onCheckedChange={(v) => setValue(key, v)} className="scale-75 origin-right" />
              </div>
            ))}
          </div>
          <InfoBox>{t('article').split('.')[0]}.</InfoBox>
        </ToolCard>
      </div>
    </div>
  );
}
