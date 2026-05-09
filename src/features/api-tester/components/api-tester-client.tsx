"use client"

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Send, Settings2, Code, History, Globe, Download, Copy, Check, Info, Share2, Activity, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface Header {
  key: string;
  value: string;
  enabled: boolean;
}

import { ToolNavigation } from '@/components/tool-navigation';

export function ApiTesterClient() {
  const t = useTranslations('tools.api-tester');
  const tCommon = useTranslations('common');
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts/1');
  const [body, setBody] = useState('');
  const [headers, setHeaders] = useState<Header[]>([
    { key: 'Content-Type', value: 'application/json', enabled: true }
  ]);
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const isEnglish = tCommon('hero.searchPlaceholder' as any) === 'Find a tool...';

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '', enabled: true }]);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const updateHeader = (index: number, field: keyof Header, value: any) => {
    const newHeaders = [...headers];
    (newHeaders[index] as any)[field] = value;
    setHeaders(newHeaders);
  };

  const sendRequest = async () => {
    setLoading(true);
    setResponse(null);
    try {
      const headerObj = headers
        .filter(h => h.enabled && h.key)
        .reduce((acc, h) => ({ ...acc, [h.key]: h.value }), {});

      const start = performance.now();
      const res = await axios({
        method,
        url,
        headers: headerObj,
        data: method !== 'GET' ? (body ? JSON.parse(body) : undefined) : undefined,
      });
      const end = performance.now();

      setResponse({
        status: res.status,
        statusText: res.statusText,
        time: Math.round(end - start),
        headers: res.headers,
        data: res.data,
      });
    } catch (e: any) {
      setResponse({
        error: e.message,
        status: e.response?.status,
        data: e.response?.data,
        time: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadResponse = () => {
    const content = JSON.stringify(response?.data, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `response-${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const copyAsCurl = () => {
    let curl = `curl -X ${method} "${url}"`;
    headers.filter(h => h.enabled && h.key).forEach(h => {
      curl += ` -H "${h.key}: ${h.value}"`;
    });
    if (body && method !== 'GET') {
      curl += ` -d '${body}'`;
    }
    navigator.clipboard.writeText(curl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-12">
          <Card className="border border-border shadow-none rounded-md bg-background overflow-hidden p-2">
            <div className="flex flex-col md:flex-row gap-2">
              <Select value={method} onValueChange={(v) => v && setMethod(v)}>
                <SelectTrigger className="w-full md:w-[120px] h-9 text-xs font-bold bg-muted/30 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'].map(m => (
                    <SelectItem key={m} value={m} className="text-xs font-bold">{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex-1 relative flex items-center">
                <Globe className="absolute left-3 h-3.5 w-3.5 text-muted-foreground" />
                <Input 
                  className="h-9 pl-9 text-xs font-mono bg-muted/30 border-border focus-visible:ring-0 shadow-none" 
                  placeholder="https://api.example.com/v1/resource" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              <Button 
                onClick={sendRequest} 
                disabled={loading}
                className="h-9 px-6 text-xs font-bold gap-2 min-w-[100px]"
              >
                {loading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                {loading ? (isEnglish ? 'Sending...' : 'بھیج رہا ہے...') : t('send')}
              </Button>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <Tabs defaultValue="headers" className="space-y-4">
            <TabsList className="bg-muted/50 p-0.5 border border-border h-9">
              <TabsTrigger value="headers" className="h-8 text-xs px-4 data-[state=active]:bg-background data-[state=active]:shadow-none">
                {t('headers')}
                <Badge variant="outline" className="ml-2 h-4 px-1 rounded-sm text-[9px] bg-foreground/5">{headers.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="body" className="h-8 text-xs px-4 data-[state=active]:bg-background data-[state=active]:shadow-none">
                {t('body')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="headers" className="m-0">
              <Card className="border border-border shadow-none rounded-md bg-background">
                <CardContent className="p-3 space-y-2">
                  <div className="grid grid-cols-12 gap-2 px-1 mb-1">
                    <div className="col-span-5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{isEnglish ? 'Key' : 'کی'}</div>
                    <div className="col-span-6 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{isEnglish ? 'Value' : 'ویلیو'}</div>
                  </div>
                  {headers.map((header, i) => (
                    <div key={i} className="grid grid-cols-12 gap-2 items-center group">
                      <div className="col-span-5">
                        <Input 
                          placeholder={isEnglish ? 'Header' : 'ہیڈر'} 
                          value={header.key}
                          onChange={(e) => updateHeader(i, 'key', e.target.value)}
                          className="h-8 text-[11px] font-mono bg-muted/20 border-border shadow-none"
                        />
                      </div>
                      <div className="col-span-6">
                        <Input 
                          placeholder={isEnglish ? 'Value' : 'ویلیو'} 
                          value={header.value}
                          onChange={(e) => updateHeader(i, 'value', e.target.value)}
                          className="h-8 text-[11px] font-mono bg-muted/20 border-border shadow-none"
                        />
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeHeader(i)}
                          className="h-7 w-7 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" onClick={addHeader} className="h-7 text-[10px] gap-1.5 w-full border border-dashed border-border hover:bg-muted/50 mt-2">
                    <Plus className="h-3 w-3" />
                    {isEnglish ? 'Add New Header' : 'نیا ہیڈر شامل کریں'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="body" className="m-0">
              <Card className="border border-border shadow-none rounded-md bg-background overflow-hidden">
                <Textarea
                  placeholder='{"key": "value"}'
                  className="min-h-[250px] font-mono text-xs resize-none border-none focus-visible:ring-0 p-3 bg-transparent leading-relaxed"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  disabled={method === 'GET'}
                />
              </Card>
            </TabsContent>
          </Tabs>

          <div className="p-3 rounded-md bg-muted/30 border border-border flex gap-2.5 items-start">
            <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-[10px] text-muted-foreground leading-normal">
              {t('article').split('.')[1]}.
            </p>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('response')}</Label>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={copyAsCurl} 
                  className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copied ? <Check className="h-3 w-3 text-green-500" /> : <Code className="h-3 w-3" />}
                  cURL
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={downloadResponse} 
                  disabled={!response}
                  className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {downloaded ? <Check className="h-3 w-3 text-green-500" /> : <Download className="h-3 w-3" />}
                  {isEnglish ? 'Export' : 'ایکسپورٹ'}
                </Button>
              </div>
            </div>
            
            <Card className="border border-border shadow-none rounded-md bg-background overflow-hidden flex flex-col h-[400px]">
              <CardHeader className="py-2 px-3 border-b bg-muted/30 flex flex-row items-center justify-between space-y-0 h-9">
                <div className="flex items-center gap-2">
                  <Activity className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-tight">{isEnglish ? 'Output' : 'آؤٹ پٹ'}</span>
                </div>
                {response && (
                  <div className="flex gap-2">
                    <Badge variant="outline" className={cn(
                      "h-5 px-1.5 rounded-sm text-[9px] font-bold border-none",
                      response.status < 400 ? "bg-green-500/10 text-green-600" : "bg-destructive/10 text-destructive"
                    )}>
                      {response.status || 'ERR'} {response.statusText}
                    </Badge>
                    {response.time > 0 && (
                      <Badge variant="outline" className="h-5 px-1.5 rounded-sm text-[9px] font-mono border-none bg-foreground/5">
                        {response.time}ms
                      </Badge>
                    )}
                  </div>
                )}
              </CardHeader>
              <CardContent className="p-0 overflow-hidden flex-1">
                <div className="h-full font-mono text-xs p-3 overflow-auto bg-muted/10 leading-relaxed">
                  {response ? (
                    <pre className="text-foreground whitespace-pre-wrap break-all">
                      {JSON.stringify(response.data, null, 2)}
                    </pre>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-3 opacity-50">
                      <Send className="h-8 w-8" />
                      <p className="text-[10px] font-medium tracking-tight uppercase">{t('responsePlaceholder')}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border border-border shadow-none rounded-md bg-background">
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-xs font-semibold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="h-3.5 w-3.5" />
                  {isEnglish ? 'Quick Presets' : 'فوری پری سیٹس'}
                </div>
                <Share2 className="h-3 w-3 text-muted-foreground hover:text-foreground cursor-pointer" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              {[
                { name: 'JSONPlaceholder Post', method: 'GET', url: 'https://jsonplaceholder.typicode.com/posts/1' },
                { name: 'GitHub User API', method: 'GET', url: 'https://api.github.com/users/octocat' },
                { name: 'Dummy Auth Login', method: 'POST', url: 'https://dummyjson.com/auth/login' }
              ].map((preset, i) => (
                <Button 
                  key={i} 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => { setMethod(preset.method); setUrl(preset.url); }}
                  className="w-full h-8 justify-start text-[10px] font-medium border border-border/50 hover:bg-muted/50"
                >
                  <Badge variant="outline" className="mr-2 h-4 px-1 rounded-sm text-[8px] bg-foreground/5">{preset.method}</Badge>
                  {preset.name}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <ToolNavigation currentToolId="api-tester" />
    </div>
  );
}
