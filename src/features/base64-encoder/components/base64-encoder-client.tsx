'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Copy, Check, Repeat, Settings2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  urlSafe: z.boolean().default(false),
  stripPadding: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export function Base64EncoderClient() {
  const t = useTranslations('tools.base64-encoder');
  const tCommon = useTranslations('common');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const { watch, setValue } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      urlSafe: false,
      stripPadding: false,
    },
  });

  const options = watch();

  const handleTransform = (val: string = input, currentMode: 'encode' | 'decode' = mode) => {
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
        // Restore padding if needed
        while (toDecode.length % 4 !== 0) toDecode += '=';
        setOutput(atob(toDecode));
      }
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setOutput('');
    }
  };

  useEffect(() => {
    handleTransform();
  }, [options, mode]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const switchMode = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode';
    setMode(newMode);
    setInput(output);
    handleTransform(output, newMode);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col h-[calc(100vh-16rem)] rounded-[2rem] border-muted-foreground/10 bg-card/50 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              {mode === 'encode' ? tCommon('encode') : tCommon('decode')}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={switchMode} title="Switch Mode" className="rounded-xl hover:bg-primary/5">
              <Repeat className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-4">
            <Textarea
              placeholder={t('placeholder')}
              className="flex-1 font-mono text-sm resize-none border-none focus-visible:ring-0 p-4 bg-muted/30 rounded-2xl"
              value={input}
              onChange={(e) => { setInput(e.target.value); handleTransform(e.target.value); }}
            />
          </CardContent>
        </Card>

        <Card className="flex flex-col h-[calc(100vh-16rem)] rounded-[2rem] border-muted-foreground/10 bg-card/50 backdrop-blur-md relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              {mode === 'encode' ? tCommon('decode') : tCommon('encode')}
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={copyToClipboard} 
              disabled={!output}
              className="rounded-xl h-8 gap-2"
            >
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              {tCommon('copy')}
            </Button>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-4 overflow-hidden">
            <pre className={cn(
              "flex-1 font-mono text-sm p-4 bg-muted/30 rounded-2xl overflow-auto whitespace-pre-wrap break-all",
              error ? "text-destructive" : "text-foreground"
            )}>
              {error ? `Error: ${error}` : (output || tCommon('ui.result'))}
            </pre>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="rounded-[2rem] border-muted-foreground/10 bg-card/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-primary" />
              {tCommon('ui.customization')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t('custom.urlSafe')}</Label>
                <p className="text-[10px] text-muted-foreground">{t('custom.urlSafeDesc')}</p>
              </div>
              <Switch checked={options.urlSafe} onCheckedChange={(v) => setValue('urlSafe', v)} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t('custom.stripPadding')}</Label>
                <p className="text-[10px] text-muted-foreground">{t('custom.stripPaddingDesc')}</p>
              </div>
              <Switch checked={options.stripPadding} onCheckedChange={(v) => setValue('stripPadding', v)} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
