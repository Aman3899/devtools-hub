'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Trash2, SortAsc, SortDesc, Shuffle } from 'lucide-react';
import { toast } from 'sonner';
import { ToolNavigation } from '@/components/tool-navigation';

export function TextSorterClient() {
  const t = useTranslations('tools.text-sorter');
  const commonT = useTranslations('common');
  const [input, setInput] = useState('');

  const sort = (type: string) => {
    let lines = input.split('\n').filter(l => l.trim() !== '');
    if (type === 'asc') lines.sort();
    if (type === 'desc') lines.sort().reverse();
    if (type === 'shuffle') {
      for (let i = lines.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [lines[i], lines[j]] = [lines[j], lines[i]];
      }
    }
    setInput(lines.join('\n'));
    toast.success(commonT('cleared')); 
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="input">{t('input')}</Label>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => {
                navigator.clipboard.writeText(input);
                toast.success(commonT('copied'));
              }}>
                <Copy className="h-4 w-4 mr-2" />
                {commonT('copy')}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setInput('')}>
                <Trash2 className="h-4 w-4 mr-2" />
                {commonT('clear')}
              </Button>
            </div>
          </div>
          <Textarea
            id="input"
            placeholder={t('placeholder')}
            className="min-h-[300px] font-mono"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="flex gap-2">
            <Button onClick={() => sort('asc')} disabled={!input}>
              <SortAsc className="h-4 w-4 mr-2" />
              {t('asc')}
            </Button>
            <Button onClick={() => sort('desc')} disabled={!input}>
              <SortDesc className="h-4 w-4 mr-2" />
              {t('desc')}
            </Button>
            <Button variant="secondary" onClick={() => sort('shuffle')} disabled={!input}>
              <Shuffle className="h-4 w-4 mr-2" />
              {t('shuffle')}
            </Button>
          </div>
        </CardContent>
      </Card>
      <ToolNavigation currentToolId="text-sorter" />
    </div>
  );
}
