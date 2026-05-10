'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Copy, Info, RefreshCw, Settings2 } from 'lucide-react';
import { toast } from 'sonner';
import { ToolNavigation } from '@/components/tool-navigation';

const LOREM_TEXT = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

export function LoremIpsumClient() {
  const t = useTranslations('tools.lorem-ipsum');
  const commonT = useTranslations('common');
  const [count, setCount] = useState(3);
  const [output, setOutput] = useState('');

  const generate = () => {
    let result = [];
    for (let i = 0; i < count; i++) {
      result.push(LOREM_TEXT);
    }
    setOutput(result.join('\n\n'));
    toast.success(commonT('cleared')); 
  };

  const stats = {
    chars: output.length,
    words: output.split(/\s+/).filter(Boolean).length
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('output')}</Label>
              {output && (
                <>
                  <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                  <span className="text-[10px] text-muted-foreground/60">{stats.words} words • {stats.chars} chars</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  navigator.clipboard.writeText(output);
                  toast.success(commonT('copied'));
                }} 
                disabled={!output}
                className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Copy className="h-3 w-3" />
                {commonT('copy')}
              </Button>
            </div>
          </div>
          <Card className="flex flex-col h-[500px] border border-border shadow-none rounded-md overflow-hidden bg-muted/20">
            <Textarea
              readOnly
              className="flex-1 font-mono text-xs p-3 bg-transparent resize-none border-none focus-visible:ring-0 leading-relaxed"
              value={output}
              placeholder={t('placeholder')}
            />
          </Card>
        </div>

        {/* Sidebar Settings */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="border border-border shadow-none rounded-md bg-background">
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-xs font-semibold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings2 className="h-3.5 w-3.5" />
                  {commonT('ui.customization')}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-5">
              <div className="space-y-2">
                <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">{t('paragraphs')}</Label>
                <Input 
                  type="number" 
                  value={count} 
                  onChange={(e) => setCount(Number(e.target.value))} 
                  min={1} 
                  max={50}
                  className="h-8 text-xs bg-muted/30 border-border"
                />
              </div>
              <Button className="w-full h-8 text-xs" onClick={generate}>
                <RefreshCw className="h-3.5 w-3.5 mr-2" />
                {t('generate')}
              </Button>
            </CardContent>
          </Card>

          <div className="p-3 rounded-md bg-muted/30 border border-border flex gap-2.5 items-start">
            <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-[10px] text-muted-foreground leading-normal">
              {t('article').split('.')[0]}.
            </p>
          </div>
        </div>
      </div>
      <ToolNavigation currentToolId="lorem-ipsum" />
    </div>
  );
}
