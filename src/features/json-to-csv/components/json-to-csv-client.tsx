'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Copy, Trash2, ArrowRightLeft, Download, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';
import Papa from 'papaparse';
import { ToolNavigation } from '@/components/tool-navigation';

export function JsonToCsvClient() {
  const t = useTranslations('tools.json-to-csv');
  const commonT = useTranslations('common');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [shouldFlatten, setShouldFlatten] = useState(true);

  const flattenObject = (obj: any, prefix = '') => {
    return Object.keys(obj).reduce((acc: any, k: string) => {
      const pre = prefix.length ? prefix + '.' : '';
      if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
        Object.assign(acc, flattenObject(obj[k], pre + k));
      } else {
        acc[pre + k] = obj[k];
      }
      return acc;
    }, {});
  };

  const handleConvert = () => {
    try {
      let data = JSON.parse(input);
      if (!Array.isArray(data)) {
        data = [data];
      }

      const processedData = shouldFlatten 
        ? data.map((item: any) => flattenObject(item))
        : data;

      const csv = Papa.unparse(processedData);
      setOutput(csv);
      toast.success(commonT('success'));
    } catch (e) {
      toast.error('Invalid JSON');
    }
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadSample = () => {
    setInput(t('sample'));
    toast.success(commonT('success'));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-dashed">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="flatten-toggle" className="cursor-pointer">{t('flatten')}</Label>
                <Switch id="flatten-toggle" checked={shouldFlatten} onCheckedChange={setShouldFlatten} />
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={loadSample}>
              {commonT('loadSample')}
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="input">{t('input')}</Label>
                <Button variant="ghost" size="sm" onClick={() => setInput('')} className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  {commonT('clear')}
                </Button>
              </div>
              <Textarea
                id="input"
                placeholder={t('placeholder')}
                className="min-h-[400px] font-mono text-xs resize-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button className="w-full" size="lg" onClick={handleConvert} disabled={!input}>
                <ArrowRightLeft className="h-4 w-4 mr-2" />
                {t('convert')}
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="output">{t('output')}</Label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleDownload} disabled={!output}>
                    <Download className="h-4 w-4 mr-2" />
                    {commonT('download')}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => {
                    navigator.clipboard.writeText(output);
                    toast.success(commonT('copied'));
                  }} disabled={!output}>
                    <Copy className="h-4 w-4 mr-2" />
                    {commonT('copy')}
                  </Button>
                </div>
              </div>
              <div className="relative">
                <Textarea
                  id="output"
                  readOnly
                  className="min-h-[400px] font-mono text-xs bg-muted/50 resize-none"
                  value={output}
                />
                {!output && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground opacity-50 pointer-events-none">
                    <FileSpreadsheet className="h-12 w-12 mb-2" />
                    <p>{t('output')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <ToolNavigation currentToolId="json-to-csv" />
    </div>
  );
}
