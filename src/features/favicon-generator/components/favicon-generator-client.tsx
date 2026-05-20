"use client"

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Copy, Trash2, Settings2, Info, Check, Image as ImageIcon } from 'lucide-react';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

export function FaviconGeneratorClient() {
  const t = useTranslations('tools.favicon-generator');
  const commonT = useTranslations('common');
  const { copiedType, copyToClipboard } = useCopyToClipboard();
  
  const [formData, setFormData] = useState({ iconUrl: '/favicon.ico', appleIcon: true, manifest: true });
  const [output, setOutput] = useState('');

  const generateTags = useCallback(() => {
    let tags = ['<!-- Favicon Tags -->', `<link rel="icon" type="image/x-icon" href="${formData.iconUrl}">`, `<link rel="shortcut icon" href="${formData.iconUrl}">`];
    if (formData.appleIcon) tags.push('<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">');
    if (formData.manifest) tags.push('<link rel="manifest" href="/site.webmanifest">');
    setOutput(tags.join('\n'));
  }, [formData]);

  useEffect(() => { generateTags(); }, [generateTags]);

  const handleClear = () => setFormData({ iconUrl: '/favicon.ico', appleIcon: true, manifest: true });

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">
        <ToolCard 
          title={t('input')}
          action={<Button variant="ghost" size="icon" onClick={handleClear} title={commonT('clear')} className="h-6 w-6 hover:text-destructive"><Trash2 className="h-3 w-3" /></Button>}
          contentClassName="p-4 space-y-4"
        >
          <div className="space-y-1.5">
            <Label className="text-xs">{t('icon_url')}</Label>
            <Input value={formData.iconUrl} onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })} placeholder="/favicon.ico" className="h-9 text-xs" />
          </div>
          <div className="p-3 rounded-md bg-muted/20 border border-border flex items-center gap-3">
            <div className="h-10 w-10 bg-white rounded border border-border flex items-center justify-center"><ImageIcon className="h-5 w-5 text-muted-foreground" /></div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-semibold uppercase tracking-tight text-muted-foreground">{t('preview')}</p>
              <p className="text-[11px] text-foreground">{t('standard_favicon')}</p>
            </div>
          </div>
        </ToolCard>

        <ToolCard 
          title={commonT('ui.result')}
          action={<Button variant="ghost" size="sm" onClick={() => copyToClipboard(output, 'html')} className="h-6 px-2 text-[10px] gap-1.5">{copiedType === 'html' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}{commonT('copy')}</Button>}
          contentClassName="p-0 flex flex-col h-full bg-muted/20 min-h-[400px]"
        >
          <pre className="flex-1 font-mono text-[11px] p-4 overflow-auto whitespace-pre-wrap leading-relaxed text-foreground bg-transparent">{output}</pre>
        </ToolCard>
      </div>

      <div className="md:col-span-1 space-y-4">
        <ToolCard title={commonT('ui.options')} icon={Settings2} contentClassName="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-xs cursor-pointer" htmlFor="apple-switch">{t('apple_icon')}</Label>
            <Switch id="apple-switch" checked={formData.appleIcon} onCheckedChange={(val) => setFormData({ ...formData, appleIcon: val })} className="scale-75 origin-right" />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs cursor-pointer" htmlFor="manifest-switch">{t('manifest')}</Label>
            <Switch id="manifest-switch" checked={formData.manifest} onCheckedChange={(val) => setFormData({ ...formData, manifest: val })} className="scale-75 origin-right" />
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
