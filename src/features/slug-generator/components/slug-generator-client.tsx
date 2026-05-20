"use client"

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Link as LinkIcon, Settings2 } from 'lucide-react';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, ToolActions, InfoBox, StatsDisplay } from '@/components/common';

const STOP_WORDS = new Set(['a','an','the','and','or','but','is','if','then','else','when','at','from','by','for','with','about','to','up','down','in','out','on','off','over','under']);

export function SlugGeneratorClient() {
  const t = useTranslations('tools.slug-generator');
  const commonT = useTranslations('common');

  const [input, setInput] = useState('');
  const [slug, setSlug] = useState('');
  const [lowercase, setLowercase] = useState(true);
  const [removeStopWords, setRemoveStopWords] = useState(false);

  useEffect(() => {
    let result = input.trim();
    if (lowercase) result = result.toLowerCase();
    if (removeStopWords) result = result.split(/\s+/).filter(w => !STOP_WORDS.has(w.toLowerCase())).join(' ');
    result = result.replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
    setSlug(result);
  }, [input, lowercase, removeStopWords]);

  const loadSample = () => setInput('10 Amazing Developer Tools You Should Use in 2024');

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 space-y-4">
        <ToolCard
          title={<StatsDisplay title={t('input')} stats={{ chars: input.length, words: input.trim() ? input.trim().split(/\s+/).length : 0 }} />}
          action={<ToolActions onSample={loadSample} onClear={() => setInput('')} />}
          contentClassName="p-0 overflow-hidden"
        >
          <Input
            placeholder={t('placeholder')}
            className="font-sans text-xs h-12 border-none focus-visible:ring-0 px-3 bg-transparent shadow-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </ToolCard>

        <ToolCard
          title={t('output')}
          action={<CopyButton text={slug} type="slug" />}
          contentClassName="min-h-[80px] flex items-center px-4 py-3 bg-muted/20 overflow-hidden relative"
        >
          <div className="font-mono text-xs break-all pr-8 leading-relaxed">
            {slug || <span className="text-muted-foreground opacity-30">{t('placeholder_slug')}</span>}
          </div>
          {slug && <LinkIcon className="absolute right-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/20" />}
        </ToolCard>
      </div>

      <div className="md:col-span-1 space-y-4">
        <ToolCard title={commonT('ui.customization')} icon={Settings2} contentClassName="p-4 space-y-5">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5"><Label className="text-xs">Lowercase</Label><p className="text-[10px] text-muted-foreground leading-tight">All chars to lowercase</p></div>
            <Switch checked={lowercase} onCheckedChange={setLowercase} className="scale-75 origin-right" />
          </div>
          <div className="flex items-center justify-between border-t pt-4">
            <div className="space-y-0.5"><Label className="text-xs">Stop Words</Label><p className="text-[10px] text-muted-foreground leading-tight">Strip a, the, is, etc.</p></div>
            <Switch checked={removeStopWords} onCheckedChange={setRemoveStopWords} className="scale-75 origin-right" />
          </div>
        </ToolCard>
        <InfoBox>{t('article').split('.')[0]}.</InfoBox>
      </div>
    </div>
  );
}
