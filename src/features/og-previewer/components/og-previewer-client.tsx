'use client';

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Trash2, Settings2, Info, Check, Share2, Globe, Image as ImageIcon } from 'lucide-react';
import { ToolNavigation } from '@/components/tool-navigation';

export function OgPreviewerClient() {
  const t = useTranslations('tools.og-previewer');
  const commonT = useTranslations('common');
  
  const [input, setInput] = useState('<meta property="og:title" content="Open Graph Previewer">\n<meta property="og:description" content="Preview how your website looks on social media.">\n<meta property="og:image" content="https://example.com/og-image.jpg">\n<meta property="og:url" content="https://example.com">');
  const [metaData, setMetaData] = useState({
    title: '',
    description: '',
    image: '',
    url: '',
    siteName: '',
  });

  const parseMetaTags = useCallback(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<html><head>${input}</head><body></body></html>`, 'text/html');
    const metas = doc.querySelectorAll('meta');
    
    const data = {
      title: doc.querySelector('title')?.textContent || '',
      description: '',
      image: '',
      url: '',
      siteName: '',
    };

    metas.forEach(meta => {
      const property = meta.getAttribute('property') || meta.getAttribute('name');
      const content = meta.getAttribute('content');
      
      if (!content) return;

      if (property === 'og:title' || property === 'twitter:title' || property === 'title') {
        data.title = content;
      } else if (property === 'og:description' || property === 'twitter:description' || property === 'description') {
        data.description = content;
      } else if (property === 'og:image' || property === 'twitter:image' || property === 'image') {
        data.image = content;
      } else if (property === 'og:url' || property === 'url') {
        data.url = content;
      } else if (property === 'og:site_name') {
        data.siteName = content;
      }
    });

    setMetaData(data);
  }, [input]);

  useEffect(() => {
    parseMetaTags();
  }, [parseMetaTags]);

  const handleClear = () => {
    setInput('');
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
            <Card className="border border-border shadow-none rounded-md p-4 bg-background">
              <Textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('placeholder')}
                className="h-64 text-xs font-mono resize-none"
              />
            </Card>
          </div>

          {/* Preview Area */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{commonT('ui.result')}</Label>
              </div>
            </div>
            <div className="space-y-4">
              {/* Facebook Card Preview */}
              <div className="border border-border rounded-lg overflow-hidden bg-white shadow-sm max-w-md mx-auto">
                <div className="aspect-[1.91/1] bg-muted relative overflow-hidden flex items-center justify-center">
                  {metaData.image ? (
                    <img src={metaData.image} alt={t('image_alt')} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  ) : (
                    <ImageIcon className="h-12 w-12 text-muted-foreground/20" />
                  )}
                </div>
                <div className="p-3 space-y-1 bg-[#f2f3f5]">
                  <p className="text-[11px] text-[#606770] uppercase truncate">{metaData.url || t('preview_url')}</p>
                  <p className="text-sm font-semibold text-[#1c1e21] line-clamp-2 leading-tight">{metaData.title || t('preview_title')}</p>
                  <p className="text-[12px] text-[#606770] line-clamp-2 leading-normal">{metaData.description || t('preview_desc')}</p>
                </div>
              </div>

              {/* Twitter Card Preview */}
              <div className="border border-border rounded-2xl overflow-hidden bg-black shadow-sm max-w-md mx-auto">
                 <div className="aspect-[1.91/1] bg-zinc-900 relative overflow-hidden flex items-center justify-center border-b border-zinc-800">
                  {metaData.image ? (
                    <img src={metaData.image} alt={t('image_alt')} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="h-12 w-12 text-zinc-800" />
                  )}
                </div>
                <div className="p-3 space-y-0.5">
                  <p className="text-[12px] text-zinc-500">{metaData.url || t('preview_url')}</p>
                  <p className="text-[13px] font-medium text-white line-clamp-1">{metaData.title || t('preview_title')}</p>
                  <p className="text-[13px] text-zinc-400 line-clamp-2 leading-snug">{metaData.description || t('preview_desc')}</p>
                </div>
              </div>
            </div>
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
                   <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium uppercase">
                      <Globe className="h-3 w-3" />
                      {t('sidebar_title')}
                   </div>
                   <p className="text-[10px] text-muted-foreground leading-relaxed">
                     {t('sidebar_desc')}
                   </p>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ToolNavigation currentToolId="og-previewer" />
    </div>
  );
}
