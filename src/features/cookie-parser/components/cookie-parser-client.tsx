'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Trash2, Settings2, Info, Check, Table, ShieldCheck, Clock, Globe } from 'lucide-react';
import { ToolNavigation } from '@/components/tool-navigation';

export function CookieParserClient() {
  const t = useTranslations('tools.cookie-parser');
  const commonT = useTranslations('common');
  
  const [input, setInput] = useState('name=value; Domain=example.com; Path=/; Expires=Wed, 09 Jun 2021 10:18:14 GMT; Secure; HttpOnly; SameSite=Lax');
  const [parsed, setParsed] = useState<{ key: string; value: string; isAttr: boolean }[]>([]);
  const [copied, setCopied] = useState(false);

  const parseCookie = useCallback(() => {
    if (!input.trim()) {
      setParsed([]);
      return;
    }

    const parts = input.split(';').map(p => p.trim()).filter(p => p);
    const results: { key: string; value: string; isAttr: boolean }[] = [];

    parts.forEach((part, i) => {
      const [key, ...valParts] = part.split('=');
      const val = valParts.join('=');
      
      const standardAttrs = ['domain', 'path', 'expires', 'max-age', 'samesite', 'secure', 'httponly'];
      const isAttr = i > 0 && standardAttrs.includes(key.toLowerCase());

      results.push({
        key: key,
        value: val || (key.toLowerCase() === 'secure' || key.toLowerCase() === 'httponly' ? 'true' : ''),
        isAttr: isAttr
      });
    });

    setParsed(results);
  }, [input]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(parsed, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setParsed([]);
  };

  const getAttrIcon = (key: string) => {
    const k = key.toLowerCase();
    if (k === 'domain') return <Globe className="h-3 w-3 text-blue-500" />;
    if (k === 'expires' || k === 'max-age') return <Clock className="h-3 w-3 text-amber-500" />;
    if (k === 'secure' || k === 'httponly' || k === 'samesite') return <ShieldCheck className="h-3 w-3 text-green-500" />;
    return null;
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 grid gap-4 md:grid-cols-2">
          {/* Form Area */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{commonT('input')}</Label>
              </div>
              <Button variant="ghost" size="icon" onClick={handleClear} title={commonT('clear')} className="h-6 w-6 text-muted-foreground hover:text-destructive">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            <Card className="border border-border shadow-none rounded-md p-4 bg-background flex flex-col gap-3">
              <Textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('placeholder')}
                className="h-48 text-xs font-mono resize-none"
              />
              <Button onClick={parseCookie} className="w-full h-9 text-xs">
                <Table className="h-3.5 w-3.5 mr-2" />
                {t('title')}
              </Button>
            </Card>
          </div>

          {/* Result Area */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{commonT('ui.result')}</Label>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={copyToClipboard}
                disabled={parsed.length === 0}
                className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                {commonT('copy')}
              </Button>
            </div>
            <Card className="flex flex-col h-[300px] border border-border shadow-none rounded-md bg-muted/20 overflow-hidden">
              <div className="flex-1 overflow-auto">
                 {parsed.length > 0 ? (
                   <table className="w-full text-left border-collapse">
                     <thead>
                       <tr className="bg-muted/50 border-b border-border">
                         <th className="px-3 py-2 text-[10px] font-bold uppercase text-muted-foreground">{t('key')}</th>
                         <th className="px-3 py-2 text-[10px] font-bold uppercase text-muted-foreground">{t('value')}</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-border">
                        {parsed.map((item, i) => (
                          <tr key={i} className="bg-background group">
                            <td className="px-3 py-2">
                               <div className="flex items-center gap-1.5">
                                 {getAttrIcon(item.key)}
                                 <span className={`text-[11px] font-mono ${item.isAttr ? 'text-muted-foreground italic' : 'font-bold text-foreground'}`}>{item.key}</span>
                               </div>
                            </td>
                            <td className="px-3 py-2">
                               <span className="text-[11px] font-mono break-all text-foreground">{item.value || '—'}</span>
                            </td>
                          </tr>
                        ))}
                     </tbody>
                   </table>
                 ) : (
                   <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                     <Table className="h-8 w-8 opacity-20" />
                     <p className="text-xs">{commonT('ui.result')}</p>
                   </div>
                 )}
              </div>
            </Card>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="border border-border shadow-none rounded-md bg-background">
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-xs font-semibold flex items-center gap-2">
                <Settings2 className="h-3.5 w-3.5" />
                {commonT('ui.options')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
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
            </CardContent>
          </Card>
        </div>
      </div>
      <ToolNavigation currentToolId="cookie-parser" />
    </div>
  );
}
