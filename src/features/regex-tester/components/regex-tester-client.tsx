'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Settings2, Search, Replace, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function RegexTesterClient() {
  const t = useTranslations('tools.regex-tester');
  const tCommon = useTranslations('common');
  const [regex, setRegex] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');
  const [replaceString, setReplaceString] = useState('');
  const [matches, setMatches] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [replacedResult, setReplacedResult] = useState('');

  useEffect(() => {
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

  const toggleFlag = (flag: string) => {
    setFlags(prev => prev.includes(flag) ? prev.replace(flag, '') : prev + flag);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="space-y-6">
        <Card className="rounded-[2rem] border-muted-foreground/10 bg-card/50 backdrop-blur-md overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Search className="h-4 w-4" />
              {t('pattern')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">/</span>
                <Input
                  placeholder="[a-zA-Z]+"
                  className="font-mono pl-7 pr-7 h-12 rounded-xl bg-muted/30 border-muted-foreground/10 focus-visible:ring-primary"
                  value={regex}
                  onChange={(e) => setRegex(e.target.value)}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">/</span>
              </div>
              <Input
                placeholder="flags"
                className="w-24 font-mono h-12 rounded-xl bg-muted/30 border-muted-foreground/10"
                value={flags}
                onChange={(e) => setFlags(e.target.value)}
              />
            </div>
            {error && <p className="text-xs text-destructive font-medium px-2">Error: {error}</p>}
          </CardContent>
        </Card>

        <Tabs defaultValue="match" className="space-y-4">
          <TabsList className="bg-muted/50 p-1 rounded-2xl border border-muted-foreground/5 h-12">
            <TabsTrigger value="match" className="rounded-xl px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Search className="h-4 w-4 mr-2" />
              {t('matches')}
            </TabsTrigger>
            <TabsTrigger value="replace" className="rounded-xl px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Replace className="h-4 w-4 mr-2" />
              {t('replace')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="match">
            <Card className="rounded-[2rem] border-muted-foreground/10 bg-card/50 backdrop-blur-md overflow-hidden">
              <CardContent className="p-4 flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-2">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground px-2">{t('testString')}</Label>
                  <Textarea
                    className="min-h-[200px] font-mono text-sm resize-none border-none focus-visible:ring-0 p-4 bg-muted/30 rounded-2xl"
                    value={testString}
                    onChange={(e) => setTestString(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-64 space-y-2">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground px-2">{t('results')}</Label>
                  <div className="h-[200px] bg-muted/30 rounded-2xl p-4 overflow-auto space-y-2 border border-muted-foreground/5">
                    {matches.length > 0 ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold text-primary">
                          <span>{t('totalMatches')}</span>
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-none">{matches.length}</Badge>
                        </div>
                        {matches.map((m, i) => (
                          <div key={i} className="p-2 rounded-lg bg-background/50 border border-muted-foreground/5 text-xs font-mono">
                            <div className="text-muted-foreground mb-1 flex justify-between">
                              <span>Match {i + 1}</span>
                              <span>pos: {m.index}</span>
                            </div>
                            <div className="text-foreground font-bold truncate">{m[0]}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-xs text-center space-y-2">
                        <Info className="h-4 w-4" />
                        <p>{t('noMatches')}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="replace">
            <Card className="rounded-[2rem] border-muted-foreground/10 bg-card/50 backdrop-blur-md overflow-hidden">
              <CardContent className="p-4 space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-widest text-muted-foreground px-2">{t('replacementText')}</Label>
                    <Input
                      placeholder="e.g. $1"
                      className="h-12 rounded-xl bg-muted/30 border-muted-foreground/10"
                      value={replaceString}
                      onChange={(e) => setReplaceString(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-widest text-muted-foreground px-2">{tCommon('ui.result')}</Label>
                    <div className="h-12 rounded-xl bg-muted/30 border border-muted-foreground/5 flex items-center px-4 font-mono text-sm overflow-hidden truncate">
                      {replacedResult || testString}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground px-2">{t('previewArea')}</Label>
                  <div className="min-h-[150px] font-mono text-sm p-4 bg-muted/30 rounded-2xl overflow-auto whitespace-pre-wrap border border-muted-foreground/5">
                    {replacedResult || testString}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="space-y-6">
        <Card className="rounded-[2rem] border-muted-foreground/10 bg-card/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-primary" />
              Flags
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { id: 'g', label: 'Global (g)', desc: 'Don\'t return after first match' },
              { id: 'i', label: 'Case-insensitive (i)', desc: 'Ignore case' },
              { id: 'm', label: 'Multiline (m)', desc: '^ and $ match lines' },
              { id: 's', label: 'Dot All (s)', desc: 'Dot matches newline' },
              { id: 'u', label: 'Unicode (u)', desc: 'Unicode support' },
              { id: 'y', label: 'Sticky (y)', desc: 'Matches from lastIndex' }
            ].map((f) => (
              <div key={f.id} className="flex items-center justify-between group cursor-pointer" onClick={() => toggleFlag(f.id)}>
                <div className="space-y-0.5">
                  <Label className="cursor-pointer">{f.label}</Label>
                  <p className="text-[10px] text-muted-foreground">{f.desc}</p>
                </div>
                <Switch 
                  checked={flags.includes(f.id)} 
                  onCheckedChange={() => toggleFlag(f.id)} 
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
