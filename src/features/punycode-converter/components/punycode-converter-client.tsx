"use client"

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Settings2, Info, Copy, RefreshCw, Check, ArrowRightLeft, Globe } from 'lucide-react';
import punycode from 'punycode';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

export function PunycodeConverterClient() {
  const t = useTranslations('tools.punycode-converter');
  const commonT = useTranslations('common');
  const { copiedType, copyToClipboard } = useCopyToClipboard();
  
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const processData = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      if (mode === 'encode') {
        setOutput(punycode.toASCII(input));
      } else {
        setOutput(punycode.toUnicode(input));
      }
    } catch (e) {
      setOutput(commonT('error'));
    }
  }, [input, mode, commonT]);

  useEffect(() => {
    processData();
  }, [processData]);

  const loadSample = () => {
    if (mode === 'encode') {
      setInput('mañana.com');
    } else {
      setInput('xn--maana-pta.com');
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">
        {/* Input Area */}
        <ToolCard 
          title={t('domain_input')}
          action={
            <Button variant="ghost" size="sm" onClick={loadSample} className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground">
              <RefreshCw className="h-3 w-3" />
              {commonT('ui.sample')}
            </Button>
          }
          contentClassName="p-0 flex flex-col h-[300px]"
        >
          <Textarea
            placeholder={mode === 'encode' ? 'e.g., mañana.com' : 'e.g., xn--maana-pta.com'}
            className="flex-1 font-mono text-sm resize-none border-none focus-visible:ring-0 p-4 bg-transparent leading-relaxed"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </ToolCard>

        {/* Output Area */}
        <ToolCard 
          title={t('converted_output')}
          action={
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => copyToClipboard(output, 'punycode')} 
              disabled={!output || output === commonT('error')}
              className="h-6 px-2 text-[10px] gap-1.5 transition-colors"
            >
              {copiedType === 'punycode' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
              {commonT('copy')}
            </Button>
          }
          contentClassName="p-0 flex flex-col h-[300px] bg-muted/20"
        >
          <Textarea
            readOnly
            className="flex-1 font-mono text-sm resize-none border-none focus-visible:ring-0 p-4 bg-transparent leading-relaxed text-[#e06c75]"
            value={output}
            placeholder="Result..."
          />
        </ToolCard>
      </div>

      <div className="md:col-span-1 space-y-4">
        <ToolCard title={commonT('ui.customization')} icon={Settings2} contentClassName="p-4 space-y-6">
          <div className="flex flex-col gap-2">
            <Button 
              variant={mode === 'encode' ? 'default' : 'outline'} 
              className="w-full justify-start h-9 text-xs"
              onClick={() => { setMode('encode'); setInput(''); }}
            >
              <ArrowRightLeft className="h-4 w-4 mr-2" />
              {t('encode')}
            </Button>
            <Button 
              variant={mode === 'decode' ? 'default' : 'outline'} 
              className="w-full justify-start h-9 text-xs"
              onClick={() => { setMode('decode'); setInput(''); }}
            >
              <Globe className="h-4 w-4 mr-2" />
              {t('decode')}
            </Button>
          </div>

          <div className="p-3 rounded-md bg-muted/50 border border-border space-y-1.5">
            <div className="flex items-center gap-2 text-[10px] font-semibold text-foreground uppercase tracking-tight">
              <Info className="h-3 w-3" />
              Info
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">{t('info')}</p>
          </div>
        </ToolCard>
      </div>
    </div>
  );
}
