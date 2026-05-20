"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Send, Code, History, Globe, Download, Check, Info, Share2, Activity, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { useLanguage } from '@/hooks/tool';

interface Header { key: string; value: string; enabled: boolean; }

export function ApiTesterClient() {
  const t = useTranslations('tools.api-tester');
  const tCommon = useTranslations('common');
  const { copiedType, copyToClipboard } = useCopyToClipboard();

  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts/1');
  const [body, setBody] = useState('');
  const [headers, setHeaders] = useState<Header[]>([{ key: 'Content-Type', value: 'application/json', enabled: true }]);
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const { isEnglish } = useLanguage();

  const sendRequest = async () => {
    setLoading(true); setResponse(null);
    try {
      const headerObj = headers.filter(h => h.enabled && h.key).reduce((acc, h) => ({ ...acc, [h.key]: h.value }), {});
      const start = performance.now();
      const res = await axios({ method, url, headers: headerObj, data: method !== 'GET' ? (body ? JSON.parse(body) : undefined) : undefined });
      const end = performance.now();
      setResponse({ status: res.status, statusText: res.statusText, time: Math.round(end - start), headers: res.headers, data: res.data });
    } catch (e: any) {
      setResponse({ error: e.message, status: e.response?.status, data: e.response?.data, time: 0 });
    } finally {
      setLoading(false);
    }
  };

  const getCurl = () => {
    let curl = `curl -X ${method} "${url}"`;
    headers.filter(h => h.enabled && h.key).forEach(h => { curl += ` -H "${h.key}: ${h.value}"`; });
    if (body && method !== 'GET') curl += ` -d '${body}'`;
    return curl;
  };

  const downloadResponse = () => {
    const content = JSON.stringify(response?.data, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const u = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = u; a.download = `response-${new Date().getTime()}.json`; a.click();
    URL.revokeObjectURL(u);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div className="space-y-6">
      <ToolCard title="Request Configuration" icon={Globe} contentClassName="p-2">
        <div className="flex flex-col md:flex-row gap-2">
          <Select value={method} onValueChange={(v) => v && setMethod(v)}>
            <SelectTrigger className="w-full md:w-[120px] h-9 text-xs font-bold bg-muted/30 border-border"><SelectValue /></SelectTrigger>
            <SelectContent>
              {['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'].map(m => <SelectItem key={m} value={m} className="text-xs font-bold">{m}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex-1 relative flex items-center">
            <Globe className="absolute left-3 h-3.5 w-3.5 text-muted-foreground" />
            <Input className="h-9 pl-9 text-xs font-mono bg-muted/30 border-border focus-visible:ring-0 shadow-none" placeholder="https://api.example.com/v1/resource" value={url} onChange={(e) => setUrl(e.target.value)} />
          </div>
          <Button onClick={sendRequest} disabled={loading} className="h-9 px-6 text-xs font-bold gap-2 min-w-[100px]">
            {loading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            {loading ? (isEnglish ? 'Sending...' : 'بھیج رہا ہے...') : t('send')}
          </Button>
        </div>
      </ToolCard>

      <div className="grid gap-6 md:grid-cols-12 items-start">
        <div className="md:col-span-7 space-y-4">
          <Tabs defaultValue="headers" className="space-y-4">
            <TabsList className="bg-muted/50 p-0.5 border border-border h-9">
              <TabsTrigger value="headers" className="h-8 text-xs px-4">{t('headers')}<Badge variant="outline" className="ml-2 h-4 px-1 rounded-sm text-[9px]">{headers.length}</Badge></TabsTrigger>
              <TabsTrigger value="body" className="h-8 text-xs px-4">{t('body')}</TabsTrigger>
            </TabsList>

            <TabsContent value="headers" className="m-0">
              <ToolCard title="Headers" contentClassName="p-3 space-y-2">
                <div className="grid grid-cols-12 gap-2 px-1 mb-1">
                  <div className="col-span-5 text-[10px] font-semibold text-muted-foreground uppercase">{isEnglish ? 'Key' : 'کی'}</div>
                  <div className="col-span-6 text-[10px] font-semibold text-muted-foreground uppercase">{isEnglish ? 'Value' : 'ویلیو'}</div>
                </div>
                {headers.map((h, i) => (
                  <div key={i} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-5"><Input placeholder="Key" value={h.key} onChange={(e) => { const n=[...headers]; n[i].key=e.target.value; setHeaders(n); }} className="h-8 text-[11px] font-mono" /></div>
                    <div className="col-span-6"><Input placeholder="Value" value={h.value} onChange={(e) => { const n=[...headers]; n[i].value=e.target.value; setHeaders(n); }} className="h-8 text-[11px] font-mono" /></div>
                    <div className="col-span-1 flex justify-end"><Button variant="ghost" size="icon" onClick={() => setHeaders(headers.filter((_, idx) => idx !== i))} className="h-7 w-7 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button></div>
                  </div>
                ))}
                <Button variant="ghost" size="sm" onClick={() => setHeaders([...headers, { key: '', value: '', enabled: true }])} className="h-7 text-[10px] gap-1.5 w-full border border-dashed hover:bg-muted/50 mt-2"><Plus className="h-3 w-3" />{isEnglish ? 'Add Header' : 'ہیڈر شامل کریں'}</Button>
              </ToolCard>
            </TabsContent>

            <TabsContent value="body" className="m-0">
              <ToolCard title="Body Content" contentClassName="p-0">
                <Textarea placeholder='{"key": "value"}' className="min-h-[250px] font-mono text-xs resize-none border-none p-4" value={body} onChange={(e) => setBody(e.target.value)} disabled={method === 'GET'} />
              </ToolCard>
            </TabsContent>
          </Tabs>

          <div className="p-3 rounded-md bg-muted/30 border border-border flex gap-2.5 items-start">
            <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-[10px] text-muted-foreground leading-normal">{t('article').split('.')[1]}.</p>
          </div>
        </div>

        <div className="md:col-span-5 space-y-4">
          <ToolCard 
            title={t('response')}
            action={
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(getCurl(), 'curl')} className="h-6 px-2 text-[10px] gap-1.5">{copiedType === 'curl' ? <Check className="h-3 w-3 text-green-500" /> : <Code className="h-3 w-3" />} cURL</Button>
                <Button variant="ghost" size="sm" onClick={downloadResponse} disabled={!response} className="h-6 px-2 text-[10px] gap-1.5">{downloaded ? <Check className="h-3 w-3 text-green-500" /> : <Download className="h-3 w-3" />} {isEnglish ? 'Export' : 'ایکسپورٹ'}</Button>
              </div>
            }
            contentClassName="p-0 flex flex-col h-[400px]"
          >
            <div className="py-2 px-3 border-b bg-muted/30 flex items-center justify-between h-9">
              <div className="flex items-center gap-2"><Activity className="h-3 w-3 text-muted-foreground" /><span className="text-[10px] font-semibold text-muted-foreground uppercase">{isEnglish ? 'Output' : 'آؤٹ پٹ'}</span></div>
              {response && (
                <div className="flex gap-2">
                  <Badge variant="outline" className={cn("h-5 px-1.5 rounded-sm text-[9px] font-bold border-none", response.status < 400 ? "bg-green-500/10 text-green-600" : "bg-destructive/10 text-destructive")}>{response.status || 'ERR'} {response.statusText}</Badge>
                  {response.time > 0 && <Badge variant="outline" className="h-5 px-1.5 rounded-sm text-[9px] font-mono border-none bg-foreground/5">{response.time}ms</Badge>}
                </div>
              )}
            </div>
            <div className="h-full font-mono text-xs p-3 overflow-auto bg-muted/10 leading-relaxed">
              {response ? <pre className="text-foreground whitespace-pre-wrap break-all">{JSON.stringify(response.data, null, 2)}</pre> : <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-3 opacity-50"><Send className="h-8 w-8" /><p className="text-[10px] font-medium tracking-tight uppercase">{t('responsePlaceholder')}</p></div>}
            </div>
          </ToolCard>

          <ToolCard title={isEnglish ? 'Quick Presets' : 'فوری پری سیٹس'} icon={History} action={<Share2 className="h-3 w-3 text-muted-foreground cursor-pointer" />} contentClassName="p-3 space-y-2">
            {[
              { name: 'JSONPlaceholder Post', method: 'GET', url: 'https://jsonplaceholder.typicode.com/posts/1' },
              { name: 'GitHub User API', method: 'GET', url: 'https://api.github.com/users/octocat' },
              { name: 'Dummy Auth Login', method: 'POST', url: 'https://dummyjson.com/auth/login' }
            ].map((preset, i) => (
              <Button key={i} variant="ghost" size="sm" onClick={() => { setMethod(preset.method); setUrl(preset.url); }} className="w-full h-8 justify-start text-[10px] font-medium border border-border/50 hover:bg-muted/50"><Badge variant="outline" className="mr-2 h-4 px-1 rounded-sm text-[8px] bg-foreground/5">{preset.method}</Badge>{preset.name}</Button>
            ))}
          </ToolCard>
        </div>
      </div>
    </div>
  );
}
