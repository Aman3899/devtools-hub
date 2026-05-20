"use client"

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Hash, Check, X } from 'lucide-react';
import { ToolCard } from '@/components/layout/tool-card';

export function PrimeNumberCheckerClient() {
  const [number, setNumber] = useState('');
  
  const isPrime = (num: number) => {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    let i = 5;
    while (i * i <= num) {
      if (num % i === 0 || num % (i + 2) === 0) return false;
      i += 6;
    }
    return true;
  };

  const numVal = parseInt(number, 10);
  const isValid = !isNaN(numVal) && number.trim() !== '';
  const result = isValid ? isPrime(numVal) : null;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <ToolCard title="Prime Number Checker" icon={Hash} contentClassName="p-6 space-y-6">
        <div className="space-y-2">
          <Label className="text-xs">Enter a number</Label>
          <Input 
            type="number" 
            value={number} 
            onChange={(e) => setNumber(e.target.value)} 
            className="font-mono h-14 text-2xl" 
            placeholder="e.g. 17" 
          />
        </div>
        
        {isValid && (
          <div className={`p-6 rounded-md border flex items-center gap-4 ${result ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400' : 'bg-destructive/10 border-destructive/20 text-destructive'}`}>
            <div className="p-2 rounded-full bg-background/50">
              {result ? <Check className="h-6 w-6 text-green-500" /> : <X className="h-6 w-6 text-destructive" />}
            </div>
            <div>
              <p className="text-sm font-medium">{result ? 'Yes, it is a prime number!' : 'No, it is not a prime number.'}</p>
              <p className="text-2xl font-bold font-mono mt-1">{numVal}</p>
            </div>
          </div>
        )}
      </ToolCard>
    </div>
  );
}
