'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Check, Clock, Calendar, RefreshCcw, Globe } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function TimestampConverterClient() {
  const t = useTranslations('tools.timestamp-converter');
  const tCommon = useTranslations('common');
  const [unix, setUnix] = useState(Math.floor(Date.now() / 1000).toString());
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000));

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(timer);
  }, []);

  const getDates = (ts: string) => {
    try {
      const val = parseInt(ts);
      if (isNaN(val)) throw new Error('Invalid');
      // Detect if milliseconds or seconds
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
  };

  const getRelativeTime = (date: Date) => {
    const diff = Math.floor((date.getTime() - Date.now()) / 1000);
    const absDiff = Math.abs(diff);
    if (absDiff < 60) return diff > 0 ? t('relativeFormat.inSeconds', { v: absDiff }) : t('relativeFormat.secondsAgo', { v: absDiff });
    if (absDiff < 3600) return diff > 0 ? t('relativeFormat.inMinutes', { v: Math.floor(absDiff/60) }) : t('relativeFormat.minutesAgo', { v: Math.floor(absDiff/60) });
    if (absDiff < 86400) return diff > 0 ? t('relativeFormat.inHours', { v: Math.floor(absDiff/3600) }) : t('relativeFormat.hoursAgo', { v: Math.floor(absDiff/3600) });
    return diff > 0 ? t('relativeFormat.inDays', { v: Math.floor(absDiff/86400) }) : t('relativeFormat.daysAgo', { v: Math.floor(absDiff/86400) });
  };

  const dates = getDates(unix);

  const copy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-[2rem] border-muted-foreground/10 bg-card/50 backdrop-blur-md overflow-hidden">
        <CardContent className="p-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary/60">{t('current')}</p>
              <div className="text-4xl font-black tabular-nums">{currentTime}</div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setUnix(currentTime.toString())}
                className="rounded-xl gap-2 h-12 px-6 border-primary/20 hover:bg-primary/5 hover:text-primary"
              >
                <RefreshCcw className="h-4 w-4" />
                {t('useCurrent')}
              </Button>
            </div>
          </div>
          
          <div className="relative group">
            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type="text"
              placeholder="Unix Timestamp (e.g. 1715241600)"
              className="h-16 pl-12 text-xl font-mono rounded-2xl bg-muted/30 border-muted-foreground/10 focus-visible:ring-primary"
              value={unix}
              onChange={(e) => setUnix(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { key: 'iso', label: t('iso'), icon: Calendar },
          { key: 'local', label: t('local'), icon: Clock },
          { key: 'utc', label: t('utc'), icon: Globe },
          { key: 'relative', label: t('relative'), icon: RefreshCcw }
        ].map((item) => (
          <Card key={item.key} className="rounded-[2rem] border-muted-foreground/10 bg-card/50 backdrop-blur-md group hover:border-primary/20 transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <item.icon className="h-3 w-3" />
                {item.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm font-medium h-12 flex items-center break-all line-clamp-2">
                {dates ? (dates as any)[item.key] : '-'}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full rounded-xl gap-2 hover:bg-primary/5"
                onClick={() => copy((dates as any)[item.key], item.key)}
                disabled={!dates}
              >
                {copiedType === item.key ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                {tCommon('copy')}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
