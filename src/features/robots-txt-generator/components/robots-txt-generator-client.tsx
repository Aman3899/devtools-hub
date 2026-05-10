'use client';

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Copy, Trash2, Settings2, Info, Check } from 'lucide-react';
import { ToolNavigation } from '@/components/tool-navigation';

export function RobotsTxtGeneratorClient() {
  const t = useTranslations('tools.robots-txt-generator');
  const commonT = useTranslations('common');
  
  const [formData, setFormData] = useState({
    allowAll: true,
    disallowPaths: '/admin\n/private',
    sitemapUrl: 'https://example.com/sitemap.xml',
  });
  
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setFormData({
      allowAll: true,
      disallowPaths: '',
      sitemapUrl: '',
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
                <Label className="text-xs">{t('disallow')}</Label>
                <Textarea 
                  value={formData.disallowPaths}
                  onChange={(e) => setFormData({ ...formData, disallowPaths: e.target.value })}
                  placeholder={t('placeholder_disallow')}
                  className="h-32 text-xs resize-none font-mono"
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
            </CardContent>
          </Card>
        </div>
      </div>
      <ToolNavigation currentToolId="robots-txt-generator" />
    </div>
  );
}
