"use client"

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { diffLines } from 'diff';
import { useTranslations } from 'next-intl';
import { Settings2, Split, Rows, Trash2, Download, Share2, Info, RefreshCw, Check } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';

const SAMPLE_OLD = `function calculateTotal(price, quantity) {
  const tax = 0.05;
  return price * quantity * (1 + tax);
}

console.log(calculateTotal(10, 2));`;

const SAMPLE_NEW = `function calculateTotal(price, quantity) {
  const tax = 0.08; // Updated tax rate
  const discount = 0.1;
  const subtotal = price * quantity;
  return subtotal * (1 + tax - discount);
}

console.log(calculateTotal(20, 5));`;

export function CodeDiffCheckerClient() {
  const t = useTranslations('tools.code-diff-checker');
  const tCommon = useTranslations('common');
  const [originalCode, setOriginalCode] = useState('');
  const [newCode, setNewCode] = useState('');
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');
  const [downloaded, setDownloaded] = useState(false);

  const { isEnglish } = useLanguage();

  const diff = useMemo(() => diffLines(originalCode, newCode, { ignoreWhitespace }), [originalCode, newCode, ignoreWhitespace]);

  const loadSample = () => { setOriginalCode(SAMPLE_OLD); setNewCode(SAMPLE_NEW); };

  const downloadDiff = () => {
    const diffText = diff.map(part => {
      const prefix = part.added ? '+ ' : part.removed ? '- ' : '  ';
      return part.value.split('\n').filter(l => l).map(l => prefix + l).join('\n');
    }).join('\n');
    const blob = new Blob([diffText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `diff-${new Date().getTime()}.patch`; a.click(); URL.revokeObjectURL(url);
    setDownloaded(true); setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <ToolCard 
            title={t('original')} 
            action={<Button variant="ghost" size="icon" onClick={() => setOriginalCode('')} title={tCommon('clear')} className="h-6 w-6 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>}
            contentClassName="p-0"
          >
            <Textarea placeholder={t('originalPlaceholder')} className="min-h-[250px] font-mono text-[11px] resize-none border-none p-3 bg-transparent leading-relaxed" value={originalCode} onChange={(e) => setOriginalCode(e.target.value)} />
          </ToolCard>

          <ToolCard 
            title={t('new')} 
            action={<Button variant="ghost" size="icon" onClick={() => setNewCode('')} title={tCommon('clear')} className="h-6 w-6 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>}
            contentClassName="p-0"
          >
            <Textarea placeholder={t('newPlaceholder')} className="min-h-[250px] font-mono text-[11px] resize-none border-none p-3 bg-transparent leading-relaxed" value={newCode} onChange={(e) => setNewCode(e.target.value)} />
          </ToolCard>
        </div>

        <ToolCard 
          title={t('result')}
          action={
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={loadSample} className="h-6 px-2 text-[10px] gap-1.5"><RefreshCw className="h-3 w-3" />{isEnglish ? 'Sample' : 'مثال'}</Button>
              <Button variant="ghost" size="sm" onClick={downloadDiff} disabled={!originalCode && !newCode} className="h-6 px-2 text-[10px] gap-1.5">{downloaded ? <Check className="h-3 w-3 text-green-500" /> : <Download className="h-3 w-3" />}{isEnglish ? 'Export' : 'ایکسپورٹ'}</Button>
            </div>
          }
          contentClassName="p-0 overflow-hidden"
        >
          <div className="p-2 border-b bg-muted/30 flex items-center justify-between h-10">
            <div className="flex items-center gap-2"><Switch id="ignore-ws" checked={ignoreWhitespace} onCheckedChange={setIgnoreWhitespace} className="scale-75" /><Label className="text-[10px] font-medium text-muted-foreground cursor-pointer" htmlFor="ignore-ws">{t('ignoreWhitespace')}</Label></div>
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="h-7 p-0.5 bg-muted/50 rounded border border-border">
              <TabsList className="bg-transparent h-full p-0">
                <TabsTrigger value="split" className="h-full rounded-sm px-2 text-[9px] data-[state=active]:bg-background data-[state=active]:shadow-none"><Split className="h-3 w-3 mr-1.5" />{t('split')}</TabsTrigger>
                <TabsTrigger value="unified" className="h-full rounded-sm px-2 text-[9px] data-[state=active]:bg-background data-[state=active]:shadow-none"><Rows className="h-3 w-3 mr-1.5" />{t('unified')}</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="bg-muted/10 font-mono text-[11px] min-h-[300px] overflow-auto leading-relaxed">
            {viewMode === 'unified' ? (
              <div className="p-3">
                {diff.map((part, i) => (
                  <div key={i} className={cn("whitespace-pre", part.added ? "bg-green-500/10 text-green-600" : part.removed ? "bg-destructive/10 text-destructive" : "text-muted-foreground/80")}>
                    {part.value.split('\n').filter((l, idx, arr) => idx < arr.length - 1 || l).map((line, lineIdx) => (<div key={lineIdx} className="flex"><span className="inline-block w-4 shrink-0 opacity-50">{part.added ? '+' : part.removed ? '-' : ' '}</span><span>{line}</span></div>))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 divide-x divide-border">
                <div className="p-3 overflow-auto">
                  {diff.map((part, i) => !part.added && (
                    <div key={i} className={cn("whitespace-pre", part.removed ? "bg-destructive/10 text-destructive" : "text-muted-foreground/80")}>
                      {part.value.split('\n').filter((l, idx, arr) => idx < arr.length - 1 || l).map((line, lineIdx) => (<div key={lineIdx} className="flex"><span className="inline-block w-4 shrink-0 opacity-50">{part.removed ? '-' : ' '}</span><span>{line}</span></div>))}
                    </div>
                  ))}
                </div>
                <div className="p-3 overflow-auto">
                  {diff.map((part, i) => !part.removed && (
                    <div key={i} className={cn("whitespace-pre", part.added ? "bg-green-500/10 text-green-600" : "text-muted-foreground/80")}>
                      {part.value.split('\n').filter((l, idx, arr) => idx < arr.length - 1 || l).map((line, lineIdx) => (<div key={lineIdx} className="flex"><span className="inline-block w-4 shrink-0 opacity-50">{part.added ? '+' : ' '}</span><span>{line}</span></div>))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ToolCard>
      </div>

      <div className="md:col-span-1 space-y-4">
        <ToolCard 
          title={isEnglish ? 'Options' : 'آپشنز'} 
          icon={Settings2} 
          action={<Share2 className="h-3 w-3 text-muted-foreground hover:text-foreground cursor-pointer" />}
          contentClassName="p-4 space-y-6"
        >
          <div className="p-3 rounded-md bg-muted/50 border border-border space-y-1.5">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase"><Info className="h-3 w-3" />{isEnglish ? 'How it works' : 'یہ کیسے کام کرتا ہے'}</div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">{t('article').split('.')[1]}.</p>
          </div>

          <div className="space-y-3 pt-2">
            <Label className="text-[10px] font-medium text-muted-foreground uppercase">{isEnglish ? 'Statistics' : 'اعداد و شمار'}</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-muted/20 border rounded flex flex-col gap-1"><span className="text-[9px] text-muted-foreground uppercase font-bold">{isEnglish ? 'Added' : 'شامل'}</span><span className="text-lg font-mono font-bold text-green-600">{diff.filter(p => p.added).length}</span></div>
              <div className="p-2 bg-muted/20 border rounded flex flex-col gap-1"><span className="text-[9px] text-muted-foreground uppercase font-bold">{isEnglish ? 'Removed' : 'حذف'}</span><span className="text-lg font-mono font-bold text-destructive">{diff.filter(p => p.removed).length}</span></div>
            </div>
          </div>

          <Button onClick={loadSample} variant="outline" className="w-full h-8 gap-2 text-xs"><RefreshCw className="h-3.5 w-3.5" />{isEnglish ? 'Load Example' : 'مثال لوڈ کریں'}</Button>
        </ToolCard>
      </div>
    </div>
  );
}
