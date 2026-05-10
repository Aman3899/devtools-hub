'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Copy, RefreshCw } from 'lucide-react';
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

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-end gap-4">
            <div className="space-y-2">
              <Label>{t('paragraphs')}</Label>
              <Input 
                type="number" 
                value={count} 
                onChange={(e) => setCount(Number(e.target.value))} 
                min={1} 
                max={50}
                className="w-32"
              />
            </div>
            <Button onClick={generate}>
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('generate')}
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>{t('output')}</Label>
              <Button variant="outline" size="sm" onClick={() => {
                navigator.clipboard.writeText(output);
                toast.success(commonT('copied'));
              }} disabled={!output}>
                <Copy className="h-4 w-4 mr-2" />
                {commonT('copy')}
              </Button>
            </div>
            <Textarea
              readOnly
              value={output}
              className="min-h-[300px] font-mono"
              placeholder={t('placeholder')}
            />
          </div>
        </CardContent>
      </Card>
      <ToolNavigation currentToolId="lorem-ipsum" />
    </div>
  );
}
