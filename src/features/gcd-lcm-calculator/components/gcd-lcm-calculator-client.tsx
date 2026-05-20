"use client"

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator } from 'lucide-react';
import { ToolCard } from '@/components/layout/tool-card';

export function GcdLcmCalculatorClient() {
  const [input, setInput] = useState('12, 18');

  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
  const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);

  const calculate = () => {
    const nums = input.split(',').map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n) && n > 0);
    if (nums.length < 2) return { gcdVal: null, lcmVal: null };
    
    let resGcd = nums[0], resLcm = nums[0];
    for (let i = 1; i < nums.length; i++) {
      resGcd = gcd(resGcd, nums[i]);
      resLcm = lcm(resLcm, nums[i]);
    }
    return { gcdVal: resGcd, lcmVal: resLcm };
  };

  const { gcdVal, lcmVal } = calculate();

  return (
    <div className="space-y-6">
      <ToolCard title="GCD and LCM Calculator" icon={Calculator}>
        <div className="space-y-2">
          <Label className="text-xs">Enter numbers (comma separated)</Label>
          <Input type="text" value={input} onChange={(e) => setInput(e.target.value)} className="font-mono" placeholder="e.g. 12, 18, 24" />
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="p-4 border rounded-md bg-muted/30">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Greatest Common Divisor (GCD)</Label>
            <div className="text-3xl font-mono mt-2 font-bold">{gcdVal !== null ? gcdVal : '-'}</div>
          </div>
          <div className="p-4 border rounded-md bg-muted/30">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Least Common Multiple (LCM)</Label>
            <div className="text-3xl font-mono mt-2 font-bold">{lcmVal !== null ? lcmVal : '-'}</div>
          </div>
        </div>
      </ToolCard>
    </div>
  );
}
