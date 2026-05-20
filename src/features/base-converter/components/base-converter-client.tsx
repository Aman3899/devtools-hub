'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings2, Hash, RefreshCw, Trash2, Check, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';

export function BaseConverterClient() {
  const t = useTranslations('tools.base-converter');
  const commonT = useTranslations('common');
  const { copiedType, copyToClipboard } = useCopyToClipboard();
  
  const [values, setValues] = useState({ binary: '', octal: '', decimal: '', hex: '' });
  const [error, setError] = useState('');

  const updateFromBase = useCallback((value: string, base: number) => {
    if (!value.trim()) { setValues({ binary: '', octal: '', decimal: '', hex: '' }); setError(''); return; }
    try {
      const val = value.replace(/\s+/g, '');
      let decimalValue: bigint;
      if (base === 2 && !/^[01]+$/.test(val)) throw new Error('Invalid binary');
      if (base === 8 && !/^[0-7]+$/.test(val)) throw new Error('Invalid octal');
      if (base === 10 && !/^\d+$/.test(val)) throw new Error('Invalid decimal');
      if (base === 16 && !/^[0-9A-Fa-f]+$/.test(val)) throw new Error('Invalid hexadecimal');

      if (base === 16) decimalValue = BigInt('0x' + val);
      else if (base === 2) decimalValue = BigInt('0b' + val);
      else if (base === 8) decimalValue = BigInt('0o' + val);
      else decimalValue = BigInt(val);

      setValues({ binary: decimalValue.toString(2), octal: decimalValue.toString(8), decimal: decimalValue.toString(10), hex: decimalValue.toString(16).toUpperCase() });
      setError('');
    } catch (err) { setError(t('invalid_charact')); }
  }, [t]);

  const loadSample = () => { updateFromBase('255', 10); toast.success(commonT('success')); };
  const clear = () => { setValues({ binary: '', octal: '', decimal: '', hex: '' }); setError(''); };

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 space-y-4">
        <ToolCard 
          title={t('instant_convert')} 
          action={
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={loadSample} className="h-6 px-2 text-[10px] gap-1.5"><RefreshCw className="h-3 w-3" />{t('sample')}</Button>
              <Button variant="ghost" size="icon" onClick={clear} title={commonT('clear')} className="h-6 w-6 hover:text-destructive"><Trash2 className="h-3 w-3" /></Button>
            </div>
          }
          contentClassName="p-6 space-y-6"
        >
          {error && <div className="p-3 bg-destructive/10 text-destructive text-xs rounded-md border border-destructive/20 font-medium text-center">{error}</div>}
          
          <div className="space-y-2">
            <div className="flex items-center justify-between"><Label className="text-xs font-semibold">Decimal (Base 10)</Label><Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(values.decimal, 'dec')} disabled={!values.decimal}>{copiedType === 'dec' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}</Button></div>
            <Input type="text" value={values.decimal} onChange={(e) => { setValues(prev => ({...prev, decimal: e.target.value})); updateFromBase(e.target.value, 10); }} className="font-mono bg-muted/20 focus-visible:ring-1 border-border" placeholder="e.g. 255" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between"><Label className="text-xs font-semibold">Binary (Base 2)</Label><Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(values.binary, 'bin')} disabled={!values.binary}>{copiedType === 'bin' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}</Button></div>
            <Input type="text" value={values.binary} onChange={(e) => { setValues(prev => ({...prev, binary: e.target.value})); updateFromBase(e.target.value, 2); }} className="font-mono bg-muted/20 focus-visible:ring-1 border-border" placeholder="e.g. 11111111" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between"><Label className="text-xs font-semibold">Hexadecimal (Base 16)</Label><Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(values.hex, 'hex')} disabled={!values.hex}>{copiedType === 'hex' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}</Button></div>
            <Input type="text" value={values.hex} onChange={(e) => { setValues(prev => ({...prev, hex: e.target.value})); updateFromBase(e.target.value, 16); }} className="font-mono bg-muted/20 focus-visible:ring-1 border-border" placeholder="e.g. FF" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between"><Label className="text-xs font-semibold">Octal (Base 8)</Label><Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(values.octal, 'oct')} disabled={!values.octal}>{copiedType === 'oct' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}</Button></div>
            <Input type="text" value={values.octal} onChange={(e) => { setValues(prev => ({...prev, octal: e.target.value})); updateFromBase(e.target.value, 8); }} className="font-mono bg-muted/20 focus-visible:ring-1 border-border" placeholder="e.g. 377" />
          </div>
        </ToolCard>
      </div>

      <div className="md:col-span-1 space-y-4">
        <ToolCard title={commonT('ui.customization')} icon={Settings2} contentClassName="p-4 space-y-6">
          <div className="p-3 rounded-md bg-muted/50 border border-border space-y-1.5">
            <div className="flex items-center gap-2 text-[10px] font-semibold text-foreground uppercase tracking-tight"><Hash className="h-3 w-3" />{t('bigint_support')}</div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">{t('this_converter')}</p>
          </div>
        </ToolCard>
      </div>
    </div>
  );
}
