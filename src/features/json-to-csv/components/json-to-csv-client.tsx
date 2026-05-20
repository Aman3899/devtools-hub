"use client"

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ArrowRightLeft, FileSpreadsheet, Settings2 } from 'lucide-react';
import { toast } from 'sonner';
import Papa from 'papaparse';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';
import { useLanguage } from '@/hooks/tool';

export function JsonToCsvClient() {
  const t = useTranslations('tools.json-to-csv');
  const commonT = useTranslations('common');
  const { isEnglish } = useLanguage();
  
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [shouldFlatten, setShouldFlatten] = useState(true);

  const flattenObject = (obj: any, prefix = '') => {
    return Object.keys(obj).reduce((acc: any, k: string) => {
      const pre = prefix.length ? prefix + '.' : '';
      if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
        Object.assign(acc, flattenObject(obj[k], pre + k));
      } else {
        acc[pre + k] = obj[k];
      }
      return acc;
    }, {});
  };

  const handleConvert = () => {
    try {
      let data = JSON.parse(input);
      if (!Array.isArray(data)) {
        data = [data];
      }

      const processedData = shouldFlatten 
        ? data.map((item: any) => flattenObject(item))
        : data;

      const csv = Papa.unparse(processedData);
      setOutput(csv);
      toast.success(commonT('success'));
    } catch (e) {
      toast.error('Invalid JSON');
    }
  };

  const loadSample = () => {
    const sample = [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "role": "Admin",
        "active": true
      },
      {
        "id": 2,
        "name": "Jane Smith",
        "email": "jane@example.com",
        "role": "User",
        "active": false
      }
    ];
    setInput(JSON.stringify(sample, null, 2));
    toast.success(commonT('success'));
  };

  const stats = {
    chars: input.length,
    lines: input.split('\n').length
  };

  const outputStats = {
    chars: output.length,
    lines: output.split('\n').length,
    size: (new TextEncoder().encode(output).length / 1024).toFixed(2)
  };

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">
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
            <Button className="w-full h-8 text-xs" onClick={handleConvert} disabled={!input}>
              <ArrowRightLeft className="h-3.5 w-3.5 mr-2" />
              {t('convert')}
            </Button>
          </div>
        </ToolCard>

        <ToolCard 
          title={
            <div className="flex items-center gap-2">
              {t('output')}
              {output && <><div className="h-1 w-1 rounded-full bg-muted-foreground/30" /><span className="text-[10px] text-muted-foreground/60 normal-case tracking-normal">{outputStats.size} KB</span></>}
            </div>
          }
          action={
            <div className="flex items-center gap-1">
              <DownloadButton content={output} filename="converted.csv" mimeType="text/csv" disabled={!output} />
              <CopyButton text={output} type="csv" disabled={!output} />
            </div>
          }
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
                <FileSpreadsheet className="h-10 w-10 mb-2" />
                <p className="text-[10px]">{t('output')}</p>
              </div>
            )}
          </div>
        </ToolCard>
      </div>

      <div className="md:col-span-1 space-y-4">
        <ToolCard title={commonT('ui.customization')} icon={Settings2} contentClassName="p-4 space-y-5">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-xs">{t('flatten')}</Label>
              <p className="text-[10px] text-muted-foreground leading-tight">Flatten nested structures</p>
            </div>
            <Switch checked={shouldFlatten} onCheckedChange={setShouldFlatten} className="scale-75 origin-right" />
          </div>
          
          <InfoBox>
            {t('article').split('.')[0]}.
          </InfoBox>
        </ToolCard>
      </div>
    </div>
  );
}
