"use client"

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Copy, Check, Trash2, RefreshCw, Download, Settings2, Info } from 'lucide-react';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function HtmlMinifierClient() {
  const t = useTranslations('tools.html-minifier');
  const tCommon = useTranslations('common');
  const { copiedType, copyToClipboard } = useCopyToClipboard();

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [removeComments, setRemoveComments] = useState(true);
  const [collapseWhitespace, setCollapseWhitespace] = useState(true);
  const [downloaded, setDownloaded] = useState(false);

  const minifyHtml = useCallback(() => {
    let result = input;
    if (removeComments) result = result.replace(/<!--[\s\S]*?-->/g, '');
    if (collapseWhitespace) result = result.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();
    setOutput(result);
  }, [input, removeComments, collapseWhitespace]);

  const originalSize = input.length;
  const minifiedSize = output.length;
  const reduction = originalSize > 0 ? Math.round(((originalSize - minifiedSize) / originalSize) * 100) : 0;

  const downloadMinified = () => {
    const blob = new Blob([output], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `minified-${new Date().getTime()}.html`; a.click(); URL.revokeObjectURL(url);
    setDownloaded(true); setTimeout(() => setDownloaded(false), 2000);
  };

  const loadSample = () => { setInput(`<!DOCTYPE html>\n<html>\n<head>\n  <!-- Meta tags -->\n  <meta charset="UTF-8">\n  <title>Sample Page</title>\n</head>\n<body>\n  <!-- Main content -->\n  <h1>Hello World</h1>\n  <p>This is a sample HTML file.</p>\n</body>\n</html>`); setOutput(''); };
  const stats = { chars: input.length, lines: input.split('\n').length };

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">
        <ToolCard 
          title={
            <div className="flex items-center gap-2">
              {t('input')}
              <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
              <span className="text-[10px] text-muted-foreground/60 normal-case tracking-normal">{stats.chars} chars • {stats.lines} lines</span>
            </div>
          }
          action={
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={loadSample} className="h-6 px-2 text-[10px] gap-1.5"><RefreshCw className="h-3 w-3" />Sample</Button>
              <Button variant="ghost" size="icon" onClick={() => setInput('')} title={tCommon('clear')} className="h-6 w-6 hover:text-destructive"><Trash2 className="h-3 w-3" /></Button>
            </div>
          }
          contentClassName="p-0 flex flex-col h-[500px]"
        >
          <Textarea placeholder={t('placeholder')} className="flex-1 font-mono text-xs resize-none border-none focus-visible:ring-0 p-3 bg-transparent leading-relaxed" value={input} onChange={(e) => setInput(e.target.value)} />
        </ToolCard>

        <ToolCard 
          title={
            <div className="flex items-center gap-2">
              {t('output')}
              {output && <><div className="h-1 w-1 rounded-full bg-muted-foreground/30" /><span className="text-[10px] text-muted-foreground/60 normal-case tracking-normal">{reduction}% reduction</span></>}
            </div>
          }
          action={
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={downloadMinified} disabled={!output} className="h-6 px-2 text-[10px] gap-1.5">{downloaded ? <Check className="h-3 w-3 text-green-500" /> : <Download className="h-3 w-3" />}Download</Button>
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(output, 'html')} disabled={!output} className="h-6 px-2 text-[10px] gap-1.5">{copiedType === 'html' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}{tCommon('copy')}</Button>
            </div>
          }
          contentClassName="p-0 flex flex-col h-[500px] bg-muted/20"
        >
          <pre className="flex-1 font-mono text-xs p-3 overflow-auto whitespace-pre-wrap break-all leading-relaxed text-foreground">{output || tCommon('ui.result')}</pre>
        </ToolCard>
      </div>

      <div className="md:col-span-1 space-y-4">
        <ToolCard title={tCommon('ui.customization')} icon={Settings2} contentClassName="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5"><Label className="text-xs">{t('remove_comments')}</Label><p className="text-[10px] text-muted-foreground leading-tight">Remove HTML comments</p></div>
            <Switch checked={removeComments} onCheckedChange={setRemoveComments} className="scale-75 origin-right" />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5"><Label className="text-xs">{t('collapse_whitespace')}</Label><p className="text-[10px] text-muted-foreground leading-tight">Remove extra spaces</p></div>
            <Switch checked={collapseWhitespace} onCheckedChange={setCollapseWhitespace} className="scale-75 origin-right" />
          </div>
          <Button onClick={minifyHtml} className="w-full h-8 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-colors">{t('minify')}</Button>
        </ToolCard>

        {output && (
          <Card className="border border-border shadow-none rounded-md bg-background">
            <CardHeader className="py-3 px-4 border-b"><CardTitle className="text-xs font-semibold">Statistics</CardTitle></CardHeader>
            <CardContent className="p-4 space-y-2 text-[10px]">
              <div className="flex justify-between"><span className="text-muted-foreground">Original:</span><span className="font-mono font-semibold">{originalSize} bytes</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Minified:</span><span className="font-mono font-semibold">{minifiedSize} bytes</span></div>
              <div className="flex justify-between pt-2 border-t"><span className="text-muted-foreground">Saved:</span><span className="font-mono font-semibold text-green-600">{reduction}%</span></div>
            </CardContent>
          </Card>
        )}

        <div className="p-3 rounded-md bg-muted/30 border border-border flex gap-2.5 items-start">
          <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-[10px] text-muted-foreground leading-normal">{t('article').split('.')[0]}.</p>
        </div>
      </div>
    </div>
  );
}
