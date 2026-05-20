"use client"

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check, Clock, Calendar, RefreshCw, Globe, Info, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';

export function TimestampConverterClient() {
  const t = useTranslations('tools.timestamp-converter');
  const tCommon = useTranslations('common');
  const [unix, setUnix] = useState(Math.floor(Date.now() / 1000).toString());
  const { copiedType, copyToClipboard } = useCopyToClipboard();
  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000));

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(timer);
  }, []);

  const getRelativeTime = useCallback((date: Date) => {
    const diff = Math.floor((date.getTime() - Date.now()) / 1000);
    const absDiff = Math.abs(diff);
    if (absDiff < 60) return diff > 0 ? t('relativeFormat.inSeconds', { v: absDiff }) : t('relativeFormat.secondsAgo', { v: absDiff });
    if (absDiff < 3600) return diff > 0 ? t('relativeFormat.inMinutes', { v: Math.floor(absDiff/60) }) : t('relativeFormat.minutesAgo', { v: Math.floor(absDiff/60) });
    if (absDiff < 86400) return diff > 0 ? t('relativeFormat.inHours', { v: Math.floor(absDiff/3600) }) : t('relativeFormat.hoursAgo', { v: Math.floor(absDiff/3600) });
    return diff > 0 ? t('relativeFormat.inDays', { v: Math.floor(absDiff/86400) }) : t('relativeFormat.daysAgo', { v: Math.floor(absDiff/86400) });
  }, [t]);

  const getDates = useCallback((ts: string) => {
    try {
      const val = parseInt(ts);
      if (isNaN(val)) throw new Error('Invalid');
      const date = val > 10000000000 ? new Date(val) : new Date(val * 1000);
      return {
        iso: date.toISOString(),
        local: date.toLocaleString(),
        utc: date.toUTCString(),
        relative: getRelativeTime(date)
      };
    } catch {
      return null;
    }
  }, [getRelativeTime]);

  const dates = getDates(unix);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <ToolCard 
          title={t('input')}
          action={
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setUnix(currentTime.toString())}
                className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <RefreshCw className="h-3 w-3" />
                {t('useCurrent')}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setUnix('')} title={tCommon('clear')} className="h-6 w-6 text-muted-foreground hover:text-destructive">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          }
          contentClassName="p-4"
        >
          <div className="relative group">
            <Clock className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t('placeholder' as any) || "Unix Timestamp (e.g. 1715241600)"}
              className="h-10 pl-7 text-lg font-mono border-none focus-visible:ring-0 shadow-none bg-transparent"
              value={unix}
              onChange={(e) => setUnix(e.target.value)}
            />
          </div>
        </ToolCard>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[
          { key: 'iso', label: t('iso'), icon: Calendar },
          { key: 'local', label: t('local'), icon: Clock },
          { key: 'utc', label: t('utc'), icon: Globe },
          { key: 'relative', label: t('relative'), icon: RefreshCw }
        ].map((item) => (
          <ToolCard 
            key={item.key}
            title={
              <span className="flex items-center gap-1.5">
                <item.icon className="h-3 w-3" />
                {item.label}
              </span>
            }
            action={
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 text-[10px] gap-1.5 transition-colors"
                onClick={() => dates && copyToClipboard((dates as any)[item.key], item.key)}
                disabled={!dates}
              >
                {copiedType === item.key ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                {tCommon('copy')}
              </Button>
            }
            contentClassName="p-3 bg-muted/20"
          >
            <div className="text-xs font-mono font-medium truncate">
              {dates ? (dates as any)[item.key] : '-'}
            </div>
          </ToolCard>
        ))}
      </div>
    </div>
  );
}
