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

export function FibonacciGeneratorClient() {
  const { copiedType, copyToClipboard } = useCopyToClipboard();

  const [count, setCount] = useState('10');
  const [result, setResult] = useState('');

  const generate = () => {
    const cnt = parseInt(count, 10);
    if (isNaN(cnt) || cnt <= 0) return;
    
    const seq = [0, 1];
    if (cnt === 1) { setResult('0'); return; }
    
    for (let i = 2; i < cnt; i++) {
      seq.push(seq[i - 1] + seq[i - 2]);
    }
    setResult(seq.slice(0, cnt).join(', '));
  };

  return (
    <div className="space-y-6">
      <ToolCard title="Fibonacci Sequence Generator" icon={Hash}>
        <div className="space-y-2">
          <Label className="text-xs">Number of Terms</Label>
          <Input type="number" value={count} onChange={(e) => setCount(e.target.value)} min="1" max="1476" className="font-mono" placeholder="e.g. 10" />
          <p className="text-xs text-muted-foreground">Note: Maximum 1476 to avoid Infinity</p>
        </div>
        <Button onClick={generate} className="w-full">Generate Sequence</Button>
      </ToolCard>

      {result && (
        <ToolCard 
          title="Result"
          copyText={result}
          copyType="res"
          copiedType={copiedType}
          onCopy={copyToClipboard}
          contentClassName="p-0"
        >
          <Textarea 
            value={result} 
            readOnly 
            className="min-h-[200px] font-mono text-sm border-0 resize-y p-4 bg-transparent focus-visible:ring-0 shadow-none leading-relaxed" 
          />
        </ToolCard>
      )}
    </div>
  );
}
