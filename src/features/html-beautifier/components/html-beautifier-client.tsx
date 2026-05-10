'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Check, Trash2, RefreshCw, Download, Settings2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ToolNavigation } from '@/components/tool-navigation';

export function HtmlBeautifierClient() {
  const t = useTranslations('tools.html-beautifier');
  const tCommon = useTranslations('common');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indentSize, setIndentSize] = useState('2');
  const [preserveNewlines, setPreserveNewlines] = useState(true);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const beautifyHtml = useCallback(() => {
    let result = input;
    const indent = ' '.repeat(parseInt(indentSize));
    let level = 0;
    let formatted = '';
    let inTag = false;
    let tagContent = '';

    for (let i = 0; i < result.length; i++) {
      const char = result[i];
      const nextChar = result[i + 1];

      if (char === '<') {
        if (formatted.trim() && !inTag) {
          formatted += '\n' + indent.repeat(level);
        }
        inTag = true;
        tagContent = char;
      } else if (char === '>') {
        tagContent += char;
        inTag = false;

        const isClosing = tagContent.includes('</');
        const isSelfClosing = tagContent.includes('/>');
        const isComment = tagContent.includes('<!--');

        if (isClosing && !isComment) {
          level = Math.max(0, level - 1);
        }

        formatted += tagContent;

        if (!isSelfClosing && !isClosing && !isComment) {
          level++;
        }

        if (preserveNewlines || nextChar === '<') {
          formatted += '\n';
        }
      } else if (inTag) {
        tagContent += char;
      } else if (!inTag && char.trim()) {
        formatted += char;
      }
    }

    setOutput(formatted.trim());
  }, [input, indentSize, preserveNewlines]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadBeautified = () => {
    const blob = new Blob([output], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `beautified-${new Date().getTime()}.html`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const loadSample = () => {
    const sample = `<html><head><title>Sample</title></head><body><div class="container"><h1>Hello World</h1><p>This is a sample HTML file.</p><ul><li>Item 1</li><li>Item 2</li></ul></div></body></html>`;
    setInput(sample);
    setOutput('');
  };

  const handleIndentSizeChange = (val: string | null) => {
    if (val) setIndentSize(val);
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
                    <span className="text-[10px] text-muted-foreground/60">{output.split('\n').length} lines</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={downloadBeautified} 
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
              <div className="space-y-2">
                <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{t('indent_size')}</Label>
                <Select value={indentSize} onValueChange={handleIndentSizeChange}>
                  <SelectTrigger className="h-8 text-xs bg-muted/30 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2" className="text-xs">2 Spaces</SelectItem>
                    <SelectItem value="4" className="text-xs">4 Spaces</SelectItem>
                    <SelectItem value="8" className="text-xs">8 Spaces</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="space-y-0.5">
                  <Label className="text-xs">{t('preserve_newlines')}</Label>
                  <p className="text-[10px] text-muted-foreground leading-tight">Keep line breaks</p>
                </div>
                <Switch checked={preserveNewlines} onCheckedChange={setPreserveNewlines} className="scale-75 origin-right" />
              </div>

              <Button 
                onClick={beautifyHtml}
                className="w-full h-8 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-colors"
              >
                {t('beautify')}
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

      <ToolNavigation currentToolId="html-beautifier" />
    </div>
  );
}
