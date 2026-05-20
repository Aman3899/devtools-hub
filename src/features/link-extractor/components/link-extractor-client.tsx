"use client"

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Trash2, Settings2, Info, Check, Link as LinkIcon, ExternalLink, Hash } from 'lucide-react';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

export function LinkExtractorClient() {
  const t = useTranslations('tools.link-extractor');
  const commonT = useTranslations('common');
  const { copiedType, copyToClipboard } = useCopyToClipboard();
  
  const [input, setInput] = useState('');
  const [links, setLinks] = useState<{ url: string; type: 'absolute' | 'relative' | 'hash' }[]>([]);

  const extractLinks = useCallback(() => {
    if (!input) {
      setLinks([]);
      return;
    }

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

    const urlRegex = /(https?:\/\/[^\s<]+)/g;
    const rawUrls = input.match(urlRegex) || [];
    rawUrls.forEach(url => {
      if (!foundLinks.some(l => l.url === url)) {
        foundLinks.push({ url, type: 'absolute' });
      }
    });

    setLinks(foundLinks);
  }, [input]);

  const handleClear = () => {
    setInput('');
    setLinks([]);
  };

  const stats = {
    total: links.length,
    unique: new Set(links.map(l => l.url)).size
  };

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">
        <ToolCard 
          title={commonT('input')}
          action={<Button variant="ghost" size="icon" onClick={handleClear} title={commonT('clear')} className="h-6 w-6 hover:text-destructive"><Trash2 className="h-3 w-3" /></Button>}
          contentClassName="p-4 flex flex-col gap-3"
        >
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
        </ToolCard>

        <ToolCard 
          title={commonT('ui.result')}
          action={
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => copyToClipboard(links.map(l => l.url).join('\n'), 'links')}
              disabled={links.length === 0}
              className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              {copiedType === 'links' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
              {commonT('copy')}
            </Button>
          }
          contentClassName="p-0 flex flex-col h-[480px] bg-muted/20"
        >
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
                    onClick={() => copyToClipboard(link.url, `link-${i}`)}
                  >
                    {copiedType === `link-${i}` ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
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
        </ToolCard>
      </div>

      <div className="md:col-span-1 space-y-4">
        <ToolCard title={commonT('ui.options')} icon={Settings2} contentClassName="p-4 space-y-4">
          <div className="flex gap-2.5 items-start p-3 rounded-md bg-muted/30 border border-border">
            <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-[10px] text-muted-foreground leading-normal">{t('article').split('.')[0]}.</p>
          </div>
          <div className="pt-2 space-y-2">
            <p className="text-[10px] text-muted-foreground leading-relaxed">{t('sidebar_desc')}</p>
          </div>
        </ToolCard>
      </div>
    </div>
  );
}
