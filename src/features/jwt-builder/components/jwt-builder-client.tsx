'use client';

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Trash2, RefreshCw, Settings2, Info, Key, ShieldPlus } from 'lucide-react';
import { toast } from 'sonner';
import { ToolNavigation } from '@/components/tool-navigation';

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
  }, [headerStr, payloadStr, secret]);

  useEffect(() => {
    generateToken();
  }, [generateToken]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast.success(commonT('copied'));
  };

  const loadSample = () => {
    setHeaderStr('{\n  "alg": "HS256",\n  "typ": "JWT"\n}');
    setPayloadStr('{\n  "sub": "user_123",\n  "role": "admin",\n  "exp": 1735689600\n}');
    setSecret('my-super-secret-key-2024');
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Header Input */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-1">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('header__json')}</Label>
              </div>
              <Card className="flex flex-col h-[250px] border border-border shadow-none rounded-md overflow-hidden bg-background focus-within:border-foreground/20 transition-colors">
                <Textarea
                  className="flex-1 font-mono text-xs resize-none border-none focus-visible:ring-0 p-3 bg-transparent leading-relaxed text-[#e06c75]"
                  value={headerStr}
                  onChange={(e) => setHeaderStr(e.target.value)}
                />
              </Card>
            </div>

            {/* Payload Input */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-1">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('payload__json')}</Label>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={loadSample} className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground">
                    <RefreshCw className="h-3 w-3" />
                    {t('sample')}
                  </Button>
                </div>
              </div>
              <Card className="flex flex-col h-[250px] border border-border shadow-none rounded-md overflow-hidden bg-background focus-within:border-foreground/20 transition-colors">
                <Textarea
                  className="flex-1 font-mono text-xs resize-none border-none focus-visible:ring-0 p-3 bg-transparent leading-relaxed text-[#98c379]"
                  value={payloadStr}
                  onChange={(e) => setPayloadStr(e.target.value)}
                />
              </Card>
            </div>
          </div>

          {/* Result Area */}
          <div className="flex flex-col gap-2 pt-4">
            <div className="flex items-center justify-between px-1">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('generated_jwt')}</Label>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={copyToClipboard} 
                  disabled={!output}
                  className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Copy className="h-3 w-3" />
                  {commonT('copy')}
                </Button>
              </div>
            </div>
            <Card className="flex flex-col min-h-[150px] border border-border shadow-none rounded-md overflow-hidden bg-muted/20">
              <div className="flex-1 font-mono text-xs p-4 overflow-auto whitespace-pre-wrap break-all leading-relaxed">
                {error ? (
                  <span className="text-destructive font-medium">{error}</span>
                ) : (
                  <span className="text-foreground">{output}</span>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="border border-border shadow-none rounded-md bg-background">
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-xs font-semibold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings2 className="h-3.5 w-3.5" />
                  {t('signature_optio')}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-6">
              
              <div className="space-y-2">
                <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{t('algorithm')}</Label>
                <Select value="HS256" disabled>
                  <SelectTrigger className="h-8 text-xs bg-muted/30 border-border opacity-70">
                    <SelectValue />
                  </SelectTrigger>
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
                  <Input 
                    type="text" 
                    value={secret} 
                    onChange={(e) => setSecret(e.target.value)}
                    className="h-8 pl-8 text-xs bg-muted/30 border-border"
                  />
                </div>
              </div>

              <div className="p-3 rounded-md bg-muted/50 border border-border space-y-1.5 mt-4">
                <div className="flex items-center gap-2 text-[10px] font-semibold text-foreground uppercase tracking-tight">
                  <ShieldPlus className="h-3 w-3" />
                  {t('secure_generati')}
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  {t('tokens_are_gene')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ToolNavigation currentToolId="jwt-builder" />
    </div>
  );
}
