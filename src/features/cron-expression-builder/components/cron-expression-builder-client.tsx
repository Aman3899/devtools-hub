"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';

export function CronExpressionBuilderClient() {
  const t = useTranslations('tools.cron-expression-builder');
  const tCommon = useTranslations('common');
  const { copiedType, copyToClipboard } = useCopyToClipboard();
  
  const [minute, setMinute] = useState('*');
  const [hour, setHour] = useState('*');
  const [dayOfMonth, setDayOfMonth] = useState('*');
  const [month, setMonth] = useState('*');
  const [dayOfWeek, setDayOfWeek] = useState('*');
  const [cronExpression, setCronExpression] = useState('* * * * *');

  useEffect(() => { setCronExpression(`${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`); }, [minute, hour, dayOfMonth, month, dayOfWeek]);

  const getCommonOptions = (max: number, start: number = 0) => {
    const options = [{ label: 'Every', value: '*' }];
    for (let i = start; i <= max; i++) options.push({ label: i.toString(), value: i.toString() });
    return options;
  };

  const minutesOptions = getCommonOptions(59);
  const hoursOptions = getCommonOptions(23);
  const daysOptions = getCommonOptions(31, 1);
  const monthsOptions = [
    { label: 'Every', value: '*' }, { label: 'January', value: '1' }, { label: 'February', value: '2' },
    { label: 'March', value: '3' }, { label: 'April', value: '4' }, { label: 'May', value: '5' },
    { label: 'June', value: '6' }, { label: 'July', value: '7' }, { label: 'August', value: '8' },
    { label: 'September', value: '9' }, { label: 'October', value: '10' }, { label: 'November', value: '11' }, { label: 'December', value: '12' }
  ];
  const daysOfWeekOptions = [
    { label: 'Every', value: '*' }, { label: 'Sunday', value: '0' }, { label: 'Monday', value: '1' },
    { label: 'Tuesday', value: '2' }, { label: 'Wednesday', value: '3' }, { label: 'Thursday', value: '4' },
    { label: 'Friday', value: '5' }, { label: 'Saturday', value: '6' }
  ];

  return (
    <div className="space-y-6">
      <ToolCard title="Visual Picker" contentClassName="p-6 grid gap-4 md:grid-cols-5">
        <div className="space-y-2"><Label className="text-xs font-medium">{t('minute')}</Label><Select value={minute} onValueChange={(val) => val && setMinute(val)}><SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger><SelectContent>{minutesOptions.map(opt => (<SelectItem key={opt.value} value={opt.value} className="text-xs">{opt.label}</SelectItem>))}</SelectContent></Select></div>
        <div className="space-y-2"><Label className="text-xs font-medium">{t('hour')}</Label><Select value={hour} onValueChange={(val) => val && setHour(val)}><SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger><SelectContent>{hoursOptions.map(opt => (<SelectItem key={opt.value} value={opt.value} className="text-xs">{opt.label}</SelectItem>))}</SelectContent></Select></div>
        <div className="space-y-2"><Label className="text-xs font-medium">{t('day_of_month')}</Label><Select value={dayOfMonth} onValueChange={(val) => val && setDayOfMonth(val)}><SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger><SelectContent>{daysOptions.map(opt => (<SelectItem key={opt.value} value={opt.value} className="text-xs">{opt.label}</SelectItem>))}</SelectContent></Select></div>
        <div className="space-y-2"><Label className="text-xs font-medium">{t('month')}</Label><Select value={month} onValueChange={(val) => val && setMonth(val)}><SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger><SelectContent>{monthsOptions.map(opt => (<SelectItem key={opt.value} value={opt.value} className="text-xs">{opt.label}</SelectItem>))}</SelectContent></Select></div>
        <div className="space-y-2"><Label className="text-xs font-medium">{t('day_of_week')}</Label><Select value={dayOfWeek} onValueChange={(val) => val && setDayOfWeek(val)}><SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger><SelectContent>{daysOfWeekOptions.map(opt => (<SelectItem key={opt.value} value={opt.value} className="text-xs">{opt.label}</SelectItem>))}</SelectContent></Select></div>
      </ToolCard>

      <ToolCard 
        title="Generated Cron Expression" 
        action={<Button variant="ghost" size="sm" onClick={() => copyToClipboard(cronExpression, 'cron')} className="h-7 text-[10px] gap-1.5">{copiedType === 'cron' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}{tCommon('copy')}</Button>}
        contentClassName="p-6 flex flex-col items-center justify-center gap-4 bg-muted/10"
      >
        <div className="text-3xl font-mono font-bold text-foreground tracking-wider">{cronExpression}</div>
      </ToolCard>
    </div>
  );
}
