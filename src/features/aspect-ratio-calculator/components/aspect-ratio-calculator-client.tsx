"use client"

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Layout } from 'lucide-react';
import { ToolCard } from '@/components/layout/tool-card';

export function AspectRatioCalculatorClient() {
  const [w1, setW1] = useState('1920');
  const [h1, setH1] = useState('1080');
  const [w2, setW2] = useState('1280');
  const [h2, setH2] = useState('720');

  const handleW1Change = (val: string) => {
    setW1(val);
    const numW1 = parseFloat(val);
    const numH1 = parseFloat(h1);
    const numW2 = parseFloat(w2);
    if (numW1 && numH1 && numW2) {
      setH2(((numH1 / numW1) * numW2).toFixed(2).replace(/\.00$/, ''));
    }
  };

  const handleH1Change = (val: string) => {
    setH1(val);
    const numW1 = parseFloat(w1);
    const numH1 = parseFloat(val);
    const numW2 = parseFloat(w2);
    if (numW1 && numH1 && numW2) {
      setH2(((numH1 / numW1) * numW2).toFixed(2).replace(/\.00$/, ''));
    }
  };

  const handleW2Change = (val: string) => {
    setW2(val);
    const numW1 = parseFloat(w1);
    const numH1 = parseFloat(h1);
    const numW2 = parseFloat(val);
    if (numW1 && numH1 && numW2) {
      setH2(((numH1 / numW1) * numW2).toFixed(2).replace(/\.00$/, ''));
    }
  };

  const handleH2Change = (val: string) => {
    setH2(val);
    const numW1 = parseFloat(w1);
    const numH1 = parseFloat(h1);
    const numH2 = parseFloat(val);
    if (numW1 && numH1 && numH2) {
      setW2(((numW1 / numH1) * numH2).toFixed(2).replace(/\.00$/, ''));
    }
  };

  return (
    <div className="space-y-6">
      <ToolCard title="Aspect Ratio Calculator" icon={Layout} contentClassName="p-6 space-y-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-4">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Original Ratio</Label>
            <div className="flex items-center gap-4">
              <div className="space-y-2 flex-1">
                <Label className="text-xs">Width (W1)</Label>
                <Input type="number" value={w1} onChange={(e) => handleW1Change(e.target.value)} className="font-mono" />
              </div>
              <div className="text-2xl font-light text-muted-foreground mt-6">:</div>
              <div className="space-y-2 flex-1">
                <Label className="text-xs">Height (H1)</Label>
                <Input type="number" value={h1} onChange={(e) => handleH1Change(e.target.value)} className="font-mono" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">New Ratio</Label>
            <div className="flex items-center gap-4">
              <div className="space-y-2 flex-1">
                <Label className="text-xs">Width (W2)</Label>
                <Input type="number" value={w2} onChange={(e) => handleW2Change(e.target.value)} className="font-mono" />
              </div>
              <div className="text-2xl font-light text-muted-foreground mt-6">:</div>
              <div className="space-y-2 flex-1">
                <Label className="text-xs">Height (H2)</Label>
                <Input type="number" value={h2} onChange={(e) => handleH2Change(e.target.value)} className="font-mono" />
              </div>
            </div>
          </div>
        </div>
      </ToolCard>
    </div>
  );
}
