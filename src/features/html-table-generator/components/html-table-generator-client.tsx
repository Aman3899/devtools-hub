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

export function HtmlTableGeneratorClient() {
  const t = useTranslations('tools.html-table-generator');
  const commonT = useTranslations('common');
  const { copiedType, copyToClipboard } = useCopyToClipboard();
  
  const [formData, setFormData] = useState({ rows: 3, cols: 3, header: true, striped: true });
  const [output, setOutput] = useState('');

  const generateTable = useCallback(() => {
    let html = '<table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">\n';
    if (formData.header) {
      html += '  <thead>\n    <tr style="background-color: #f2f2f2;">\n';
      for (let j = 0; j < formData.cols; j++) html += `      <th style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd;">${t('header_cell')} ${j + 1}</th>\n`;
      html += '    </tr>\n  </thead>\n';
    }
    html += '  <tbody>\n';
    for (let i = 0; i < formData.rows; i++) {
      const bgColor = formData.striped && i % 2 === 1 ? 'background-color: #fafafa;' : '';
      html += `    <tr style="${bgColor}">\n`;
      for (let j = 0; j < formData.cols; j++) html += `      <td style="padding: 12px; border-bottom: 1px solid #ddd;">${t('data_cell')} ${i + 1}-${j + 1}</td>\n`;
      html += '    </tr>\n';
    }
    html += '  </tbody>\n</table>';
    setOutput(html);
  }, [formData, t]);

  useEffect(() => { generateTable(); }, [generateTable]);

  const handleClear = () => setFormData({ rows: 3, cols: 3, header: true, striped: true });

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">
        <ToolCard 
          title={commonT('input')}
          action={<Button variant="ghost" size="icon" onClick={handleClear} title={commonT('clear')} className="h-6 w-6 hover:text-destructive"><Trash2 className="h-3 w-3" /></Button>}
          contentClassName="p-4 space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">{t('rows')}</Label>
              <Input type="number" min="1" max="50" value={formData.rows} onChange={(e) => setFormData({ ...formData, rows: parseInt(e.target.value) || 1 })} className="h-9 text-xs" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{t('cols')}</Label>
              <Input type="number" min="1" max="20" value={formData.cols} onChange={(e) => setFormData({ ...formData, cols: parseInt(e.target.value) || 1 })} className="h-9 text-xs" />
            </div>
          </div>
          <div className="p-4 border rounded-md bg-muted/20 overflow-hidden">
            <div className="overflow-x-auto"><div dangerouslySetInnerHTML={{ __html: output }} className="scale-[0.8] origin-top-left" /></div>
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
            <Label className="text-xs cursor-pointer" htmlFor="header-switch">{t('header')}</Label>
            <Switch id="header-switch" checked={formData.header} onCheckedChange={(val) => setFormData({ ...formData, header: val })} className="scale-75 origin-right" />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs cursor-pointer" htmlFor="striped-switch">{t('striped')}</Label>
            <Switch id="striped-switch" checked={formData.striped} onCheckedChange={(val) => setFormData({ ...formData, striped: val })} className="scale-75 origin-right" />
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
