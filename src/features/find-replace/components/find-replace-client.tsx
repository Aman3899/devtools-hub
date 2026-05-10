'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Copy, Trash2, RefreshCw, Search, ArrowRightLeft, Type } from 'lucide-react';
import { toast } from 'sonner';
import { ToolNavigation } from '@/components/tool-navigation';

export function FindReplaceClient() {
  const t = useTranslations('tools.find-replace');
  const commonT = useTranslations('common');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [useRegex, setUseRegex] = useState(false);

  const handleReplace = () => {
    if (!input || !findText) return;

    try {
      let result = '';
      if (useRegex) {
        const flags = caseSensitive ? 'g' : 'gi';
        const regex = new RegExp(findText, flags);
        result = input.replace(regex, replaceText);
      } else {
        if (caseSensitive) {
          result = input.split(findText).join(replaceText);
        } else {
          const regex = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
          result = input.replace(regex, replaceText);
        }
      }
      setOutput(result);
      toast.success(commonT('success'));
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const loadSample = () => {
    setInput(t('sample'));
    setFindText('quick');
    setReplaceText('slow');
    toast.success(commonT('success'));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-muted/30 rounded-lg border border-dashed">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="find-input">{t('find')}</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="find-input"
                    placeholder="Text to find..."
                    className="pl-10"
                    value={findText}
                    onChange={(e) => setFindText(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="replace-input">{t('replace')}</Label>
                <div className="relative">
                  <ArrowRightLeft className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="replace-input"
                    placeholder="Replace with..."
                    className="pl-10"
                    value={replaceText}
                    onChange={(e) => setReplaceText(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 flex flex-col justify-center">
              <div className="flex items-center justify-between p-2 hover:bg-background rounded-md transition-colors">
                <div className="space-y-0.5">
                  <Label className="text-sm">Case Sensitive</Label>
                  <p className="text-xs text-muted-foreground">Match exact character casing</p>
                </div>
                <Switch checked={caseSensitive} onCheckedChange={setCaseSensitive} />
              </div>
              <div className="flex items-center justify-between p-2 hover:bg-background rounded-md transition-colors">
                <div className="space-y-0.5">
                  <Label className="text-sm">Use Regex</Label>
                  <p className="text-xs text-muted-foreground">Treat find text as a regular expression</p>
                </div>
                <Switch checked={useRegex} onCheckedChange={setUseRegex} />
              </div>
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
                className="min-h-[300px] font-mono text-sm resize-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button className="w-full" size="lg" onClick={handleReplace} disabled={!input || !findText}>
                <Type className="h-4 w-4 mr-2" />
                {t('replaceAll')}
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
                  className="min-h-[300px] font-mono text-sm bg-muted/50 resize-none"
                  value={output}
                />
                {!output && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground opacity-50 pointer-events-none">
                    <ArrowRightLeft className="h-12 w-12 mb-2" />
                    <p>{t('output')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <ToolNavigation currentToolId="find-replace" />
    </div>
  );
}
