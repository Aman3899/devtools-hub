"use client"

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator } from 'lucide-react';
import { ToolCard } from '@/components/layout/tool-card';
import { InfoBox } from '@/components/common';

export function BmiCalculatorClient() {
  const [height, setHeight] = useState('175');
  const [weight, setWeight] = useState('70');

  const h = parseFloat(height), w = parseFloat(weight);
  let bmi = 0, category = '', color = 'text-foreground';
  if (h > 0 && w > 0) {
    bmi = w / ((h / 100) ** 2);
    if (bmi < 18.5) { category = 'Underweight'; color = 'text-blue-500'; }
    else if (bmi < 25) { category = 'Normal weight'; color = 'text-green-500'; }
    else if (bmi < 30) { category = 'Overweight'; color = 'text-yellow-500'; }
    else { category = 'Obese'; color = 'text-destructive'; }
  }

  return (
    <div className="space-y-6">
      <ToolCard title="BMI Calculator" icon={Calculator}>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs">Height (cm)</Label>
            <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="font-mono" placeholder="e.g. 175" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Weight (kg)</Label>
            <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="font-mono" placeholder="e.g. 70" />
          </div>
        </div>
        <div className="pt-6 border-t mt-6">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Your BMI Result</Label>
          <div className="flex items-center gap-6 mt-4">
            <div className="text-5xl font-mono font-bold">{bmi > 0 ? bmi.toFixed(1) : '0.0'}</div>
            {bmi > 0 && <div className="flex flex-col"><span className="text-sm text-muted-foreground">Category</span><span className={`text-xl font-semibold ${color}`}>{category}</span></div>}
          </div>
        </div>
        <InfoBox className="mt-4">BMI is a screening tool, not a diagnostic measure. Consult a healthcare provider for a full assessment.</InfoBox>
      </ToolCard>
    </div>
  );
}
