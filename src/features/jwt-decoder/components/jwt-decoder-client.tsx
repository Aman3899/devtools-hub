'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Copy, Trash2, Download, ShieldCheck, ShieldAlert, FileJson, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { ToolNavigation } from '@/components/tool-navigation';

export function JwtDecoderClient() {
  const t = useTranslations('tools.jwt-decoder');
  const commonT = useTranslations('common');
  const [token, setToken] = useState('');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [error, setError] = useState<string | null>(null);

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

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(commonT('copied'));
  };

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadSample = () => {
    setToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
    toast.success(commonT('success'));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Label htmlFor="token-input">{t('input')}</Label>
              {error ? (
                <Badge variant="destructive" className="gap-1">
                  <ShieldAlert className="h-3 w-3" />
                  {t('invalidToken')}
                </Badge>
              ) : token && (
                <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20 gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  {t('structureOk')}
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={loadSample}>
                <RefreshCw className="h-4 w-4 mr-2" />
                {commonT('loadSample')}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setToken('')} disabled={!token}>
                <Trash2 className="h-4 w-4 mr-2" />
                {commonT('clear')}
              </Button>
            </div>
          </div>
          <Textarea
            id="token-input"
            placeholder={t('placeholder')}
            className="min-h-[120px] font-mono text-xs resize-none"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <Label>{t('header')}</Label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleDownload(header, 'header.json')} disabled={!header}>
                  <Download className="h-3 w-3 mr-2" />
                  JSON
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleCopy(header)} disabled={!header}>
                  <Copy className="h-3 w-3 mr-2" />
                  {commonT('copy')}
                </Button>
              </div>
            </div>
            <div className="relative min-h-[300px] rounded-md border bg-muted/50 p-4 font-mono text-xs overflow-auto">
              {header ? (
                <pre>{header}</pre>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground opacity-50">
                  <FileJson className="h-8 w-8 mb-2" />
                  <p>{t('decodedHeader')}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <Label>{t('payload')}</Label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleDownload(payload, 'payload.json')} disabled={!payload}>
                  <Download className="h-3 w-3 mr-2" />
                  JSON
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleCopy(payload)} disabled={!payload}>
                  <Copy className="h-3 w-3 mr-2" />
                  {commonT('copy')}
                </Button>
              </div>
            </div>
            <div className="relative min-h-[300px] rounded-md border bg-muted/50 p-4 font-mono text-xs overflow-auto">
              {payload ? (
                <pre>{payload}</pre>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground opacity-50">
                  <FileJson className="h-8 w-8 mb-2" />
                  <p>{t('decodedPayload')}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      <ToolNavigation currentToolId="jwt-decoder" />
    </div>
  );
}
