"use client"

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Code, Layout, Settings2, Trash2, Maximize2, Zap, Download, Share2, Info, RefreshCw, Check, Copy } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const SAMPLE_HTML = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f4f4f5; }
    .card { background: white; padding: 2rem; border-radius: 8px; shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); text-align: center; }
    h1 { color: #18181b; margin-top: 0; }
    p { color: #71717a; }
    .btn { background: #18181b; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; }
  </style>
</head>
<body>
  <div class="card">
    <h1>DevTools Hub</h1>
    <p>Professional utilities for developers.</p>
    <button class="btn">Explore More</button>
  </div>
</body>
</html>`;

import { ToolNavigation } from '@/components/tool-navigation';

export function HtmlPreviewerClient() {
  const t = useTranslations('tools.html-previewer');
  const tCommon = useTranslations('common');
  const [html, setHtml] = useState(SAMPLE_HTML);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [includeTailwind, setIncludeTailwind] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [downloaded, setDownloaded] = useState(false);
  const [copied, setCopied] = useState(false);

  const isEnglish = tCommon('hero.searchPlaceholder' as any) === 'Find a tool...';

  const updatePreview = useCallback(() => {
    let finalHtml = html;
    if (includeTailwind) {
      finalHtml = `<script src="https://cdn.tailwindcss.com"></script>\n${html}`;
    }
    setPreviewHtml(finalHtml);
  }, [html, includeTailwind]);

  useEffect(() => {
    if (autoRefresh) {
      const timer = setTimeout(updatePreview, 500);
      return () => clearTimeout(timer);
    }
  }, [autoRefresh, updatePreview]);

  const downloadHtml = () => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `preview-${new Date().getTime()}.html`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const copyHtml = () => {
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 space-y-4">
          <div className="grid gap-4 md:grid-cols-2 h-[calc(100vh-20rem)] min-h-[500px]">
            {/* Editor Column */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-1">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('editorTitle')}</Label>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => setHtml(SAMPLE_HTML)} className="h-5 px-1.5 text-[9px] gap-1 text-muted-foreground hover:text-foreground">
                    <RefreshCw className="h-2.5 w-2.5" />
                    {isEnglish ? 'Sample' : 'مثال'}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setHtml('')} title={tCommon('clear')} className="h-5 w-5 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <Card className="border border-border shadow-none rounded-md bg-background overflow-hidden flex-1 focus-within:border-foreground/20 transition-colors">
                <Textarea
                  placeholder={t('placeholder')}
                  className="h-full font-mono text-[11px] resize-none border-none focus-visible:ring-0 p-3 bg-transparent leading-relaxed"
                  value={html}
                  onChange={(e) => setHtml(e.target.value)}
                />
              </Card>
            </div>

            {/* Preview Column */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-1">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{isEnglish ? 'Live Preview' : 'لائیو پیش نظارہ'}</Label>
                <div className="flex items-center gap-1">
                  {!autoRefresh && (
                    <Button variant="ghost" size="sm" onClick={updatePreview} className="h-5 px-1.5 text-[9px] gap-1 text-muted-foreground hover:text-foreground">
                      <Zap className="h-2.5 w-2.5 text-yellow-500" />
                      {t('refresh')}
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={downloadHtml} className="h-5 px-1.5 text-[9px] gap-1 text-muted-foreground hover:text-foreground">
                    {downloaded ? <Check className="h-2.5 w-2.5 text-green-500" /> : <Download className="h-2.5 w-2.5" />}
                    {isEnglish ? 'Export' : 'ایکسپورٹ'}
                  </Button>
                </div>
              </div>
              <Card className="border border-border shadow-none rounded-md bg-white overflow-hidden flex-1">
                <iframe
                  title="preview"
                  srcDoc={previewHtml}
                  className="w-full h-full border-none"
                  sandbox="allow-scripts"
                />
              </Card>
            </div>
          </div>
        </div>

        {/* Settings Column */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="border border-border shadow-none rounded-md bg-background">
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-xs font-semibold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings2 className="h-3.5 w-3.5" />
                  {t('settingsTitle')}
                </div>
                <Share2 className="h-3 w-3 text-muted-foreground hover:text-foreground cursor-pointer" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-xs">{t('autoRefresh')}</Label>
                  <p className="text-[9px] text-muted-foreground leading-tight">{t('autoRefreshDesc')}</p>
                </div>
                <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} className="scale-75 origin-right" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-xs">{t('includeTailwind')}</Label>
                  <p className="text-[9px] text-muted-foreground leading-tight">{t('tailwindDesc')}</p>
                </div>
                <Switch checked={includeTailwind} onCheckedChange={setIncludeTailwind} className="scale-75 origin-right" />
              </div>
              
              <div className="p-3 rounded-md bg-muted/50 border border-border space-y-1.5">
                <div className="flex items-center gap-2 text-[10px] font-semibold text-foreground uppercase tracking-tight">
                  <Info className="h-3 w-3" />
                  {isEnglish ? 'Preview Mode' : 'پیش نظارہ موڈ'}
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  {t('article').split('.')[1]}.
                </p>
              </div>

              <Button onClick={copyHtml} variant="outline" size="sm" className="w-full h-8 gap-2 text-xs">
                {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                {isEnglish ? 'Copy Source' : 'سورس کاپی کریں'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <ToolNavigation currentToolId="html-previewer" />
    </div>
  );
}
