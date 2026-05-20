"use client"

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'sql-formatter';
import { Copy, Check, Trash2, Settings2, Database, Download, RefreshCw, Info, Share2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { useLanguage } from '@/hooks/tool';

const SAMPLE_SQL = `SELECT id, name, email FROM users WHERE active = 1 AND created_at > '2024-01-01' ORDER BY created_at DESC LIMIT 10;`;

export function SqlFormatterClient() {
  const t = useTranslations('tools.sql-formatter');
  const tCommon = useTranslations('common');
  const { copiedType, copyToClipboard } = useCopyToClipboard();

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [dialect, setDialect] = useState('sql');
  const [uppercase, setUppercase] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloaded, setDownloaded] = useState(false);

  const { isEnglish } = useLanguage();

  const handleFormat = useCallback((val: string = input) => {
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
  }, [dialect, uppercase, input]);

  useEffect(() => {
    handleFormat();
  }, [handleFormat]);

  const downloadSql = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formatted-${new Date().getTime()}.sql`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const loadSample = () => {
    setInput(SAMPLE_SQL);
    handleFormat(SAMPLE_SQL);
  };

  const stats = {
    chars: input.length,
    lines: input.split('\n').length
  };

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">
        {/* Input Card */}
        <ToolCard 
          title={
            <div className="flex items-center gap-2">
              <span>{t('input')}</span>
              <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
              <span className="text-[10px] text-muted-foreground/60">{stats.chars} {isEnglish ? 'chars' : 'حروف'} • {stats.lines} {isEnglish ? 'lines' : 'لائنیں'}</span>
            </div>
          }
          action={
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={loadSample} className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground">
                <RefreshCw className="h-3 w-3" />
                {isEnglish ? 'Sample' : 'مثال'}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setInput('')} title={tCommon('clear')} className="h-6 w-6 text-muted-foreground hover:text-destructive">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          }
          contentClassName="p-0 flex flex-col h-[500px]"
        >
          <Textarea
            placeholder={t('placeholder')}
            className="flex-1 font-mono text-xs resize-none border-none focus-visible:ring-0 p-3 bg-transparent leading-relaxed"
            value={input}
            onChange={(e) => { setInput(e.target.value); handleFormat(e.target.value); }}
          />
        </ToolCard>

        {/* Output Card */}
        <ToolCard 
          title={t('output')}
          action={
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={downloadSql} 
                disabled={!output}
                className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                {downloaded ? <Check className="h-3 w-3 text-green-500" /> : <Download className="h-3 w-3" />}
                {isEnglish ? 'Download' : 'ڈاؤن لوڈ'}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => copyToClipboard(output, 'sql')} 
                disabled={!output}
                className="h-6 px-2 text-[10px] gap-1.5 transition-colors"
              >
                {copiedType === 'sql' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                {tCommon('copy')}
              </Button>
            </div>
          }
          contentClassName="p-0 flex flex-col h-[500px] bg-muted/20"
        >
          <pre className={cn(
            "flex-1 font-mono text-xs p-3 overflow-auto whitespace-pre-wrap break-all leading-relaxed bg-transparent",
            error ? "text-destructive" : "text-foreground"
          )}>
            {error ? `${tCommon('error')}: ${error}` : (output || (isEnglish ? 'Formatted SQL will appear here...' : 'فارمیٹ شدہ SQL یہاں ظاہر ہوگا...'))}
          </pre>
        </ToolCard>
      </div>

      {/* Settings Card */}
      <div className="md:col-span-1 space-y-4">
        <ToolCard 
          title={tCommon('ui.settings')} 
          icon={Settings2} 
          action={<Share2 className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground cursor-pointer" />}
          contentClassName="p-4 space-y-5"
        >
          <div className="space-y-2">
            <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{t('custom.dialect')}</Label>
            <Select value={dialect} onValueChange={(v) => setDialect(v || 'sql')}>
              <SelectTrigger className="h-8 text-xs bg-muted/30 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sql" className="text-xs">{isEnglish ? 'Standard SQL' : 'معیاری SQL'}</SelectItem>
                <SelectItem value="mysql" className="text-xs">MySQL</SelectItem>
                <SelectItem value="postgresql" className="text-xs">PostgreSQL</SelectItem>
                <SelectItem value="sqlite" className="text-xs">SQLite</SelectItem>
                <SelectItem value="tsql" className="text-xs">T-SQL (SQL Server)</SelectItem>
                <SelectItem value="mariadb" className="text-xs">MariaDB</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-xs">{t('custom.uppercase')}</Label>
              <p className="text-[10px] text-muted-foreground leading-tight">{t('custom.uppercaseDesc')}</p>
            </div>
            <Switch checked={uppercase} onCheckedChange={setUppercase} className="scale-75 origin-right" />
          </div>
          
          <div className="p-3 rounded-md bg-muted/50 border border-border space-y-1.5">
            <div className="flex items-center gap-2 text-[10px] font-semibold text-foreground uppercase tracking-tight">
              <Database className="h-3 w-3" />
              {t('custom.tipLabel')}
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              {t('custom.tip')}
            </p>
          </div>
        </ToolCard>

        <div className="p-3 rounded-md bg-muted/30 border border-border flex gap-2.5 items-start">
          <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-[10px] text-muted-foreground leading-normal">
            {t('article').split('.')[1]}.
          </p>
        </div>
      </div>
    </div>
  );
}
