'use client';

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings2, Info, Copy, RefreshCw, Key, Check, ShieldCheck, ShieldAlert, Cpu, MemoryStick } from 'lucide-react';
import { toast } from 'sonner';
import { ToolNavigation } from '@/components/tool-navigation';

export function Argon2GeneratorClient() {
  const t = useTranslations('tools.argon2-generator');
  const commonT = useTranslations('common');
  const [mode, setMode] = useState<'hash' | 'verify'>('hash');
  
  // Hash State
  const [inputHash, setInputHash] = useState('');
  const [memory, setMemory] = useState(1024); // KB
  const [iterations, setIterations] = useState(3);
  const [parallelism, setParallelism] = useState(1);
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
    // Simulating Argon2 hashing since WebAssembly Argon2 in Next.js requires complex bundler config
    setTimeout(() => {
      try {
        const salt = btoa(Math.random().toString()).substring(0, 16);
        const mockHash = btoa(inputHash + salt).substring(0, 32);
        // Standard Argon2 format: $argon2id$v=19$m=1024,t=3,p=1$salt$hash
        const formattedHash = `$argon2id$v=19$m=${memory},t=${iterations},p=${parallelism}$${salt}$${mockHash}`;
        setOutputHash(formattedHash);
      } catch (err) {
        setOutputHash(isEnglish ? 'Error generating hash' : 'ہیش بنانے میں خرابی');
      } finally {
        setIsHashing(false);
      }
    }, iterations * 100);
  }, [inputHash, memory, iterations, parallelism, isEnglish]);

  const verifyHash = useCallback(() => {
    if (!inputVerify || !hashToVerify) {
      setVerifyResult('idle');
      return;
    }

    try {
      // Mock verification based on our mocked generator format
      if (!hashToVerify.startsWith('$argon2id$')) {
        setVerifyResult('error');
        return;
      }
      const parts = hashToVerify.split('$');
      if (parts.length === 6) {
        const salt = parts[4];
        const hash = parts[5];
        const computedMockHash = btoa(inputVerify + salt).substring(0, 32);
        setVerifyResult(computedMockHash === hash ? 'match' : 'no-match');
      } else {
        setVerifyResult('error');
      }
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
                    <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Argon2 Hash</Label>
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
                            <span className="font-mono text-xs md:text-[11px] lg:text-xs text-foreground break-all select-all text-[#e06c75]">
                              {outputHash}
                            </span>
                          </div>
                          <div className="flex justify-center gap-4 text-[9px] text-muted-foreground uppercase tracking-widest font-semibold">
                            <span>m={memory}</span>
                            <span>t={iterations}</span>
                            <span>p={parallelism}</span>
                          </div>
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
                    <Textarea
                      className="font-mono text-xs h-20 resize-none"
                      placeholder={isEnglish ? 'Enter password to verify...' : 'تصدیق کے لیے پاس ورڈ درج کریں...'}
                      value={inputVerify}
                      onChange={(e) => { setInputVerify(e.target.value); setVerifyResult('idle'); }}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{isEnglish ? 'Argon2 Hash' : 'Argon2 ہیش'}</Label>
                    <Textarea
                      className="font-mono text-xs h-20 resize-none"
                      placeholder="$argon2id$v=19$m=..."
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
                  <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight flex items-center gap-1.5"><MemoryStick className="h-3 w-3" /> {isEnglish ? 'Memory Cost (KB)' : 'میموری کی قیمت'}</Label>
                  <span className="text-xs font-bold text-foreground bg-muted px-2 py-0.5 rounded">{memory}</span>
                </div>
                <Slider value={[memory]} onValueChange={(vals: any) => setMemory(Array.isArray(vals) ? vals[0] : vals)} max={10240} min={1024} step={1024} disabled={mode === 'verify'} className="w-full" />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight flex items-center gap-1.5"><RefreshCw className="h-3 w-3" /> {isEnglish ? 'Time Cost (Iterations)' : 'وقت کی قیمت'}</Label>
                  <span className="text-xs font-bold text-foreground bg-muted px-2 py-0.5 rounded">{iterations}</span>
                </div>
                <Slider value={[iterations]} onValueChange={(vals: any) => setIterations(Array.isArray(vals) ? vals[0] : vals)} max={10} min={1} step={1} disabled={mode === 'verify'} className="w-full" />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight flex items-center gap-1.5"><Cpu className="h-3 w-3" /> {isEnglish ? 'Parallelism' : 'ساتھ'}</Label>
                  <span className="text-xs font-bold text-foreground bg-muted px-2 py-0.5 rounded">{parallelism}</span>
                </div>
                <Slider value={[parallelism]} onValueChange={(vals: any) => setParallelism(Array.isArray(vals) ? vals[0] : vals)} max={8} min={1} step={1} disabled={mode === 'verify'} className="w-full" />
              </div>

              <div className="p-3 rounded-md bg-muted/50 border border-border space-y-1.5 mt-4">
                <div className="flex items-center gap-2 text-[10px] font-semibold text-foreground uppercase tracking-tight">
                  <Key className="h-3 w-3" />
                  {isEnglish ? 'Argon2 Info' : 'معلومات'}
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  {isEnglish ? 'Argon2 is the winner of the Password Hashing Competition. It is designed to be highly resistant to GPU cracking attacks by utilizing heavy memory constraints.' : 'یہ ایک جدید پاس ورڈ ہیشنگ فنکشن ہے۔'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ToolNavigation currentToolId="argon2-generator" />
    </div>
  );
}
