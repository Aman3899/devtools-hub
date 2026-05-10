'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Trash2, Type } from 'lucide-react';
import { toast } from 'sonner';
import { ToolNavigation } from '@/components/tool-navigation';

export function CaseConverterClient() {
  const t = useTranslations('tools.case-converter');
  const commonT = useTranslations('common');
  const [input, setInput] = useState('');

  const convert = (type: string) => {
    let result = '';
    const text = input.trim();
    if (!text) return;

    switch (type) {
      case 'upper': result = text.toUpperCase(); break;
      case 'lower': result = text.toLowerCase(); break;
      case 'camel': 
        result = text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
          index === 0 ? word.toLowerCase() : word.toUpperCase()
        ).replace(/\s+/g, '');
        break;
      case 'snake':
        result = text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
          ?.map(x => x.toLowerCase())
          .join('_') || '';
        break;
      case 'pascal':
        result = text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase()).replace(/\s+/g, '');
        break;
      case 'kebab':
        result = text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
          ?.map(x => x.toLowerCase())
          .join('-') || '';
        break;
      default: result = text;
    }
    setInput(result);
    toast.success(commonT('cleared')); // Using a generic success or localized message
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(input);
    toast.success(commonT('copied'));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="input">{t('input')}</Label>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setInput(t('sample'))}>
                {commonT('loadSample')}
              </Button>
              <Button variant="outline" size="sm" onClick={handleCopy} disabled={!input}>
                <Copy className="h-4 w-4 mr-2" />
                {commonT('copy')}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setInput('')} disabled={!input}>
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { id: 'upper' },
              { id: 'lower' },
              { id: 'camel' },
              { id: 'snake' },
              { id: 'pascal' },
              { id: 'kebab' },
            ].map((mode) => (
              <Button 
                key={mode.id} 
                variant="secondary" 
                size="sm" 
                onClick={() => convert(mode.id)}
                disabled={!input}
              >
                <Type className="h-3.5 w-3.5 mr-2" />
                {t(mode.id as any)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      <ToolNavigation currentToolId="case-converter" />
    </div>
  );
}
