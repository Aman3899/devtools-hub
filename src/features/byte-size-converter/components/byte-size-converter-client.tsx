"use client"

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Repeat } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';

export function ByteSizeConverterClient() {
  const tCommon = useTranslations('common');
  const { copiedType, copyToClipboard } = useCopyToClipboard();

  const [values, setValues] = useState({ b: '', kb: '', mb: '', gb: '', tb: '' });

  const updateAll = (val: string, unit: 'b'|'kb'|'mb'|'gb'|'tb') => {
    if (!val || isNaN(parseFloat(val))) {
      setValues({ b: '', kb: '', mb: '', gb: '', tb: '' });
      return;
    }
    const num = parseFloat(val);
    let bytes = 0;
    switch(unit) {
      case 'b': bytes = num; break;
      case 'kb': bytes = num * 1024; break;
      case 'mb': bytes = num * 1024 * 1024; break;
      case 'gb': bytes = num * 1024 * 1024 * 1024; break;
      case 'tb': bytes = num * 1024 * 1024 * 1024 * 1024; break;
    }

    setValues({
      b: bytes.toString(),
      kb: (bytes / 1024).toPrecision(8).replace(/\.?0+$/, ''),
      mb: (bytes / (1024 * 1024)).toPrecision(8).replace(/\.?0+$/, ''),
      gb: (bytes / (1024 * 1024 * 1024)).toPrecision(8).replace(/\.?0+$/, ''),
      tb: (bytes / (1024 * 1024 * 1024 * 1024)).toPrecision(8).replace(/\.?0+$/, '')
    });
  };

  const units = [
    { id: 'b', label: 'Bytes (B)', value: values.b },
    { id: 'kb', label: 'Kilobytes (KB)', value: values.kb },
    { id: 'mb', label: 'Megabytes (MB)', value: values.mb },
    { id: 'gb', label: 'Gigabytes (GB)', value: values.gb },
    { id: 'tb', label: 'Terabytes (TB)', value: values.tb },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button variant="ghost" size="sm" onClick={() => setValues({ b: '', kb: '', mb: '', gb: '', tb: '' })} className="h-8 text-xs text-muted-foreground hover:text-destructive">
          {tCommon('clear')}
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
