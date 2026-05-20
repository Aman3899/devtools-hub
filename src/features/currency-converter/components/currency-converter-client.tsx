"use client"

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Repeat } from 'lucide-react';
import { ToolCard } from '@/components/layout/tool-card';

export function CurrencyConverterClient() {
  const rates: { [key: string]: number } = { USD: 1, EUR: 0.92, GBP: 0.79, JPY: 151.0, AUD: 1.53, CAD: 1.36, CHF: 0.90, CNY: 7.23, INR: 83.30 };

  const [amount, setAmount] = useState('100');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');

  const amt = parseFloat(amount);
  const result = !isNaN(amt) ? (amt / rates[from]) * rates[to] : 0;

  return (
    <div className="space-y-6">
      <ToolCard title="Currency Converter (Static Rates)" icon={Repeat}>
        <div className="grid gap-6 sm:grid-cols-3 items-end">
          <div className="space-y-2">
            <Label className="text-xs">Amount</Label>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="font-mono" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">From</Label>
            <select 
              value={from} 
              onChange={(e) => setFrom(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">To</Label>
            <select 
              value={to} 
              onChange={(e) => setTo(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        
        <div className="p-6 border rounded-md bg-muted/30 text-center mt-6">
          <div className="text-3xl font-mono font-bold">
            {result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {to}
          </div>
          <p className="text-xs text-muted-foreground mt-2">Note: Conversion rates are static examples.</p>
        </div>
      </ToolCard>
    </div>
  );
}
