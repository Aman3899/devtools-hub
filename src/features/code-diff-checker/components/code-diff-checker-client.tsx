'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { diffLines, Change } from 'diff';
import { useTranslations } from 'next-intl';
import { Settings2, Split, Rows, Trash2, FileText } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export function CodeDiffCheckerClient() {
  const t = useTranslations('tools.code-diff-checker');
  const tCommon = useTranslations('common');
  const [originalCode, setOriginalCode] = useState('');
  const [newCode, setNewCode] = useState('');
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');

  const diff = diffLines(originalCode, newCode, { ignoreWhitespace });

  const clearAll = () => {
    setOriginalCode('');
    setNewCode('');
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-[2rem] border-muted-foreground/10 bg-card/50 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {t('original')}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setOriginalCode('')} className="rounded-xl">
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <Textarea
              placeholder={t('originalPlaceholder')}
              className="min-h-[300px] font-mono text-sm resize-none border-none focus-visible:ring-0 p-4 bg-muted/30 rounded-2xl"
              value={originalCode}
              onChange={(e) => setOriginalCode(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-muted-foreground/10 bg-card/50 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {t('new')}
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => setNewCode('')} className="rounded-xl">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <Textarea
              placeholder={t('newPlaceholder')}
              className="min-h-[300px] font-mono text-sm resize-none border-none focus-visible:ring-0 p-4 bg-muted/30 rounded-2xl"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
            />
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-[2rem] border-muted-foreground/10 bg-card/50 backdrop-blur-md overflow-hidden">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-muted-foreground/5 pb-4">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{t('result')}</CardTitle>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Label className="text-xs font-medium cursor-pointer" htmlFor="ignore-ws">{t('ignoreWhitespace')}</Label>
              <Switch id="ignore-ws" checked={ignoreWhitespace} onCheckedChange={setIgnoreWhitespace} />
            </div>
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)} className="h-10 p-1 bg-muted/50 rounded-xl border border-muted-foreground/10">
              <TabsList className="bg-transparent h-full p-0">
                <TabsTrigger value="split" className="rounded-lg px-3 data-[state=active]:bg-background">
                  <Split className="h-3.5 w-3.5 mr-1" />
                  {t('split')}
                </TabsTrigger>
                <TabsTrigger value="unified" className="rounded-lg px-3 data-[state=active]:bg-background">
                  <Rows className="h-3.5 w-3.5 mr-1" />
                  {t('unified')}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-muted-foreground/5">
            {viewMode === 'unified' ? (
              <div className="font-mono text-xs p-4 bg-muted/20 min-h-[200px] overflow-auto whitespace-pre">
                {diff.map((part, i) => (
                  <div
                    key={i}
                    className={cn(
                      "px-2 py-0.5",
                      part.added ? "bg-green-500/10 text-green-600 dark:text-green-400" : 
                      part.removed ? "bg-destructive/10 text-destructive" : ""
                    )}
                  >
                    {part.added ? '+ ' : part.removed ? '- ' : '  '}
                    {part.value}
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 divide-x divide-muted-foreground/5 min-h-[200px]">
                <div className="font-mono text-xs p-4 bg-muted/20 overflow-auto whitespace-pre">
                  {diff.filter(p => !p.added).map((part, i) => (
                    <div key={i} className={cn("px-2 py-0.5", part.removed ? "bg-destructive/10 text-destructive" : "")}>
                      {part.removed ? '- ' : '  '}{part.value}
                    </div>
                  ))}
                </div>
                <div className="font-mono text-xs p-4 bg-muted/20 overflow-auto whitespace-pre">
                  {diff.filter(p => !p.removed).map((part, i) => (
                    <div key={i} className={cn("px-2 py-0.5", part.added ? "bg-green-500/10 text-green-600 dark:text-green-400" : "")}>
                      {part.added ? '+ ' : '  '}{part.value}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
