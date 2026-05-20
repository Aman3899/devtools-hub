"use client"

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Repeat } from 'lucide-react';
import { ToolCard } from '@/components/layout/tool-card';
import { InfoBox } from '@/components/common';

const RATES: Record<string, number> = { USD:1, EUR:0.92, GBP:0.79, JPY:151.0, AUD:1.53, CAD:1.36, CHF:0.90, CNY:7.23, INR:83.30, PKR:278.5 };

export function CurrencyConverterClient() {
  const [amount, setAmount] = useState('100');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');

  const amt = parseFloat(amount);
  const result = !isNaN(amt) ? (amt / RATES[from]) * RATES[to] : 0;

  return (
    <div className="space-y-6">
      <ToolCard title="Currency Converter" icon={Repeat}>
        <div className="grid gap-6 sm:grid-cols-3 items-end">
          <div className="space-y-2">
            <Label className="text-xs">Amount</Label>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="font-mono" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">From</Label>
            <Select value={from} onValueChange={(val) => val && setFrom(val)}>
              <SelectTrigger className="h-10 text-sm bg-background border-input"><SelectValue /></SelectTrigger>
              <SelectContent>{Object.keys(RATES).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">To</Label>
            <Select value={to} onValueChange={(val) => val && setTo(val)}>
              <SelectTrigger className="h-10 text-sm bg-background border-input"><SelectValue /></SelectTrigger>
              <SelectContent>{Object.keys(RATES).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div className="p-6 border rounded-md bg-muted/30 text-center mt-6">
          <div className="text-3xl font-mono font-bold">{result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {to}</div>
        </div>
        <InfoBox className="mt-4">Conversion rates are static examples for demonstration. Use a live API for production accuracy.</InfoBox>
      </ToolCard>
    </div>
  );
}
