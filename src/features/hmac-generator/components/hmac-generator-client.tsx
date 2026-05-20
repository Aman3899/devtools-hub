"use client"

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings2, Info, Copy, RefreshCw, Key, Check, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import CryptoJS from 'crypto-js';

export function HmacGeneratorClient() {
  const t = useTranslations('tools.hmac-generator');
  const commonT = useTranslations('common');
  const { copiedType, copyToClipboard } = useCopyToClipboard();

  const [input, setInput] = useState('');
  const [secret, setSecret] = useState('my-secret-key');
  const [algo, setAlgo] = useState('SHA256');
  const [outputFormat, setOutputFormat] = useState('hex');
  const [output, setOutput] = useState('');

  const processText = useCallback(() => {
    if (!input || !secret) { setOutput(''); return; }
    let hashObj: any;
    switch (algo) {
      case 'MD5': hashObj = CryptoJS.HmacMD5(input, secret); break;
      case 'SHA1': hashObj = CryptoJS.HmacSHA1(input, secret); break;
      case 'SHA256': hashObj = CryptoJS.HmacSHA256(input, secret); break;
      case 'SHA512': hashObj = CryptoJS.HmacSHA512(input, secret); break;
      default: hashObj = CryptoJS.HmacSHA256(input, secret);
    }
    setOutput(hashObj.toString(outputFormat === 'hex' ? CryptoJS.enc.Hex : CryptoJS.enc.Base64));
  }, [input, secret, algo, outputFormat]);

  useEffect(() => { processText(); }, [processText]);

  const loadSample = () => { setInput('Message to authenticate'); setSecret('super-secret-key-2024'); setAlgo('SHA256'); setOutputFormat('hex'); toast.success(commonT('success')); };
  const clear = () => { setInput(''); setOutput(''); };

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">
        <ToolCard 
          title={commonT('input')}
          action={
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={loadSample} className="h-6 px-2 text-[10px] gap-1.5"><RefreshCw className="h-3 w-3" />{t('sample')}</Button>
              <Button variant="ghost" size="icon" onClick={clear} title={commonT('clear')} className="h-6 w-6 hover:text-destructive"><Trash2 className="h-3 w-3" /></Button>
            </div>
          }
          contentClassName="p-0 flex flex-col h-[300px] focus-within:border-foreground/20 transition-colors"
        >
          <Textarea placeholder={t('enter_message_t')} className="flex-1 font-mono text-xs resize-none border-none focus-visible:ring-0 p-3 bg-transparent leading-relaxed" value={input} onChange={(e) => setInput(e.target.value)} />
        </ToolCard>

        <ToolCard 
          title={`HMAC ${algo}`}
          action={<Button variant="ghost" size="sm" onClick={() => copyToClipboard(output, 'hmac')} disabled={!output} className="h-6 px-2 text-[10px] gap-1.5">{copiedType === 'hmac' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}{commonT('copy')}</Button>}
          contentClassName="p-6 flex flex-col h-[300px] bg-muted/20 items-center justify-center"
        >
          {output ? (
            <div className="w-full text-center space-y-4">
              <div className="p-4 bg-background border border-border rounded-md shadow-sm"><span className="font-mono text-xs md:text-sm text-foreground break-all select-all text-[#98c379]">{output}</span></div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">{outputFormat === 'hex' ? 'Hexadecimal Format' : 'Base64 Format'}</p>
            </div>
          ) : (<p className="text-sm text-muted-foreground opacity-50">{t('hash_will_appea')}</p>)}
        </ToolCard>
      </div>

      <div className="md:col-span-1 space-y-4">
        <ToolCard title={commonT('ui.customization')} icon={Settings2} contentClassName="p-4 space-y-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{t('secret_key')}</Label>
            <div className="relative">
              <Key className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input type="text" value={secret} onChange={(e) => setSecret(e.target.value)} className="h-8 pl-8 text-xs bg-muted/30 border-border font-mono" placeholder="Enter secret key..." />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{t('algorithm')}</Label>
            <Select value={algo} onValueChange={(val) => val && setAlgo(val)}>
              <SelectTrigger className="h-8 text-xs bg-muted/30 border-border"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="MD5" className="text-xs">HMAC-MD5</SelectItem>
                <SelectItem value="SHA1" className="text-xs">HMAC-SHA1</SelectItem>
                <SelectItem value="SHA256" className="text-xs">HMAC-SHA256</SelectItem>
                <SelectItem value="SHA512" className="text-xs">HMAC-SHA512</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{t('output_format')}</Label>
            <Select value={outputFormat} onValueChange={(val) => val && setOutputFormat(val)}>
              <SelectTrigger className="h-8 text-xs bg-muted/30 border-border"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="hex" className="text-xs">Hex (a-f, 0-9)</SelectItem>
                <SelectItem value="base64" className="text-xs">Base64</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="p-3 rounded-md bg-muted/50 border border-border space-y-1.5">
            <div className="flex items-center gap-2 text-[10px] font-semibold text-foreground uppercase tracking-tight"><Info className="h-3 w-3" />{t('information')}</div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">{t('hmac_uses_a_cry')}</p>
          </div>
        </ToolCard>
      </div>
    </div>
  );
}
