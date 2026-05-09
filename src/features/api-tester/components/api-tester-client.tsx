'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Send, Settings2, Code, History, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Header {
  key: string;
  value: string;
  enabled: boolean;
}

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
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-[2rem] border-muted-foreground/10 bg-card/50 backdrop-blur-md overflow-hidden">
        <CardContent className="p-4 pt-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger className="w-full md:w-[140px] h-14 rounded-2xl bg-muted/30 border-muted-foreground/10 text-lg font-bold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                {['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'].map(m => (
                  <SelectItem key={m} value={m} className="font-bold">{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex-1 relative group">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                className="h-14 pl-12 text-lg rounded-2xl bg-muted/30 border-muted-foreground/10 focus-visible:ring-primary shadow-sm" 
                placeholder={t('url')} 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <Button 
              onClick={sendRequest} 
              disabled={loading}
              className="h-14 px-8 rounded-2xl gap-2 text-lg font-bold shadow-lg shadow-primary/20"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
              {loading ? t('sending') : t('send')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <Tabs defaultValue="headers" className="space-y-6">
          <TabsList className="bg-muted/50 p-1 rounded-2xl border border-muted-foreground/5 h-12">
            <TabsTrigger value="headers" className="rounded-xl px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              {t('headers')}
              <Badge variant="secondary" className="ml-2 bg-primary/5 text-primary border-none">{headers.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="body" className="rounded-xl px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              {t('body')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="headers">
            <Card className="rounded-[2rem] border-muted-foreground/10 bg-card/50 backdrop-blur-md">
              <CardContent className="p-4 space-y-4">
                {headers.map((header, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <Input 
                      placeholder="Header" 
                      value={header.key}
                      onChange={(e) => updateHeader(i, 'key', e.target.value)}
                      className="rounded-xl bg-muted/30 border-muted-foreground/10"
                    />
                    <Input 
                      placeholder="Value" 
                      value={header.value}
                      onChange={(e) => updateHeader(i, 'value', e.target.value)}
                      className="rounded-xl bg-muted/30 border-muted-foreground/10"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeHeader(i)}
                      className="rounded-xl hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addHeader} className="rounded-xl gap-2 w-full border-dashed border-muted-foreground/20">
                  <Plus className="h-4 w-4" />
                  {t('addHeader')}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="body">
            <Card className="rounded-[2rem] border-muted-foreground/10 bg-card/50 backdrop-blur-md">
              <CardContent className="p-4">
                <Textarea
                  placeholder='{"key": "value"}'
                  className="min-h-[300px] font-mono text-sm resize-none border-none focus-visible:ring-0 p-4 bg-muted/30 rounded-2xl"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  disabled={method === 'GET'}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="rounded-[2rem] border-muted-foreground/10 bg-card/50 backdrop-blur-md overflow-hidden flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{t('response')}</CardTitle>
            {response && (
              <div className="flex gap-2">
                <Badge variant={response.status < 400 ? 'secondary' : 'destructive'} className="rounded-lg">
                  {response.status || 'ERR'}
                </Badge>
                {response.time && (
                  <Badge variant="outline" className="rounded-lg font-mono">
                    {response.time}ms
                  </Badge>
                )}
              </div>
            )}
          </CardHeader>
          <CardContent className="flex-1 p-4 pt-0 overflow-hidden">
            <pre className="h-[500px] font-mono text-xs p-4 bg-muted/30 rounded-2xl overflow-auto border border-muted-foreground/5 whitespace-pre-wrap break-all">
              {response ? JSON.stringify(response.data, null, 2) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4 text-center px-8">
                  <Send className="h-10 w-10 opacity-20" />
                  <p>{t('responsePlaceholder')}</p>
                </div>
              )}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
