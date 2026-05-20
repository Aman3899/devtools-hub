"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Copy, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { Input } from '@/components/ui/input';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';

export function DateDifferenceCalcClient() {
  const t = useTranslations('tools.date-difference-calc');
  const tCommon = useTranslations('common');
  
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<{ days: number; weeks: number; months: number; years: number; } | null>(null);
  
  const { copiedType, copyToClipboard } = useCopyToClipboard();

  const calculateDifference = () => {
    if (!startDate || !endDate) return;
    const start = new Date(startDate); const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(diffDays / 7);
    const years = end.getFullYear() - start.getFullYear();
    const months = (years * 12) + (end.getMonth() - start.getMonth());
    setResult({ days: diffDays, weeks: weeks, months: months, years: years });
  };

  useEffect(() => { calculateDifference(); }, [startDate, endDate]);

  return (
    <div className="space-y-6">
      <ToolCard title="Select Dates" contentClassName="p-6 grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="start-date" className="text-xs font-medium">{t('start_date')}</Label>
          <div className="relative">
            <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="pl-10 text-xs h-10 border-border focus-visible:ring-1 focus-visible:ring-primary" />
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="end-date" className="text-xs font-medium">{t('end_date')}</Label>
          <div className="relative">
            <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="pl-10 text-xs h-10 border-border focus-visible:ring-1 focus-visible:ring-primary" />
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </ToolCard>

      {result && (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {[
            { label: t('days'), value: result.days, id: 'days' },
            { label: t('weeks'), value: result.weeks, id: 'weeks' },
            { label: t('months'), value: result.months, id: 'months' },
            { label: t('years'), value: result.years, id: 'years' }
          ].map(item => (
            <ToolCard key={item.id} title={item.label} contentClassName="p-4 flex flex-col items-center justify-center gap-2">
              <div className="text-3xl font-mono font-bold text-foreground">{item.value}</div>
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(item.value.toString(), item.id)} className="h-7 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground">
                {copiedType === item.id ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                {tCommon('copy')}
              </Button>
            </ToolCard>
          ))}
        </div>
      )}
    </div>
  );
}
