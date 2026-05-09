'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Check, RefreshCw, Settings2, Hash } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { v4 as uuidv4 } from 'uuid';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

export function UuidGeneratorClient() {
  const t = useTranslations('tools.uuid-generator');
  const tCommon = useTranslations('common');
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateUuids = () => {
    const newUuids = Array.from({ length: count }, () => uuidv4());
    setUuids(newUuids);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join('\n'));
    setCopiedIndex(-1);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="space-y-6">
        <Card className="rounded-[2rem] border-muted-foreground/10 bg-card/50 backdrop-blur-md overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{t('generatedUuids')}</CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={copyAll} 
                disabled={uuids.length === 0}
                className="rounded-xl gap-2 h-9 border-primary/20 hover:bg-primary/5"
              >
                {copiedIndex === -1 ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                {t('copyAll')}
              </Button>
              <Button onClick={generateUuids} className="rounded-xl gap-2 h-9">
                <RefreshCw className="h-4 w-4" />
                {t('new')}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 p-6 pt-0">
            {uuids.length > 0 ? (
              uuids.map((uuid, i) => (
                <div key={i} className="flex items-center gap-3 group">
                  <div className="flex-1 font-mono text-sm p-4 bg-muted/30 rounded-2xl border border-muted-foreground/5 transition-all group-hover:border-primary/20 truncate">
                    {uuid}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => copyToClipboard(uuid, i)}
                    className="rounded-xl h-12 w-12 hover:bg-primary/5"
                  >
                    {copiedIndex === i ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              ))
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-muted-foreground space-y-4 bg-muted/10 rounded-[2rem] border border-dashed border-muted-foreground/20">
                <Hash className="h-10 w-10 opacity-20" />
                <p className="text-sm font-medium">{t('placeholder')}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="rounded-[2rem] border-muted-foreground/10 bg-card/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-primary" />
              {tCommon('ui.settings')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">{t('quantity')}</Label>
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{count}</span>
              </div>
              <Slider 
                value={[count]} 
                onValueChange={(value) => {
                  const newValue = Array.isArray(value) ? value[0] : value;
                  setCount(newValue);
                }} 
                max={20} 
                min={1} 
                step={1}
                className="py-4"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground px-1">{t('version')}</Label>
              <Select defaultValue="v4">
                <SelectTrigger className="rounded-xl bg-muted/30 border-muted-foreground/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="v4">{t('v4Label')}</SelectItem>
                  <SelectItem value="v1" disabled>{t('v1Label')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="p-4 rounded-2xl bg-muted/30 border border-muted-foreground/5 space-y-2">
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                {t('v4Desc')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
