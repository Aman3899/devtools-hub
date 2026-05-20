"use client"

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Hash } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { Textarea } from '@/components/ui/textarea';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';

export function RandomNumberGeneratorClient() {
  const { copiedType, copyToClipboard } = useCopyToClipboard();

  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');
  const [count, setCount] = useState('1');
  const [result, setResult] = useState('');

  const generate = () => {
    const minNum = parseInt(min, 10);
    const maxNum = parseInt(max, 10);
    const cnt = parseInt(count, 10);
    
    if (isNaN(minNum) || isNaN(maxNum) || isNaN(cnt) || cnt <= 0) return;
    
    const nums = [];
    for (let i = 0; i < cnt; i++) {
      nums.push(Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
    }
    setResult(nums.join('\n'));
  };

  return (
    <div className="space-y-6">
      <ToolCard title="Random Number Settings" icon={Hash}>
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="space-y-2">
            <Label className="text-xs">Minimum</Label>
            <Input type="number" value={min} onChange={(e) => setMin(e.target.value)} className="font-mono" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Maximum</Label>
            <Input type="number" value={max} onChange={(e) => setMax(e.target.value)} className="font-mono" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Quantity</Label>
            <Input type="number" value={count} onChange={(e) => setCount(e.target.value)} min="1" max="1000" className="font-mono" />
          </div>
        </div>
        <Button onClick={generate} className="w-full">Generate Numbers</Button>
      </ToolCard>

      {result && (
        <ToolCard
          title="Generated Numbers"
          copyText={result}
          copyType="res"
          copiedType={copiedType}
          onCopy={copyToClipboard}
          contentClassName="p-0"
        >
          <Textarea 
            value={result} 
            readOnly 
            className="min-h-[200px] font-mono text-sm border-0 resize-y p-4 bg-transparent focus-visible:ring-0 shadow-none" 
          />
        </ToolCard>
      )}
    </div>
  );
}
