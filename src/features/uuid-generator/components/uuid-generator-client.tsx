"use client"

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check, RefreshCw, Settings2, Hash, Download, Share2, Info, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { v4 as uuidv4 } from 'uuid';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { useLanguage } from '@/hooks/tool';

export function UuidGeneratorClient() {
  const t = useTranslations('tools.uuid-generator');
  const tCommon = useTranslations('common');
  const { copiedType, copyToClipboard } = useCopyToClipboard();
  
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [downloaded, setDownloaded] = useState(false);

  const { isEnglish } = useLanguage();

  const generateUuids = useCallback(() => {
    const newUuids = Array.from({ length: count }, () => uuidv4());
    setUuids(newUuids);
  }, [count]);

  const downloadUuids = () => {
    const blob = new Blob([uuids.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uuids-${new Date().getTime()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 flex flex-col gap-4">
        <ToolCard 
          title={
            <div className="flex items-center gap-2">
              <span>{t('generatedUuids')}</span>
              {uuids.length > 0 && (
                <>
                  <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                  <span className="text-[10px] text-muted-foreground/60">{uuids.length} {isEnglish ? 'generated' : 'تیار کیے گئے'}</span>
                </>
              )}
            </div>
          }
          action={
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={downloadUuids} 
                disabled={uuids.length === 0}
                className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                {downloaded ? <Check className="h-3 w-3 text-green-500" /> : <Download className="h-3 w-3" />}
                {isEnglish ? 'Download' : 'ڈاؤن لوڈ'}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => copyToClipboard(uuids.join('\n'), 'all')} 
                disabled={uuids.length === 0}
                className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                {copiedType === 'all' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                {isEnglish ? 'Copy All' : 'تمام کاپی کریں'}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setUuids([])} disabled={uuids.length === 0} title={tCommon('clear')} className="h-6 w-6 text-muted-foreground hover:text-destructive">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          }
          contentClassName="p-3 space-y-2 bg-muted/10 min-h-[400px]"
        >
          {uuids.length > 0 ? (
            uuids.map((uuid, i) => (
              <div key={i} className="flex items-center gap-2 group">
                <div className="flex-1 font-mono text-xs p-2 bg-background border border-border rounded transition-colors group-hover:border-foreground/20 truncate leading-none">
                  {uuid}
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => copyToClipboard(uuid, `uuid-${i}`)}
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                >
                  {copiedType === `uuid-${i}` ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
            ))
          ) : (
            <div className="h-[370px] flex flex-col items-center justify-center text-muted-foreground space-y-3">
              <div className="p-3 rounded-full bg-muted/50 border border-border">
                <Hash className="h-5 w-5 opacity-40" />
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-foreground">{t('placeholder')}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{isEnglish ? 'Configure options and generate unique identifiers' : 'آپشنز سیٹ کریں اور منفرد شناختی کوڈز تخلیق کریں'}</p>
              </div>
              <Button onClick={generateUuids} size="sm" className="h-8 gap-2 px-4 mt-2">
                <RefreshCw className="h-3.5 w-3.5" />
                {isEnglish ? 'Generate UUIDs' : 'UUIDs تخلیق کریں'}
              </Button>
            </div>
          )}
        </ToolCard>
      </div>

      <div className="md:col-span-1 space-y-4">
        <ToolCard 
          title={tCommon('ui.settings')} 
          icon={Settings2}
          action={<Share2 className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground cursor-pointer" />}
          contentClassName="p-4 space-y-6"
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{t('quantity')}</Label>
              <span className="text-[10px] font-bold font-mono text-foreground">{count}</span>
            </div>
            <Slider
              value={[count]}
              onValueChange={(v) => {
                const val = Array.isArray(v) ? v[0] : v;
                setCount(val);
              }}
              max={20}
              min={1}
              step={1}
              className="py-1"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{t('version')}</Label>
            <Select defaultValue="v4">
              <SelectTrigger className="h-8 text-xs bg-muted/30 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="v4" className="text-xs">{t('v4Label')}</SelectItem>
                <SelectItem value="v1" className="text-xs" disabled>{t('v1Label')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="p-3 rounded-md bg-muted/50 border border-border space-y-1.5">
            <div className="flex items-center gap-2 text-[10px] font-semibold text-foreground uppercase tracking-tight">
              <Info className="h-3 w-3" />
              {isEnglish ? 'Details' : 'تفصیلات'}
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              {t('v4Desc')}
            </p>
          </div>

          <Button onClick={generateUuids} className="w-full h-8 gap-2 text-xs">
            <RefreshCw className={cn("h-3.5 w-3.5", uuids.length > 0 && "animate-spin-once")} />
            {isEnglish ? 'Generate New' : 'نیا تیار کریں'}
          </Button>
        </ToolCard>
      </div>
    </div>
  );
}
