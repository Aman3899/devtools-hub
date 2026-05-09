"use client"

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Check, ShieldAlert, ShieldCheck, Download, RefreshCw, Share2, Info, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

import { ToolNavigation } from '@/components/tool-navigation';

const SAMPLE_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

export function JwtDecoderClient() {
  const t = useTranslations('tools.jwt-decoder');
  const tCommon = useTranslations('common');
  const [token, setToken] = useState('');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<'header' | 'payload' | 'token' | null>(null);

  const isEnglish = tCommon('hero.searchPlaceholder' as any) === 'Find a tool...';

  const decodeToken = useCallback(() => {
    if (!token.trim()) {
      setHeader('');
      setPayload('');
      setError(null);
      return;
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error(t('invalid'));
      }

      const decodedHeader = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
      const decodedPayload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

      setHeader(JSON.stringify(decodedHeader, null, 2));
      setPayload(JSON.stringify(decodedPayload, null, 2));
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setHeader('');
      setPayload('');
    }
  }, [token, t]);

  useEffect(() => {
    decodeToken();
  }, [decodeToken]);

  const copyToClipboard = (text: string, type: 'header' | 'payload' | 'token') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const downloadPart = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadSample = () => {
    setToken(SAMPLE_JWT);
  };

  return (
    <div className="space-y-12">
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('input')}</Label>
              <div className="flex items-center gap-2">
                {error ? (
                  <Badge variant="destructive" className="h-5 px-1.5 rounded-sm text-[10px] gap-1">
                    <ShieldAlert className="h-3 w-3" />
                    {t('invalidToken')}
                  </Badge>
                ) : token && (
                  <Badge variant="outline" className="h-5 px-1.5 rounded-sm text-[10px] gap-1 bg-green-500/10 text-green-600 border-green-500/20">
                    <ShieldCheck className="h-3 w-3" />
                    {t('structureOk')}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={loadSample} className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                <RefreshCw className="h-3 w-3" />
                {isEnglish ? 'Sample' : 'مثال'}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setToken('')} title={tCommon('clear')} className="h-6 w-6 text-muted-foreground hover:text-destructive">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <Card className="border border-border shadow-none rounded-md overflow-hidden bg-background focus-within:border-foreground/20 transition-colors">
            <Textarea
              placeholder={t('placeholder')}
              className="min-h-[120px] font-mono text-xs resize-none border-none focus-visible:ring-0 p-3 bg-transparent leading-relaxed"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('header')}</Label>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => downloadPart(header, 'jwt-header.json')} 
                  disabled={!header}
                  className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Download className="h-3 w-3" />
                  JSON
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => copyToClipboard(header, 'header')} 
                  disabled={!header}
                  className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copiedType === 'header' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                  {tCommon('copy')}
                </Button>
              </div>
            </div>
            <Card className="border border-border shadow-none rounded-md overflow-hidden bg-muted/20">
              <pre className="h-[350px] font-mono text-xs p-3 overflow-auto whitespace-pre-wrap break-all leading-relaxed">
                {header || (error ? `${tCommon('error')}: ${error}` : t('decodedHeader'))}
              </pre>
            </Card>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('payload')}</Label>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => downloadPart(payload, 'jwt-payload.json')} 
                  disabled={!payload}
                  className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Download className="h-3 w-3" />
                  JSON
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => copyToClipboard(payload, 'payload')} 
                  disabled={!payload}
                  className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copiedType === 'payload' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                  {tCommon('copy')}
                </Button>
              </div>
            </div>
            <Card className="border border-border shadow-none rounded-md overflow-hidden bg-muted/20">
              <pre className="h-[350px] font-mono text-xs p-3 overflow-auto whitespace-pre-wrap break-all leading-relaxed">
                {payload || (error ? `${tCommon('error')}: ${error}` : t('decodedPayload'))}
              </pre>
            </Card>
          </div>
        </div>

        <div className="p-3 rounded-md bg-muted/30 border border-border flex gap-2.5 items-start">
          <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-[10px] text-muted-foreground leading-normal">
            {t('article').split('.')[0]}.
          </p>
        </div>
      </div>
      
      <ToolNavigation currentToolId="jwt-decoder" />
    </div>
  );
}
