'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'sql-formatter';
import { Copy, Check, Trash2, Settings2, Database } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

export function SqlFormatterClient() {
  const t = useTranslations('tools.sql-formatter');
  const tCommon = useTranslations('common');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [dialect, setDialect] = useState('sql');
  const [uppercase, setUppercase] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFormat = (val: string = input) => {
    if (!val.trim()) {
      setOutput('');
      setError(null);
      return;
    }
    try {
      const result = format(val, {
        language: dialect as any,
        keywordCase: uppercase ? 'upper' : 'lower',
      });
      setOutput(result);
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setOutput('');
    }
  };

  useEffect(() => {
    handleFormat();
  }, [dialect, uppercase]);

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
          <CardContent className="flex-1 flex flex-col p-4 pt-0">
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
          <CardContent className="flex-1 flex flex-col p-4 pt-0 overflow-hidden">
            <pre className="flex-1 font-mono text-sm p-4 bg-muted/30 rounded-2xl overflow-auto whitespace-pre-wrap break-all">
              {error ? `Error: ${error}` : (output || 'Formatted SQL will appear here...')}
            </pre>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="rounded-[2rem] border-muted-foreground/10 bg-card/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-primary" />
              {tCommon('ui.settings')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">{t('custom.dialect')}</Label>
              <Select value={dialect} onValueChange={(v) => setDialect(v || 'sql')}>
                <SelectTrigger className="rounded-xl bg-muted/30 border-muted-foreground/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="sql">Standard SQL</SelectItem>
                  <SelectItem value="mysql">MySQL</SelectItem>
                  <SelectItem value="postgresql">PostgreSQL</SelectItem>
                  <SelectItem value="sqlite">SQLite</SelectItem>
                  <SelectItem value="tsql">T-SQL (SQL Server)</SelectItem>
                  <SelectItem value="mariadb">MariaDB</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t('custom.uppercase')}</Label>
                <p className="text-[10px] text-muted-foreground">{t('custom.uppercaseDesc')}</p>
              </div>
              <Switch checked={uppercase} onCheckedChange={setUppercase} />
            </div>
            
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-primary">
                <Database className="h-3 w-3" />
                {t('custom.tipLabel')}
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                {t('custom.tip')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
