"use client"

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Settings2 } from 'lucide-react';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, ToolActions, InfoBox, CodeTextarea } from '@/components/common';

const rot13 = (str: string) => str.replace(/[a-zA-Z]/g, c => {
  const base = c.charCodeAt(0) <= 90 ? 65 : 97;
  return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
});

export function Rot13EncoderClient() {
  const t = useTranslations('tools.rot13-encoder');
  const commonT = useTranslations('common');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  useEffect(() => { setOutput(input.trim() ? rot13(input) : ''); }, [input]);

  const loadSample = () => setInput('Why did the chicken cross the road? Gb trg gb gur bgure fvqr!');

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">
        <ToolCard
          title={commonT('input')}
          action={<ToolActions onSample={loadSample} onClear={() => { setInput(''); setOutput(''); }} />}
          contentClassName="p-0 flex flex-col h-[400px]"
        >
          <CodeTextarea placeholder={t('enter_text_to_e')} value={input} onChange={setInput} />
        </ToolCard>

        <ToolCard
          title={commonT('ui.result')}
          action={<CopyButton text={output} type="rot13" />}
          contentClassName="p-0 flex flex-col h-[400px] bg-muted/20"
        >
          <CodeTextarea value={output} onChange={() => {}} placeholder={t('result_will_app')} disabled className="text-[#98c379]" />
        </ToolCard>
      </div>

      <div className="md:col-span-1 space-y-4">
        <ToolCard title={commonT('ui.customization')} icon={Settings2} contentClassName="p-4 space-y-6">
          <InfoBox title={t('ui_text_1')} variant="default">{t('rot13_is_a_simp')}</InfoBox>
        </ToolCard>
      </div>
    </div>
  );
}
