'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings2, Info, Copy, Key, Check, Download, ShieldCheck, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { ToolNavigation } from '@/components/tool-navigation';
import forge from 'node-forge';

export function RsaKeyGeneratorClient() {
  const t = useTranslations('tools.rsa-key-generator');
  const commonT = useTranslations('common');
  
  const [keySize, setKeySize] = useState('2048');
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedStates, setCopiedStates] = useState({ pub: false, priv: false });

  const isEnglish = commonT('hero.searchPlaceholder' as any) === 'Find a tool...';

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
        toast.success(isEnglish ? 'RSA Key Pair Generated' : 'RSA کلیدی جوڑا تیار ہو گیا');
      } catch (err) {
        toast.error(isEnglish ? 'Error generating keys' : 'کلیدیں بنانے میں خرابی');
      } finally {
        setIsGenerating(false);
      }
    }, 100);
  }, [keySize, isEnglish]);

  const copyToClipboard = (type: 'pub' | 'priv') => {
    const text = type === 'pub' ? publicKey : privateKey;
    navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [type]: true }));
    setTimeout(() => setCopiedStates(prev => ({ ...prev, [type]: false })), 2000);
    toast.success(commonT('copied'));
  };

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

  const clear = () => {
    setPublicKey('');
    setPrivateKey('');
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 grid gap-4 md:grid-cols-2">
          
          {/* Public Key Area */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{isEnglish ? 'Public Key' : 'عوامی کلید'}</Label>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => handleDownload('pub')} disabled={!publicKey} className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground">
                  <Download className="h-3 w-3" />
                  {commonT('download')}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard('pub')} disabled={!publicKey} className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground">
                  {copiedStates.pub ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                  {commonT('copy')}
                </Button>
              </div>
            </div>
            
            <Card className="flex flex-col h-[500px] border border-border shadow-none rounded-md overflow-hidden bg-background">
              <Textarea
                readOnly
                placeholder={isEnglish ? 'Public key will appear here...' : 'عوامی کلید یہاں ظاہر ہوگی...'}
                className="flex-1 font-mono text-[10px] sm:text-xs resize-none border-none focus-visible:ring-0 p-3 bg-muted/20 leading-relaxed text-[#98c379]"
                value={publicKey}
              />
            </Card>
          </div>

          {/* Private Key Area */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{isEnglish ? 'Private Key' : 'نجی کلید'}</Label>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => handleDownload('priv')} disabled={!privateKey} className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground">
                  <Download className="h-3 w-3" />
                  {commonT('download')}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard('priv')} disabled={!privateKey} className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground">
                  {copiedStates.priv ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                  {commonT('copy')}
                </Button>
              </div>
            </div>
            
            <Card className="flex flex-col h-[500px] border border-border shadow-none rounded-md overflow-hidden bg-background">
              <Textarea
                readOnly
                placeholder={isEnglish ? 'Private key will appear here...' : 'نجی کلید یہاں ظاہر ہوگی...'}
                className="flex-1 font-mono text-[10px] sm:text-xs resize-none border-none focus-visible:ring-0 p-3 bg-muted/20 leading-relaxed text-[#e06c75]"
                value={privateKey}
              />
            </Card>
          </div>
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
                <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{isEnglish ? 'Key Size (Bits)' : 'کلید کا سائز'}</Label>
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
                {isGenerating ? (isEnglish ? 'Generating...' : 'بنا رہا ہے...') : (isEnglish ? 'Generate Key Pair' : 'کلیدیں بنائیں')}
              </Button>

              <div className="p-3 rounded-md bg-muted/50 border border-border space-y-1.5 mt-4">
                <div className="flex items-center gap-2 text-[10px] font-semibold text-foreground uppercase tracking-tight">
                  <ShieldCheck className="h-3 w-3" />
                  {isEnglish ? 'Client-Side Only' : 'صرف کلائنٹ سائیڈ'}
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  {isEnglish ? 'Keys are generated entirely within your browser memory. They are never transmitted over the internet.' : 'کلیدیں آپ کے براؤزر میں بنتی ہیں اور انٹرنیٹ پر نہیں بھیجی جاتیں۔'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ToolNavigation currentToolId="rsa-key-generator" />
    </div>
  );
}
