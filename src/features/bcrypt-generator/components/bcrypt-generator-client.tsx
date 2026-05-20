'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings2, Info, RefreshCw, Key, Check, ShieldCheck, ShieldAlert } from 'lucide-react';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import bcrypt from 'bcryptjs';

export function BcryptGeneratorClient() {
  const t = useTranslations('tools.bcrypt-generator');
  const commonT = useTranslations('common');
  const { copiedType, copyToClipboard } = useCopyToClipboard();

  const [mode, setMode] = useState<'hash' | 'verify'>('hash');
  
  const [inputHash, setInputHash] = useState('');
  const [cost, setCost] = useState(10);
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
        const salt = bcrypt.genSaltSync(cost);
        const hash = bcrypt.hashSync(inputHash, salt);
        setOutputHash(hash);
      } catch (err) { setOutputHash(t('error_generatin')); } finally { setIsHashing(false); }
    }, 50);
  }, [inputHash, cost, t]);

  const verifyHash = useCallback(() => {
    if (!inputVerify || !hashToVerify) { setVerifyResult('idle'); return; }
    try {
      const isMatch = bcrypt.compareSync(inputVerify, hashToVerify);
      setVerifyResult(isMatch ? 'match' : 'no-match');
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

              <ToolCard title="Bcrypt Hash" copyText={outputHash} copyType="hash" copiedType={copiedType} onCopy={copyToClipboard} disabled={!outputHash} contentClassName="p-0 flex flex-col h-[200px]">
                <div className="flex-1 flex items-center justify-center p-6 bg-muted/20">
                  {outputHash ? (
                    <div className="w-full text-center space-y-4">
                      <div className="p-4 bg-background border border-border rounded-md shadow-sm"><span className="font-mono text-xs md:text-sm text-[#e06c75] break-all select-all">{outputHash}</span></div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Cost: {cost}</p>
                    </div>
                  ) : <p className="text-sm text-muted-foreground opacity-50">{t('generated_hash')}</p>}
                </div>
              </ToolCard>
            </div>
          </TabsContent>

          <TabsContent value="verify" className="mt-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-4">
                <div className="flex flex-col gap-2"><Label className="text-[11px] font-semibold uppercase">{t('plain_text_pass')}</Label><Input type="text" className="font-mono text-xs h-10" placeholder={t('ui_text_1')} value={inputVerify} onChange={(e) => { setInputVerify(e.target.value); setVerifyResult('idle'); }} /></div>
                <div className="flex flex-col gap-2"><Label className="text-[11px] font-semibold uppercase">{t('bcrypt_hash')}</Label><Input type="text" className="font-mono text-xs h-10" placeholder="$2a$10$..." value={hashToVerify} onChange={(e) => { setHashToVerify(e.target.value); setVerifyResult('idle'); }} /></div>
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
            <div className="flex items-center justify-between"><Label className="text-[10px] uppercase tracking-tight">{t('cost_factor')}</Label><span className="text-xs font-bold bg-muted px-2 py-0.5 rounded">{cost}</span></div>
            <Slider value={[cost]} onValueChange={(vals: any) => setCost(vals[0])} max={16} min={4} step={1} disabled={mode === 'verify'} className="w-full" />
            <p className="text-[9px] text-muted-foreground leading-tight">{t('higher_cost_fac')}</p>
          </div>

          <div className="p-3 rounded-md bg-muted/50 border border-border space-y-1.5 mt-4">
            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase"><Key className="h-3 w-3" />{t('bcrypt_info')}</div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">{t('bcrypt_is_a_pas')}</p>
          </div>
        </ToolCard>
      </div>
    </div>
  );
}
