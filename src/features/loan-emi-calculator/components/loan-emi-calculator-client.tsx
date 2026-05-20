"use client"

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator } from 'lucide-react';
import { ToolCard } from '@/components/layout/tool-card';
import { InfoBox } from '@/components/common';

export function LoanEmiCalculatorClient() {
  const [principal, setPrincipal] = useState('10000');
  const [rate, setRate] = useState('5');
  const [years, setYears] = useState('5');

  const p = parseFloat(principal), r = parseFloat(rate) / 12 / 100, n = parseFloat(years) * 12;
  let emi = 0, totalPayment = 0, totalInterest = 0;
  if (p > 0 && r > 0 && n > 0) {
    emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    totalPayment = emi * n;
    totalInterest = totalPayment - p;
  }

  return (
    <div className="space-y-6">
      <ToolCard title="Loan EMI Calculator" icon={Calculator}>
        <div className="grid gap-6 sm:grid-cols-3">
          {[['Loan Amount', principal, setPrincipal], ['Annual Rate (%)', rate, setRate], ['Tenure (Years)', years, setYears]].map(([label, val, setter]) => (
            <div key={label as string} className="space-y-2">
              <Label className="text-xs">{label as string}</Label>
              <Input type="number" value={val as string} onChange={(e) => (setter as any)(e.target.value)} className="font-mono" />
            </div>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-3 pt-6 border-t mt-6">
          {[['Monthly EMI', emi, 'text-foreground'], ['Total Interest', totalInterest, 'text-yellow-600 dark:text-yellow-500'], ['Total Payment', totalPayment, 'text-green-600 dark:text-green-500']].map(([label, val, color]) => (
            <div key={label as string} className="p-4 border rounded-md bg-muted/30 text-center">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{label as string}</Label>
              <div className={`text-2xl font-mono mt-2 font-bold ${color}`}>{(val as number) > 0 ? (val as number).toFixed(2) : '0.00'}</div>
            </div>
          ))}
        </div>
        <InfoBox className="mt-4">EMI = [P × R × (1+R)^N] / [(1+R)^N - 1] where P = Principal, R = Monthly Rate, N = Months.</InfoBox>
      </ToolCard>
    </div>
  );
}
