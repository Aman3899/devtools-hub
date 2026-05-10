'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Trash2, ListOrdered } from 'lucide-react';
import { toast } from 'sonner';
import { ToolNavigation } from '@/components/tool-navigation';

export function LineNumberAdderClient() {
  const t = useTranslations('tools.line-number-adder');
  const commonT = useTranslations('common');
  const [input, setInput] = useState('');

  const addNumbers = () => {
    const lines = input.split('\n');
    const result = lines.map((line, index) => `${index + 1}. ${line}`).join('\n');
    setInput(result);
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
          <Button className="w-full" onClick={addNumbers} disabled={!input}>
            <ListOrdered className="h-4 w-4 mr-2" />
            {t('add')}
          </Button>
        </CardContent>
      </Card>
      <ToolNavigation currentToolId="line-number-adder" />
    </div>
  );
}
