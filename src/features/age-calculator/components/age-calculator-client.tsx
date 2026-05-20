"use client"

import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';

export function AgeCalculatorClient() {
  const t = useTranslations('tools.age-calculator');
  const { copiedType, copyToClipboard } = useCopyToClipboard();
  
  const [dob, setDob] = useState<string>('1990-01-01');
  const [result, setResult] = useState<{ years: number; months: number; days: number; } | null>(null);

  const calculateAge = () => {
    if (!dob) return;
    const birthDate = new Date(dob);
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();
    if (months < 0 || (months === 0 && days < 0)) { years--; months += 12; }
    if (days < 0) { const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0); days += prevMonth.getDate(); months--; }
    setResult({ years, months, days });
  };

  useEffect(() => { calculateAge(); }, [dob]);

  return (
    <div className="space-y-6">
      <ToolCard title="Enter Date of Birth" icon={Calendar} contentClassName="p-6">
        <div className="space-y-2 max-w-xs">
          <Label htmlFor="dob" className="text-xs font-medium">{t('dob')}</Label>
          <div className="relative">
            <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="pl-10 text-xs h-10 border-border focus-visible:ring-1 focus-visible:ring-primary" />
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </ToolCard>

      {result && (
        <div className="grid gap-4 md:grid-cols-3">
          <ToolCard title={t('years')} copyText={result.years.toString()} copyType="years" copiedType={copiedType} onCopy={copyToClipboard} contentClassName="p-4 flex flex-col items-center justify-center gap-2">
            <div className="text-4xl font-mono font-bold text-foreground">{result.years}</div>
          </ToolCard>
          <ToolCard title={t('months')} copyText={result.months.toString()} copyType="months" copiedType={copiedType} onCopy={copyToClipboard} contentClassName="p-4 flex flex-col items-center justify-center gap-2">
            <div className="text-4xl font-mono font-bold text-foreground">{result.months}</div>
          </ToolCard>
          <ToolCard title={t('days')} copyText={result.days.toString()} copyType="days" copiedType={copiedType} onCopy={copyToClipboard} contentClassName="p-4 flex flex-col items-center justify-center gap-2">
            <div className="text-4xl font-mono font-bold text-foreground">{result.days}</div>
          </ToolCard>
        </div>
      )}
    </div>
  );
}
