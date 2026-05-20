'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Settings2, Info, Check, Table, ShieldCheck, Clock, Globe, Copy } from 'lucide-react';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

export function CookieParserClient() {
  const t = useTranslations('tools.cookie-parser');
  const commonT = useTranslations('common');
  const { copiedType, copyToClipboard } = useCopyToClipboard();
  
  const [input, setInput] = useState('name=value; Domain=example.com; Path=/; Expires=Wed, 09 Jun 2021 10:18:14 GMT; Secure; HttpOnly; SameSite=Lax');
  const [parsed, setParsed] = useState<{ key: string; value: string; isAttr: boolean }[]>([]);

  const parseCookie = useCallback(() => {
    if (!input.trim()) { setParsed([]); return; }
    const parts = input.split(';').map(p => p.trim()).filter(p => p);
    const results: { key: string; value: string; isAttr: boolean }[] = [];
    parts.forEach((part, i) => {
      const [key, ...valParts] = part.split('=');
      const val = valParts.join('=');
      const standardAttrs = ['domain', 'path', 'expires', 'max-age', 'samesite', 'secure', 'httponly'];
      const isAttr = i > 0 && standardAttrs.includes(key.toLowerCase());
      results.push({ key: key, value: val || (key.toLowerCase() === 'secure' || key.toLowerCase() === 'httponly' ? 'true' : ''), isAttr: isAttr });
    });
    setParsed(results);
  }, [input]);

  const handleClear = () => { setInput(''); setParsed([]); };

  const getAttrIcon = (key: string) => {
    const k = key.toLowerCase();
    if (k === 'domain') return <Globe className="h-3 w-3 text-blue-500" />;
    if (k === 'expires' || k === 'max-age') return <Clock className="h-3 w-3 text-amber-500" />;
    if (k === 'secure' || k === 'httponly' || k === 'samesite') return <ShieldCheck className="h-3 w-3 text-green-500" />;
    return null;
  };

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">
        <ToolCard 
          title={commonT('input')} 
          action={<Button variant="ghost" size="icon" onClick={handleClear} title={commonT('clear')} className="h-6 w-6 hover:text-destructive"><Trash2 className="h-3 w-3" /></Button>}
          contentClassName="p-4 flex flex-col gap-3"
        >
          <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={t('placeholder')} className="h-48 text-xs font-mono resize-none" />
          <Button onClick={parseCookie} className="w-full h-9 text-xs"><Table className="h-3.5 w-3.5 mr-2" />{t('title')}</Button>
        </ToolCard>

        <ToolCard 
          title={commonT('ui.result')}
          action={<Button variant="ghost" size="sm" onClick={() => copyToClipboard(JSON.stringify(parsed, null, 2), 'json')} disabled={parsed.length === 0} className="h-6 px-2 text-[10px] gap-1.5">{copiedType === 'json' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}{commonT('copy')}</Button>}
          contentClassName="p-0 flex flex-col h-[300px] bg-muted/20 overflow-hidden"
        >
          <div className="flex-1 overflow-auto">
             {parsed.length > 0 ? (
               <table className="w-full text-left border-collapse">
                 <thead><tr className="bg-muted/50 border-b border-border"><th className="px-3 py-2 text-[10px] font-bold uppercase text-muted-foreground">{t('key')}</th><th className="px-3 py-2 text-[10px] font-bold uppercase text-muted-foreground">{t('value')}</th></tr></thead>
                 <tbody className="divide-y divide-border">
                    {parsed.map((item, i) => (
                      <tr key={i} className="bg-background group">
                        <td className="px-3 py-2"><div className="flex items-center gap-1.5">{getAttrIcon(item.key)}<span className={`text-[11px] font-mono ${item.isAttr ? 'text-muted-foreground italic' : 'font-bold text-foreground'}`}>{item.key}</span></div></td>
                        <td className="px-3 py-2"><span className="text-[11px] font-mono break-all text-foreground">{item.value || '—'}</span></td>
                      </tr>
                    ))}
                 </tbody>
               </table>
             ) : (
               <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-2"><Table className="h-8 w-8 opacity-20" /><p className="text-xs">{commonT('ui.result')}</p></div>
             )}
          </div>
        </ToolCard>
      </div>

      <div className="md:col-span-1 space-y-4">
        <ToolCard title={commonT('ui.options')} icon={Settings2} contentClassName="p-4 space-y-4">
           <div className="flex gap-2.5 items-start p-3 rounded-md bg-muted/30 border border-border">
              <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-[10px] text-muted-foreground leading-normal">{t('article').split('.')[0]}.</p>
            </div>
            <div className="pt-2 space-y-2"><p className="text-[10px] text-muted-foreground leading-relaxed">{t('sidebar_desc')}</p></div>
        </ToolCard>
      </div>
    </div>
  );
}
