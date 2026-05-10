'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Trash2, RotateCcw, Shuffle } from 'lucide-react';
import { toast } from 'sonner';
import { ToolNavigation } from '@/components/tool-navigation';

export function StringReverseClient() {
  const t = useTranslations('tools.string-reverse');
  const commonT = useTranslations('common');
  const [input, setInput] = useState('');

  const reverseChars = () => {
    setInput(input.split('').reverse().join(''));
    toast.success(commonT('copied')); 
  };

  const reverseWords = () => {
    setInput(input.split(/\s+/).reverse().join(' '));
    toast.success(commonT('copied'));
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
            className="min-h-[200px] font-mono"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="flex gap-2">
            <Button onClick={reverseChars} disabled={!input}>
              <RotateCcw className="h-4 w-4 mr-2" />
              {t('reverseChars')}
            </Button>
            <Button variant="secondary" onClick={reverseWords} disabled={!input}>
              <Shuffle className="h-4 w-4 mr-2" />
              {t('reverseWords')}
            </Button>
          </div>
        </CardContent>
      </Card>
      <ToolNavigation currentToolId="string-reverse" />
    </div>
  );
}
