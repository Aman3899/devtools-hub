"use client"

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Copy, Check, Repeat, Settings2, Download, RefreshCw, Trash2, Info, Share2, ArrowRightLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  urlSafe: z.boolean(),
  stripPadding: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

import { ToolNavigation } from '@/components/tool-navigation';

export function Base64EncoderClient() {
  const t = useTranslations('tools.base64-encoder');
  const tCommon = useTranslations('common');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const isEnglish = tCommon('hero.searchPlaceholder' as any) === 'Find a tool...';

  const { watch, setValue } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      urlSafe: false,
      stripPadding: false,
    },
  });

  const options = watch();

  const handleTransform = useCallback((val: string = input, currentMode: 'encode' | 'decode' = mode) => {
    if (!val.trim()) {
      setOutput('');
      setError(null);
      return;
    }

    try {
      if (currentMode === 'encode') {
        let result = btoa(val);
        if (options.urlSafe) {
          result = result.replace(/\+/g, '-').replace(/\//g, '_');
        }
        if (options.stripPadding) {
          result = result.replace(/=+$/, '');
        }
        setOutput(result);
      } else {
        let toDecode = val;
        if (options.urlSafe) {
          toDecode = toDecode.replace(/-/g, '+').replace(/_/g, '/');
        }
        while (toDecode.length % 4 !== 0) toDecode += '=';
        setOutput(atob(toDecode));
      }
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setOutput('');
    }
  }, [input, mode, options]);

  useEffect(() => {
    handleTransform();
  }, [handleTransform]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadOutput = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `base64-${mode === 'encode' ? 'encoded' : 'decoded'}-${new Date().getTime()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const switchMode = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode';
    setMode(newMode);
    setInput(output);
    handleTransform(output, newMode);
  };

  const loadSample = () => {
    const sample = mode === 'encode' ? "Hello, DevTools Hub!" : "SGVsbG8sIERldlRvb2xzIEh1YiE=";
    setInput(sample);
    handleFormat(sample);
  };

  const handleFormat = (val: string) => {
    setInput(val);
    handleTransform(val);
  };

  const stats = {
    chars: input.length,
    lines: input.split('\n').length
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 grid gap-4 md:grid-cols-2">
          {/* Input Card */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {mode === 'encode' ? tCommon('input') : (isEnglish ? 'Base64 Input' : 'Base64 ان پٹ')}
                </Label>
                <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                <span className="text-[10px] text-muted-foreground/60">{stats.chars} chars</span>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={loadSample} className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground">
                  <RefreshCw className="h-3 w-3" />
                  {isEnglish ? 'Sample' : 'مثال'}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setInput('')} title={tCommon('clear')} className="h-6 w-6 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <Card className="flex flex-col h-[500px] border border-border shadow-none rounded-md overflow-hidden bg-background focus-within:border-foreground/20 transition-colors relative">
              <Textarea
                placeholder={t('placeholder')}
                className="flex-1 font-mono text-xs resize-none border-none focus-visible:ring-0 p-3 bg-transparent leading-relaxed"
                value={input}
                onChange={(e) => { setInput(e.target.value); handleTransform(e.target.value); }}
              />
              <Button 
                variant="outline" 
                size="icon" 
                onClick={switchMode} 
                className="absolute bottom-3 right-3 h-8 w-8 rounded-full shadow-sm bg-background hover:bg-muted"
                title={isEnglish ? 'Switch Mode' : 'موڈ تبدیل کریں'}
              >
                <ArrowRightLeft className="h-3.5 w-3.5" />
              </Button>
            </Card>
          </div>

          {/* Output Card */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {mode === 'encode' ? (isEnglish ? 'Base64 Output' : 'Base64 آؤٹ پٹ') : (isEnglish ? 'Decoded Output' : 'ڈی کوڈ شدہ آؤٹ پٹ')}
              </Label>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={downloadOutput} 
                  disabled={!output}
                  className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {downloaded ? <Check className="h-3 w-3 text-green-500" /> : <Download className="h-3 w-3" />}
                  {isEnglish ? 'Download' : 'ڈاؤن لوڈ'}
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
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-xs">{t('custom.urlSafe')}</Label>
                    <p className="text-[10px] text-muted-foreground leading-tight">{t('custom.urlSafeDesc')}</p>
                  </div>
                  <Switch checked={options.urlSafe} onCheckedChange={(v) => setValue('urlSafe', v)} className="scale-75 origin-right" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-xs">{t('custom.stripPadding')}</Label>
                    <p className="text-[10px] text-muted-foreground leading-tight">{t('custom.stripPaddingDesc')}</p>
                  </div>
                  <Switch checked={options.stripPadding} onCheckedChange={(v) => setValue('stripPadding', v)} className="scale-75 origin-right" />
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
      
      <ToolNavigation currentToolId="base64-encoder" />
    </div>
  );
}
