"use client"

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';
import { ToolCard } from '@/components/layout/tool-card';

export function ScientificCalculatorClient() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState(false);

  const calculate = () => {
    try {
      let expr = expression
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/pi/gi, 'Math.PI')
        .replace(/e/gi, 'Math.E')
        .replace(/log/g, 'Math.log10')
        .replace(/ln/g, 'Math.log')
        .replace(/sqrt/g, 'Math.sqrt')
        .replace(/\^/g, '**');

      // eslint-disable-next-line no-new-func
      const res = new Function(`'use strict'; return (${expr})`)();
      
      if (typeof res === 'number' && !isNaN(res)) {
        setResult(res.toPrecision(10).replace(/\.?0+$/, ''));
        setError(false);
      } else {
        setResult('Error');
        setError(true);
      }
    } catch (e) {
      setResult('Error');
      setError(true);
    }
  };

  return (
    <div className="space-y-6">
      <ToolCard title="Scientific Expression Evaluator" icon={Calculator}>
        <div className="space-y-4">
          <Input 
            type="text" 
            value={expression} 
            onChange={(e) => setExpression(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && calculate()}
            className="font-mono h-14 text-lg" 
            placeholder="e.g. sin(PI/2) * 5 + sqrt(16)" 
          />
          <div className="flex gap-2 flex-wrap">
            {['sin(', 'cos(', 'tan(', 'log(', 'sqrt(', 'PI', 'E', '^', '+', '-', '*', '/'].map(btn => (
              <Button key={btn} variant="outline" size="sm" onClick={() => setExpression(prev => prev + btn)} className="font-mono text-xs">
                {btn}
              </Button>
            ))}
          </div>
          <Button onClick={calculate} className="w-full">Calculate (=)</Button>
        </div>
        
        {result && (
          <div className={`p-6 rounded-md border text-center ${error ? 'bg-destructive/10 border-destructive/20 text-destructive' : 'bg-muted/30'}`}>
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">Result</div>
            <div className="text-4xl font-mono font-bold break-all">{result}</div>
          </div>
        )}
      </ToolCard>
    </div>
  );
}
