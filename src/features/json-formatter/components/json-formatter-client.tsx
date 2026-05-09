'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Copy, Check, Trash2, Settings2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  indent: z.string(),
  minify: z.boolean(),
  sortKeys: z.boolean(),
  escapeUnicode: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export function JsonFormatterClient() {
  const t = useTranslations('tools.json-formatter');
  const tCommon = useTranslations('common');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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

  const handleFormat = (val: string = input) => {
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
  };

  useEffect(() => {
    handleFormat();
  }, [options]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col h-[calc(100vh-16rem)] rounded-[2rem] border-muted-foreground/10 bg-card/50 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{t('input')}</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setInput('')} title={tCommon('clear')} className="rounded-xl">
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-4">
            <Textarea
              placeholder={t('placeholder')}
              className="flex-1 font-mono text-sm resize-none border-none focus-visible:ring-0 p-4 bg-muted/30 rounded-2xl"
              value={input}
              onChange={(e) => { setInput(e.target.value); handleFormat(e.target.value); }}
            />
          </CardContent>
        </Card>

        <Card className="flex flex-col h-[calc(100vh-16rem)] rounded-[2rem] border-muted-foreground/10 bg-card/50 backdrop-blur-md relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{t('output')}</CardTitle>
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
            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">{t('custom.indentation')}</Label>
              <Select value={options.indent} onValueChange={(v) => setValue('indent', v || '2')}>
                <SelectTrigger className="rounded-xl bg-muted/30 border-muted-foreground/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="2">{t('custom.spaces2')}</SelectItem>
                  <SelectItem value="4">{t('custom.spaces4')}</SelectItem>
                  <SelectItem value="tab">{t('custom.tabs')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t('custom.minify')}</Label>
                <p className="text-[10px] text-muted-foreground">{t('custom.minifyDesc')}</p>
              </div>
              <Switch checked={options.minify} onCheckedChange={(v) => setValue('minify', v)} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t('custom.sortKeys')}</Label>
                <p className="text-[10px] text-muted-foreground">{t('custom.sortKeysDesc')}</p>
              </div>
              <Switch checked={options.sortKeys} onCheckedChange={(v) => setValue('sortKeys', v)} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t('custom.escapeUnicode')}</Label>
                <p className="text-[10px] text-muted-foreground">{t('custom.escapeUnicodeDesc')}</p>
              </div>
              <Switch checked={options.escapeUnicode} onCheckedChange={(v) => setValue('escapeUnicode', v)} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
