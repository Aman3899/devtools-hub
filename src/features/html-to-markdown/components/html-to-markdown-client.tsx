"use client"

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Copy, Check, Trash2, RefreshCw, Download, Settings2, Info } from 'lucide-react';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

export function HtmlToMarkdownClient() {
  const t = useTranslations('tools.html-to-markdown');
  const tCommon = useTranslations('common');
  const { copiedType, copyToClipboard } = useCopyToClipboard();
  
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [preserveLinks, setPreserveLinks] = useState(true);
  const [downloaded, setDownloaded] = useState(false);

  const htmlToMarkdown = useCallback(() => {
    let result = input;
    result = result.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n').replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n').replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n').replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n').replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n').replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n');
    result = result.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**').replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**').replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*').replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');
    if (preserveLinks) result = result.replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, '[$2]($1)');
    else result = result.replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, '$2');
    result = result.replace(/<img[^>]*src=["']([^"']*)["'][^>]*alt=["']([^"']*)["'][^>]*>/gi, '![$2]($1)').replace(/<img[^>]*alt=["']([^"']*)["'][^>]*src=["']([^"']*)["'][^>]*>/gi, '![$1]($2)');
    result = result.replace(/<br\s*\/?>/gi, '\n').replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
    result = result.replace(/<ul[^>]*>(.*?)<\/ul>/gi, (match: string, content: string) => {
      const items = content.match(/<li[^>]*>(.*?)<\/li>/gi) || []; return items.map((item: string) => '- ' + item.replace(/<li[^>]*>(.*?)<\/li>/i, '$1')).join('\n') + '\n';
    });
    result = result.replace(/<ol[^>]*>(.*?)<\/ol>/gi, (match: string, content: string) => {
      const items = content.match(/<li[^>]*>(.*?)<\/li>/gi) || []; return items.map((item: string, i: number) => (i + 1) + '. ' + item.replace(/<li[^>]*>(.*?)<\/li>/i, '$1')).join('\n') + '\n';
    });
    result = result.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`').replace(/<pre[^>]*>(.*?)<\/pre>/gi, '```\n$1\n```').replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n');
    result = result.replace(/<[^>]*>/g, '').replace(/\n\n\n+/g, '\n\n');
    const textarea = document.createElement('textarea'); textarea.innerHTML = result; result = textarea.value;
    setOutput(result.trim());
  }, [input, preserveLinks]);

  const loadSample = () => { setInput(`<h1>Hello World</h1>\n<p>This is a <strong>sample</strong> HTML file.</p>\n<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>\n<p>Visit <a href="https://example.com">our website</a> for more info.</p>`); setOutput(''); };

  const downloadMarkdown = () => {
    const blob = new Blob([output], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `converted-${new Date().getTime()}.md`; a.click(); URL.revokeObjectURL(url);
    setDownloaded(true); setTimeout(() => setDownloaded(false), 2000);
  };

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
              {output && <><div className="h-1 w-1 rounded-full bg-muted-foreground/30" /><span className="text-[10px] text-muted-foreground/60 normal-case tracking-normal">{output.length} chars</span></>}
            </div>
          }
          action={
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={downloadMarkdown} disabled={!output} className="h-6 px-2 text-[10px] gap-1.5">{downloaded ? <Check className="h-3 w-3 text-green-500" /> : <Download className="h-3 w-3" />}Download</Button>
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(output, 'md')} disabled={!output} className="h-6 px-2 text-[10px] gap-1.5">{copiedType === 'md' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}{tCommon('copy')}</Button>
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
            <div className="space-y-0.5"><Label className="text-xs">{t('preserve_links')}</Label><p className="text-[10px] text-muted-foreground leading-tight">Keep hyperlinks</p></div>
            <Switch checked={preserveLinks} onCheckedChange={setPreserveLinks} className="scale-75 origin-right" />
          </div>
          <Button onClick={htmlToMarkdown} className="w-full h-8 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-colors">{t('convert')}</Button>
          
          <div className="p-3 mt-4 rounded-md bg-muted/30 border border-border flex gap-2.5 items-start">
            <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-[10px] text-muted-foreground leading-normal">{t('article').split('.')[0]}.</p>
          </div>
        </ToolCard>
      </div>
    </div>
  );
}
