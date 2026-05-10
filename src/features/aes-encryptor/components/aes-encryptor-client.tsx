'use client';

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings2, Info, Copy, RefreshCw, Key, Check, Lock, Unlock, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { ToolNavigation } from '@/components/tool-navigation';
import CryptoJS from 'crypto-js';

export function AesEncryptorClient() {
  const t = useTranslations('tools.aes-encryptor');
  const commonT = useTranslations('common');
  
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [input, setInput] = useState('');
  const [secret, setSecret] = useState('super-secret-passphrase');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  
  const processData = useCallback(() => {
    if (!input || !secret) {
      setOutput('');
      setError('');
      return;
    }

    try {
      if (mode === 'encrypt') {
        const encrypted = CryptoJS.AES.encrypt(input, secret).toString();
        setOutput(encrypted);
        setError('');
      } else {
        const decrypted = CryptoJS.AES.decrypt(input, secret);
        const plainText = decrypted.toString(CryptoJS.enc.Utf8);
        if (!plainText && input.length > 0) {
          throw new Error('Malformed UTF-8 data');
        }
        setOutput(plainText);
        setError('');
      }
    } catch (err) {
      setOutput('');
      setError(t('decryption_fail'));
    }
  }, [input, secret, mode, t]);

  useEffect(() => {
    processData();
  }, [processData]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success(commonT('copied'));
  };

  const loadSample = () => {
    if (mode === 'encrypt') {
      setInput('Confidential data that needs to be encrypted.');
    } else {
      setInput('U2FsdGVkX1+zQn/JbA0H6X4oQ/M3PZ0M4N/I5vW9kR9vP/9YQ0Q0Q0Q0Q0Q0Q0Q0');
    }
    setSecret('super-secret-passphrase');
    toast.success(commonT('success'));
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 space-y-4">
          <Tabs value={mode} onValueChange={(v: any) => { setMode(v); setInput(''); setOutput(''); setError(''); }} className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
              <TabsTrigger value="encrypt">
                <Lock className="h-3.5 w-3.5 mr-2" />
                {t('encrypt')}
              </TabsTrigger>
              <TabsTrigger value="decrypt">
                <Unlock className="h-3.5 w-3.5 mr-2" />
                {t('decrypt')}
              </TabsTrigger>
            </TabsList>

            <div className="grid gap-4 md:grid-cols-2 mt-4">
              {/* Input Area */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between px-1">
                  <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {mode === 'encrypt' ? (t('plain_text')) : (t('cipher_text__ba'))}
                  </Label>
                  <Button variant="ghost" size="sm" onClick={loadSample} className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground">
                    <RefreshCw className="h-3 w-3" />
                    {t('sample')}
                  </Button>
                </div>
                
                <Card className="flex flex-col h-[300px] border border-border shadow-none rounded-md overflow-hidden bg-background focus-within:border-foreground/20 transition-colors">
                  <Textarea
                    placeholder={mode === 'encrypt' ? (t('enter_text_to_e')) : (t('enter_aes_ciphe'))}
                    className="flex-1 font-mono text-xs resize-none border-none focus-visible:ring-0 p-3 bg-transparent leading-relaxed"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                </Card>
              </div>

              {/* Output Area */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between px-1">
                  <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {mode === 'encrypt' ? (t('cipher_text__ba')) : (t('plain_text'))}
                  </Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={copyToClipboard} 
                    disabled={!output}
                    className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                    {commonT('copy')}
                  </Button>
                </div>
                <Card className="flex flex-col h-[300px] border border-border shadow-none rounded-md overflow-hidden bg-muted/20">
                  <div className="flex-1 flex flex-col items-center justify-center p-6">
                    {error ? (
                      <div className="flex flex-col items-center text-destructive space-y-2 text-center">
                        <ShieldAlert className="h-8 w-8 opacity-80" />
                        <span className="font-medium text-sm">{error}</span>
                      </div>
                    ) : output ? (
                      <Textarea
                        readOnly
                        className={`flex-1 w-full font-mono text-xs resize-none border-none focus-visible:ring-0 bg-transparent leading-relaxed ${mode === 'encrypt' ? 'text-[#e06c75]' : 'text-[#98c379]'}`}
                        value={output}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground opacity-50">{t('result_will_app')}</p>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </Tabs>
        </div>

        {/* Sidebar Settings */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="border border-border shadow-none rounded-md bg-background">
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-xs font-semibold flex items-center gap-2">
                <Settings2 className="h-3.5 w-3.5" />
                {commonT('ui.customization')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-6">
              
              <div className="space-y-2">
                <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{t('passphrase___se')}</Label>
                <div className="relative">
                  <Key className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <Input 
                    type="password" 
                    value={secret} 
                    onChange={(e) => setSecret(e.target.value)}
                    className="h-8 pl-8 text-xs bg-muted/30 border-border font-mono"
                    placeholder="Enter decryption key..."
                  />
                </div>
                <p className="text-[9px] text-muted-foreground leading-tight mt-1">
                  {t('this_acts_as_th')}
                </p>
              </div>

              <div className="p-3 rounded-md bg-muted/50 border border-border space-y-1.5 mt-4">
                <div className="flex items-center gap-2 text-[10px] font-semibold text-foreground uppercase tracking-tight">
                  <Info className="h-3 w-3" />
                  {t('aes_256__cbc')}
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  {t('advanced_encryp')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ToolNavigation currentToolId="aes-encryptor" />
    </div>
  );
}
