'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Check, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';

export function JwtDecoderClient() {
  const t = useTranslations('tools.jwt-decoder');
  const tCommon = useTranslations('common');
  const [token, setToken] = useState('');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<'header' | 'payload' | null>(null);

  useEffect(() => {
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

      const decodedHeader = JSON.parse(atob(parts[0]));
      const decodedPayload = JSON.parse(atob(parts[1]));

      setHeader(JSON.stringify(decodedHeader, null, 2));
      setPayload(JSON.stringify(decodedPayload, null, 2));
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setHeader('');
      setPayload('');
    }
  }, [token, t]);

  const copyToClipboard = (text: string, type: 'header' | 'payload') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-[2rem] border-muted-foreground/10 bg-card/50 backdrop-blur-md overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{t('input')}</CardTitle>
            {error ? (
              <Badge variant="destructive" className="gap-1 px-2 py-0.5">
                <ShieldAlert className="h-3 w-3" />
                {t('invalidToken')}
              </Badge>
            ) : token && (
              <Badge variant="secondary" className="gap-1 px-2 py-0.5 bg-green-500/10 text-green-500 border-green-500/20">
                <ShieldCheck className="h-3 w-3" />
                {t('structureOk')}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <Textarea
            placeholder={t('placeholder')}
            className="min-h-[120px] font-mono text-sm resize-none border-none focus-visible:ring-0 p-4 bg-muted/30 rounded-2xl"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-[2rem] border-muted-foreground/10 bg-card/50 backdrop-blur-md relative overflow-hidden flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{t('header')}</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => copyToClipboard(header, 'header')} 
              disabled={!header}
              className="rounded-xl h-8 gap-2"
            >
              {copiedType === 'header' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              {tCommon('copy')}
            </Button>
          </CardHeader>
          <CardContent className="flex-1 p-4 pt-0">
            <pre className="h-[300px] font-mono text-sm p-4 bg-muted/30 rounded-2xl overflow-auto whitespace-pre-wrap break-all">
              {header || (error ? `${tCommon('error')}: ${error}` : t('decodedHeader'))}
            </pre>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-muted-foreground/10 bg-card/50 backdrop-blur-md relative overflow-hidden flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{t('payload')}</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => copyToClipboard(payload, 'payload')} 
              disabled={!payload}
              className="rounded-xl h-8 gap-2"
            >
              {copiedType === 'payload' ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              {tCommon('copy')}
            </Button>
          </CardHeader>
          <CardContent className="flex-1 p-4 pt-0">
            <pre className="h-[300px] font-mono text-sm p-4 bg-muted/30 rounded-2xl overflow-auto whitespace-pre-wrap break-all">
              {payload || (error ? `${tCommon('error')}: ${error}` : t('decodedPayload'))}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
