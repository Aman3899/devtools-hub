'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Type, Settings2 } from 'lucide-react';
import { toast } from 'sonner';
import figlet from 'figlet';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox } from '@/components/common';

export function AsciiArtClient() {
  const t = useTranslations('tools.ascii-art');
  const commonT = useTranslations('common');
  const [input, setInput] = useState('');
  const [font, setFont] = useState<figlet.Fonts>('Standard');
  const [output, setOutput] = useState('');

  useEffect(() => {
    if (!input.trim()) { setOutput(''); return; }
    figlet.text(input, { font }, (err, data) => { if (!err) setOutput(data || ''); });
  }, [input, font]);

  const loadSample = () => { setInput('DevTools'); toast.success(commonT('success')); };

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 flex flex-col gap-6">
        <ToolCard
          title={t('input')}
          action={<ToolActions onSample={loadSample} onClear={() => setInput('')} />}
          contentClassName="p-0"
        >
          <Input placeholder={t('placeholder')} className="font-sans text-xs h-10 border-none focus-visible:ring-0 px-3 bg-transparent" value={input} onChange={(e) => setInput(e.target.value)} />
        </ToolCard>

        <ToolCard
          title={t('output')}
          action={
            <div className="flex items-center gap-1">
              <DownloadButton content={output} filename="ascii-art.txt" />
              <CopyButton text={output} type="art" />
            </div>
          }
          contentClassName="min-h-[400px] flex items-center justify-center p-8 bg-muted/20 overflow-auto"
        >
          {output
            ? <pre className="font-mono text-[10px] sm:text-xs leading-none text-foreground whitespace-pre animate-in fade-in zoom-in-95 duration-300">{output}</pre>
            : <div className="text-muted-foreground opacity-30 flex flex-col items-center gap-2 pointer-events-none"><Type className="h-10 w-10" /><p className="text-[10px]">ASCII Preview</p></div>
          }
        </ToolCard>
      </div>

      <div className="md:col-span-1 space-y-4">
        <ToolCard title={commonT('ui.customization')} icon={Settings2} contentClassName="p-4 space-y-5">
          <div className="space-y-2">
            <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">Font Style</Label>
            <Select value={font} onValueChange={(v) => setFont(v as figlet.Fonts)}>
              <SelectTrigger className="h-8 text-xs bg-muted/30 border-border"><SelectValue /></SelectTrigger>
              <SelectContent>
                {['Standard','Slant','Shadow','Big','Small','Banner','Digital','Block','Bubble'].map(f => (
                  <SelectItem key={f} value={f} className="text-xs">{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <InfoBox>{t('article').split('.')[0]}.</InfoBox>
        </ToolCard>
      </div>
    </div>
  );
}
