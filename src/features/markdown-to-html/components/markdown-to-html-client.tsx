'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Copy, Check, Trash2, RefreshCw, Download, Settings2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ToolNavigation } from '@/components/tool-navigation';

export function MarkdownToHtmlClient() {
  const t = useTranslations('tools.markdown-to-html');
  const tCommon = useTranslations('common');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [enableTables, setEnableTables] = useState(true);
  const [enableTaskLists, setEnableTaskLists] = useState(true);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const markdownToHtml = useCallback(() => {
    let result = input;

    result = result
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    result = result.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
    result = result.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    result = result.replace(/^# (.*?)$/gm, '<h1>$1</h1>');

    result = result.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    result = result.replace(/__(.+?)__/g, '<strong>$1</strong>');

    result = result.replace(/\*(.*?)\*/g, '<em>$1</em>');
    result = result.replace(/_(.+?)_/g, '<em>$1</em>');

    result = result.replace(/`([^`]+)`/g, '<code>$1</code>');

    result = result.replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>');

    result = result.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

    result = result.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" />');

    result = result.replace(/^&gt; (.*?)$/gm, '<blockquote>$1</blockquote>');

    result = result.replace(/^\* (.*?)$/gm, '<li>$1</li>');
    result = result.replace(/^- (.*?)$/gm, '<li>$1</li>');
    result = result.replace(/^&lt;li&gt;(.*?)&lt;\/li&gt;$/gm, '<li>$1</li>');
    result = result.replace(/(<li>.*?<\/li>)/s, '<ul>$1</ul>');

    result = result.replace(/^\d+\. (.*?)$/gm, '<li>$1</li>');

    result = result.replace(/\n\n/g, '</p><p>');
    result = '<p>' + result + '</p>';
    result = result.replace(/<p><\/p>/g, '');

    result = result.replace(/\n/g, '<br />');

    result = result.replace(/<p><(h[1-6]|ul|ol|blockquote|pre)/g, '<$1');
    result = result.replace(/<\/(h[1-6]|ul|ol|blockquote|pre)><\/p>/g, '</$1>');

    setOutput(result);
  }, [input]);

  const loadSample = () => {
    const sample = `# Hello World

This is a **sample** Markdown file.

- Item 1
- Item 2
- Item 3

Visit [our website](https://example.com) for more info.`;
    setInput(sample);
    setOutput('');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadHtml = () => {
    const blob = new Blob([output], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted-${new Date().getTime()}.html`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const stats = {
    chars: input.length,
    lines: input.split('\n').length,
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 grid gap-4 md:grid-cols-2">
          {/* Input Card */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('input')}</Label>
                <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                <span className="text-[10px] text-muted-foreground/60">{stats.chars} chars • {stats.lines} lines</span>
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={loadSample}
                  className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <RefreshCw className="h-3 w-3" />
                  Sample
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setInput('')} title={tCommon('clear')} className="h-6 w-6 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <Card className="flex flex-col h-[500px] border border-border shadow-none rounded-md overflow-hidden bg-background focus-within:border-foreground/20 transition-colors">
              <Textarea
                placeholder={t('placeholder')}
                className="flex-1 font-mono text-xs resize-none border-none focus-visible:ring-0 p-3 bg-transparent leading-relaxed"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </Card>
          </div>

          {/* Output Card */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('output')}</Label>
                {output && (
                  <>
                    <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                    <span className="text-[10px] text-muted-foreground/60">{output.length} chars</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={downloadHtml} 
                  disabled={!output}
                  className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {downloaded ? <Check className="h-3 w-3 text-green-500" /> : <Download className="h-3 w-3" />}
                  Download
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={copyToClipboard} 
                  disabled={!output}
                  className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                  {tCommon('copy')}
                </Button>
              </div>
            </div>
            <Card className="flex flex-col h-[500px] border border-border shadow-none rounded-md overflow-hidden bg-muted/20">
              <pre className="flex-1 font-mono text-xs p-3 overflow-auto whitespace-pre-wrap break-all leading-relaxed text-foreground">
                {output || tCommon('ui.result')}
              </pre>
            </Card>
          </div>
        </div>

        {/* Settings Card */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="border border-border shadow-none rounded-md bg-background">
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-xs font-semibold flex items-center gap-2">
                <Settings2 className="h-3.5 w-3.5" />
                {tCommon('ui.customization')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-xs">{t('enable_tables')}</Label>
                  <p className="text-[10px] text-muted-foreground leading-tight">Support tables</p>
                </div>
                <Switch checked={enableTables} onCheckedChange={setEnableTables} className="scale-75 origin-right" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-xs">{t('enable_task_lists')}</Label>
                  <p className="text-[10px] text-muted-foreground leading-tight">Support task lists</p>
                </div>
                <Switch checked={enableTaskLists} onCheckedChange={setEnableTaskLists} className="scale-75 origin-right" />
              </div>

              <Button 
                onClick={markdownToHtml}
                className="w-full h-8 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-colors"
              >
                {t('convert')}
              </Button>
            </CardContent>
          </Card>

          <div className="p-3 rounded-md bg-muted/30 border border-border flex gap-2.5 items-start">
            <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-[10px] text-muted-foreground leading-normal">
              {t('article').split('.')[0]}.
            </p>
          </div>
        </div>
      </div>

      <ToolNavigation currentToolId="markdown-to-html" />
    </div>
  );
}
