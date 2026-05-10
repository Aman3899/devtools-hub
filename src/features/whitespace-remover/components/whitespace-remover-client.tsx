'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Copy, Trash2, RefreshCw, Eraser, AlignJustify } from 'lucide-react';
import { toast } from 'sonner';
import { ToolNavigation } from '@/components/tool-navigation';

export function WhitespaceRemoverClient() {
  const t = useTranslations('tools.whitespace-remover');
  const commonT = useTranslations('common');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [options, setOptions] = useState({
    all: false,
    trim: true,
    extra: true,
    lines: true
  });

  const processText = () => {
    if (!input) return;

    let result = input;

    if (options.all) {
      result = result.replace(/\s+/g, '');
    } else {
      if (options.trim) {
        result = result.split('\n').map(line => line.trim()).join('\n').trim();
      }
      if (options.extra) {
        result = result.replace(/[ \t]+/g, ' ');
      }
      if (options.lines) {
        result = result.split('\n').filter(line => line.trim() !== '').join('\n');
      }
    }

    setOutput(result);
    toast.success(commonT('success'));
  };

  const loadSample = () => {
    setInput(t('sample'));
    toast.success(commonT('success'));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg border border-dashed">
            <div className="flex items-center justify-between space-x-2">
              <Label className="text-xs">{t('trim')}</Label>
              <Switch checked={options.trim} onCheckedChange={(v) => setOptions(prev => ({ ...prev, trim: v }))} disabled={options.all} />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label className="text-xs">{t('extra')}</Label>
              <Switch checked={options.extra} onCheckedChange={(v) => setOptions(prev => ({ ...prev, extra: v }))} disabled={options.all} />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label className="text-xs">{t('lines')}</Label>
              <Switch checked={options.lines} onCheckedChange={(v) => setOptions(prev => ({ ...prev, lines: v }))} disabled={options.all} />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label className="text-xs font-bold text-destructive">{t('all')}</Label>
              <Switch checked={options.all} onCheckedChange={(v) => setOptions(prev => ({ ...prev, all: v }))} />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="input">{t('input')}</Label>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={loadSample}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {commonT('loadSample')}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setInput('')} className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    {commonT('clear')}
                  </Button>
                </div>
              </div>
              <Textarea
                id="input"
                placeholder={t('placeholder')}
                className="min-h-[400px] font-mono text-sm resize-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button className="w-full" size="lg" onClick={processText} disabled={!input}>
                <Eraser className="h-4 w-4 mr-2" />
                {t('title').split(' ')[0]} {commonT('format')}
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="output">{t('output')}</Label>
                <Button variant="outline" size="sm" onClick={() => {
                  navigator.clipboard.writeText(output);
                  toast.success(commonT('copied'));
                }} disabled={!output}>
                  <Copy className="h-4 w-4 mr-2" />
                  {commonT('copy')}
                </Button>
              </div>
              <div className="relative">
                <Textarea
                  id="output"
                  readOnly
                  className="min-h-[400px] font-mono text-sm bg-muted/50 resize-none"
                  value={output}
                />
                {!output && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground opacity-50 pointer-events-none">
                    <AlignJustify className="h-12 w-12 mb-2" />
                    <p>{t('output')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <ToolNavigation currentToolId="whitespace-remover" />
    </div>
  );
}
