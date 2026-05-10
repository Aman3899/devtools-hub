'use client';

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Trash2, Settings2, Info, Check } from 'lucide-react';
import { ToolNavigation } from '@/components/tool-navigation';

export function SitemapGeneratorClient() {
  const t = useTranslations('tools.sitemap-generator');
  const commonT = useTranslations('common');
  
  const [formData, setFormData] = useState({
    urls: 'https://example.com/\nhttps://example.com/about\nhttps://example.com/contact',
    changefreq: 'weekly',
    priority: '0.8',
  });
  
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setFormData({
      urls: '',
      changefreq: 'weekly',
      priority: '0.8',
    });
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 grid gap-4 md:grid-cols-2">
          {/* Form Area */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{commonT('input')}</Label>
              </div>
              <Button variant="ghost" size="icon" onClick={handleClear} title={commonT('clear')} className="h-6 w-6 text-muted-foreground hover:text-destructive">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            <Card className="border border-border shadow-none rounded-md p-4 bg-background space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs">{t('input')}</Label>
                <Textarea 
                  value={formData.urls}
                  onChange={(e) => setFormData({ ...formData, urls: e.target.value })}
                  placeholder={t('placeholder')}
                  className="h-48 text-xs resize-none font-mono"
                />
              </div>
            </Card>
          </div>

          {/* Output Area */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{commonT('ui.result')}</Label>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={copyToClipboard}
                className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                {commonT('copy')}
              </Button>
            </div>
            <Card className="flex flex-col h-full border border-border shadow-none rounded-md overflow-hidden bg-muted/20 min-h-[400px]">
              <pre className="flex-1 font-mono text-[11px] p-4 overflow-auto whitespace-pre-wrap leading-relaxed text-foreground bg-transparent">
                {output}
              </pre>
            </Card>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="border border-border shadow-none rounded-md bg-background">
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-xs font-semibold flex items-center gap-2">
                <Settings2 className="h-3.5 w-3.5" />
                {commonT('ui.options')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
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
            </CardContent>
          </Card>
        </div>
      </div>
      <ToolNavigation currentToolId="sitemap-generator" />
    </div>
  );
}
