"use client"

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { RefreshCw, Lock, Unlock, Settings2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton } from '@/components/common';
import { DownloadButton } from '@/components/common';
import { ToolActions } from '@/components/common';
import { CodeTextarea } from '@/components/common';

export function UrlEncoderClient() {
  const t = useTranslations('tools.url-encoder');
  const commonT = useTranslations('common');

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [isComponentMode, setIsComponentMode] = useState(true);

  const process = useCallback((textToProcess: string = input) => {
    if (!textToProcess.trim()) {
      setOutput('');
      return;
    }

    try {
      if (mode === 'encode') {
        setOutput(isComponentMode ? encodeURIComponent(textToProcess) : encodeURI(textToProcess));
      } else {
        setOutput(isComponentMode ? decodeURIComponent(textToProcess) : decodeURI(textToProcess));
      }
    } catch (e) {
      setOutput(commonT('error'));
    }
  }, [input, mode, isComponentMode, commonT]);

  const loadSample = () => {
    const sample = mode === 'encode' 
      ? 'https://devtools-hub.com/search?q=hello world&category=dev tools' 
      : 'https%3A%2F%2Fdevtools-hub.com%2Fsearch%3Fq%3Dhello%20world%26category%3Ddev%20tools';
    setInput(sample);
    process(sample);
  };

  const stats = {
    chars: input.length,
    lines: input.split('\n').length
  };

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">
        {/* Input Area */}
        <ToolCard 
          title={
            <div className="flex items-center gap-2">
              <span>{commonT('input')}</span>
              <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
              <span className="text-[10px] text-muted-foreground/60">{stats.chars} chars</span>
            </div>
          }
          action={
            <ToolActions onSample={loadSample} onClear={() => { setInput(''); setOutput(''); }} />
          }
          contentClassName="p-0 flex flex-col h-[500px]"
        >
          <CodeTextarea
            placeholder={mode === 'encode' ? 'Enter URL or text to encode...' : 'Enter encoded URL to decode...'}
            value={input}
            onChange={(val) => { setInput(val); process(val); }}
          />
          <div className="p-2 border-t bg-muted/5">
            <Button className="w-full h-8 text-xs" onClick={() => process()} disabled={!input}>
              <RefreshCw className="h-3.5 w-3.5 mr-2" />
              {mode === 'encode' ? commonT('encode') : commonT('decode')}
            </Button>
          </div>
        </ToolCard>

        {/* Output Area */}
        <ToolCard 
          title={commonT('ui.result')}
          action={
            <div className="flex items-center gap-1">
              <DownloadButton
                content={output}
                filename={`url-${mode}d-${new Date().getTime()}.txt`}
                mimeType="text/plain"
                disabled={!output}
              />
              <CopyButton text={output} type="url" disabled={!output} />
            </div>
          }
          contentClassName="p-0 flex flex-col h-[500px] bg-muted/20"
        >
          <pre className="flex-1 font-mono text-xs p-3 overflow-auto whitespace-pre-wrap break-all leading-relaxed text-foreground">
            {output || (t('result_will_app'))}
          </pre>
        </ToolCard>
      </div>

      {/* Sidebar Settings */}
      <div className="md:col-span-1 space-y-4">
        <ToolCard title={commonT('ui.customization')} icon={Settings2} contentClassName="p-4 space-y-6">
          <div className="flex bg-muted/30 p-1 rounded-md border border-border">
            <Button
              variant={mode === 'encode' ? 'default' : 'ghost'}
              size="sm"
              className={cn("flex-1 h-7 text-[10px] rounded-sm transition-all", mode === 'encode' ? "shadow-sm" : "")}
              onClick={() => { setMode('encode'); setInput(''); setOutput(''); }}
            >
              <Lock className="h-3 w-3 mr-1.5" />
              {commonT('encode')}
            </Button>
            <Button
              variant={mode === 'decode' ? 'default' : 'ghost'}
              size="sm"
              className={cn("flex-1 h-7 text-[10px] rounded-sm transition-all", mode === 'decode' ? "shadow-sm" : "")}
              onClick={() => { setMode('decode'); setInput(''); setOutput(''); }}
            >
              <Unlock className="h-3 w-3 mr-1.5" />
              {commonT('decode')}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-xs">{t('component_mode')}</Label>
              <p className="text-[9px] text-muted-foreground leading-tight">
                {t('encodes_all_spe')}
              </p>
            </div>
            <Switch checked={isComponentMode} onCheckedChange={(val) => { setIsComponentMode(val); process(); }} className="scale-75 origin-right" />
          </div>

          <div className="p-3 rounded-md bg-muted/50 border border-border space-y-1.5">
            <div className="flex items-center gap-2 text-[10px] font-semibold text-foreground uppercase tracking-tight">
              <Info className="h-3 w-3" />
              {t('quick_tip')}
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              {t('use_component_m')}
            </p>
          </div>
        </ToolCard>
      </div>
    </div>
  );
}
