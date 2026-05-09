'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Code, Layout, Settings2, Trash2, Maximize2, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export function HtmlPreviewerClient() {
  const t = useTranslations('tools.html-previewer');
  const [html, setHtml] = useState('<h1>Hello World</h1>\n<p>Start coding to see magic!</p>');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [includeTailwind, setIncludeTailwind] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');

  const updatePreview = () => {
    let finalHtml = html;
    if (includeTailwind) {
      finalHtml = `<script src="https://cdn.tailwindcss.com"></script>\n${html}`;
    }
    setPreviewHtml(finalHtml);
  };

  useEffect(() => {
    if (autoRefresh) {
      const timer = setTimeout(updatePreview, 500);
      return () => clearTimeout(timer);
    }
  }, [html, autoRefresh, includeTailwind]);

  function tCommon(arg0: string): import("react").ReactNode {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="flex flex-col h-[calc(100vh-16rem)] rounded-[2rem] border-muted-foreground/10 bg-card/50 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Code className="h-4 w-4" />
                {t('editorTitle')}
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setHtml('')} className="rounded-xl">
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-4 pt-0">
              <Textarea
                placeholder={t('placeholder')}
                className="flex-1 font-mono text-sm resize-none border-none focus-visible:ring-0 p-4 bg-muted/30 rounded-2xl"
                value={html}
                onChange={(e) => setHtml(e.target.value)}
              />
            </CardContent>
          </Card>

          <Card className="flex flex-col h-[calc(100vh-16rem)] rounded-[2rem] border-muted-foreground/10 bg-card/50 backdrop-blur-md overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Eye className="h-4 w-4" />
              {tCommon('ui.livePreview')}
            </CardTitle>
              <div className="flex gap-2">
                {!autoRefresh && (
                  <Button size="sm" onClick={updatePreview} className="rounded-xl h-8 gap-2">
                    <Zap className="h-3 w-3" />
                    {t('refresh')}
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="rounded-xl h-8 w-8">
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 bg-white dark:bg-zinc-900">
              <iframe
                title="preview"
                srcDoc={previewHtml}
                className="w-full h-full border-none"
                sandbox="allow-scripts"
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="rounded-[2rem] border-muted-foreground/10 bg-card/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-primary" />
              {t('settingsTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t('autoRefresh')}</Label>
                <p className="text-[10px] text-muted-foreground">{t('autoRefreshDesc')}</p>
              </div>
              <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t('includeTailwind')}</Label>
                <p className="text-[10px] text-muted-foreground">{t('tailwindDesc')}</p>
              </div>
              <Switch checked={includeTailwind} onCheckedChange={setIncludeTailwind} />
            </div>
            
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest">
                <Layout className="h-3 w-3" />
                {t('layout')}
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                {t('layoutDesc')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
