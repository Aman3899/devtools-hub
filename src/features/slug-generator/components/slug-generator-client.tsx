'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Copy, Trash2, RefreshCw, Link as LinkIcon, Info, Settings2 } from 'lucide-react';
import { toast } from 'sonner';
import { ToolNavigation } from '@/components/tool-navigation';

export function SlugGeneratorClient() {
  const t = useTranslations('tools.slug-generator');
  const commonT = useTranslations('common');
  const [input, setInput] = useState('');
  const [slug, setSlug] = useState('');
  const [lowercase, setLowercase] = useState(true);
  const [removeStopWords, setRemoveStopWords] = useState(false);

  useEffect(() => {
    let result = input
      .toString()
      .trim();

    if (lowercase) {
      result = result.toLowerCase();
    }

    if (removeStopWords) {
      const stopWords = ['a', 'an', 'the', 'and', 'or', 'but', 'is', 'if', 'then', 'else', 'when', 'at', 'from', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once'];
      result = result.split(/\s+/).filter(word => !stopWords.includes(word.toLowerCase())).join(' ');
    }

    result = result
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');

    setSlug(result);
  }, [input, lowercase, removeStopWords]);

  const loadSample = () => {
    setInput('10 Amazing Developer Tools You Should Use in 2024');
    toast.success(commonT('success'));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(slug);
    toast.success(commonT('copied'));
  };

  const stats = {
    chars: input.length,
    words: input.trim() ? input.trim().split(/\s+/).length : 0
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 flex flex-col gap-6">
          {/* Input Area */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('input')}</Label>
                <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                <span className="text-[10px] text-muted-foreground/60">{stats.chars} chars • {stats.words} words</span>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={loadSample} className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground">
                  <RefreshCw className="h-3 w-3" />
                  {commonT('hero.searchPlaceholder' as any) === 'Find a tool...' ? 'Sample' : 'مثال'}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setInput('')} title={commonT('clear')} className="h-6 w-6 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <Card className="border border-border shadow-none rounded-md bg-background focus-within:border-foreground/20 transition-colors overflow-hidden">
              <Input
                placeholder={t('placeholder')}
                className="font-sans text-xs h-10 border-none focus-visible:ring-0 px-3 bg-transparent"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </Card>
          </div>

          {/* Result Area */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('output')}</Label>
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={copyToClipboard} 
                  disabled={!slug}
                  className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Copy className="h-3 w-3" />
                  {commonT('copy')}
                </Button>
              </div>
            </div>
            <Card className="min-h-[80px] flex items-center px-4 py-3 rounded-md bg-muted/20 border border-border shadow-none overflow-hidden relative">
              <div className="font-mono text-xs break-all pr-8 leading-relaxed">
                {slug || <span className="text-muted-foreground opacity-30">{t('placeholder_slug')}</span>}
              </div>
              {slug && <LinkIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/20" />}
            </Card>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="border border-border shadow-none rounded-md bg-background">
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-xs font-semibold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings2 className="h-3.5 w-3.5" />
                  {commonT('ui.customization')}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-5">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-xs">Lowercase</Label>
                  <p className="text-[10px] text-muted-foreground leading-tight">All chars to lowercase</p>
                </div>
                <Switch checked={lowercase} onCheckedChange={setLowercase} className="scale-75 origin-right" />
              </div>
              <div className="flex items-center justify-between border-t pt-4">
                <div className="space-y-0.5">
                  <Label className="text-xs">Stop Words</Label>
                  <p className="text-[10px] text-muted-foreground leading-tight">Strip a, the, is, etc.</p>
                </div>
                <Switch checked={removeStopWords} onCheckedChange={setRemoveStopWords} className="scale-75 origin-right" />
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
      <ToolNavigation currentToolId="slug-generator" />
    </div>
  );
}
