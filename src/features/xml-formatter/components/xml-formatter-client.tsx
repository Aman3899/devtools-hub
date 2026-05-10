'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Trash2, Code } from 'lucide-react';
import { toast } from 'sonner';
import { ToolNavigation } from '@/components/tool-navigation';

export function XmlFormatterClient() {
  const t = useTranslations('tools.xml-formatter');
  const commonT = useTranslations('common');
  const [input, setInput] = useState('');

  const format = () => {
    try {
      let formatted = '';
      let indent = '';
      const tab = '  ';
      input.split(/>\s*</).forEach(node => {
        if (node.match(/^\/\w/)) indent = indent.substring(tab.length);
        formatted += indent + '<' + node + '>\r\n';
        if (node.match(/^<?\w[^>]*[^\/]$/)) indent += tab;
      });
      setInput(formatted.substring(1, formatted.length - 3));
      toast.success(commonT('cleared')); 
    } catch (e) {
      toast.error('Invalid XML');
    }
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
            className="min-h-[400px] font-mono text-xs"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button className="w-full" onClick={format}>
            <Code className="h-4 w-4 mr-2" />
            {t('format')}
          </Button>
        </CardContent>
      </Card>
      <ToolNavigation currentToolId="xml-formatter" />
    </div>
  );
}
