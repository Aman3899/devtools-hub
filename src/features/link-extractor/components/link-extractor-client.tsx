'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Trash2, Settings2, Info, Check, Link as LinkIcon, ExternalLink, Hash } from 'lucide-react';
import { ToolNavigation } from '@/components/tool-navigation';

export function LinkExtractorClient() {
  const t = useTranslations('tools.link-extractor');
  const commonT = useTranslations('common');
  
  const [input, setInput] = useState('');
  const [links, setLinks] = useState<{ url: string; type: 'absolute' | 'relative' | 'hash' }[]>([]);
  const [copied, setCopied] = useState(false);

  const extractLinks = useCallback(() => {
    if (!input) {
      setLinks([]);
      return;
    }

    // Extract from <a> tags first
    const parser = new DOMParser();
    const doc = parser.parseFromString(input, 'text/html');
    const anchorTags = Array.from(doc.querySelectorAll('a'));
    
    let foundLinks: { url: string; type: 'absolute' | 'relative' | 'hash' }[] = [];
    
    anchorTags.forEach(a => {
      const href = a.getAttribute('href');
      if (href) {
        let type: 'absolute' | 'relative' | 'hash' = 'relative';
        if (href.startsWith('http')) type = 'absolute';
        else if (href.startsWith('#')) type = 'hash';
        foundLinks.push({ url: href, type });
      }
    });

    // Also extract raw URLs using regex if not much found via DOM
    const urlRegex = /(https?:\/\/[^\s<]+)/g;
    const rawUrls = input.match(urlRegex) || [];
    rawUrls.forEach(url => {
      if (!foundLinks.some(l => l.url === url)) {
        foundLinks.push({ url, type: 'absolute' });
      }
    });

    setLinks(foundLinks);
  }, [input]);

  const copyToClipboard = () => {
    const text = links.map(l => l.url).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setLinks([]);
  };

  const stats = {
    total: links.length,
    unique: new Set(links.map(l => l.url)).size
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
            <Card className="border border-border shadow-none rounded-md p-4 bg-background flex flex-col gap-3">
              <Textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('placeholder')}
                className="h-96 text-xs font-mono resize-none"
              />
              <Button onClick={extractLinks} className="w-full h-9 text-xs">
                <LinkIcon className="h-3.5 w-3.5 mr-2" />
                {t('title')}
              </Button>
            </Card>
          </div>

          {/* Result Area */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{commonT('ui.result')}</Label>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={copyToClipboard}
                disabled={links.length === 0}
                className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                {commonT('copy')}
              </Button>
            </div>
            <Card className="flex flex-col h-[480px] border border-border shadow-none rounded-md overflow-hidden bg-muted/20">
              <div className="flex-1 overflow-auto p-4 space-y-2">
                {links.length > 0 ? (
                  links.map((link, i) => (
                    <div key={i} className="flex items-center justify-between gap-3 p-2 rounded border border-border bg-background group">
                      <div className="flex items-center gap-2 overflow-hidden">
                        {link.type === 'absolute' ? <ExternalLink className="h-3 w-3 text-blue-500 shrink-0" /> : <Hash className="h-3 w-3 text-muted-foreground shrink-0" />}
                        <span className="text-[11px] font-mono truncate text-foreground">{link.url}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => navigator.clipboard.writeText(link.url)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                    <LinkIcon className="h-8 w-8 opacity-20" />
                    <p className="text-xs">{t('no_links')}</p>
                  </div>
                )}
              </div>
              {links.length > 0 && (
                <div className="p-3 bg-muted/50 border-t flex items-center justify-between">
                   <div className="flex items-center gap-4 text-[10px] font-medium text-muted-foreground uppercase">
                     <span>{t('total_links')}: {stats.total}</span>
                     <span>{t('unique_links')}: {stats.unique}</span>
                   </div>
                </div>
              )}
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
               <div className="flex gap-2.5 items-start p-3 rounded-md bg-muted/30 border border-border">
                  <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                  <p className="text-[10px] text-muted-foreground leading-normal">
                    {t('article').split('.')[0]}.
                  </p>
                </div>
                <div className="pt-2 space-y-2">
                   <p className="text-[10px] text-muted-foreground leading-relaxed">
                     {t('sidebar_desc')}
                   </p>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ToolNavigation currentToolId="link-extractor" />
    </div>
  );
}
