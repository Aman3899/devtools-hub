'use client';

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Trash2, Settings2, Info, Check, Link as LinkIcon, Hash, Globe, Server, List } from 'lucide-react';
import { ToolNavigation } from '@/components/tool-navigation';

interface ParsedUrl {
  protocol?: string;
  host?: string;
  port?: string;
  path?: string;
  hash?: string;
  params?: Record<string, string>;
  origin?: string;
  username?: string;
  password?: string;
  error?: string;
}

export function UrlParserClient() {
  const t = useTranslations('tools.url-parser');
  const commonT = useTranslations('common');
  
  const [input, setInput] = useState('https://user:pass@example.com:8080/path/to/resource?query=1&name=dev#section-1');
  const [parsed, setParsed] = useState<ParsedUrl>({});
  const [copied, setCopied] = useState(false);

  const parseUrl = useCallback(() => {
    if (!input.trim()) {
      setParsed({});
      return;
    }

    try {
      const url = new URL(input);
      const params: Record<string, string> = {};
      url.searchParams.forEach((val, key) => {
        params[key] = val;
      });

      setParsed({
        protocol: url.protocol,
        host: url.hostname,
        port: url.port || (url.protocol === 'https:' ? '443' : '80'),
        path: url.pathname,
        hash: url.hash,
        params: params,
        origin: url.origin,
        username: url.username,
        password: url.password,
      });
    } catch (e) {
      setParsed({ error: t('invalid') });
    }
  }, [input]);

  useEffect(() => {
    parseUrl();
  }, [parseUrl]);

  const handleClear = () => {
    setInput('');
    setParsed({});
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(parsed, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 grid gap-4 md:grid-cols-2">
          {/* Form Area */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{commonT('input')}</Label>
              </div>
              <Button variant="ghost" size="icon" onClick={handleClear} title={commonT('clear')} className="h-6 w-6 text-muted-foreground hover:text-destructive">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            <Card className="border border-border shadow-none rounded-md p-4 bg-background">
              <Textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('placeholder')}
                className="h-32 text-xs font-mono resize-none"
              />
            </Card>
          </div>

          {/* Result Area */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{commonT('ui.result')}</Label>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={copyToClipboard}
                disabled={!input || !!parsed.error}
                className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                {commonT('copy')}
              </Button>
            </div>
            <Card className="flex flex-col border border-border shadow-none rounded-md bg-muted/20 overflow-hidden min-h-[300px]">
              <div className="flex-1 overflow-auto p-4 space-y-3">
                {parsed.error ? (
                  <div className="h-full flex flex-col items-center justify-center text-destructive gap-2 py-12">
                    <Info className="h-8 w-8 opacity-20" />
                    <p className="text-xs">{parsed.error}</p>
                  </div>
                ) : parsed.protocol ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                       <div className="space-y-1">
                          <Label className="text-[10px] uppercase text-muted-foreground font-bold flex items-center gap-1">
                             <Globe className="h-3 w-3" /> {t('protocol')}
                          </Label>
                          <p className="text-xs font-mono bg-background p-2 rounded border border-border">{parsed.protocol}</p>
                       </div>
                       <div className="space-y-1">
                          <Label className="text-[10px] uppercase text-muted-foreground font-bold flex items-center gap-1">
                             <Server className="h-3 w-3" /> {t('host')}
                          </Label>
                          <p className="text-xs font-mono bg-background p-2 rounded border border-border">{parsed.host}</p>
                       </div>
                       <div className="space-y-1">
                          <Label className="text-[10px] uppercase text-muted-foreground font-bold flex items-center gap-1">
                             <Hash className="h-3 w-3" /> {t('port')}
                          </Label>
                          <p className="text-xs font-mono bg-background p-2 rounded border border-border">{parsed.port}</p>
                       </div>
                       <div className="space-y-1">
                          <Label className="text-[10px] uppercase text-muted-foreground font-bold flex items-center gap-1">
                             <LinkIcon className="h-3 w-3" /> {t('hash')}
                          </Label>
                          <p className="text-xs font-mono bg-background p-2 rounded border border-border">{parsed.hash || '—'}</p>
                       </div>
                    </div>
                    <div className="space-y-1">
                       <Label className="text-[10px] uppercase text-muted-foreground font-bold flex items-center gap-1">
                          <List className="h-3 w-3" /> {t('path')}
                       </Label>
                       <p className="text-xs font-mono bg-background p-2 rounded border border-border break-all">{parsed.path}</p>
                    </div>
                    {parsed.params && Object.keys(parsed.params).length > 0 && (
                      <div className="space-y-1 pt-2">
                        <Label className="text-[10px] uppercase text-muted-foreground font-bold">{t('params')}</Label>
                        <div className="space-y-1.5">
                           {Object.entries(parsed.params).map(([key, val]) => (
                             <div key={key} className="flex items-center gap-2 text-xs font-mono bg-background p-2 rounded border border-border">
                                <span className="text-blue-600 font-bold">{key}:</span>
                                <span className="text-foreground truncate">{val}</span>
                             </div>
                           ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </Card>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="border border-border shadow-none rounded-md bg-background">
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-xs font-semibold flex items-center gap-2">
                <Settings2 className="h-3.5 w-3.5" />
                {commonT('ui.options')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
               <div className="flex flex-col gap-2.5 p-3 rounded-md bg-muted/30 border border-border">
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium uppercase">
                      <Globe className="h-3 w-3" />
                      {t('sidebar_title')}
                  </div>
                  <div className="pt-2 space-y-2">
                   <p className="text-[10px] text-muted-foreground leading-relaxed">
                     {t('sidebar_desc')}
                   </p>
                  </div>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ToolNavigation currentToolId="url-parser" />
    </div>
  );
}
