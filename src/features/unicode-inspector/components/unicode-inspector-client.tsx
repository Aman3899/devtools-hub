'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Settings2, Info, Search, RefreshCw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ToolNavigation } from '@/components/tool-navigation';

export function UnicodeInspectorClient() {
  const t = useTranslations('tools.unicode-inspector');
  const commonT = useTranslations('common');
  
  const [input, setInput] = useState('');

  const loadSample = () => {
    setInput('A 🚀 ü 漢字');
    toast.success(commonT('success'));
  };

  const getUnicodeData = (str: string) => {
    const chars = [];
    // Use for...of to correctly iterate over surrogate pairs (like emojis)
    for (const char of str) {
      const codePoint = char.codePointAt(0);
      chars.push({
        char,
        codePointHex: codePoint?.toString(16).toUpperCase().padStart(4, '0'),
        codePointDec: codePoint
      });
    }
    return chars;
  };

  const data = getUnicodeData(input);

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 space-y-4">
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('text_input')}</Label>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={loadSample} className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground">
                  <RefreshCw className="h-3 w-3" />
                  {commonT('ui.sample')}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setInput('')} title={commonT('clear')} className="h-6 w-6 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <Card className="flex flex-col h-[150px] border border-border shadow-none rounded-md overflow-hidden bg-background focus-within:border-foreground/20 transition-colors">
              <Textarea
                placeholder="Enter string to inspect characters..."
                className="flex-1 font-mono text-sm resize-none border-none focus-visible:ring-0 p-4 bg-transparent leading-relaxed"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </Card>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-1">{t('character_details')}</Label>
            <div className="space-y-2">
              {data.length > 0 ? (
                data.map((item, idx) => (
                  <Card key={idx} className="flex items-center p-3 border border-border shadow-none rounded-md bg-muted/10 gap-4">
                    <div className="flex items-center justify-center h-12 w-12 bg-background border border-border rounded shrink-0 shadow-sm">
                      <span className="text-xl">{item.char}</span>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{t('code_point')}</span>
                        <span className="font-mono text-sm">U+{item.codePointHex}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{t('decimal')}</span>
                        <span className="font-mono text-sm">{item.codePointDec}</span>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="flex flex-col h-[200px] items-center justify-center border border-border shadow-none rounded-md bg-muted/20">
                  <Search className="h-8 w-8 text-muted-foreground opacity-50 mb-2" />
                  <p className="text-sm text-muted-foreground opacity-50">Type something to inspect.</p>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="border border-border shadow-none rounded-md bg-background">
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-xs font-semibold flex items-center gap-2">
                <Settings2 className="h-3.5 w-3.5" />
                {commonT('ui.customization')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-6">
              <div className="p-3 rounded-md bg-muted/50 border border-border space-y-1.5">
                <div className="flex items-center gap-2 text-[10px] font-semibold text-foreground uppercase tracking-tight">
                  <Info className="h-3 w-3" />
                  Info
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  {t('info')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ToolNavigation currentToolId="unicode-inspector" />
    </div>
  );
}
