'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Copy, Trash2, ArrowRightLeft, Download, FileSpreadsheet, Info, RefreshCw, Settings2 } from 'lucide-react';
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
    const sample = [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "role": "Admin",
        "active": true
      },
      {
        "id": 2,
        "name": "Jane Smith",
        "email": "jane@example.com",
        "role": "User",
        "active": false
      }
    ];
    setInput(JSON.stringify(sample, null, 2));
    toast.success(commonT('success'));
  };

  const stats = {
    chars: input.length,
    lines: input.split('\n').length
  };

  const outputStats = {
    chars: output.length,
    lines: output.split('\n').length,
    size: (new TextEncoder().encode(output).length / 1024).toFixed(2)
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 grid gap-4 md:grid-cols-2">
          {/* Input Card */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('input')}</Label>
                <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                <span className="text-[10px] text-muted-foreground/60">{stats.chars} chars • {stats.lines} lines</span>
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
            <Card className="flex flex-col h-[500px] border border-border shadow-none rounded-md overflow-hidden bg-background focus-within:border-foreground/20 transition-colors">
              <Textarea
                placeholder={t('placeholder')}
                className="flex-1 font-mono text-xs resize-none border-none focus-visible:ring-0 p-3 bg-transparent leading-relaxed"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <div className="p-2 border-t bg-muted/5">
                <Button className="w-full h-8 text-xs" onClick={handleConvert} disabled={!input}>
                  <ArrowRightLeft className="h-3.5 w-3.5 mr-2" />
                  {t('convert')}
                </Button>
              </div>
            </Card>
          </div>

          {/* Output Card */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('output')}</Label>
                {output && (
                  <>
                    <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                    <span className="text-[10px] text-muted-foreground/60">{outputStats.size} KB</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleDownload} 
                  disabled={!output}
                  className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Download className="h-3 w-3" />
                  {commonT('download')}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    navigator.clipboard.writeText(output);
                    toast.success(commonT('copied'));
                  }} 
                  disabled={!output}
                  className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Copy className="h-3 w-3" />
                  {commonT('copy')}
                </Button>
              </div>
            </div>
            <Card className="flex flex-col h-[500px] border border-border shadow-none rounded-md overflow-hidden bg-muted/20">
              <div className="flex-1 relative">
                <Textarea
                  readOnly
                  className="w-full h-full font-mono text-xs p-3 bg-transparent resize-none border-none focus-visible:ring-0 leading-relaxed"
                  value={output}
                />
                {!output && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground opacity-30 pointer-events-none">
                    <FileSpreadsheet className="h-10 w-10 mb-2" />
                    <p className="text-[10px]">{t('output')}</p>
                  </div>
                )}
              </div>
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
                  <Label className="text-xs">{t('flatten')}</Label>
                  <p className="text-[10px] text-muted-foreground leading-tight">Flatten nested structures</p>
                </div>
                <Switch checked={shouldFlatten} onCheckedChange={setShouldFlatten} className="scale-75 origin-right" />
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
      <ToolNavigation currentToolId="json-to-csv" />
    </div>
  );
}
