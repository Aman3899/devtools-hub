"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';

const COMMON_TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Dubai',
  'Asia/Karachi',
  'Australia/Sydney',
];

export function TimezoneConverterClient() {
  const t = useTranslations('tools.timezone-converter');
  const tCommon = useTranslations('common');
  
  const [selectedTimezones, setSelectedTimezones] = useState<string[]>(['UTC', 'Asia/Karachi']);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { copiedType, copyToClipboard } = useCopyToClipboard();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const removeTimezone = (tz: string) => {
    setSelectedTimezones(selectedTimezones.filter(t => t !== tz));
  };

  const addTimezone = (tz: string) => {
    if (!selectedTimezones.includes(tz)) {
      setSelectedTimezones([...selectedTimezones, tz]);
    }
  };

  const formatTime = (date: Date, tz: string) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(date);
  };

  const formatDate = (date: Date, tz: string) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Controls Card */}
      <ToolCard 
        title={t('add_timezone')}
        contentClassName="p-6"
      >
        <div className="flex gap-4">
          <Select onValueChange={(val) => val && addTimezone(val as string)}>
            <SelectTrigger className="w-full h-10 text-xs border-border">
              <SelectValue placeholder={t('select_timezone')} />
            </SelectTrigger>
            <SelectContent>
              {COMMON_TIMEZONES.map(tz => (
                <SelectItem key={tz} value={tz} className="text-xs">{tz}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </ToolCard>

      {/* Timezones Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {selectedTimezones.map(tz => {
          const timeStr = formatTime(currentTime, tz);
          const dateStr = formatDate(currentTime, tz);
          return (
            <ToolCard 
              key={tz} 
              title={tz}
              action={
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTimezone(tz)}
                  className="h-6 w-6 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              }
              contentClassName="p-4 flex flex-col items-center justify-center gap-2"
            >
              <div className="text-3xl font-mono font-bold text-foreground">
                {timeStr}
              </div>
              <div className="text-xs text-muted-foreground">
                {dateStr}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(`${timeStr} ${dateStr}`, tz)}
                className="h-7 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground mt-2 transition-colors"
              >
                {copiedType === tz ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                {tCommon('copy')}
              </Button>
            </ToolCard>
          );
        })}
      </div>
    </div>
  );
}
