"use client"

import { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Check, Terminal, Settings2, Plus, Trash2, Globe, Download, Share2, Info, RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface Header {
  key: string;
  value: string;
}

import { ToolNavigation } from '@/components/tool-navigation';

export function CurlGeneratorClient() {
  const t = useTranslations('tools.curl-generator');
  const tCommon = useTranslations('common');
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('https://api.example.com/v1/resource');
  const [headers, setHeaders] = useState<Header[]>([
    { key: 'Content-Type', value: 'application/json' },
    { key: 'Accept', value: 'application/json' }
  ]);
  const [body, setBody] = useState('');
  const [copied, setCopied] = useState(false);
  const [pretty, setPretty] = useState(true);
  const [downloaded, setDownloaded] = useState(false);

  const isEnglish = tCommon('hero.searchPlaceholder' as any) === 'Find a tool...';

  const addHeader = () => setHeaders([...headers, { key: '', value: '' }]);
  const removeHeader = (i: number) => setHeaders(headers.filter((_, idx) => idx !== i));
  const updateHeader = (i: number, field: keyof Header, val: string) => {
    const newHeaders = [...headers];
    newHeaders[i][field] = val;
    setHeaders(newHeaders);
  };

  const curlCode = useMemo(() => {
    const separator = pretty ? ' \\\n  ' : ' ';
    let curl = `curl --request ${method}`;
    curl += `${separator}--url '${url}'`;
    
    headers.forEach(h => {
      if (h.key && h.value) {
        curl += `${separator}--header '${h.key}: ${h.value}'`;
      }
    });
    
    if (body && method !== 'GET') {
      curl += `${separator}--data '${body.replace(/'/g, "'\\''")}'`;
    }
    
    return curl;
  }, [method, url, headers, body, pretty]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(curlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCurl = () => {
    const content = `#!/bin/bash\n\n${curlCode}`;
    const blob = new Blob([content], { type: 'application/x-sh' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `request-${new Date().getTime()}.sh`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 space-y-4">
          {/* Endpoint Card */}
          <div className="flex flex-col gap-2">
            <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1">{t('endpoint')}</Label>
            <Card className="border border-border shadow-none rounded-md bg-background overflow-hidden p-2">
              <div className="flex flex-col md:flex-row gap-2">
                <Select value={method} onValueChange={(v) => v && setMethod(v)}>
                  <SelectTrigger className="w-full md:w-[120px] h-9 text-xs font-bold bg-muted/30 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map(m => (
                      <SelectItem key={m} value={m} className="text-xs font-bold">{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex-1 relative flex items-center">
                  <Globe className="absolute left-3 h-3.5 w-3.5 text-muted-foreground" />
                  <Input 
                    value={url} 
                    onChange={(e) => setUrl(e.target.value)} 
                    placeholder="https://api.example.com/resource" 
                    className="h-9 pl-9 text-xs font-mono bg-muted/30 border-border focus-visible:ring-0 shadow-none"
                  />
                </div>
              </div>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Headers Column */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-1">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{isEnglish ? 'Headers' : 'ہیڈرز'}</Label>
                <Button variant="ghost" size="sm" onClick={addHeader} className="h-5 px-1.5 text-[9px] gap-1 text-muted-foreground hover:text-foreground">
                  <Plus className="h-2.5 w-2.5" />
                  {isEnglish ? 'Add' : 'شامل کریں'}
                </Button>
              </div>
              <Card className="border border-border shadow-none rounded-md bg-background p-3 space-y-2 min-h-[300px]">
                {headers.map((h, i) => (
                  <div key={i} className="flex gap-2 group">
                    <Input 
                      value={h.key} 
                      onChange={(e) => updateHeader(i, 'key', e.target.value)} 
                      placeholder={isEnglish ? 'Key' : 'کی'}
                      className="h-8 text-[10px] font-mono bg-muted/20 border-border"
                    />
                    <Input 
                      value={h.value} 
                      onChange={(e) => updateHeader(i, 'value', e.target.value)} 
                      placeholder={isEnglish ? 'Value' : 'قیمت'}
                      className="h-8 text-[10px] font-mono bg-muted/20 border-border"
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeHeader(i)} className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
                {headers.length === 0 && (
                  <div className="h-full flex items-center justify-center text-[10px] text-muted-foreground italic opacity-50 py-10">
                    {isEnglish ? 'No headers added' : 'کوئی ہیڈرز شامل نہیں کیے گئے'}
                  </div>
                )}
              </Card>
            </div>

            {/* Body Column */}
            <div className="flex flex-col gap-2">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1">{isEnglish ? 'Request Body' : 'درخواست کی باڈی'}</Label>
              <Card className="border border-border shadow-none rounded-md bg-background overflow-hidden min-h-[300px]">
                <Textarea 
                  value={body} 
                  onChange={(e) => setBody(e.target.value)}
                  placeholder='{"foo": "bar"}'
                  className="h-full min-h-[300px] font-mono text-[11px] p-3 bg-transparent border-none focus-visible:ring-0 resize-none leading-relaxed"
                  disabled={method === 'GET'}
                />
              </Card>
            </div>
          </div>
        </div>

        {/* Output & Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{isEnglish ? 'Generated cURL' : 'تخلیق شدہ cURL'}</Label>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={downloadCurl} 
                  className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {downloaded ? <Check className="h-3 w-3 text-green-500" /> : <Download className="h-3 w-3" />}
                  {isEnglish ? 'Script' : 'اسکرپٹ'}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={copyToClipboard} 
                  className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                  {tCommon('copy')}
                </Button>
              </div>
            </div>
            
            <Card className="border border-border shadow-none rounded-md bg-background overflow-hidden">
              <div className="p-2 border-b bg-muted/30 flex items-center justify-between h-9">
                <div className="flex items-center gap-2">
                  <Terminal className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-tight">CLI</span>
                </div>
              </div>
              <div className="bg-muted/10 font-mono text-[10px] p-3 h-[250px] overflow-auto leading-normal text-foreground">
                {curlCode}
              </div>
            </Card>
          </div>

          <Card className="border border-border shadow-none rounded-md bg-background">
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-xs font-semibold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings2 className="h-3.5 w-3.5" />
                  {isEnglish ? 'Options' : 'آپشنز'}
                </div>
                <Share2 className="h-3 w-3 text-muted-foreground hover:text-foreground cursor-pointer" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-xs">{t('multiline')}</Label>
                  <p className="text-[9px] text-muted-foreground leading-tight">{t('multilineDesc')}</p>
                </div>
                <Switch checked={pretty} onCheckedChange={setPretty} className="scale-75 origin-right" />
              </div>

              <div className="p-3 rounded-md bg-muted/50 border border-border space-y-1.5">
                <div className="flex items-center gap-2 text-[10px] font-semibold text-foreground uppercase tracking-tight">
                  <Info className="h-3 w-3" />
                  CLI Tip
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  {t('article').split('.')[1]}.
                </p>
              </div>

              <Button variant="outline" size="sm" onClick={() => { setHeaders([]); setBody(''); }} className="w-full h-8 gap-2 text-[10px]">
                <Trash2 className="h-3 w-3" />
                {isEnglish ? 'Reset Request' : 'درخواست دوبارہ ترتیب دیں'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <ToolNavigation currentToolId="curl-generator" />
    </div>
  );
}
