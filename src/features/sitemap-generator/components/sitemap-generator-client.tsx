"use client"

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Trash2, Settings2, Info, Check } from 'lucide-react';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

export function SitemapGeneratorClient() {
  const t = useTranslations('tools.sitemap-generator');
  const commonT = useTranslations('common');
  const { copiedType, copyToClipboard } = useCopyToClipboard();
  
  const [formData, setFormData] = useState({
    urls: 'https://example.com/\nhttps://example.com/about\nhttps://example.com/contact',
    changefreq: 'weekly',
    priority: '0.8',
  });
  
  const [output, setOutput] = useState('');

  const generateSitemap = useCallback(() => {
    let lines = [];
    lines.push('<?xml version="1.0" encoding="UTF-8"?>');
    lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    
    const urls = formData.urls.split('\n').filter(u => u.trim());
    urls.forEach(url => {
      lines.push('  <url>');
      lines.push(`    <loc>${url.trim()}</loc>`);
      lines.push(`    <changefreq>${formData.changefreq}</changefreq>`);
      lines.push(`    <priority>${formData.priority}</priority>`);
      lines.push('  </url>');
    });
    
    lines.push('</urlset>');
    setOutput(lines.join('\n'));
  }, [formData]);

  useEffect(() => {
    generateSitemap();
  }, [generateSitemap]);

  const handleClear = () => {
    setFormData({
      urls: '',
      changefreq: 'weekly',
      priority: '0.8',
    });
  };

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">
        {/* Form Area */}
        <ToolCard 
          title={commonT('input')}
          action={
            <Button variant="ghost" size="icon" onClick={handleClear} title={commonT('clear')} className="h-6 w-6 hover:text-destructive">
              <Trash2 className="h-3 w-3" />
            </Button>
          }
          contentClassName="p-4"
        >
          <div className="space-y-1.5">
            <Label className="text-xs">{t('input')}</Label>
            <Textarea 
              value={formData.urls}
              onChange={(e) => setFormData({ ...formData, urls: e.target.value })}
              placeholder={t('placeholder')}
              className="h-48 text-xs resize-none font-mono border border-border"
            />
          </div>
        </ToolCard>

        {/* Output Area */}
        <ToolCard 
          title={commonT('ui.result')}
          action={
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => copyToClipboard(output, 'sitemap')}
              className="h-6 px-2 text-[10px] gap-1.5 transition-colors"
            >
              {copiedType === 'sitemap' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
              {commonT('copy')}
            </Button>
          }
          contentClassName="p-0 flex flex-col h-full bg-muted/20 min-h-[400px]"
        >
          <pre className="flex-1 font-mono text-[11px] p-4 overflow-auto whitespace-pre-wrap leading-relaxed text-foreground bg-transparent">
            {output}
          </pre>
        </ToolCard>
      </div>

      {/* Sidebar Settings */}
      <div className="md:col-span-1 space-y-4">
        <ToolCard title={commonT('ui.options')} icon={Settings2} contentClassName="p-4 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">{t('changefreq')}</Label>
            <Select value={formData.changefreq} onValueChange={(val) => setFormData({ ...formData, changefreq: val || 'weekly' })}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="always" className="text-xs">{t('freq_always')}</SelectItem>
                <SelectItem value="hourly" className="text-xs">{t('freq_hourly')}</SelectItem>
                <SelectItem value="daily" className="text-xs">{t('freq_daily')}</SelectItem>
                <SelectItem value="weekly" className="text-xs">{t('freq_weekly')}</SelectItem>
                <SelectItem value="monthly" className="text-xs">{t('freq_monthly')}</SelectItem>
                <SelectItem value="yearly" className="text-xs">{t('freq_yearly')}</SelectItem>
                <SelectItem value="never" className="text-xs">{t('freq_never')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">{t('priority')}</Label>
            <Select value={formData.priority} onValueChange={(val) => setFormData({ ...formData, priority: val || '0.8' })}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1.0" className="text-xs">{t('priority_highest')}</SelectItem>
                <SelectItem value="0.8" className="text-xs">{t('priority_high')}</SelectItem>
                <SelectItem value="0.5" className="text-xs">{t('priority_default')}</SelectItem>
                <SelectItem value="0.3" className="text-xs">{t('priority_low')}</SelectItem>
                <SelectItem value="0.1" className="text-xs">{t('priority_lowest')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 border-t space-y-3">
            <div className="flex gap-2.5 items-start p-3 rounded-md bg-muted/30 border border-border">
              <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-[10px] text-muted-foreground leading-normal">
                {t('article').split('.')[0]}.
              </p>
            </div>
          </div>
        </ToolCard>
      </div>
    </div>
  );
}
