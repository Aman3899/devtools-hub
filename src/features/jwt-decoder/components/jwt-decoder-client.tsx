"use client"

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ShieldCheck, ShieldAlert, FileJson, Settings2, Timer } from 'lucide-react';
import { ToolCard } from '@/components/layout/tool-card';
import { cn } from '@/lib/utils';
import { CopyButton } from '@/components/common';
import { DownloadButton } from '@/components/common';
import { ToolActions } from '@/components/common';
import { CodeTextarea } from '@/components/common';
import { toast } from 'sonner';

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
  }, [token, t]);

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
  }, [expiry, t]);

  const loadSample = () => {
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
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 space-y-4">
        {/* Input Area */}
        <ToolCard 
          title={
            <div className="flex items-center gap-4">
              {t('input')}
              {error ? (
                <Badge variant="destructive" className="gap-1 h-5 text-[9px] px-1.5"><ShieldAlert className="h-3 w-3" />{t('invalid_token')}</Badge>
              ) : token && (
                <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20 gap-1 h-5 text-[9px] px-1.5"><ShieldCheck className="h-3 w-3" />{t('valid_structure')}</Badge>
              )}
            </div>
          }
          action={
            <ToolActions onSample={loadSample} onClear={() => setToken('')} />
          }
          contentClassName="p-0 flex flex-col"
        >
          <CodeTextarea
            placeholder={t('paste_your_jwt')}
            value={token}
            onChange={(val) => setToken(val)}
          />
        </ToolCard>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Header Output */}
          <ToolCard 
            title={t('header')}
            action={
              <div className="flex items-center gap-1">
                <DownloadButton content={header} filename="header.json" mimeType="application/json" disabled={!header} />
                <CopyButton text={header} type="hdr" disabled={!header} />
              </div>
            }
            contentClassName="p-0 flex flex-col h-[300px] bg-muted/20 relative"
          >
            {header ? (
              <pre className="flex-1 font-mono text-xs p-3 overflow-auto whitespace-pre-wrap break-all leading-relaxed text-[#e06c75] bg-transparent">{header}</pre>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground opacity-30">
                <FileJson className="h-8 w-8 mb-2" />
                <p className="text-[10px]">{t('decodedHeader') || 'Decoded Header'}</p>
              </div>
            )}
          </ToolCard>

          {/* Payload Output */}
          <ToolCard 
            title={t('payload')}
            action={
              <div className="flex items-center gap-1">
                <DownloadButton content={payload} filename="payload.json" mimeType="application/json" disabled={!payload} />
                <CopyButton text={payload} type="pay" disabled={!payload} />
              </div>
            }
            contentClassName="p-0 flex flex-col h-[300px] bg-muted/20 relative"
          >
            {payload ? (
              <pre className="flex-1 font-mono text-xs p-3 overflow-auto whitespace-pre-wrap break-all leading-relaxed text-[#98c379] bg-transparent">{payload}</pre>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground opacity-30">
                <FileJson className="h-8 w-8 mb-2" />
                <p className="text-[10px]">{t('decodedPayload') || 'Decoded Payload'}</p>
              </div>
            )}
          </ToolCard>
        </div>
      </div>

      <div className="md:col-span-1 space-y-4">
        <ToolCard title={t('token_info')} icon={Settings2} contentClassName="p-4 space-y-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{t('expiry_status')}</Label>
            <div className="p-3 bg-muted/30 border border-border rounded-md flex flex-col items-center justify-center gap-2 min-h-[80px]">
              {expiry ? (
                <>
                  <Timer className={cn("h-6 w-6", countdown === 'Expired' || countdown === 'میعاد ختم' ? "text-destructive" : "text-green-500")} />
                  <span className={cn("font-mono text-sm font-bold", countdown === 'Expired' || countdown === 'میعاد ختم' ? "text-destructive" : "text-foreground")}>{countdown}</span>
                  <span className="text-[9px] text-muted-foreground">{new Date(expiry).toLocaleString()}</span>
                </>
              ) : (
                <span className="text-[10px] text-muted-foreground">{t('no_expiry_claim')}</span>
              )}
            </div>
          </div>

          <div className="p-3 rounded-md bg-muted/50 border border-border space-y-1.5">
            <div className="flex items-center gap-2 text-[10px] font-semibold text-foreground uppercase tracking-tight">{t('important_note')}</div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">{t('decoding_a_jwt')}</p>
          </div>
        </ToolCard>
      </div>
    </div>
  );
}
