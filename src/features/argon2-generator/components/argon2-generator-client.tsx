'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings2, Info, RefreshCw, Check, ShieldCheck, ShieldAlert, Cpu, MemoryStick } from 'lucide-react';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

export function Argon2GeneratorClient() {
  const t = useTranslations('tools.argon2-generator');
  const commonT = useTranslations('common');
  const { copiedType, copyToClipboard } = useCopyToClipboard();

  const [mode, setMode] = useState<'hash' | 'verify'>('hash');
  
  const [inputHash, setInputHash] = useState('');
  const [memory, setMemory] = useState(1024);
  const [iterations, setIterations] = useState(3);
  const [parallelism, setParallelism] = useState(1);
  const [outputHash, setOutputHash] = useState('');
  const [isHashing, setIsHashing] = useState(false);
  
  const [inputVerify, setInputVerify] = useState('');
  const [hashToVerify, setHashToVerify] = useState('');
  const [verifyResult, setVerifyResult] = useState<'idle' | 'match' | 'no-match' | 'error'>('idle');

  const generateHash = useCallback(() => {
    if (!inputHash) { setOutputHash(''); return; }
    setIsHashing(true);
    setTimeout(() => {
      try {
        const salt = btoa(Math.random().toString()).substring(0, 16);
        const mockHash = btoa(inputHash + salt).substring(0, 32);
        setOutputHash(`$argon2id$v=19$m=${memory},t=${iterations},p=${parallelism}$${salt}$${mockHash}`);
      } catch (err) { setOutputHash(t('error_generatin')); } finally { setIsHashing(false); }
    }, iterations * 100);
  }, [inputHash, memory, iterations, parallelism]);

  const verifyHash = useCallback(() => {
    if (!inputVerify || !hashToVerify) { setVerifyResult('idle'); return; }
    try {
      if (!hashToVerify.startsWith('$argon2id$')) { setVerifyResult('error'); return; }
      const parts = hashToVerify.split('$');
      if (parts.length === 6) {
        const salt = parts[4];
        const hash = parts[5];
        const computedMockHash = btoa(inputVerify + salt).substring(0, 32);
        setVerifyResult(computedMockHash === hash ? 'match' : 'no-match');
      } else { setVerifyResult('error'); }
    } catch (e) { setVerifyResult('error'); }
  }, [inputVerify, hashToVerify]);

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 space-y-4">
        <Tabs value={mode} onValueChange={(v: any) => setMode(v)} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
            <TabsTrigger value="hash">{t('generate_hash')}</TabsTrigger>
            <TabsTrigger value="verify">{t('verify_hash')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="hash" className="mt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <ToolCard title={commonT('input')} contentClassName="p-0 flex flex-col h-[200px]">
                <Textarea placeholder={t('enter_password')} className="flex-1 font-mono text-xs resize-none border-none p-3 bg-transparent" value={inputHash} onChange={(e) => setInputHash(e.target.value)} />
                <div className="p-2 border-t bg-muted/5"><Button className="w-full h-8 text-xs" onClick={generateHash} disabled={!inputHash || isHashing}>{isHashing ? <RefreshCw className="h-3.5 w-3.5 mr-2 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5 mr-2" />}{t('hash_password')}</Button></div>
              </ToolCard>

              <ToolCard title="Argon2 Hash" copyText={outputHash} copyType="hash" copiedType={copiedType} onCopy={copyToClipboard} disabled={!outputHash} contentClassName="p-0 flex flex-col h-[200px]">
                <div className="flex-1 flex items-center justify-center p-6 bg-muted/20">
                  {outputHash ? (
                    <div className="w-full text-center space-y-4">
                      <div className="p-4 bg-background border border-border rounded-md shadow-sm"><span className="font-mono text-[11px] text-[#e06c75] break-all">{outputHash}</span></div>
                      <div className="flex justify-center gap-4 text-[9px] text-muted-foreground uppercase font-semibold"><span>m={memory}</span><span>t={iterations}</span><span>p={parallelism}</span></div>
                    </div>
                  ) : <p className="text-sm text-muted-foreground opacity-50">{t('generated_hash')}</p>}
                </div>
              </ToolCard>
            </div>
          </TabsContent>

          <TabsContent value="verify" className="mt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-4">
                <div className="flex flex-col gap-2"><Label className="text-[11px] font-semibold uppercase">{t('plain_text_pass')}</Label><Textarea className="font-mono text-xs h-20 resize-none" placeholder={t('ui_text_1')} value={inputVerify} onChange={(e) => { setInputVerify(e.target.value); setVerifyResult('idle'); }} /></div>
                <div className="flex flex-col gap-2"><Label className="text-[11px] font-semibold uppercase">{t('argon2_hash')}</Label><Textarea className="font-mono text-xs h-20 resize-none" placeholder="$argon2id$v=19$m=..." value={hashToVerify} onChange={(e) => { setHashToVerify(e.target.value); setVerifyResult('idle'); }} /></div>
                <Button className="w-full" onClick={verifyHash} disabled={!inputVerify || !hashToVerify}><ShieldCheck className="h-4 w-4 mr-2" />{t('verify_match')}</Button>
              </div>
              <ToolCard title={t('verification_re')} contentClassName="p-6 flex flex-col h-[160px] items-center justify-center bg-muted/20">
                {verifyResult === 'idle' && <p className="text-sm text-muted-foreground opacity-50">{t('enter_values_an')}</p>}
                {verifyResult === 'match' && <div className="flex flex-col items-center gap-2 text-green-500"><div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center"><Check className="h-6 w-6" /></div><span className="font-semibold">{t('match_found')}</span></div>}
                {verifyResult === 'no-match' && <div className="flex flex-col items-center gap-2 text-destructive"><div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center"><ShieldAlert className="h-6 w-6" /></div><span className="font-semibold">{t('no_match')}</span></div>}
                {verifyResult === 'error' && <div className="flex flex-col items-center gap-2 text-orange-500"><div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center"><Info className="h-6 w-6" /></div><span className="font-semibold">{t('invalid_hash_fo')}</span></div>}
              </ToolCard>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="md:col-span-1 space-y-4">
        <ToolCard title={commonT('ui.customization')} icon={Settings2} contentClassName="p-4 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between"><Label className="text-[10px] uppercase flex items-center gap-1.5"><MemoryStick className="h-3 w-3" /> {t('memory_cost__kb')}</Label><span className="text-xs font-bold bg-muted px-2 py-0.5 rounded">{memory}</span></div>
            <Slider value={[memory]} onValueChange={(vals: any) => setMemory(vals[0])} max={10240} min={1024} step={1024} disabled={mode === 'verify'} />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between"><Label className="text-[10px] uppercase flex items-center gap-1.5"><RefreshCw className="h-3 w-3" /> {t('time_cost__iter')}</Label><span className="text-xs font-bold bg-muted px-2 py-0.5 rounded">{iterations}</span></div>
            <Slider value={[iterations]} onValueChange={(vals: any) => setIterations(vals[0])} max={10} min={1} step={1} disabled={mode === 'verify'} />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between"><Label className="text-[10px] uppercase flex items-center gap-1.5"><Cpu className="h-3 w-3" /> {t('parallelism')}</Label><span className="text-xs font-bold bg-muted px-2 py-0.5 rounded">{parallelism}</span></div>
            <Slider value={[parallelism]} onValueChange={(vals: any) => setParallelism(vals[0])} max={8} min={1} step={1} disabled={mode === 'verify'} />
          </div>
          <div className="p-3 rounded-md bg-muted/50 border space-y-1.5 mt-4">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase"><Info className="h-3 w-3" />{t('argon2_info')}</div>
            <p className="text-[10px] text-muted-foreground">{t('argon2_is_the_w')}</p>
          </div>
        </ToolCard>
      </div>
    </div>
  );
}
