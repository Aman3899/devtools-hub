'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Copy, Trash2, RefreshCw, Link as LinkIcon } from 'lucide-react';
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
    setInput(t('sample'));
    toast.success(commonT('success'));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(slug);
    toast.success(commonT('copied'));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg border border-dashed">
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label className="text-sm">Lowercase</Label>
                <p className="text-xs text-muted-foreground">Convert all characters to lowercase</p>
              </div>
              <Switch checked={lowercase} onCheckedChange={setLowercase} />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label className="text-sm">Remove Stop Words</Label>
                <p className="text-xs text-muted-foreground">Strip common words (a, the, is, etc.)</p>
              </div>
              <Switch checked={removeStopWords} onCheckedChange={setRemoveStopWords} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="input">{t('input')}</Label>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={loadSample}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {commonT('loadSample')}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setInput('')} disabled={!input}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {commonT('clear')}
                </Button>
              </div>
            </div>
            <Input
              id="input"
              placeholder={t('placeholder')}
              className="font-sans text-sm h-12"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="output">{t('output')}</Label>
              <Button variant="outline" size="sm" onClick={copyToClipboard} disabled={!slug}>
                <Copy className="h-4 w-4 mr-2" />
                {commonT('copy')}
              </Button>
            </div>
            <div className="relative group">
              <div className="min-h-[60px] flex items-center px-4 py-3 rounded-md bg-muted/50 border font-mono text-sm break-all pr-12">
                {slug || <span className="text-muted-foreground opacity-50">{t('placeholder_slug')}</span>}
                {slug && <LinkIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30" />}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <ToolNavigation currentToolId="slug-generator" />
    </div>
  );
}
