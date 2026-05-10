'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, RefreshCw, Eye, Code, Download } from 'lucide-react';
import { toast } from 'sonner';
import { ToolNavigation } from '@/components/tool-navigation';
import ReactMarkdown from 'react-markdown';

export function MarkdownPreviewerClient() {
  const t = useTranslations('tools.markdown-previewer');
  const commonT = useTranslations('common');
  const [input, setInput] = useState('');

  const loadSample = () => {
    setInput(t('sample'));
    toast.success(commonT('success'));
  };

  const handleDownload = () => {
    const blob = new Blob([input], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label>{t('title')}</Label>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={loadSample}>
                <RefreshCw className="h-4 w-4 mr-2" />
                {commonT('loadSample')}
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload} disabled={!input}>
                <Download className="h-4 w-4 mr-2" />
                {commonT('download')}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setInput('')} disabled={!input}>
                <Trash2 className="h-4 w-4 mr-2" />
                {commonT('clear')}
              </Button>
            </div>
          </div>

          <Tabs defaultValue="editor" className="w-full">
            <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-4">
              <TabsTrigger value="editor" className="gap-2">
                <Code className="h-4 w-4" />
                {t('input_label')}
              </TabsTrigger>
              <TabsTrigger value="preview" className="gap-2">
                <Eye className="h-4 w-4" />
                {t('output_label')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="mt-0">
              <Textarea
                placeholder={t('placeholder')}
                className="min-h-[500px] font-mono text-sm resize-none p-4"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </TabsContent>

            <TabsContent value="preview" className="mt-0">
              <div className="min-h-[500px] rounded-md border bg-background p-8 overflow-auto prose dark:prose-invert max-w-none">
                {input ? (
                  <ReactMarkdown>{input}</ReactMarkdown>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 space-y-2 py-20">
                    <Eye className="h-12 w-12" />
                    <p>{t('placeholder')}</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <ToolNavigation currentToolId="markdown-previewer" />
    </div>
  );
}
