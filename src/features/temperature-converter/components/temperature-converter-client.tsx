"use client"

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Repeat } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';

export function TemperatureConverterClient() {
  const tCommon = useTranslations('common');
  const { copiedType, copyToClipboard } = useCopyToClipboard();

  const [values, setValues] = useState({ c: '', f: '', k: '' });

  const updateAll = (val: string, unit: 'c'|'f'|'k') => {
    if (!val || isNaN(parseFloat(val)) || val === '-') {
      setValues(prev => ({ ...prev, [unit]: val, ...(unit !== 'c' && {c: ''}), ...(unit !== 'f' && {f: ''}), ...(unit !== 'k' && {k: ''}) }));
      return;
    }
    
    const num = parseFloat(val);
    let c = 0;
    
    switch(unit) {
      case 'c': c = num; break;
      case 'f': c = (num - 32) * 5/9; break;
      case 'k': c = num - 273.15; break;
    }

    setValues({
      c: unit === 'c' ? val : c.toFixed(2).replace(/\.00$/, ''),
      f: unit === 'f' ? val : ((c * 9/5) + 32).toFixed(2).replace(/\.00$/, ''),
      k: unit === 'k' ? val : (c + 273.15).toFixed(2).replace(/\.00$/, '')
    });
  };

  const units = [
    { id: 'c', label: 'Celsius (°C)', value: values.c },
    { id: 'f', label: 'Fahrenheit (°F)', value: values.f },
    { id: 'k', label: 'Kelvin (K)', value: values.k },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button variant="ghost" size="sm" onClick={() => setValues({ c: '', f: '', k: '' })} className="h-8 text-xs text-muted-foreground hover:text-destructive">
          {tCommon('clear')}
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {units.map((u) => (
          <ToolCard
            key={u.id}
            title={u.label}
            icon={Repeat}
            copyText={u.value}
            copyType={u.id}
            copiedType={copiedType}
            onCopy={copyToClipboard}
            disabled={!u.value}
            contentClassName="p-4"
          >
            <Input
              type="number"
              value={u.value}
              onChange={(e) => updateAll(e.target.value, u.id)}
              placeholder={`0`}
              className="h-12 text-lg font-mono border-none focus-visible:ring-0 shadow-none bg-transparent px-3"
            />
          </ToolCard>
        ))}
      </div>
    </div>
  );
}
