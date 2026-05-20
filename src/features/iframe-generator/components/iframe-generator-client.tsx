"use client"

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Copy, Trash2, Settings2, Info, Check } from 'lucide-react';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

export function IframeGeneratorClient() {
  const t = useTranslations('tools.iframe-generator');
  const commonT = useTranslations('common');
  const { copiedType, copyToClipboard } = useCopyToClipboard();
  
  const [formData, setFormData] = useState({ src: 'https://www.google.com/maps/embed?...', width: '100%', height: '450', border: false, sandbox: true });
  const [output, setOutput] = useState('');

  const generateIframe = useCallback(() => {
    let tag = `<iframe\n  src="${formData.src}"\n  width="${formData.width}"\n  height="${formData.height}"\n  style="border: ${formData.border ? '1px solid #ccc' : '0'}"\n  allowfullscreen\n  loading="lazy"\n  referrerpolicy="no-referrer-when-downgrade"`;
    if (formData.sandbox) tag += '\n  sandbox="allow-scripts allow-same-origin"';
    tag += '\n></iframe>';
    setOutput(tag);
  }, [formData]);

  useEffect(() => { generateIframe(); }, [generateIframe]);

  const handleClear = () => setFormData({ src: '', width: '100%', height: '450', border: false, sandbox: true });

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">
        <ToolCard 
          title={commonT('input')}
          action={<Button variant="ghost" size="icon" onClick={handleClear} title={commonT('clear')} className="h-6 w-6 hover:text-destructive"><Trash2 className="h-3 w-3" /></Button>}
          contentClassName="p-4 space-y-4"
        >
          <div className="space-y-1.5">
            <Label className="text-xs">{t('src')}</Label>
            <Input value={formData.src} onChange={(e) => setFormData({ ...formData, src: e.target.value })} placeholder={t('placeholder_src')} className="h-9 text-xs" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label className="text-xs">{t('width')}</Label><Input value={formData.width} onChange={(e) => setFormData({ ...formData, width: e.target.value })} placeholder="100%" className="h-9 text-xs" /></div>
            <div className="space-y-1.5"><Label className="text-xs">{t('height')}</Label><Input value={formData.height} onChange={(e) => setFormData({ ...formData, height: e.target.value })} placeholder="450" className="h-9 text-xs" /></div>
          </div>
        </ToolCard>

        <ToolCard 
          title={commonT('ui.result')}
          action={<Button variant="ghost" size="sm" onClick={() => copyToClipboard(output, 'iframe')} className="h-6 px-2 text-[10px] gap-1.5">{copiedType === 'iframe' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}{commonT('copy')}</Button>}
          contentClassName="p-0 flex flex-col h-full bg-muted/20 min-h-[400px]"
        >
          <pre className="flex-1 font-mono text-[11px] p-4 overflow-auto whitespace-pre-wrap leading-relaxed text-foreground bg-transparent">{output}</pre>
        </ToolCard>
      </div>

      <div className="md:col-span-1 space-y-4">
        <ToolCard title={commonT('ui.options')} icon={Settings2} contentClassName="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-xs cursor-pointer" htmlFor="border-switch">{t('border')}</Label>
            <Switch id="border-switch" checked={formData.border} onCheckedChange={(val) => setFormData({ ...formData, border: val })} className="scale-75 origin-right" />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs cursor-pointer" htmlFor="sandbox-switch">{t('sandbox')}</Label>
            <Switch id="sandbox-switch" checked={formData.sandbox} onCheckedChange={(val) => setFormData({ ...formData, sandbox: val })} className="scale-75 origin-right" />
          </div>

          <div className="pt-4 border-t space-y-3">
            <div className="flex gap-2.5 items-start p-3 rounded-md bg-muted/30 border border-border">
              <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-[10px] text-muted-foreground leading-normal">{t('article').split('.')[0]}.</p>
            </div>
          </div>
        </ToolCard>
      </div>
    </div>
  );
}
