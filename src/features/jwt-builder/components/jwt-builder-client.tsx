"use client"

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, Settings2, Key, ShieldPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton } from '@/components/common';
import { CodeTextarea } from '@/components/common';

// Simplified HMAC SHA-256 for browser (for demonstration/utility purposes)
async function signJWT(header: any, payload: any, secret: string) {
  const encHeader = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const encPayload = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const unsignedToken = `${encHeader}.${encPayload}`;

  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const data = encoder.encode(unsignedToken);

  try {
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', cryptoKey, data);
    const signatureBase64Url = btoa(String.fromCharCode(...new Uint8Array(signature)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    return `${unsignedToken}.${signatureBase64Url}`;
  } catch (err) {
    // Fallback if crypto API fails
    return `${unsignedToken}.[signature-generation-failed]`;
  }
}

export function JwtBuilderClient() {
  const t = useTranslations('tools.jwt-builder');
  const commonT = useTranslations('common');
  
  const [headerStr, setHeaderStr] = useState('{\n  "alg": "HS256",\n  "typ": "JWT"\n}');
  const [payloadStr, setPayloadStr] = useState('{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}');
  const [secret, setSecret] = useState('your-256-bit-secret');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const generateToken = useCallback(async () => {
    try {
      const headerObj = JSON.parse(headerStr);
      const payloadObj = JSON.parse(payloadStr);
      setError('');
      
      const token = await signJWT(headerObj, payloadObj, secret);
      setOutput(token);
    } catch (e: any) {
      setError(t('invalid_json_in'));
      setOutput('');
    }
  }, [headerStr, payloadStr, secret, t]);

  useEffect(() => {
    generateToken();
  }, [generateToken]);

  const loadSample = () => {
    setHeaderStr('{\n  "alg": "HS256",\n  "typ": "JWT"\n}');
    setPayloadStr('{\n  "sub": "user_123",\n  "role": "admin",\n  "exp": 1735689600\n}');
    setSecret('my-super-secret-key-2024');
  };

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Header Input */}
          <ToolCard 
            title={t('header__json')}
            contentClassName="p-0 flex flex-col h-[250px]"
          >
            <CodeTextarea
              value={headerStr}
              onChange={(val) => setHeaderStr(val)}
            />
          </ToolCard>

          {/* Payload Input */}
          <ToolCard 
            title={t('payload__json')}
            action={
              <Button variant="ghost" size="sm" onClick={loadSample} className="h-6 px-2 text-[10px] gap-1.5"><RefreshCw className="h-3 w-3" />{t('sample')}</Button>
            }
            contentClassName="p-0 flex flex-col h-[250px]"
          >
            <CodeTextarea
              value={payloadStr}
              onChange={(val) => setPayloadStr(val)}
            />
          </ToolCard>
        </div>

        {/* Result Area */}
        <ToolCard 
          title={t('generated_jwt')}
          action={
            <CopyButton text={output} type="jwt" disabled={!output} />
          }
          contentClassName="p-0 flex flex-col min-h-[150px] bg-muted/20"
        >
          <div className="flex-1 font-mono text-xs p-4 overflow-auto whitespace-pre-wrap break-all leading-relaxed bg-transparent">
            {error ? (
              <span className="text-destructive font-medium">{error}</span>
            ) : (
              <span className="text-foreground">{output}</span>
            )}
          </div>
        </ToolCard>
      </div>

      <div className="md:col-span-1 space-y-4">
        <ToolCard title={t('signature_optio')} icon={Settings2} contentClassName="p-4 space-y-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{t('algorithm')}</Label>
            <Select value="HS256" disabled>
              <SelectTrigger className="h-8 text-xs bg-muted/30 border-border opacity-70"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="HS256" className="text-xs">HS256 (HMAC SHA-256)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[9px] text-muted-foreground">Only HS256 is supported in client browser.</p>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{t('secret_key')}</Label>
            <div className="relative">
              <Key className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input type="text" value={secret} onChange={(e) => setSecret(e.target.value)} className="h-8 pl-8 text-xs bg-muted/30 border-border" />
            </div>
          </div>

          <div className="p-3 rounded-md bg-muted/50 border border-border space-y-1.5 mt-4">
            <div className="flex items-center gap-2 text-[10px] font-semibold text-foreground uppercase tracking-tight"><ShieldPlus className="h-3 w-3" />{t('secure_generati')}</div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">{t('tokens_are_gene')}</p>
          </div>
        </ToolCard>
      </div>
    </div>
  );
}
