'use client';

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Settings2, RefreshCw, ArrowRightLeft, List } from 'lucide-react';
import { toast } from 'sonner';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, ToolActions, InfoBox, CodeTextarea } from '@/components/common';

export function CaesarCipherClient() {
  const t = useTranslations('tools.caesar-cipher');
  const commonT = useTranslations('common');
  
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [shift, setShift] = useState(3);
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [isBruteForce, setIsBruteForce] = useState(false);

  const caesarShift = (text: string, amount: number) => {
    if (amount < 0) return caesarShift(text, amount + 26);
    let result = '';
    for (let i = 0; i < text.length; i++) {
      let c = text[i];
      if (c.match(/[a-z]/i)) {
        let code = text.charCodeAt(i);
        if (code >= 65 && code <= 90) c = String.fromCharCode(((code - 65 + amount) % 26) + 65);
        else if (code >= 97 && code <= 122) c = String.fromCharCode(((code - 97 + amount) % 26) + 97);
      }
      result += c;
    }
    return result;
  };

  const processData = useCallback(() => {
    if (!input.trim()) { setOutput(''); return; }
    if (isBruteForce) {
      let bruteForceOut = '';
      for (let i = 1; i < 26; i++) bruteForceOut += `Shift +${i}:\n${caesarShift(input, i)}\n\n`;
      setOutput(bruteForceOut);
    } else {
      const actualShift = mode === 'encode' ? shift : (26 - shift);
      setOutput(caesarShift(input, actualShift));
    }
  }, [input, shift, mode, isBruteForce]);

  useEffect(() => { processData(); }, [processData]);

  const loadSample = () => { setInput('Hello World! This is Caesar Cipher.'); setShift(3); setMode('encode'); setIsBruteForce(false); toast.success(commonT('success')); };
  const clear = () => { setInput(''); setOutput(''); };

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 grid gap-4 md:grid-cols-2">
        <ToolCard 
          title={commonT('input')} 
          action={
            <ToolActions onSample={loadSample} onClear={clear} />
          }
          contentClassName="p-0"
        >
          <CodeTextarea
            placeholder={t('enter_text_to_s')}
            value={input}
            onChange={(val) => setInput(val)}
          />
        </ToolCard>

        <ToolCard 
          title={commonT('ui.result')} 
          action={<CopyButton text={output} type="cipher" disabled={!output} />}
          disabled={!output} 
          contentClassName="p-0 bg-muted/20"
        >
          <CodeTextarea
            value={output}
            onChange={() => {}}
            placeholder={t('result_will_app')}
            disabled
          />
        </ToolCard>
      </div>

      <div className="md:col-span-1 space-y-4">
        <ToolCard title={commonT('ui.customization')} icon={Settings2} contentClassName="p-4 space-y-6">
          <div className="flex bg-muted/30 p-1 rounded-md border border-border">
            <Button variant={mode === 'encode' && !isBruteForce ? 'default' : 'ghost'} size="sm" className="flex-1 h-7 text-[10px] rounded-sm" onClick={() => { setMode('encode'); setIsBruteForce(false); }}><ArrowRightLeft className="h-3 w-3 mr-1.5" />{t('encode')}</Button>
            <Button variant={mode === 'decode' && !isBruteForce ? 'default' : 'ghost'} size="sm" className="flex-1 h-7 text-[10px] rounded-sm" onClick={() => { setMode('decode'); setIsBruteForce(false); }}><RefreshCw className="h-3 w-3 mr-1.5" />{t('decode')}</Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between"><Label className="text-[10px] uppercase">{t('shift_value')}</Label><span className="text-xs font-bold bg-muted px-2 py-0.5 rounded">{shift}</span></div>
            <Slider value={[shift]} onValueChange={(vals: any) => setShift(vals[0])} max={25} min={1} step={1} disabled={isBruteForce} className="w-full" />
          </div>

          <div className="pt-4 border-t"><Button variant={isBruteForce ? "default" : "outline"} className="w-full h-9 text-xs" onClick={() => setIsBruteForce(!isBruteForce)}><List className="h-4 w-4 mr-2" />{t('brute_force')}</Button></div>

          <InfoBox title={t('ui_text_1')}>
            {t('caesar_cipher_i')}
          </InfoBox>
        </ToolCard>
      </div>
    </div>
  );
}
