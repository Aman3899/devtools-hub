'use client';

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings2, Info, Copy, RefreshCw, Key, Check, ShieldCheck, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { ToolNavigation } from '@/components/tool-navigation';
import bcrypt from 'bcryptjs';

export function BcryptGeneratorClient() {
  const t = useTranslations('tools.bcrypt-generator');
  const commonT = useTranslations('common');
  const [mode, setMode] = useState<'hash' | 'verify'>('hash');
  
  // Hash State
  const [inputHash, setInputHash] = useState('');
  const [cost, setCost] = useState(10);
  const [outputHash, setOutputHash] = useState('');
  const [isHashing, setIsHashing] = useState(false);
  
  // Verify State
  const [inputVerify, setInputVerify] = useState('');
  const [hashToVerify, setHashToVerify] = useState('');
  const [verifyResult, setVerifyResult] = useState<'idle' | 'match' | 'no-match' | 'error'>('idle');

  const [copied, setCopied] = useState(false);

  const isEnglish = commonT('hero.searchPlaceholder' as any) === 'Find a tool...';

  const generateHash = useCallback(() => {
    if (!inputHash) {
      setOutputHash('');
      return;
    }

    setIsHashing(true);
    // Use setTimeout to allow UI to update to loading state before heavy sync operation
    setTimeout(() => {
      try {
        const salt = bcrypt.genSaltSync(cost);
        const hash = bcrypt.hashSync(inputHash, salt);
        setOutputHash(hash);
      } catch (err) {
        setOutputHash(isEnglish ? 'Error generating hash' : 'ہیش بنانے میں خرابی');
      } finally {
        setIsHashing(false);
      }
    }, 50);
  }, [inputHash, cost, isEnglish]);

  const verifyHash = useCallback(() => {
    if (!inputVerify || !hashToVerify) {
      setVerifyResult('idle');
      return;
    }

    try {
      const isMatch = bcrypt.compareSync(inputVerify, hashToVerify);
      setVerifyResult(isMatch ? 'match' : 'no-match');
    } catch (e) {
      setVerifyResult('error');
    }
  }, [inputVerify, hashToVerify]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success(commonT('copied'));
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 space-y-4">
          <Tabs value={mode} onValueChange={(v: any) => setMode(v)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
              <TabsTrigger value="hash">{isEnglish ? 'Generate Hash' : 'ہیش بنائیں'}</TabsTrigger>
              <TabsTrigger value="verify">{isEnglish ? 'Verify Hash' : 'ہیش کی تصدیق کریں'}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="hash" className="mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{commonT('input')}</Label>
                  <Card className="flex flex-col h-[200px] border border-border shadow-none rounded-md overflow-hidden bg-background focus-within:border-foreground/20 transition-colors">
                    <Textarea
                      placeholder={isEnglish ? 'Enter password to hash...' : 'ہیش کرنے کے لیے پاس ورڈ درج کریں...'}
                      className="flex-1 font-mono text-xs resize-none border-none focus-visible:ring-0 p-3 bg-transparent leading-relaxed"
                      value={inputHash}
                      onChange={(e) => setInputHash(e.target.value)}
                    />
                    <div className="p-2 border-t bg-muted/5">
                      <Button className="w-full h-8 text-xs" onClick={generateHash} disabled={!inputHash || isHashing}>
                        {isHashing ? <RefreshCw className="h-3.5 w-3.5 mr-2 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5 mr-2" />}
                        {isEnglish ? 'Hash Password' : 'پاس ورڈ ہیش کریں'}
                      </Button>
                    </div>
                  </Card>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between px-1">
                    <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Bcrypt Hash</Label>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={copyToClipboard} 
                      disabled={!outputHash}
                      className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                      {commonT('copy')}
                    </Button>
                  </div>
                  <Card className="flex flex-col h-[200px] border border-border shadow-none rounded-md overflow-hidden bg-muted/20">
                    <div className="flex-1 flex items-center justify-center p-6">
                      {outputHash ? (
                        <div className="w-full text-center space-y-4">
                          <div className="p-4 bg-background border border-border rounded-md shadow-sm">
                            <span className="font-mono text-xs md:text-sm text-foreground break-all select-all text-[#e06c75]">
                              {outputHash}
                            </span>
                          </div>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Cost: {cost}</p>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground opacity-50">{isEnglish ? 'Generated hash will appear here...' : 'ہیش یہاں ظاہر ہوگا...'}</p>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="verify" className="mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{isEnglish ? 'Plain Text Password' : 'سادہ پاس ورڈ'}</Label>
                    <Input
                      type="text"
                      className="font-mono text-xs h-10"
                      placeholder={isEnglish ? 'Enter password to verify...' : 'تصدیق کے لیے پاس ورڈ درج کریں...'}
                      value={inputVerify}
                      onChange={(e) => { setInputVerify(e.target.value); setVerifyResult('idle'); }}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{isEnglish ? 'Bcrypt Hash' : 'Bcrypt ہیش'}</Label>
                    <Input
                      type="text"
                      className="font-mono text-xs h-10"
                      placeholder="$2a$10$..."
                      value={hashToVerify}
                      onChange={(e) => { setHashToVerify(e.target.value); setVerifyResult('idle'); }}
                    />
                  </div>
                  <Button className="w-full" onClick={verifyHash} disabled={!inputVerify || !hashToVerify}>
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    {isEnglish ? 'Verify Match' : 'تصدیق کریں'}
                  </Button>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{isEnglish ? 'Verification Result' : 'تصدیق کا نتیجہ'}</Label>
                  <Card className="flex flex-col flex-1 min-h-[160px] border border-border shadow-none rounded-md overflow-hidden bg-muted/20 items-center justify-center">
                    {verifyResult === 'idle' && (
                      <p className="text-sm text-muted-foreground opacity-50">{isEnglish ? 'Enter values and click verify' : 'اقدار درج کریں اور تصدیق پر کلک کریں'}</p>
                    )}
                    {verifyResult === 'match' && (
                      <div className="flex flex-col items-center gap-2 text-green-500">
                        <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                          <Check className="h-6 w-6" />
                        </div>
                        <span className="font-semibold">{isEnglish ? 'Match Found!' : 'میچ مل گیا!'}</span>
                      </div>
                    )}
                    {verifyResult === 'no-match' && (
                      <div className="flex flex-col items-center gap-2 text-destructive">
                        <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                          <ShieldAlert className="h-6 w-6" />
                        </div>
                        <span className="font-semibold">{isEnglish ? 'No Match' : 'کوئی میچ نہیں ملا'}</span>
                      </div>
                    )}
                    {verifyResult === 'error' && (
                      <div className="flex flex-col items-center gap-2 text-orange-500">
                        <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                          <Info className="h-6 w-6" />
                        </div>
                        <span className="font-semibold">{isEnglish ? 'Invalid Hash Format' : 'غلط ہیش فارمیٹ'}</span>
                      </div>
                    )}
                  </Card>
                </div>
              </div>
            </TabsContent>
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
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{isEnglish ? 'Cost Factor' : 'کاسٹ فیکٹر'}</Label>
                  <span className="text-xs font-bold text-foreground bg-muted px-2 py-0.5 rounded">{cost}</span>
                </div>
                <Slider
                  value={[cost]}
                  onValueChange={(vals: any) => setCost(Array.isArray(vals) ? vals[0] : vals)}
                  max={16}
                  min={4}
                  step={1}
                  disabled={mode === 'verify'}
                  className="w-full"
                />
                <p className="text-[9px] text-muted-foreground leading-tight">
                  {isEnglish ? 'Higher cost factors take exponentially longer to compute. Values > 12 may freeze your browser.' : 'اعلی قیمت عوامل کا حساب لگانے میں زیادہ وقت لگتا ہے۔'}
                </p>
              </div>

              <div className="p-3 rounded-md bg-muted/50 border border-border space-y-1.5 mt-4">
                <div className="flex items-center gap-2 text-[10px] font-semibold text-foreground uppercase tracking-tight">
                  <Key className="h-3 w-3" />
                  {isEnglish ? 'Bcrypt Info' : 'Bcrypt کی معلومات'}
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  {isEnglish ? 'Bcrypt is a password-hashing function designed to be slow and compute-intensive. This protects against brute-force attacks.' : 'بکرپٹ ایک پاس ورڈ ہیشنگ فنکشن ہے۔'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ToolNavigation currentToolId="bcrypt-generator" />
    </div>
  );
}
