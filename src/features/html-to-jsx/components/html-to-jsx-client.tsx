"use client"

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Copy, Check, Trash2, Download, Settings2, Info, RefreshCw } from 'lucide-react';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

export function HtmlToJsxClient() {
  const t = useTranslations('tools.html-to-jsx');
  const tCommon = useTranslations('common');
  const { copiedType, copyToClipboard } = useCopyToClipboard();
  
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [formatOutput, setFormatOutput] = useState(true);
  const [convertInlineStyles, setConvertInlineStyles] = useState(true);
  const [downloaded, setDownloaded] = useState(false);

  const htmlToJsx = useCallback(() => {
    let result = input;
    result = result.replace(/<!DOCTYPE[^>]*>/gi, '').replace(/<html[^>]*>/gi, '').replace(/<\/html>/gi, '').replace(/<body[^>]*>/gi, '').replace(/<\/body>/gi, '').replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '');
    result = result.replace(/\bclass=/gi, 'className=');
    result = result.replace(/\bfor=/gi, 'htmlFor=');
    if (convertInlineStyles) {
      result = result.replace(/style="([^"]*)"/gi, (match: string, styles: string) => {
        const styleObj: Record<string, string> = {};
        styles.split(';').forEach((style: string) => {
          const [key, value] = style.split(':').map((s: string) => s.trim());
          if (key && value) { const camelKey = key.replace(/-([a-z])/g, (g: string) => g[1].toUpperCase()); styleObj[camelKey] = value; }
        });
        return `style={${JSON.stringify(styleObj)}}`;
      });
    }
    result = result.replace(/\bon([a-z]+)=/gi, (match: string, event: string) => 'on' + event.charAt(0).toUpperCase() + event.slice(1) + '=');
    result = result.replace(/<(img|input|br|hr|meta|link)[^>]*>/gi, '<$1 />');
    result = result.replace(/\b(disabled|checked|selected|readonly|multiple|ismap|declare|noshade|compact|noresize)(?!=)/gi, '$1={true}');
    if (formatOutput) result = result.replace(/></g, '>\n<').replace(/\n\s*\n/g, '\n');
    const rootElements = (result.match(/<[A-Z]/g) || []).length + (result.match(/<[a-z]/g) || []).length;
    if (rootElements > 1 && !result.trim().startsWith('<>')) result = `<>\n  ${result.trim()}\n</>`;
    setOutput(result.trim());
  }, [input, formatOutput, convertInlineStyles]);

  const loadSample = () => { setInput(`<div class="container">\n  <h1>Hello World</h1>\n  <p>This is a sample HTML file.</p>\n  <button onclick="handleClick()">Click Me</button>\n</div>`); setOutput(''); };

  const downloadJsx = () => {
    const blob = new Blob([output], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `component-${new Date().getTime()}.jsx`; a.click(); URL.revokeObjectURL(url);
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
              <Button variant="ghost" size="sm" onClick={downloadJsx} disabled={!output} className="h-6 px-2 text-[10px] gap-1.5">{downloaded ? <Check className="h-3 w-3 text-green-500" /> : <Download className="h-3 w-3" />}Download</Button>
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(output, 'jsx')} disabled={!output} className="h-6 px-2 text-[10px] gap-1.5">{copiedType === 'jsx' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}{tCommon('copy')}</Button>
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
            <div className="space-y-0.5"><Label className="text-xs">{t('format_output')}</Label><p className="text-[10px] text-muted-foreground leading-tight">Add line breaks</p></div>
            <Switch checked={formatOutput} onCheckedChange={setFormatOutput} className="scale-75 origin-right" />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5"><Label className="text-xs">{t('convert_inline_styles')}</Label><p className="text-[10px] text-muted-foreground leading-tight">Convert to objects</p></div>
            <Switch checked={convertInlineStyles} onCheckedChange={setConvertInlineStyles} className="scale-75 origin-right" />
          </div>
          <Button onClick={htmlToJsx} className="w-full h-8 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-colors">{t('convert')}</Button>
          
          <div className="p-3 mt-4 rounded-md bg-muted/30 border border-border flex gap-2.5 items-start">
            <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-[10px] text-muted-foreground leading-normal">{t('article').split('.')[0]}.</p>
          </div>
        </ToolCard>
      </div>
    </div>
  );
}
