'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Trash2, ArrowRightLeft, Upload, Download, FileJson } from 'lucide-react';
import { toast } from 'sonner';
import Papa from 'papaparse';
import { ToolNavigation } from '@/components/tool-navigation';

export function CsvToJsonClient() {
  const t = useTranslations('tools.csv-to-json');
  const commonT = useTranslations('common');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [delimiter, setDelimiter] = useState(',');
  const [hasHeader, setHasHeader] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleConvert = () => {
    if (!input.trim()) return;

    Papa.parse(input, {
      delimiter: delimiter === 'auto' ? '' : delimiter,
      header: hasHeader,
      skipEmptyLines: true,
      complete: (results) => {
        setOutput(JSON.stringify(results.data, null, 2));
        toast.success(commonT('success'));
      },
      error: (error: any) => {
        toast.error(error.message);
      }
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setInput(text);
      toast.success(commonT('success'));
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.json';
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg border border-dashed">
            <div className="space-y-2">
              <Label>{t('delimiter')}</Label>
              <Select value={delimiter} onValueChange={setDelimiter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=",">Comma (,)</SelectItem>
                  <SelectItem value=";">Semicolon (;)</SelectItem>
                  <SelectItem value="\t">Tab</SelectItem>
                  <SelectItem value="auto">Auto-detect</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between space-x-2 pt-8">
              <Label htmlFor="header-toggle" className="cursor-pointer">{t('header')}</Label>
              <Switch id="header-toggle" checked={hasHeader} onCheckedChange={setHasHeader} />
            </div>
            <div className="flex items-end justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={loadSample}>
                {commonT('loadSample')}
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".csv,.txt"
                onChange={handleFileUpload}
              />
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                {commonT('importFile')}
              </Button>
            </div>
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
                    <FileJson className="h-12 w-12 mb-2" />
                    <p>{t('output')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <ToolNavigation currentToolId="csv-to-json" />
    </div>
  );
}
