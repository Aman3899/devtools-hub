'use client';

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings2, Info, RefreshCw, Key, Lock, Unlock, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import CryptoJS from 'crypto-js';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';

export function AesEncryptorClient() {
  const t = useTranslations('tools.aes-encryptor');
  const commonT = useTranslations('common');
  const { copiedType, copyToClipboard } = useCopyToClipboard();
  
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [input, setInput] = useState('');
  const [secret, setSecret] = useState('super-secret-passphrase');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  
  const processData = useCallback(() => {
    if (!input || !secret) { setOutput(''); setError(''); return; }
    try {
      if (mode === 'encrypt') {
        setOutput(CryptoJS.AES.encrypt(input, secret).toString());
        setError('');
      } else {
        const plainText = CryptoJS.AES.decrypt(input, secret).toString(CryptoJS.enc.Utf8);
        if (!plainText && input.length > 0) throw new Error('Malformed UTF-8 data');
        setOutput(plainText);
        setError('');
      }
    } catch (err) {
      setOutput('');
      setError(t('decryption_fail'));
    }
  }, [input, secret, mode, t]);

  useEffect(() => { processData(); }, [processData]);

  const loadSample = () => {
    setInput(mode === 'encrypt' ? 'Confidential data that needs to be encrypted.' : 'U2FsdGVkX1+zQn/JbA0H6X4oQ/M3PZ0M4N/I5vW9kR9vP/9YQ0Q0Q0Q0Q0Q0Q0Q0');
    setSecret('super-secret-passphrase');
    toast.success(commonT('success'));
  };

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 space-y-4">
        <Tabs value={mode} onValueChange={(v: any) => { setMode(v); setInput(''); setOutput(''); setError(''); }} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-4">
            <TabsTrigger value="encrypt"><Lock className="h-3.5 w-3.5 mr-2" />{t('encrypt')}</TabsTrigger>
            <TabsTrigger value="decrypt"><Unlock className="h-3.5 w-3.5 mr-2" />{t('decrypt')}</TabsTrigger>
          </TabsList>

          <div className="grid gap-4 sm:grid-cols-2">
            <ToolCard 
              title={mode === 'encrypt' ? t('plain_text') : t('cipher_text__ba')}
              action={<Button variant="ghost" size="sm" onClick={loadSample} className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground"><RefreshCw className="h-3 w-3" />{t('sample')}</Button>}
              contentClassName="p-0"
            >
              <Textarea
                placeholder={mode === 'encrypt' ? t('enter_text_to_e') : t('enter_aes_ciphe')}
                className="flex-1 h-[300px] font-mono text-xs resize-none border-none focus-visible:ring-0 p-3 bg-transparent leading-relaxed"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </ToolCard>

            <ToolCard 
              title={mode === 'encrypt' ? t('cipher_text__ba') : t('plain_text')}
              copyText={output}
              copyType="output"
              copiedType={copiedType}
              onCopy={copyToClipboard}
              disabled={!output}
              contentClassName="p-0 flex flex-col h-[300px]"
            >
              <div className="flex-1 flex flex-col items-center justify-center p-6 bg-muted/20">
                {error ? (
                  <div className="flex flex-col items-center text-destructive space-y-2 text-center">
                    <ShieldAlert className="h-8 w-8 opacity-80" />
                    <span className="font-medium text-sm">{error}</span>
                  </div>
                ) : output ? (
                  <Textarea readOnly className={`flex-1 w-full h-full font-mono text-xs resize-none border-none focus-visible:ring-0 bg-transparent leading-relaxed ${mode === 'encrypt' ? 'text-[#e06c75]' : 'text-[#98c379]'}`} value={output} />
                ) : (
                  <p className="text-sm text-muted-foreground opacity-50">{t('result_will_app')}</p>
                )}
              </div>
            </ToolCard>
          </div>
        </Tabs>
      </div>

      <div className="md:col-span-1 space-y-4">
        <ToolCard title={commonT('ui.customization')} icon={Settings2} contentClassName="p-4 space-y-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{t('passphrase___se')}</Label>
            <div className="relative">
              <Key className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input type="password" value={secret} onChange={(e) => setSecret(e.target.value)} className="h-8 pl-8 text-xs bg-muted/30 border-border font-mono" placeholder="Enter decryption key..." />
            </div>
            <p className="text-[9px] text-muted-foreground leading-tight mt-1">{t('this_acts_as_th')}</p>
          </div>
          <div className="p-3 rounded-md bg-muted/50 border border-border space-y-1.5 mt-4">
            <div className="flex items-center gap-2 text-[10px] font-semibold text-foreground uppercase tracking-tight"><Info className="h-3 w-3" />{t('aes_256__cbc')}</div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">{t('advanced_encryp')}</p>
          </div>
        </ToolCard>
      </div>
    </div>
  );
}
