"use client"

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Layout } from 'lucide-react';
import { ToolCard } from '@/components/layout/tool-card';
import { InfoBox } from '@/components/common';

export function AspectRatioCalculatorClient() {
  const [w1, setW1] = useState('1920');
  const [h1, setH1] = useState('1080');
  const [w2, setW2] = useState('1280');
  const [h2, setH2] = useState('720');

  const recalc = (nw1: string, nh1: string, nw2: string, nH2?: string) => {
    const W1 = parseFloat(nw1), H1 = parseFloat(nh1), W2 = parseFloat(nw2);
    if (W1 && H1 && W2 && !nH2) setH2(((H1 / W1) * W2).toFixed(2).replace(/\.00$/, ''));
    if (W1 && H1 && nH2) { const H2 = parseFloat(nH2); if (H2) setW2(((W1 / H1) * H2).toFixed(2).replace(/\.00$/, '')); }
  };

  return (
    <div className="space-y-6">
      <ToolCard title="Aspect Ratio Calculator" icon={Layout} contentClassName="p-6 space-y-8">
        <div className="grid gap-6 sm:grid-cols-2">
          {[['Original Ratio', w1, h1, (v: string) => { setW1(v); recalc(v, h1, w2); }, (v: string) => { setH1(v); recalc(w1, v, w2); }],
            ['New Ratio', w2, h2, (v: string) => { setW2(v); recalc(w1, h1, v); }, (v: string) => { setH2(v); recalc(w1, h1, w2, v); }]
          ].map(([label, wVal, hVal, onW, onH]) => (
            <div key={label as string} className="space-y-4">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label as string}</Label>
              <div className="flex items-center gap-4">
                <div className="space-y-2 flex-1">
                  <Label className="text-xs">Width</Label>
                  <Input type="number" value={wVal as string} onChange={(e) => (onW as any)(e.target.value)} className="font-mono" />
                </div>
                <div className="text-2xl font-light text-muted-foreground mt-6">:</div>
                <div className="space-y-2 flex-1">
                  <Label className="text-xs">Height</Label>
                  <Input type="number" value={hVal as string} onChange={(e) => (onH as any)(e.target.value)} className="font-mono" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <InfoBox>Enter any three values and the fourth will be calculated automatically to maintain the aspect ratio.</InfoBox>
      </ToolCard>
    </div>
  );
}
