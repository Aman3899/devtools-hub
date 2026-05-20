"use client"

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCw, Settings2 } from 'lucide-react';
import { toast } from 'sonner';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';

const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

export function LoremIpsumClient() {
  const t = useTranslations('tools.lorem-ipsum');
  const commonT = useTranslations('common');
  const [count, setCount] = useState(3);
  const [output, setOutput] = useState('');

  const generate = () => {
    setOutput(Array.from({ length: count }, () => LOREM).join('\n\n'));
    toast.success(commonT('success'));
  };

  const words = output.split(/\s+/).filter(Boolean).length;

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2">
        <ToolCard
          title={<StatsDisplay title={t('output')} stats={output ? { words, chars: output.length } : undefined} />}
          action={<CopyButton text={output} type="lorem" />}
          contentClassName="p-0 flex flex-col h-[500px] bg-muted/20"
        >
          <CodeTextarea value={output} onChange={() => {}} placeholder={t('placeholder')} disabled />
        </ToolCard>
      </div>

      <div className="md:col-span-1 space-y-4">
        <ToolCard title={commonT('ui.customization')} icon={Settings2} contentClassName="p-4 space-y-5">
          <div className="space-y-2">
            <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{t('paragraphs')}</Label>
            <Input type="number" value={count} onChange={(e) => setCount(Number(e.target.value))} min={1} max={50} className="h-8 text-xs bg-muted/30 border-border" />
          </div>
          <Button className="w-full h-8 text-xs" onClick={generate}>
            <RefreshCw className="h-3.5 w-3.5 mr-2" />{t('generate')}
          </Button>
          <InfoBox className="mt-4">{t('article').split('.')[0]}.</InfoBox>
        </ToolCard>
      </div>
    </div>
  );
}
