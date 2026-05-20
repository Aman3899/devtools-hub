"use client"

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Repeat } from 'lucide-react';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton } from '@/components/common';

const ROMAN_MAP: [string, number][] = [['M',1000],['CM',900],['D',500],['CD',400],['C',100],['XC',90],['L',50],['XL',40],['X',10],['IX',9],['V',5],['IV',4],['I',1]];

const toRoman = (num: number) => {
  if (isNaN(num) || num <= 0 || num > 3999) return '';
  let res = ''; for (const [r, v] of ROMAN_MAP) { while (num >= v) { res += r; num -= v; } } return res;
};

const toNumber = (rom: string) => {
  const map: Record<string, number> = Object.fromEntries(ROMAN_MAP);
  let num = 0, i = 0;
  while (i < rom.length) {
    const two = rom.substring(i, i + 2);
    if (map[two]) { num += map[two]; i += 2; } else { num += map[rom[i]] || 0; i++; }
  }
  return num;
};

export function RomanNumeralConverterClient() {
  const [number, setNumber] = useState('');
  const [roman, setRoman] = useState('');

  const handleNumChange = (val: string) => { setNumber(val); setRoman(toRoman(parseInt(val, 10))); };
  const handleRomanChange = (val: string) => {
    const rom = val.toUpperCase().replace(/[^IVXLCDM]/g, '');
    setRoman(rom);
    const n = toNumber(rom);
    setNumber(n > 0 ? n.toString() : '');
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <ToolCard
          title="Decimal Number"
          icon={Repeat}
          action={<CopyButton text={number} type="num" />}
        >
          <Input type="number" min="1" max="3999" value={number} onChange={(e) => handleNumChange(e.target.value)} placeholder="e.g. 2026" className="h-16 text-3xl font-mono text-center" />
          <p className="text-xs text-center text-muted-foreground mt-4">Range: 1 - 3999</p>
        </ToolCard>

        <ToolCard
          title="Roman Numeral"
          icon={Repeat}
          action={<CopyButton text={roman} type="rom" />}
        >
          <Input type="text" value={roman} onChange={(e) => handleRomanChange(e.target.value)} placeholder="e.g. MMXXVI" className="h-16 text-3xl font-mono text-center" />
        </ToolCard>
      </div>
    </div>
  );
}
