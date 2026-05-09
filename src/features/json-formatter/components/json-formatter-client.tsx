"use client"

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Copy, Check, Trash2, Settings2, Download, FileJson, Share2, Info, RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ToolNavigation } from '@/components/tool-navigation';

const formSchema = z.object({
  indent: z.string(),
  minify: z.boolean(),
  sortKeys: z.boolean(),
  escapeUnicode: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

const SAMPLE_JSON = {
  "id": 1,
  "name": "DevTools Hub",
  "features": ["Security", "Formatting", "Transformation"],
  "status": "active",
  "metadata": {
    "version": "1.0.0",
    "secure": true
  }
};

export function JsonFormatterClient() {
  const t = useTranslations('tools.json-formatter');
  const tCommon = useTranslations('common');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const { watch, setValue } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      indent: '2',
      minify: false,
      sortKeys: false,
      escapeUnicode: false,
    },
  });

  const options = watch();

  const handleFormat = useCallback((val: string = input) => {
    if (!val.trim()) {
      setOutput('');
      setError(null);
      return;
    }
    try {
      let parsed = JSON.parse(val);
      
      if (options.sortKeys) {
        const sortObject = (obj: any): any => {
          if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) return obj;
          return Object.keys(obj).sort().reduce((acc: any, key) => {
            acc[key] = sortObject(obj[key]);
            return acc;
          }, {});
        };
        parsed = sortObject(parsed);
      }

      let result = '';
      if (options.minify) {
        result = JSON.stringify(parsed);
      } else {
        const indent = options.indent === 'tab' ? '\t' : parseInt(options.indent);
        result = JSON.stringify(parsed, null, indent);
      }

      if (options.escapeUnicode) {
        result = result.replace(/[\u007f-\uffff]/g, (c) => {
          return '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4);
        });
      }

      setOutput(result);
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setOutput('');
    }
  }, [input, options]);

  useEffect(() => {
    handleFormat();
  }, [handleFormat]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJson = () => {
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formatted-${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const loadSample = () => {
    const sample = JSON.stringify(SAMPLE_JSON, null, 2);
    setInput(sample);
    handleFormat(sample);
  };

  const stats = {
    chars: input.length,
    lines: input.split('\n').length,
    size: (new TextEncoder().encode(input).length / 1024).toFixed(2)
  };

  const outputStats = {
    chars: output.length,
    lines: output.split('\n').length,
    size: (new TextEncoder().encode(output).length / 1024).toFixed(2)
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
                <Button variant="ghost" size="sm" onClick={loadSample} className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground">
                  <RefreshCw className="h-3 w-3" />
                  {tCommon('hero.searchPlaceholder' as any) === 'Find a tool...' ? 'Sample' : 'مثال'}
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
                onChange={(e) => { setInput(e.target.value); handleFormat(e.target.value); }}
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
                    <span className="text-[10px] text-muted-foreground/60">{outputStats.size} KB</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={downloadJson} 
                  disabled={!output}
                  className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {downloaded ? <Check className="h-3 w-3 text-green-500" /> : <Download className="h-3 w-3" />}
                  {tCommon('hero.searchPlaceholder' as any) === 'Find a tool...' ? 'Download' : 'ڈاؤن لوڈ'}
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
              <pre className={cn(
                "flex-1 font-mono text-xs p-3 overflow-auto whitespace-pre-wrap break-all leading-relaxed",
                error ? "text-destructive" : "text-foreground"
              )}>
                {error ? `${tCommon('error')}: ${error}` : (output || tCommon('ui.result'))}
              </pre>
            </Card>
          </div>
        </div>

        {/* Settings Card */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="border border-border shadow-none rounded-md bg-background">
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-xs font-semibold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings2 className="h-3.5 w-3.5" />
                  {tCommon('ui.customization')}
                </div>
                <Share2 className="h-3 w-3 text-muted-foreground hover:text-foreground cursor-pointer" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-5">
              <div className="space-y-2">
                <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{t('custom.indentation')}</Label>
                <Select value={options.indent} onValueChange={(v) => setValue('indent', v || '2')}>
                  <SelectTrigger className="h-8 text-xs bg-muted/30 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2" className="text-xs">{t('custom.spaces2')}</SelectItem>
                    <SelectItem value="4" className="text-xs">{t('custom.spaces4')}</SelectItem>
                    <SelectItem value="tab" className="text-xs">{t('custom.tabs')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-xs">{t('custom.minify')}</Label>
                    <p className="text-[10px] text-muted-foreground leading-tight">{t('custom.minifyDesc')}</p>
                  </div>
                  <Switch checked={options.minify} onCheckedChange={(v) => setValue('minify', v)} className="scale-75 origin-right" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-xs">{t('custom.sortKeys')}</Label>
                    <p className="text-[10px] text-muted-foreground leading-tight">{t('custom.sortKeysDesc')}</p>
                  </div>
                  <Switch checked={options.sortKeys} onCheckedChange={(v) => setValue('sortKeys', v)} className="scale-75 origin-right" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-xs">{t('custom.escapeUnicode')}</Label>
                    <p className="text-[10px] text-muted-foreground leading-tight">{t('custom.escapeUnicodeDesc')}</p>
                  </div>
                  <Switch checked={options.escapeUnicode} onCheckedChange={(v) => setValue('escapeUnicode', v)} className="scale-75 origin-right" />
                </div>
              </div>
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

      <ToolNavigation currentToolId="json-formatter" />
    </div>
  );
}
