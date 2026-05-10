'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, RefreshCw, Eye, Settings2, Download, Info } from 'lucide-react';
import { toast } from 'sonner';
import { ToolNavigation } from '@/components/tool-navigation';
import ReactMarkdown from 'react-markdown';

export function MarkdownPreviewerClient() {
  const t = useTranslations('tools.markdown-previewer');
  const commonT = useTranslations('common');
  const [input, setInput] = useState('');

  const loadSample = () => {
    setInput(`# Sample Markdown\n\n## Typography\n\n**Bold text**, *italic text*, and ~~strikethrough~~.\n\n### Lists\n\n- Item 1\n- Item 2\n  - Sub-item A\n\n1. First\n2. Second\n\n### Code Blocks\n\n\`\`\`javascript\nconst hello = "world";\nconsole.log(hello);\n\`\`\`\n\n> This is a blockquote.\n\n[Visit DevTools Hub](https://devtools-hub.com)`);
    toast.success(commonT('success'));
  };

  const handleDownload = () => {
    const blob = new Blob([input], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    URL.revokeObjectURL(url);
    toast.success(commonT('success'));
  };

  const stats = {
    chars: input.length,
    lines: input.split('\n').length
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 grid gap-4 md:grid-cols-2">
          {/* Editor Area */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('input_label')}</Label>
                <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                <span className="text-[10px] text-muted-foreground/60">{stats.chars} chars • {stats.lines} lines</span>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={loadSample} className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground">
                  <RefreshCw className="h-3 w-3" />
                  {commonT('hero.searchPlaceholder' as any) === 'Find a tool...' ? 'Sample' : 'مثال'}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setInput('')} title={commonT('clear')} className="h-6 w-6 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <Card className="flex flex-col h-[600px] border border-border shadow-none rounded-md overflow-hidden bg-background focus-within:border-foreground/20 transition-colors">
              <Textarea
                placeholder={t('placeholder')}
                className="flex-1 font-mono text-xs resize-none border-none focus-visible:ring-0 p-3 bg-transparent leading-relaxed"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </Card>
          </div>

          {/* Preview Area */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('output_label')}</Label>
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleDownload} 
                  disabled={!input}
                  className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Download className="h-3 w-3" />
                  {commonT('download')}
                </Button>
              </div>
            </div>
            <Card className="flex flex-col h-[600px] border border-border shadow-none rounded-md overflow-hidden bg-muted/10">
              <div className="flex-1 overflow-auto p-4 prose dark:prose-invert prose-xs max-w-none prose-p:my-1 prose-headings:mb-2 prose-headings:mt-4 first:prose-headings:mt-0">
                {input ? (
                  <ReactMarkdown>{input}</ReactMarkdown>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-30">
                    <Eye className="h-10 w-10 mb-2" />
                    <p className="text-[10px]">Preview Area</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="border border-border shadow-none rounded-md bg-background">
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-xs font-semibold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings2 className="h-3.5 w-3.5" />
                  {commonT('ui.customization')}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-5">
              <p className="text-[10px] text-muted-foreground leading-tight">
                Live Markdown previewer with GitHub Flavored Markdown (GFM) support.
              </p>
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
      <ToolNavigation currentToolId="markdown-previewer" />
    </div>
  );
}
