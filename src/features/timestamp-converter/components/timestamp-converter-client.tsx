"use client"

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Check, Clock, Calendar, RefreshCw, Globe, Info, Share2, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

import { ToolNavigation } from '@/components/tool-navigation';

export function TimestampConverterClient() {
  const t = useTranslations('tools.timestamp-converter');
  const tCommon = useTranslations('common');
  const [unix, setUnix] = useState(Math.floor(Date.now() / 1000).toString());
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000));

  const isEnglish = tCommon('hero.searchPlaceholder' as any) === 'Find a tool...';

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

  const copy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 space-y-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('input')}</Label>
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
            </div>
            <Card className="p-4 border border-border shadow-none rounded-md bg-background focus-within:border-foreground/20 transition-colors">
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
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {[
              { key: 'iso', label: t('iso'), icon: Calendar },
              { key: 'local', label: t('local'), icon: Clock },
              { key: 'utc', label: t('utc'), icon: Globe },
              { key: 'relative', label: t('relative'), icon: RefreshCw }
            ].map((item) => (
              <div key={item.key} className="flex flex-col gap-2">
                <div className="flex items-center justify-between px-1">
                  <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <item.icon className="h-3 w-3" />
                    {item.label}
                  </Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => dates && copy((dates as any)[item.key], item.key)}
                    disabled={!dates}
                  >
                    {copiedType === item.key ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                    {tCommon('copy')}
                  </Button>
                </div>
                <Card className="p-3 border border-border shadow-none rounded-md bg-muted/20">
                  <div className="text-xs font-mono font-medium truncate">
                    {dates ? (dates as any)[item.key] : '-'}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <Card className="border border-border shadow-none rounded-md bg-background">
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-xs font-semibold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  {isEnglish ? 'Live Status' : 'لائیو صورتحال'}
                </div>
                <Share2 className="h-3 w-3 text-muted-foreground hover:text-foreground cursor-pointer" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-6">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{t('current')}</Label>
                <div className="text-2xl font-bold font-mono tabular-nums tracking-tighter">{currentTime}</div>
              </div>
              
              <div className="p-3 rounded-md bg-muted/50 border border-border space-y-1.5">
                <div className="flex items-center gap-2 text-[10px] font-semibold text-foreground uppercase tracking-tight">
                  <Info className="h-3 w-3" />
                  {isEnglish ? 'Format Info' : 'فارمیٹ کی معلومات'}
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  {t('article').split('.')[1]}.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <ToolNavigation currentToolId="timestamp-converter" />
    </div>
  );
}
