"use client"

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator } from 'lucide-react';
import { ToolCard } from '@/components/layout/tool-card';
import { InfoBox } from '@/components/common';

const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);

export function GcdLcmCalculatorClient() {
  const [input, setInput] = useState('12, 18');

  const nums = input.split(',').map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n) && n > 0);
  let gcdVal: number | null = null, lcmVal: number | null = null;
  if (nums.length >= 2) {
    gcdVal = nums.reduce(gcd);
    lcmVal = nums.reduce(lcm);
  }

  return (
    <div className="space-y-6">
      <ToolCard title="GCD and LCM Calculator" icon={Calculator}>
        <div className="space-y-2">
          <Label className="text-xs">Enter numbers (comma separated)</Label>
          <Input type="text" value={input} onChange={(e) => setInput(e.target.value)} className="font-mono" placeholder="e.g. 12, 18, 24" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[['Greatest Common Divisor (GCD)', gcdVal], ['Least Common Multiple (LCM)', lcmVal]].map(([label, val]) => (
            <div key={label as string} className="p-4 border rounded-md bg-muted/30">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{label as string}</Label>
              <div className="text-3xl font-mono mt-2 font-bold">{val !== null ? val : '-'}</div>
            </div>
          ))}
        </div>
        <InfoBox>Enter at least two positive integers separated by commas to calculate their GCD and LCM.</InfoBox>
      </ToolCard>
    </div>
  );
}
