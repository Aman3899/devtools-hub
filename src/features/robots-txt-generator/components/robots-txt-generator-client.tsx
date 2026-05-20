"use client"

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Copy, Trash2, Settings2, Info, Check } from 'lucide-react';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

export function RobotsTxtGeneratorClient() {
  const t = useTranslations('tools.robots-txt-generator');
  const commonT = useTranslations('common');
  const { copiedType, copyToClipboard } = useCopyToClipboard();
  
  const [formData, setFormData] = useState({
    allowAll: true,
    disallowPaths: '/admin\n/private',
    sitemapUrl: 'https://example.com/sitemap.xml',
  });
  
  const [output, setOutput] = useState('');

  const generateRobots = useCallback(() => {
    let lines = [];
    
    lines.push('User-agent: *');
    if (formData.allowAll) {
      lines.push('Allow: /');
    }
    
    const paths = formData.disallowPaths.split('\n').filter(p => p.trim());
    paths.forEach(path => {
      lines.push(`Disallow: ${path.trim()}`);
    });
    
    if (formData.sitemapUrl) {
      lines.push(`\nSitemap: ${formData.sitemapUrl}`);
    }
    
    setOutput(lines.join('\n'));
  }, [formData]);

  useEffect(() => {
    generateRobots();
  }, [generateRobots]);

  const handleClear = () => {
    setFormData({
      allowAll: true,
      disallowPaths: '',
      sitemapUrl: '',
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
          contentClassName="p-4 space-y-4"
        >
          <div className="space-y-1.5">
            <Label className="text-xs">{t('disallow')}</Label>
            <Textarea 
              value={formData.disallowPaths}
              onChange={(e) => setFormData({ ...formData, disallowPaths: e.target.value })}
              placeholder={t('placeholder_disallow')}
              className="h-32 text-xs resize-none font-mono border border-border"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">{t('sitemap_url')}</Label>
            <Input 
              value={formData.sitemapUrl}
              onChange={(e) => setFormData({ ...formData, sitemapUrl: e.target.value })}
              placeholder="https://example.com/sitemap.xml"
              className="h-9 text-xs"
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
              onClick={() => copyToClipboard(output, 'robots')}
              className="h-6 px-2 text-[10px] gap-1.5 transition-colors"
            >
              {copiedType === 'robots' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
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
          <div className="flex items-center justify-between">
            <Label className="text-xs cursor-pointer" htmlFor="allow-switch">{t('allow_all')}</Label>
            <Switch 
              id="allow-switch"
              checked={formData.allowAll} 
              onCheckedChange={(val) => setFormData({ ...formData, allowAll: val })} 
              className="scale-75 origin-right" 
            />
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
