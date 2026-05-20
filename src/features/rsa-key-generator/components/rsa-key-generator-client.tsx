"use client"

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings2, Info, Copy, Key, Check, Download, ShieldCheck, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import forge from 'node-forge';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

export function RsaKeyGeneratorClient() {
  const t = useTranslations('tools.rsa-key-generator');
  const commonT = useTranslations('common');
  const { copiedType, copyToClipboard } = useCopyToClipboard();
  
  const [keySize, setKeySize] = useState('2048');
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateKeys = useCallback(() => {
    setIsGenerating(true);
    setPublicKey('');
    setPrivateKey('');
    
    // setTimeout to allow UI to update loading state, node-forge RSA gen blocks the thread
    setTimeout(() => {
      try {
        const size = parseInt(keySize, 10);
        // We use workers theoretically, but for simplicity in browser we just run it. 
        // Note: > 2048 will freeze the browser for a while
        const keypair = forge.pki.rsa.generateKeyPair({ bits: size, e: 0x10001 });
        
        const pubPem = forge.pki.publicKeyToPem(keypair.publicKey);
        const privPem = forge.pki.privateKeyToPem(keypair.privateKey);
        
        setPublicKey(pubPem);
        setPrivateKey(privPem);
        toast.success(t('rsa_key_pair_ge'));
      } catch (err) {
        toast.error(commonT('error'));
      } finally {
        setIsGenerating(false);
      }
    }, 100);
  }, [keySize, commonT]);

  const handleDownload = (type: 'pub' | 'priv') => {
    const text = type === 'pub' ? publicKey : privateKey;
    const filename = type === 'pub' ? 'public_key.pem' : 'private_key.pem';
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">
        {/* Public Key Area */}
        <ToolCard 
          title={t('public_key')}
          action={
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={() => handleDownload('pub')} disabled={!publicKey} className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground">
                <Download className="h-3 w-3" />
                {commonT('download')}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(publicKey, 'pub')} disabled={!publicKey} className="h-6 px-2 text-[10px] gap-1.5 transition-colors">
                {copiedType === 'pub' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                {commonT('copy')}
              </Button>
            </div>
          }
          contentClassName="p-0 flex flex-col h-[500px]"
        >
          <Textarea
            readOnly
            placeholder={t('public_key_will')}
            className="flex-1 font-mono text-[10px] sm:text-xs resize-none border-none focus-visible:ring-0 p-3 bg-muted/20 leading-relaxed text-[#98c379]"
            value={publicKey}
          />
        </ToolCard>

        {/* Private Key Area */}
        <ToolCard 
          title={t('private_key')}
          action={
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={() => handleDownload('priv')} disabled={!privateKey} className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground">
                <Download className="h-3 w-3" />
                {commonT('download')}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(privateKey, 'priv')} disabled={!privateKey} className="h-6 px-2 text-[10px] gap-1.5 transition-colors">
                {copiedType === 'priv' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                {commonT('copy')}
              </Button>
            </div>
          }
          contentClassName="p-0 flex flex-col h-[500px]"
        >
          <Textarea
            readOnly
            placeholder={t('private_key_wil')}
            className="flex-1 font-mono text-[10px] sm:text-xs resize-none border-none focus-visible:ring-0 p-3 bg-muted/20 leading-relaxed text-[#e06c75]"
            value={privateKey}
          />
        </ToolCard>
      </div>

      {/* Sidebar Settings */}
      <div className="md:col-span-1 space-y-4">
        <ToolCard title={commonT('ui.customization')} icon={Settings2} contentClassName="p-4 space-y-6">
          <div className="space-y-2">
            <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{t('key_size__bits')}</Label>
            <Select value={keySize} onValueChange={(val) => val && setKeySize(val)} disabled={isGenerating}>
              <SelectTrigger className="h-8 text-xs bg-muted/30 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1024" className="text-xs">1024-bit (Fast, Less Secure)</SelectItem>
                <SelectItem value="2048" className="text-xs">2048-bit (Standard)</SelectItem>
                <SelectItem value="4096" className="text-xs">4096-bit (Secure, Slow)</SelectItem>
              </SelectContent>
            </Select>
            {keySize === '4096' && (
              <p className="text-[9px] text-destructive font-medium mt-1">Warning: 4096-bit generation may freeze your browser for several seconds.</p>
            )}
          </div>

          <Button 
            className="w-full h-9 text-xs font-semibold" 
            onClick={generateKeys} 
            disabled={isGenerating}
          >
            {isGenerating ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Key className="h-4 w-4 mr-2" />}
            {isGenerating ? (t('generating')) : (t('generate_key_pair'))}
          </Button>

          <div className="p-3 rounded-md bg-muted/50 border border-border space-y-1.5 mt-4">
            <div className="flex items-center gap-2 text-[10px] font-semibold text-foreground uppercase tracking-tight">
              <ShieldCheck className="h-3 w-3" />
              {t('client_side_onl')}
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              {t('keys_are_genera')}
            </p>
          </div>
        </ToolCard>
      </div>
    </div>
  );
}
