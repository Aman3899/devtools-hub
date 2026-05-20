"use client"

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator } from 'lucide-react';
import { ToolCard } from '@/components/layout/tool-card';

export function LoanEmiCalculatorClient() {
  const [principal, setPrincipal] = useState('10000');
  const [rate, setRate] = useState('5');
  const [years, setYears] = useState('5');

  const p = parseFloat(principal);
  const r = parseFloat(rate) / 12 / 100;
  const n = parseFloat(years) * 12;

  let emi = 0, totalPayment = 0, totalInterest = 0;

  if (p > 0 && r > 0 && n > 0) {
    emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    totalPayment = emi * n;
    totalInterest = totalPayment - p;
  }

  const isValid = emi > 0;

  return (
    <div className="space-y-6">
      <ToolCard title="Loan EMI Calculator" icon={Calculator}>
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="space-y-2">
            <Label className="text-xs">Loan Amount (Principal)</Label>
            <Input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} className="font-mono" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Annual Interest Rate (%)</Label>
            <Input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="font-mono" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Loan Tenure (Years)</Label>
            <Input type="number" value={years} onChange={(e) => setYears(e.target.value)} className="font-mono" />
          </div>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-3 pt-6 border-t mt-6">
          <div className="p-4 border rounded-md bg-muted/30 text-center">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Monthly EMI</Label>
            <div className="text-2xl font-mono mt-2 font-bold text-foreground">{isValid ? emi.toFixed(2) : '0.00'}</div>
          </div>
          <div className="p-4 border rounded-md bg-muted/30 text-center">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Interest</Label>
            <div className="text-2xl font-mono mt-2 font-bold text-yellow-600 dark:text-yellow-500">{isValid ? totalInterest.toFixed(2) : '0.00'}</div>
          </div>
          <div className="p-4 border rounded-md bg-muted/30 text-center">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Payment</Label>
            <div className="text-2xl font-mono mt-2 font-bold text-green-600 dark:text-green-500">{isValid ? totalPayment.toFixed(2) : '0.00'}</div>
          </div>
        </div>
      </ToolCard>
    </div>
  );
}
