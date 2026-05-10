'use client';

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings2, Info, Copy, RefreshCw, Key, Check, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ToolNavigation } from '@/components/tool-navigation';
import CryptoJS from 'crypto-js';

export function HmacGeneratorClient() {
  const t = useTranslations('tools.hmac-generator');
  const commonT = useTranslations('common');
  const [input, setInput] = useState('');
  const [secret, setSecret] = useState('my-secret-key');
  const [algo, setAlgo] = useState('SHA256');
  const [outputFormat, setOutputFormat] = useState('hex');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const isEnglish = commonT('hero.searchPlaceholder' as any) === 'Find a tool...';

  const processText = useCallback(() => {
    if (!input || !secret) {
      setOutput('');
      return;
    }

    let hashObj: any;
    switch (algo) {
      case 'MD5': hashObj = CryptoJS.HmacMD5(input, secret); break;
      case 'SHA1': hashObj = CryptoJS.HmacSHA1(input, secret); break;
      case 'SHA256': hashObj = CryptoJS.HmacSHA256(input, secret); break;
      case 'SHA512': hashObj = CryptoJS.HmacSHA512(input, secret); break;
      default: hashObj = CryptoJS.HmacSHA256(input, secret);
    }

    if (outputFormat === 'hex') {
      setOutput(hashObj.toString(CryptoJS.enc.Hex));
    } else {
      setOutput(hashObj.toString(CryptoJS.enc.Base64));
    }
  }, [input, secret, algo, outputFormat]);

  useEffect(() => {
    processText();
  }, [processText]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success(commonT('copied'));
  };

  const loadSample = () => {
    setInput('Message to authenticate');
    setSecret('super-secret-key-2024');
    setAlgo('SHA256');
    setOutputFormat('hex');
    toast.success(commonT('success'));
  };

  const clear = () => {
    setInput('');
    setOutput('');
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 grid gap-4 md:grid-cols-2">
          {/* Input Area */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{commonT('input')}</Label>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={loadSample} className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground">
                  <RefreshCw className="h-3 w-3" />
                  {isEnglish ? 'Sample' : 'مثال'}
                </Button>
                <Button variant="ghost" size="icon" onClick={clear} title={commonT('clear')} className="h-6 w-6 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <Card className="flex flex-col h-[300px] border border-border shadow-none rounded-md overflow-hidden bg-background focus-within:border-foreground/20 transition-colors">
              <Textarea
                placeholder={isEnglish ? 'Enter message to sign...' : 'سائن کرنے کے لیے پیغام درج کریں...'}
                className="flex-1 font-mono text-xs resize-none border-none focus-visible:ring-0 p-3 bg-transparent leading-relaxed"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </Card>
          </div>

          {/* Output Area */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">HMAC {algo}</Label>
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
              <div className="flex-1 flex items-center justify-center p-6">
                {output ? (
                  <div className="w-full text-center space-y-4">
                    <div className="p-4 bg-background border border-border rounded-md shadow-sm">
                      <span className="font-mono text-xs md:text-sm text-foreground break-all select-all text-[#98c379]">
                        {output}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">{outputFormat === 'hex' ? 'Hexadecimal Format' : 'Base64 Format'}</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground opacity-50">{isEnglish ? 'Hash will appear here...' : 'ہیش یہاں ظاہر ہوگا...'}</p>
                )}
              </div>
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
                <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{isEnglish ? 'Secret Key' : 'خفیہ چابی'}</Label>
                <div className="relative">
                  <Key className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <Input 
                    type="text" 
                    value={secret} 
                    onChange={(e) => setSecret(e.target.value)}
                    className="h-8 pl-8 text-xs bg-muted/30 border-border font-mono"
                    placeholder="Enter secret key..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{isEnglish ? 'Algorithm' : 'الگورتھم'}</Label>
                <Select value={algo} onValueChange={(val) => val && setAlgo(val)}>
                  <SelectTrigger className="h-8 text-xs bg-muted/30 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MD5" className="text-xs">HMAC-MD5</SelectItem>
                    <SelectItem value="SHA1" className="text-xs">HMAC-SHA1</SelectItem>
                    <SelectItem value="SHA256" className="text-xs">HMAC-SHA256</SelectItem>
                    <SelectItem value="SHA512" className="text-xs">HMAC-SHA512</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{isEnglish ? 'Output Format' : 'آؤٹ پٹ فارمیٹ'}</Label>
                <Select value={outputFormat} onValueChange={(val) => val && setOutputFormat(val)}>
                  <SelectTrigger className="h-8 text-xs bg-muted/30 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hex" className="text-xs">Hex (a-f, 0-9)</SelectItem>
                    <SelectItem value="base64" className="text-xs">Base64</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-3 rounded-md bg-muted/50 border border-border space-y-1.5">
                <div className="flex items-center gap-2 text-[10px] font-semibold text-foreground uppercase tracking-tight">
                  <Info className="h-3 w-3" />
                  {isEnglish ? 'Information' : 'معلومات'}
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  {isEnglish ? 'HMAC uses a cryptographic hash function in combination with a secret key to verify both data integrity and authenticity.' : 'HMAC ڈیٹا کی سالمیت اور صداقت دونوں کی تصدیق کے لیے استعمال ہوتا ہے۔'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ToolNavigation currentToolId="hmac-generator" />
    </div>
  );
}
