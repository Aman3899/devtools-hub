"use client"

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Monitor, Smartphone, Cpu, Globe, Search, Settings2 } from 'lucide-react';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, InfoBox, CodeTextarea } from '@/components/common';

export function UserAgentParserClient() {
  const t = useTranslations('tools.user-agent-parser');
  const commonT = useTranslations('common');
  const [input, setInput] = useState('');
  const [result, setResult] = useState<Record<string, string>>({});

  const parseUA = useCallback((ua: string) => {
    if (!ua) { setResult({}); return; }
    const d: Record<string, string> = { browser: t('unknown'), version: t('unknown'), os: t('unknown'), engine: t('unknown'), device: 'Desktop' };
    if (ua.includes('Firefox/')) { d.browser = 'Firefox'; d.version = ua.split('Firefox/')[1]; }
    else if (ua.includes('Edg/')) { d.browser = 'Edge'; d.version = ua.split('Edg/')[1]; }
    else if (ua.includes('Chrome/')) { d.browser = 'Chrome'; d.version = ua.split('Chrome/')[1].split(' ')[0]; }
    else if (ua.includes('Safari/') && !ua.includes('Chrome')) { d.browser = 'Safari'; d.version = ua.split('Version/')[1]?.split(' ')[0] || 'Unknown'; }
    if (ua.includes('Windows NT 10.0')) d.os = 'Windows 10/11';
    else if (ua.includes('Mac OS X')) d.os = 'macOS';
    else if (ua.includes('Android')) { d.os = 'Android'; d.device = 'Mobile'; }
    else if (ua.includes('iPhone') || ua.includes('iPad')) { d.os = 'iOS'; d.device = ua.includes('iPad') ? 'Tablet' : 'Mobile'; }
    else if (ua.includes('Linux')) d.os = 'Linux';
    if (ua.includes('AppleWebKit')) d.engine = 'WebKit';
    else if (ua.includes('Gecko/')) d.engine = 'Gecko';
    setResult(d);
  }, [t]);

  useEffect(() => {
    if (typeof window !== 'undefined') { setInput(navigator.userAgent); parseUA(navigator.userAgent); }
  }, [parseUA]);

  const CARDS = [
    { label: t('browser'), value: `${result.browser || ''} ${result.version?.split('.')[0] || ''}`.trim(), icon: Globe, color: 'bg-blue-500/10', iconColor: 'text-blue-600' },
    { label: t('engine'), value: result.engine, icon: Cpu, color: 'bg-amber-500/10', iconColor: 'text-amber-600' },
    { label: t('os'), value: result.os, icon: Settings2, color: 'bg-emerald-500/10', iconColor: 'text-emerald-600' },
    { label: t('device'), value: result.device, icon: result.device === 'Mobile' ? Smartphone : Monitor, color: 'bg-muted', iconColor: 'text-zinc-500' },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">
        <ToolCard
          title={commonT('input')}
          action={
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={() => { const ua = navigator.userAgent; setInput(ua); parseUA(ua); }} className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground">
                <Search className="h-3 w-3" />{t('detect_current')}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => { setInput(''); setResult({}); }} title={commonT('clear')} className="h-6 w-6 text-muted-foreground hover:text-destructive">
                ✕
              </Button>
            </div>
          }
          contentClassName="p-4"
        >
          <CodeTextarea value={input} onChange={(v) => { setInput(v); parseUA(v); }} placeholder={t('placeholder')} className="h-32" />
        </ToolCard>

        <ToolCard
          title={commonT('ui.result')}
          action={<CopyButton text={JSON.stringify(result, null, 2)} type="result" disabled={!input} />}
          contentClassName="p-4 bg-muted/20"
        >
          <div className="grid grid-cols-2 gap-3">
            {CARDS.map(({ label, value, icon: Icon, color, iconColor }) => (
              <Card key={label} className="border border-border shadow-none bg-background p-3 flex items-center gap-3">
                <div className={`p-2 rounded-md ${color}`}><Icon className={`h-5 w-5 ${iconColor}`} /></div>
                <div className="space-y-0.5 min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">{label}</p>
                  <p className="text-xs font-semibold text-foreground truncate">{value || '—'}</p>
                </div>
              </Card>
            ))}
          </div>
        </ToolCard>
      </div>

      <div className="md:col-span-1 space-y-4">
        <ToolCard title={commonT('ui.options')} icon={Settings2} contentClassName="p-4 space-y-4">
          <InfoBox>{t('article').split('.')[0]}.</InfoBox>
          <p className="text-[10px] text-muted-foreground leading-relaxed">{t('sidebar_desc')}</p>
        </ToolCard>
      </div>
    </div>
  );
}
