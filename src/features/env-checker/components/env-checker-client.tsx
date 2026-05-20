"use client"

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Settings2, Share2, Lock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, CodeTextarea } from '@/components/common';
import { useLanguage } from '@/hooks/tool';

const SAMPLE_ENV = `# Application Configuration
NODE_ENV=production
PORT=3000

# Security & Authentication
JWT_SECRET=super-secret-key-123
API_KEY=x7y8z9a1b2c3d4e5f6
DB_PASSWORD=my-secure-password-2024

# Third Party Services
STRIPE_WEBHOOK_SECRET=whsec_...
AWS_ACCESS_KEY_ID=AKIA...`;

export function EnvCheckerClient() {
  const t = useTranslations('tools.env-checker');
  const tCommon = useTranslations('common');
  const { isEnglish } = useLanguage();

  const [input, setInput] = useState('');
  const [maskSecrets, setMaskSecrets] = useState(true);

  const parseEnv = useCallback((text: string) =>
    text.split('\n').filter(l => l.trim() && !l.startsWith('#')).map(line => {
      const [key, ...rest] = line.split('=');
      return { key: key.trim(), value: rest.join('=').trim(), isSecret: /KEY|SECRET|PASSWORD|TOKEN|AUTH|API/i.test(key) };
    }), []);

  const envVars = parseEnv(input);

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 space-y-4">
        <ToolCard
          title={tCommon('ui.editor')}
          action={<ToolActions onSample={() => setInput(SAMPLE_ENV)} onClear={() => setInput('')} />}
          contentClassName="p-0 overflow-hidden"
        >
          <CodeTextarea placeholder={t('textareaPlaceholder')} value={input} onChange={setInput} className="min-h-[200px]" />
        </ToolCard>

        <ToolCard
          title={t('validatedTitle')}
          action={
            <div className="flex items-center gap-1">
              <DownloadButton content={input} filename={`.env-${Date.now()}`} disabled={!input} />
              <CopyButton text={input} type="env" />
            </div>
          }
          contentClassName="p-0 overflow-hidden"
        >
          <div className="divide-y divide-border bg-muted/10">
            {envVars.length > 0 ? envVars.map((v, i) => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-muted/30 transition-colors">
                <div className="space-y-1 overflow-hidden pr-4">
                  <div className="flex items-center gap-2">
                    <code className="text-[11px] font-bold text-foreground truncate">{v.key}</code>
                    {v.isSecret && <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-none text-[8px] h-4 px-1 rounded-sm uppercase tracking-tighter"><Lock className="h-2 w-2 mr-1" />{t('sensitive')}</Badge>}
                  </div>
                  <code className="text-[10px] text-muted-foreground font-mono block truncate">{maskSecrets && v.isSecret ? '••••••••••••••••' : v.value}</code>
                </div>
              </div>
            )) : (
              <div className="h-32 flex flex-col items-center justify-center text-muted-foreground text-xs space-y-2 opacity-40 italic">
                <ShieldAlert className="h-6 w-6 mb-1" /><p>{t('noVars')}</p>
              </div>
            )}
          </div>
        </ToolCard>
      </div>

      <div className="md:col-span-1 space-y-4">
        <ToolCard title={t('security')} icon={Settings2} action={<Share2 className="h-3 w-3 text-muted-foreground hover:text-foreground cursor-pointer" />} contentClassName="p-4 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5"><Label className="text-xs">{t('maskSecrets')}</Label><p className="text-[9px] text-muted-foreground leading-tight">{t('maskDesc')}</p></div>
            <Switch checked={maskSecrets} onCheckedChange={setMaskSecrets} className="scale-75 origin-right" />
          </div>
          <InfoBox title={isEnglish ? 'Privacy Note' : 'رازداری کا نوٹ'} variant="default">{t('article').split('.')[1]}.</InfoBox>
          <Button onClick={() => setInput('')} variant="outline" size="sm" className="w-full h-8 gap-2 text-[10px]">{isEnglish ? 'Clear All' : 'سب صاف کریں'}</Button>
        </ToolCard>
      </div>
    </div>
  );
}
