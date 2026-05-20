"use client"

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Settings2, Search, Replace, Info, Download, Share2, RefreshCw, Trash2, Check, Copy } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { useLanguage } from '@/hooks/tool';

const SAMPLE_DATA = {
  regex: "([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)\\.([a-zA-Z]{2,})",
  test: "Contact us at support@example.com or sales@devhub.io for more info.",
  replace: "HIDDEN_EMAIL"
};

export function RegexTesterClient() {
  const t = useTranslations('tools.regex-tester');
  const tCommon = useTranslations('common');
  const { copiedType, copyToClipboard } = useCopyToClipboard();

  const [regex, setRegex] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');
  const [replaceString, setReplaceString] = useState('');
  const [matches, setMatches] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [replacedResult, setReplacedResult] = useState('');
  const [downloaded, setDownloaded] = useState(false);

  const { isEnglish } = useLanguage();

  const runRegex = useCallback(() => {
    if (!regex) {
      setMatches([]);
      setError(null);
      setReplacedResult('');
      return;
    }

    try {
      const re = new RegExp(regex, flags);
      const m = [];
      let match;
      
      if (flags.includes('g')) {
        while ((match = re.exec(testString)) !== null) {
          m.push(match);
          if (match.index === re.lastIndex) re.lastIndex++;
        }
      } else {
        match = re.exec(testString);
        if (match) m.push(match);
      }
      
      setMatches(m);
      setError(null);
      
      if (replaceString !== undefined) {
        setReplacedResult(testString.replace(re, replaceString));
      }
    } catch (e: any) {
      setError(e.message);
      setMatches([]);
    }
  }, [regex, flags, testString, replaceString]);

  useEffect(() => {
    runRegex();
  }, [runRegex]);

  const toggleFlag = (flag: string) => {
    setFlags(prev => prev.includes(flag) ? prev.replace(flag, '') : prev + flag);
  };

  const loadSample = () => {
    setRegex(SAMPLE_DATA.regex);
    setTestString(SAMPLE_DATA.test);
    setReplaceString(SAMPLE_DATA.replace);
  };

  const downloadResults = () => {
    const content = JSON.stringify({
      regex,
      flags,
      testString,
      replaceString,
      matches: matches.map(m => ({ index: m.index, value: m[0], groups: m.slice(1) })),
      replacedResult
    }, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `regex-results-${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 space-y-4">
        {/* Pattern Card */}
        <ToolCard 
          title={t('pattern')}
          action={
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={loadSample} className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground">
                <RefreshCw className="h-3 w-3" />
                {isEnglish ? 'Sample' : 'مثال'}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => { setRegex(''); setTestString(''); setReplaceString(''); }} className="h-6 w-6 text-muted-foreground hover:text-destructive">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          }
          contentClassName="p-4 space-y-2"
        >
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-1.5 px-3 py-1.5 bg-muted/30 rounded border border-border group focus-within:border-foreground/20 transition-colors">
              <span className="text-muted-foreground font-mono text-sm">/</span>
              <Input
                placeholder="[a-zA-Z]+"
                className="font-mono text-sm h-8 border-none focus-visible:ring-0 bg-transparent p-0 shadow-none"
                value={regex}
                onChange={(e) => setRegex(e.target.value)}
              />
              <span className="text-muted-foreground font-mono text-sm">/</span>
            </div>
            <Input
              placeholder="flags"
              className="w-16 font-mono text-sm h-11 bg-muted/30 border-border text-center"
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
            />
          </div>
          {error && <p className="text-[10px] text-destructive font-medium px-2 mt-2">{isEnglish ? 'Error' : 'خرابی'}: {error}</p>}
        </ToolCard>

        <Tabs defaultValue="match" className="space-y-4">
          <TabsList className="bg-muted/50 p-0.5 border border-border h-9">
            <TabsTrigger value="match" className="h-8 text-xs px-4 data-[state=active]:bg-background data-[state=active]:shadow-none">
              <Search className="h-3 w-3 mr-2" />
              {t('matches')}
            </TabsTrigger>
            <TabsTrigger value="replace" className="h-8 text-xs px-4 data-[state=active]:bg-background data-[state=active]:shadow-none">
              <Replace className="h-3 w-3 mr-2" />
              {t('replace')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="match" className="m-0 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <ToolCard title={t('testString')} contentClassName="p-0 flex flex-col h-[300px]">
                <Textarea
                  className="flex-1 font-mono text-xs resize-none border-none focus-visible:ring-0 p-3 bg-transparent leading-relaxed"
                  value={testString}
                  onChange={(e) => setTestString(e.target.value)}
                  placeholder={isEnglish ? "Enter text to test against the pattern..." : "پیٹرن کے خلاف ٹیسٹ کرنے کے لیے متن درج کریں..."}
                />
              </ToolCard>

              <ToolCard 
                title={t('results')}
                action={
                  matches.length > 0 ? (
                    <Button variant="ghost" size="sm" onClick={downloadResults} className="h-5 px-1.5 text-[9px] gap-1 text-muted-foreground hover:text-foreground">
                      {downloaded ? <Check className="h-2.5 w-2.5 text-green-500" /> : <Download className="h-2.5 w-2.5" />}
                      {isEnglish ? 'Export' : 'ایکسپورٹ'}
                    </Button>
                  ) : undefined
                }
                contentClassName="p-0 flex flex-col h-[300px] bg-muted/20"
              >
                <div className="p-3 overflow-auto space-y-2 flex-1">
                  {matches.length > 0 ? (
                    <>
                      <div className="flex items-center justify-between text-[10px] font-bold text-foreground pb-2 border-b border-border/50">
                        <span>{isEnglish ? 'Total Matches' : 'کل نتائج'}</span>
                        <Badge variant="outline" className="h-5 px-1.5 rounded-sm text-[9px] bg-foreground/5">{matches.length}</Badge>
                      </div>
                      {matches.map((m, i) => (
                        <div key={i} className="p-2 rounded bg-background border border-border text-[10px] font-mono group hover:border-foreground/20 transition-colors">
                          <div className="text-muted-foreground mb-1 flex justify-between">
                            <span>{isEnglish ? 'Match' : 'میچ'} {i + 1}</span>
                            <span className="opacity-50">index: {m.index}</span>
                          </div>
                          <div className="text-foreground font-semibold break-all">{m[0]}</div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-[10px] text-center space-y-2 py-8">
                      <div className="p-2 rounded-full bg-muted/50 border border-border">
                        <Info className="h-4 w-4 opacity-30" />
                      </div>
                      <p>{isEnglish ? 'No matches found' : 'کوئی میچ نہیں ملا'}</p>
                    </div>
                  )}
                </div>
              </ToolCard>
            </div>
          </TabsContent>

          <TabsContent value="replace" className="m-0 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <ToolCard title={t('replacementText')} contentClassName="p-2">
                <Input
                  placeholder="e.g. $1"
                  className="h-8 font-mono text-sm border-none focus-visible:ring-0 shadow-none bg-transparent"
                  value={replaceString}
                  onChange={(e) => setReplaceString(e.target.value)}
                />
              </ToolCard>
              <ToolCard 
                title={tCommon('ui.result')}
                action={
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(replacedResult || testString, 'replace')} disabled={!replacedResult} className="h-6 px-2 text-[10px] gap-1.5 transition-colors">
                    {copiedType === 'replace' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                    {tCommon('copy')}
                  </Button>
                }
                contentClassName="p-2 h-[44px] flex items-center px-3 bg-muted/20"
              >
                <div className="font-mono text-xs truncate w-full">
                  {replacedResult || testString || (isEnglish ? 'Replacement result...' : 'تبدیلی کا نتیجہ...')}
                </div>
              </ToolCard>
            </div>
            <ToolCard title={t('previewArea')} contentClassName="p-0">
              <div className="p-3 font-mono text-xs whitespace-pre-wrap break-all leading-relaxed h-[200px] overflow-auto">
                {replacedResult || testString || (isEnglish ? 'Full preview...' : 'مکمل پیش نظارہ...')}
              </div>
            </ToolCard>
          </TabsContent>
        </Tabs>
      </div>

      {/* Settings Card */}
      <div className="md:col-span-1 space-y-4">
        <ToolCard 
          title={isEnglish ? 'Flags' : 'فلیگز'}
          icon={Settings2}
          action={<Share2 className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground cursor-pointer" />}
          contentClassName="p-4 space-y-4"
        >
          {[
            { id: 'g', label: 'Global (g)', desc: isEnglish ? 'Full search' : 'مکمل تلاش' },
            { id: 'i', label: 'Case-insensitive (i)', desc: isEnglish ? 'Ignore case' : 'کیس کو نظر انداز کریں' },
            { id: 'm', label: 'Multiline (m)', desc: isEnglish ? '^ and $ boundary' : '^ اور $ باؤنڈری' },
            { id: 's', label: 'Dot All (s)', desc: isEnglish ? 'Dot matches \\n' : 'ڈاٹ \\n سے میچ کرتا ہے' },
            { id: 'u', label: 'Unicode (u)', desc: isEnglish ? 'Unicode support' : 'یونیکوڈ سپورٹ' }
          ].map((f) => (
            <div key={f.id} className="flex items-center justify-between group cursor-pointer" onClick={() => toggleFlag(f.id)}>
              <div className="space-y-0.5">
                <Label className="text-xs cursor-pointer">{f.label}</Label>
                <p className="text-[9px] text-muted-foreground leading-tight">{f.desc}</p>
              </div>
              <Switch 
                checked={flags.includes(f.id)} 
                onCheckedChange={() => toggleFlag(f.id)} 
                className="scale-75 origin-right"
              />
            </div>
          ))}
          
          <div className="pt-2 border-t border-border">
            <div className="p-3 rounded-md bg-muted/50 border border-border space-y-1.5">
              <div className="flex items-center gap-2 text-[10px] font-semibold text-foreground uppercase tracking-tight">
                <Info className="h-3 w-3" />
                {isEnglish ? 'Quick Tip' : 'فوری مشورہ'}
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                {t('article').split('.')[1]}.
              </p>
            </div>
          </div>
        </ToolCard>
      </div>
    </div>
  );
}
