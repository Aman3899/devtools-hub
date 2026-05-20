'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRightLeft, Upload, FileJson, Settings2 } from 'lucide-react';
import { toast } from 'sonner';
import Papa from 'papaparse';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';
import { useLanguage } from '@/hooks/tool';
import { Label } from '@/components/ui/label';

export function CsvToJsonClient() {
  const t = useTranslations('tools.csv-to-json');
  const commonT = useTranslations('common');
  const { isEnglish } = useLanguage();

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [delimiter, setDelimiter] = useState(',');
  const [hasHeader, setHasHeader] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleConvert = () => {
    if (!input.trim()) return;
    Papa.parse(input, {
      delimiter: delimiter === 'auto' ? '' : delimiter,
      header: hasHeader,
      skipEmptyLines: true,
      complete: (results) => { setOutput(JSON.stringify(results.data, null, 2)); toast.success(commonT('success')); },
      error: (error: any) => { toast.error(error.message); }
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => { setInput(event.target?.result as string); toast.success(commonT('success')); };
    reader.readAsText(file);
  };

  const loadSample = () => {
    const sample = "id,name,email,role,active\n1,John Doe,john@example.com,Admin,true\n2,Jane Smith,jane@example.com,User,false";
    setInput(sample); handleConvert(); toast.success(commonT('success'));
  };

  const stats = { chars: input.length, lines: input.split('\n').length };
  const outputStats = { size: (new TextEncoder().encode(output).length / 1024).toFixed(2) };

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">
        <ToolCard 
          title={<StatsDisplay title={t('input')} stats={{ chars: stats.chars, lines: stats.lines }} />}
          action={
            <div className="flex items-center gap-1">
              <ToolActions onSample={loadSample} onClear={() => setInput('')} />
              <input type="file" ref={fileInputRef} className="hidden" accept=".csv,.txt" onChange={handleFileUpload} />
              <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} title={commonT('importFile')} className="h-6 w-6"><Upload className="h-3 w-3" /></Button>
            </div>
          }
          contentClassName="p-0 flex flex-col h-[500px]"
        >
          <CodeTextarea
            placeholder={t('placeholder')}
            value={input}
            onChange={(val) => setInput(val)}
          />
          <div className="p-2 border-t bg-muted/5">
            <Button className="w-full h-8 text-xs" onClick={handleConvert} disabled={!input}><ArrowRightLeft className="h-3.5 w-3.5 mr-2" />{t('convert')}</Button>
          </div>
        </ToolCard>

        <ToolCard 
          title={
            <div className="flex items-center gap-2">
              {t('output')}
              {output && <><div className="h-1 w-1 rounded-full bg-muted-foreground/30" /><span className="text-[10px] text-muted-foreground/60 font-normal tracking-normal">{outputStats.size} KB</span></>}
            </div>
          }
          action={
            <div className="flex items-center gap-1">
              <DownloadButton content={output} filename="converted.json" mimeType="application/json" disabled={!output} />
              <CopyButton text={output} type="json" disabled={!output} />
            </div>
          }
          contentClassName="p-0 flex flex-col h-[500px] bg-muted/20 relative"
        >
          <CodeTextarea
            value={output}
            onChange={() => {}}
            disabled
          />
          {!output && <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground opacity-30 pointer-events-none"><FileJson className="h-10 w-10 mb-2" /><p className="text-[10px]">{t('output')}</p></div>}
        </ToolCard>
      </div>

      <div className="md:col-span-1 space-y-4">
        <ToolCard title={commonT('ui.customization')} icon={Settings2} contentClassName="p-4 space-y-5">
          <div className="space-y-2">
            <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{t('delimiter')}</Label>
            <Select value={delimiter} onValueChange={(val) => val && setDelimiter(val)}>
              <SelectTrigger className="h-8 text-xs bg-muted/30 border-border"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="," className="text-xs">Comma (,)</SelectItem>
                <SelectItem value=";" className="text-xs">Semicolon (;)</SelectItem>
                <SelectItem value="\t" className="text-xs">Tab</SelectItem>
                <SelectItem value="auto" className="text-xs">Auto-detect</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5"><Label className="text-xs">{t('header')}</Label><p className="text-[10px] text-muted-foreground leading-tight">First row as header</p></div>
            <Switch checked={hasHeader} onCheckedChange={setHasHeader} className="scale-75 origin-right" />
          </div>

          <InfoBox>
            {t('article').split('.')[0]}.
          </InfoBox>
        </ToolCard>
      </div>
    </div>
  );
}
