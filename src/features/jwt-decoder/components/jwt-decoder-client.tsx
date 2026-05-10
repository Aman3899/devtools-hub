'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Copy, Trash2, Download, ShieldCheck, ShieldAlert, FileJson, RefreshCw, Settings2, Info, Timer } from 'lucide-react';
import { toast } from 'sonner';
import { ToolNavigation } from '@/components/tool-navigation';
import { cn } from '@/lib/utils';

export function JwtDecoderClient() {
  const t = useTranslations('tools.jwt-decoder');
  const commonT = useTranslations('common');
  const [token, setToken] = useState('');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [expiry, setExpiry] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<string>('');

  
  const decodeToken = useCallback(() => {
    if (!token.trim()) {
      setHeader('');
      setPayload('');
      setError(null);
      setExpiry(null);
      return;
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error(t('invalid_jwt_for'));
      }

      const decodedHeader = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
      const decodedPayload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

      setHeader(JSON.stringify(decodedHeader, null, 2));
      setPayload(JSON.stringify(decodedPayload, null, 2));
      setError(null);

      if (decodedPayload.exp) {
        setExpiry(decodedPayload.exp * 1000);
      } else {
        setExpiry(null);
      }
    } catch (e: any) {
      setError(t('invalid_token_s'));
      setHeader('');
      setPayload('');
      setExpiry(null);
    }
  }, [token]);

  useEffect(() => {
    decodeToken();
  }, [decodeToken]);

  useEffect(() => {
    if (!expiry) {
      setCountdown('');
      return;
    }

    const updateCountdown = () => {
      const now = Date.now();
      const diff = expiry - now;

      if (diff <= 0) {
        setCountdown(t('expired'));
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / 1000 / 60) % 60);
      const secs = Math.floor((diff / 1000) % 60);

      const parts = [];
      if (days > 0) parts.push(`${days}d`);
      if (hours > 0) parts.push(`${hours}h`);
      if (mins > 0) parts.push(`${mins}m`);
      parts.push(`${secs}s`);

      setCountdown(parts.join(' '));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [expiry]);

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
    // A sample token with expiry 1 year in future
    const samplePayload = {
      sub: "1234567890",
      name: "John Doe",
      iat: 1516239022,
      exp: Math.floor(Date.now() / 1000) + 31536000
    };
    const sampleToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify(samplePayload))}.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`;
    setToken(sampleToken);
    toast.success(commonT('success'));
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 space-y-4">
          {/* Input Area */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-4">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('input')}</Label>
                {error ? (
                  <Badge variant="destructive" className="gap-1 h-5 text-[9px] px-1.5">
                    <ShieldAlert className="h-3 w-3" />
                    {t('invalid_token')}
                  </Badge>
                ) : token && (
                  <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20 gap-1 h-5 text-[9px] px-1.5">
                    <ShieldCheck className="h-3 w-3" />
                    {t('valid_structure')}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={loadSample} className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground">
                  <RefreshCw className="h-3 w-3" />
                  {t('sample')}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setToken('')} title={commonT('clear')} className="h-6 w-6 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <Card className="flex flex-col border border-border shadow-none rounded-md overflow-hidden bg-background focus-within:border-foreground/20 transition-colors">
              <Textarea
                placeholder={t('paste_your_jwt')}
                className="min-h-[150px] font-mono text-xs resize-none border-none focus-visible:ring-0 p-3 bg-transparent leading-relaxed break-all"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Header Output */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-1">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('header')}</Label>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleDownload(header, 'header.json')} disabled={!header} className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground">
                    <Download className="h-3 w-3" />
                    JSON
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleCopy(header)} disabled={!header} className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground">
                    <Copy className="h-3 w-3" />
                    {commonT('copy')}
                  </Button>
                </div>
              </div>
              <Card className="flex flex-col h-[300px] border border-border shadow-none rounded-md overflow-hidden bg-muted/20 relative">
                {header ? (
                  <pre className="flex-1 font-mono text-xs p-3 overflow-auto whitespace-pre-wrap break-all leading-relaxed text-foreground text-[#e06c75]">
                    {header}
                  </pre>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground opacity-30">
                    <FileJson className="h-8 w-8 mb-2" />
                    <p className="text-[10px]">{t('decodedHeader') || 'Decoded Header'}</p>
                  </div>
                )}
              </Card>
            </div>

            {/* Payload Output */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-1">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('payload')}</Label>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleDownload(payload, 'payload.json')} disabled={!payload} className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground">
                    <Download className="h-3 w-3" />
                    JSON
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleCopy(payload)} disabled={!payload} className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground">
                    <Copy className="h-3 w-3" />
                    {commonT('copy')}
                  </Button>
                </div>
              </div>
              <Card className="flex flex-col h-[300px] border border-border shadow-none rounded-md overflow-hidden bg-muted/20 relative">
                {payload ? (
                  <pre className="flex-1 font-mono text-xs p-3 overflow-auto whitespace-pre-wrap break-all leading-relaxed text-foreground text-[#98c379]">
                    {payload}
                  </pre>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground opacity-30">
                    <FileJson className="h-8 w-8 mb-2" />
                    <p className="text-[10px]">{t('decodedPayload') || 'Decoded Payload'}</p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="border border-border shadow-none rounded-md bg-background">
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-xs font-semibold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings2 className="h-3.5 w-3.5" />
                  {t('token_info')}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-6">
              
              <div className="space-y-2">
                <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{t('expiry_status')}</Label>
                <div className="p-3 bg-muted/30 border border-border rounded-md flex flex-col items-center justify-center gap-2 min-h-[80px]">
                  {expiry ? (
                    <>
                      <Timer className={cn("h-6 w-6", countdown === 'Expired' || countdown === 'میعاد ختم' ? "text-destructive" : "text-green-500")} />
                      <span className={cn("font-mono text-sm font-bold", countdown === 'Expired' || countdown === 'میعاد ختم' ? "text-destructive" : "text-foreground")}>
                        {countdown}
                      </span>
                      <span className="text-[9px] text-muted-foreground">
                        {new Date(expiry).toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">{t('no_expiry_claim')}</span>
                  )}
                </div>
              </div>

              <div className="p-3 rounded-md bg-muted/50 border border-border space-y-1.5">
                <div className="flex items-center gap-2 text-[10px] font-semibold text-foreground uppercase tracking-tight">
                  <Info className="h-3 w-3" />
                  {t('important_note')}
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  {t('decoding_a_jwt')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ToolNavigation currentToolId="jwt-decoder" />
    </div>
  );
}
