'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Check, Terminal, Settings2, Plus, Trash2, Globe } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface Header {
  key: string;
  value: string;
}

export function CurlGeneratorClient() {
  const t = useTranslations('tools.curl-generator');
  const tCommon = useTranslations('common');
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('https://api.example.com/data');
  const [headers, setHeaders] = useState<Header[]>([
    { key: 'Content-Type', value: 'application/json' }
  ]);
  const [body, setBody] = useState('');
  const [copied, setCopied] = useState(false);
  const [pretty, setPretty] = useState(true);

  const addHeader = () => setHeaders([...headers, { key: '', value: '' }]);
  const removeHeader = (i: number) => setHeaders(headers.filter((_, idx) => idx !== i));
  const updateHeader = (i: number, field: keyof Header, val: string) => {
    const newHeaders = [...headers];
    newHeaders[i][field] = val;
    setHeaders(newHeaders);
  };

  const generateCurl = () => {
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
  };

  const curlCode = generateCurl();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(curlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
      <div className="space-y-6">
        <Card className="rounded-[2rem] border-muted-foreground/10 bg-card/50 backdrop-blur-md overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Globe className="h-4 w-4" />
              {t('endpoint')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger className="w-full md:w-[140px] h-12 rounded-xl bg-muted/30 border-muted-foreground/10 font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map(m => (
                    <SelectItem key={m} value={m} className="font-bold">{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input 
                value={url} 
                onChange={(e) => setUrl(e.target.value)} 
                placeholder="URL" 
                className="flex-1 h-12 rounded-xl bg-muted/30 border-muted-foreground/10 font-mono"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="rounded-[2rem] border-muted-foreground/10 bg-card/50 backdrop-blur-md overflow-hidden flex flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Headers</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-3">
              {headers.map((h, i) => (
                <div key={i} className="flex gap-2">
                  <Input 
                    value={h.key} 
                    onChange={(e) => updateHeader(i, 'key', e.target.value)} 
                    placeholder={t('key')}
                    className="h-10 rounded-lg bg-muted/30 border-muted-foreground/10 text-xs font-mono"
                  />
                  <Input 
                    value={h.value} 
                    onChange={(e) => updateHeader(i, 'value', e.target.value)} 
                    placeholder={t('value')}
                    className="h-10 rounded-lg bg-muted/30 border-muted-foreground/10 text-xs font-mono"
                  />
                  <Button variant="ghost" size="icon" onClick={() => removeHeader(i)} className="h-10 w-10 shrink-0">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addHeader} className="w-full rounded-lg border-dashed border-muted-foreground/20 gap-2">
                <Plus className="h-3 w-3" />
                {t('addHeader')}
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-muted-foreground/10 bg-card/50 backdrop-blur-md overflow-hidden flex flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Body</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <Textarea 
                value={body} 
                onChange={(e) => setBody(e.target.value)}
                placeholder='{"foo": "bar"}'
                className="min-h-[200px] font-mono text-sm p-4 bg-muted/30 rounded-2xl border-none focus-visible:ring-0"
                disabled={method === 'GET'}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="rounded-[2rem] border-muted-foreground/10 bg-card/50 backdrop-blur-md relative overflow-hidden flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              Generated Curl
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={copyToClipboard} title={tCommon('copy')} className="rounded-xl">
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </CardHeader>
          <CardContent className="flex-1 p-4 pt-0">
            <pre className="h-[300px] p-4 rounded-2xl bg-muted/30 font-mono text-xs overflow-auto border border-muted-foreground/5 whitespace-pre-wrap break-all leading-relaxed">
              {curlCode}
            </pre>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-muted-foreground/10 bg-card/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-primary" />
              Formatting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{t('multiline')}</Label>
                <p className="text-[10px] text-muted-foreground">{t('multilineDesc')}</p>
              </div>
              <Switch checked={pretty} onCheckedChange={setPretty} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
