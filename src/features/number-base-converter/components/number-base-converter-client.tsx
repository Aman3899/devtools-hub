"use client"

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Copy, Hash, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

export function NumberBaseConverterClient() {
  const t = useTranslations('tools.number-base-converter');
  const tCommon = useTranslations('common');
  const { copiedType, copyToClipboard } = useCopyToClipboard();
  
  const [values, setValues] = useState({
    dec: '',
    bin: '',
    oct: '',
    hex: ''
  });

  const handleDecChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9-]/g, '');
    if (val === '-' || val === '') {
      setValues({ dec: val, bin: '', oct: '', hex: '' });
      return;
    }
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      setValues({
        dec: num.toString(10),
        bin: num.toString(2),
        oct: num.toString(8),
        hex: num.toString(16).toUpperCase()
      });
    }
  };

  const handleBinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^01-]/g, '');
    if (val === '-' || val === '') {
      setValues({ dec: '', bin: val, oct: '', hex: '' });
      return;
    }
    const num = parseInt(val, 2);
    if (!isNaN(num)) {
      setValues({
        dec: num.toString(10),
        bin: val,
        oct: num.toString(8),
        hex: num.toString(16).toUpperCase()
      });
    }
  };

  const handleOctChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-7-]/g, '');
    if (val === '-' || val === '') {
      setValues({ dec: '', bin: '', oct: val, hex: '' });
      return;
    }
    const num = parseInt(val, 8);
    if (!isNaN(num)) {
      setValues({
        dec: num.toString(10),
        bin: num.toString(2),
        oct: val,
        hex: num.toString(16).toUpperCase()
      });
    }
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9A-Fa-f-]/g, '');
    if (val === '-' || val === '') {
      setValues({ dec: '', bin: '', oct: '', hex: val });
      return;
    }
    const num = parseInt(val, 16);
    if (!isNaN(num)) {
      setValues({
        dec: num.toString(10),
        bin: num.toString(2),
        oct: num.toString(8),
        hex: val.toUpperCase()
      });
    }
  };

  const clearAll = () => {
    setValues({ dec: '', bin: '', oct: '', hex: '' });
  };

  const bases = [
    { id: 'dec', label: 'Decimal (Base 10)', value: values.dec, onChange: handleDecChange, prefix: '', placeholder: 'e.g. 42' },
    { id: 'bin', label: 'Binary (Base 2)', value: values.bin, onChange: handleBinChange, prefix: '0b', placeholder: 'e.g. 101010' },
    { id: 'oct', label: 'Octal (Base 8)', value: values.oct, onChange: handleOctChange, prefix: '0o', placeholder: 'e.g. 52' },
    { id: 'hex', label: 'Hexadecimal (Base 16)', value: values.hex, onChange: handleHexChange, prefix: '0x', placeholder: 'e.g. 2A' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button variant="ghost" size="sm" onClick={clearAll} className="h-8 text-xs text-muted-foreground hover:text-destructive">
          {tCommon('clear')}
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {bases.map((base) => (
          <ToolCard 
            key={base.id} 
            title={base.label} 
            icon={Hash}
            action={
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => copyToClipboard(base.value, base.id)}
                disabled={!base.value}
                className="h-6 px-2 text-[10px] gap-1.5 transition-colors"
              >
                {copiedType === base.id ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                {tCommon('copy')}
              </Button>
            }
            contentClassName="p-4"
          >
            <div className="relative flex items-center bg-transparent">
              {base.prefix && (
                <span className="absolute left-3 text-sm font-mono text-muted-foreground select-none">
                  {base.prefix}
                </span>
              )}
              <Input
                type="text"
                value={base.value}
                onChange={base.onChange}
                placeholder={base.placeholder}
                className={`h-12 text-lg font-mono border-none focus-visible:ring-0 shadow-none bg-transparent ${base.prefix ? 'pl-9' : 'pl-3'}`}
              />
            </div>
          </ToolCard>
        ))}
      </div>
    </div>
  );
}
