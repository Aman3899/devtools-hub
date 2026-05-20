"use client"

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Trash2, Settings2, Info, Check, Monitor, Smartphone, Cpu, Globe, Search } from 'lucide-react';
import { ToolCard } from '@/components/layout/tool-card';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

export function UserAgentParserClient() {
  const t = useTranslations('tools.user-agent-parser');
  const commonT = useTranslations('common');
  const { copiedType, copyToClipboard } = useCopyToClipboard();
  
  const [input, setInput] = useState('');
  const [result, setResult] = useState<Record<string, string>>({});

  const parseUA = useCallback((ua: string) => {
    if (!ua) {
      setResult({});
      return;
    }

    const data: Record<string, string> = {
      browser: t('unknown'),
      version: t('unknown'),
      os: t('unknown'),
      engine: t('unknown'),
      device: 'Desktop',
    };

    // Browser detection
    if (ua.includes('Firefox/')) {
      data.browser = 'Firefox';
      data.version = ua.split('Firefox/')[1];
    } else if (ua.includes('Edg/')) {
      data.browser = 'Edge';
      data.version = ua.split('Edg/')[1];
    } else if (ua.includes('Chrome/')) {
      data.browser = 'Chrome';
      data.version = ua.split('Chrome/')[1].split(' ')[0];
    } else if (ua.includes('Safari/') && !ua.includes('Chrome')) {
      data.browser = 'Safari';
      data.version = ua.split('Version/')[1]?.split(' ')[0] || 'Unknown';
    }

    // OS detection
    if (ua.includes('Windows NT 10.0')) data.os = 'Windows 10/11';
    else if (ua.includes('Windows NT 6.1')) data.os = 'Windows 7';
    else if (ua.includes('Mac OS X')) data.os = 'macOS';
    else if (ua.includes('Android')) {
      data.os = 'Android';
      data.device = 'Mobile';
    } else if (ua.includes('iPhone') || ua.includes('iPad')) {
      data.os = 'iOS';
      data.device = ua.includes('iPad') ? 'Tablet' : 'Mobile';
    } else if (ua.includes('Linux')) data.os = 'Linux';

    // Engine
    if (ua.includes('AppleWebKit')) data.engine = 'WebKit';
    else if (ua.includes('Gecko/')) data.engine = 'Gecko';
    else if (ua.includes('Blink')) data.engine = 'Blink';

    setResult(data);
  }, [t]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setInput(navigator.userAgent);
      parseUA(navigator.userAgent);
    }
  }, [parseUA]);

  const handleClear = () => {
    setInput('');
    setResult({});
  };

  const getDeviceIcon = (device: string) => {
    if (device === 'Mobile') return <Smartphone className="h-5 w-5 text-blue-500" />;
    if (device === 'Tablet') return <Smartphone className="h-5 w-5 text-indigo-500 rotate-90" />;
    return <Monitor className="h-5 w-5 text-zinc-500" />;
  };

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">
        {/* Form Area */}
        <ToolCard 
          title={commonT('input')}
          action={
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={() => { const ua = navigator.userAgent; setInput(ua); parseUA(ua); }} className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground">
                <Search className="h-3 w-3" />
                {t('detect_current')}
              </Button>
              <Button variant="ghost" size="icon" onClick={handleClear} title={commonT('clear')} className="h-6 w-6 text-muted-foreground hover:text-destructive">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          }
          contentClassName="p-4"
        >
          <Textarea 
            value={input}
            onChange={(e) => { setInput(e.target.value); parseUA(e.target.value); }}
            placeholder={t('placeholder')}
            className="h-32 text-xs font-mono resize-none border border-border"
          />
        </ToolCard>

        {/* Result Area */}
        <ToolCard 
          title={commonT('ui.result')}
          action={
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => copyToClipboard(JSON.stringify(result, null, 2), 'result')}
              disabled={!input}
              className="h-6 px-2 text-[10px] gap-1.5 transition-colors"
            >
              {copiedType === 'result' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
              {commonT('copy')}
            </Button>
          }
          contentClassName="p-4 bg-muted/20"
        >
          <div className="grid grid-cols-2 gap-3">
            <Card className="border border-border shadow-none bg-background p-3 flex items-center gap-3">
              <div className="p-2 rounded-md bg-blue-500/10">
                <Globe className="h-5 w-5 text-blue-600" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] text-muted-foreground uppercase font-bold">{t('browser')}</p>
                <p className="text-xs font-semibold text-foreground">{result.browser} {result.version?.split('.')[0]}</p>
              </div>
            </Card>
            <Card className="border border-border shadow-none bg-background p-3 flex items-center gap-3">
              <div className="p-2 rounded-md bg-amber-500/10">
                <Cpu className="h-5 w-5 text-amber-600" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] text-muted-foreground uppercase font-bold">{t('engine')}</p>
                <p className="text-xs font-semibold text-foreground">{result.engine}</p>
              </div>
            </Card>
            <Card className="border border-border shadow-none bg-background p-3 flex items-center gap-3">
              <div className="p-2 rounded-md bg-emerald-500/10">
                <Settings2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] text-muted-foreground uppercase font-bold">{t('os')}</p>
                <p className="text-xs font-semibold text-foreground">{result.os}</p>
              </div>
            </Card>
            <Card className="border border-border shadow-none bg-background p-3 flex items-center gap-3">
              <div className="p-2 rounded-md bg-muted">
                {getDeviceIcon(result.device || 'Desktop')}
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] text-muted-foreground uppercase font-bold">{t('device')}</p>
                <p className="text-xs font-semibold text-foreground">{result.device}</p>
              </div>
            </Card>
          </div>
        </ToolCard>
      </div>

      {/* Sidebar Settings */}
      <div className="md:col-span-1 space-y-4">
        <ToolCard title={commonT('ui.options')} icon={Settings2} contentClassName="p-4 space-y-4">
          <div className="flex gap-2.5 items-start p-3 rounded-md bg-muted/30 border border-border">
            <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-[10px] text-muted-foreground leading-normal">
              {t('article').split('.')[0]}.
            </p>
          </div>
          <div className="pt-2 space-y-2">
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              {t('sidebar_desc')}
            </p>
          </div>
        </ToolCard>
      </div>
    </div>
  );
}
