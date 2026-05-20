'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Lock, Unlock, Upload, Settings2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, CodeTextarea } from '@/components/common';

export function Base64EncoderClient() {
  const t = useTranslations('tools.base64-encoder');
  const commonT = useTranslations('common');

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [isUrlSafe, setIsUrlSafe] = useState(false);

  const process = useCallback((textToProcess: string = input) => {
    if (!textToProcess.trim()) { setOutput(''); return; }
    try {
      if (mode === 'encode') {
        let encoded = btoa(unescape(encodeURIComponent(textToProcess)));
        if (isUrlSafe) encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        setOutput(encoded);
      } else {
        let textToDecode = textToProcess;
        if (isUrlSafe) { textToDecode = textToDecode.replace(/-/g, '+').replace(/_/g, '/'); while (textToDecode.length % 4) textToDecode += '='; }
        setOutput(decodeURIComponent(escape(atob(textToDecode))));
      }
    } catch { setOutput(commonT('error')); }
  }, [input, mode, isUrlSafe, commonT]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { const text = ev.target?.result as string; setInput(text); process(text); toast.success(commonT('success')); };
    reader.readAsText(file);
  };

  const loadSample = () => {
    const sample = mode === 'encode' ? 'Hello, World! DevTools Hub is a privacy-first tool.' : 'SGVsbG8sIFdvcmxkISBEZXZUb29scyBIdWIgaXMgYSBwcml2YWN5LWZpcnN0IHRvb2wu';
    setInput(sample); process(sample);
  };

  const switchMode = (m: 'encode' | 'decode') => { setMode(m); setInput(''); setOutput(''); };

  return (
    <div className="grid gap-6 lg:grid-cols-3 items-start">
      <div className="lg:col-span-2 grid gap-4 md:grid-cols-2">
        <ToolCard
          title={commonT('input')}
          action={<ToolActions onSample={loadSample} onClear={() => { setInput(''); setOutput(''); }} />}
          contentClassName="p-0 flex flex-col h-[500px]"
        >
          <CodeTextarea
            placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
            value={input}
            onChange={(v) => { setInput(v); process(v); }}
          />
          <div className="p-2 border-t bg-muted/5">
            <Button className="w-full h-8 text-xs" onClick={() => process()} disabled={!input}>
              {mode === 'encode' ? commonT('encode') : commonT('decode')}
            </Button>
          </div>
        </ToolCard>

        <ToolCard
          title={commonT('ui.result')}
          action={
            <div className="flex items-center gap-1">
              <DownloadButton content={output} filename={`base64-${mode}d-${Date.now()}.txt`} />
              <CopyButton text={output} type="base" />
            </div>
          }
          contentClassName="p-0 flex flex-col h-[500px] bg-muted/20"
        >
          <pre className="flex-1 font-mono text-xs p-3 overflow-auto whitespace-pre-wrap break-all leading-relaxed text-foreground">
            {output || t('result_will_app')}
          </pre>
        </ToolCard>
      </div>

      <div className="lg:col-span-1 space-y-4">
        <ToolCard title={commonT('ui.customization')} icon={Settings2} contentClassName="p-4 space-y-6">
          <div className="flex bg-muted/30 p-1 rounded-md border border-border">
            <Button variant={mode === 'encode' ? 'default' : 'ghost'} size="sm" className={cn('flex-1 h-7 text-[10px] rounded-sm', mode === 'encode' ? 'shadow-sm' : '')} onClick={() => switchMode('encode')}>
              <Lock className="h-3 w-3 mr-1.5" />{commonT('encode')}
            </Button>
            <Button variant={mode === 'decode' ? 'default' : 'ghost'} size="sm" className={cn('flex-1 h-7 text-[10px] rounded-sm', mode === 'decode' ? 'shadow-sm' : '')} onClick={() => switchMode('decode')}>
              <Unlock className="h-3 w-3 mr-1.5" />{commonT('decode')}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5"><Label className="text-xs">URL Safe</Label><p className="text-[9px] text-muted-foreground leading-tight">Use - and _ instead of + and /</p></div>
            <Switch checked={isUrlSafe} onCheckedChange={(v) => { setIsUrlSafe(v); process(); }} className="scale-75 origin-right" />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-medium text-muted-foreground uppercase">{t('upload_file')}</Label>
            <Label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-md hover:border-foreground/20 hover:bg-muted/30 cursor-pointer group">
              <div className="flex flex-col items-center gap-1.5 text-muted-foreground group-hover:text-foreground">
                <Upload className="h-5 w-5" />
                <span className="text-[10px] font-medium">{t('select_text_fil')}</span>
              </div>
              <input type="file" className="hidden" accept=".txt,.json,.md,.csv" onChange={handleFileUpload} />
            </Label>
          </div>

          <InfoBox title={t('quick_tip')} variant="default">
            {t('article').split('.')[0]}.
          </InfoBox>
        </ToolCard>
      </div>
    </div>
  );
}
