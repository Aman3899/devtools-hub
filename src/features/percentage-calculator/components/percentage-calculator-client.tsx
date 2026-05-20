"use client"

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Copy, Check, Calculator } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

export function PercentageCalculatorClient() {
  const tCommon = useTranslations('common');
  const { copiedType, copyToClipboard } = useCopyToClipboard();

  // Mode 1: What is X% of Y?
  const [m1X, setM1X] = useState('');
  const [m1Y, setM1Y] = useState('');
  const m1Result = (parseFloat(m1X) / 100) * parseFloat(m1Y);

  // Mode 2: X is what percent of Y?
  const [m2X, setM2X] = useState('');
  const [m2Y, setM2Y] = useState('');
  const m2Result = (parseFloat(m2X) / parseFloat(m2Y)) * 100;

  // Mode 3: Percentage increase/decrease from X to Y
  const [m3X, setM3X] = useState('');
  const [m3Y, setM3Y] = useState('');
  const m3Diff = parseFloat(m3Y) - parseFloat(m3X);
  const m3Result = (m3Diff / parseFloat(m3X)) * 100;

  const isM1Valid = !isNaN(m1Result) && isFinite(m1Result);
  const isM2Valid = !isNaN(m2Result) && isFinite(m2Result);
  const isM3Valid = !isNaN(m3Result) && isFinite(m3Result);

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Mode 1: What is X% of Y? */}
      <ToolCard 
        title="What is X% of Y?" 
        icon={Calculator}
        contentClassName="p-6 space-y-4"
      >
        <div className="space-y-2">
          <Label className="text-xs">What is (X%)</Label>
          <Input
            type="number"
            placeholder="e.g. 20"
            value={m1X}
            onChange={(e) => setM1X(e.target.value)}
            className="font-mono"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">of (Y)</Label>
          <Input
            type="number"
            placeholder="e.g. 150"
            value={m1Y}
            onChange={(e) => setM1Y(e.target.value)}
            className="font-mono"
          />
        </div>
        <div className="pt-4 border-t border-border mt-4">
          <Label className="text-xs text-muted-foreground">Result</Label>
          <div className="flex items-center justify-between mt-1">
            <div className="text-2xl font-mono font-bold text-foreground truncate">
              {isM1Valid ? m1Result.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '-'}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(m1Result.toString(), 'm1')}
              disabled={!isM1Valid}
              className="h-8 gap-1.5"
            >
              {copiedType === 'm1' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
        </div>
      </ToolCard>

      {/* Mode 2: X is what percent of Y? */}
      <ToolCard 
        title="X is what % of Y?" 
        icon={Calculator}
        contentClassName="p-6 space-y-4"
      >
        <div className="space-y-2">
          <Label className="text-xs">(X)</Label>
          <Input
            type="number"
            placeholder="e.g. 30"
            value={m2X}
            onChange={(e) => setM2X(e.target.value)}
            className="font-mono"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">is what percent of (Y)</Label>
          <Input
            type="number"
            placeholder="e.g. 150"
            value={m2Y}
            onChange={(e) => setM2Y(e.target.value)}
            className="font-mono"
          />
        </div>
        <div className="pt-4 border-t border-border mt-4">
          <Label className="text-xs text-muted-foreground">Result (%)</Label>
          <div className="flex items-center justify-between mt-1">
            <div className="text-2xl font-mono font-bold text-foreground truncate">
              {isM2Valid ? `${m2Result.toLocaleString(undefined, { maximumFractionDigits: 2 })}%` : '-'}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(m2Result.toString(), 'm2')}
              disabled={!isM2Valid}
              className="h-8 gap-1.5"
            >
              {copiedType === 'm2' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
        </div>
      </ToolCard>

      {/* Mode 3: Percentage Increase/Decrease */}
      <ToolCard 
        title="% Increase/Decrease" 
        icon={Calculator}
        contentClassName="p-6 space-y-4"
      >
        <div className="space-y-2">
          <Label className="text-xs">From (X)</Label>
          <Input
            type="number"
            placeholder="e.g. 100"
            value={m3X}
            onChange={(e) => setM3X(e.target.value)}
            className="font-mono"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">To (Y)</Label>
          <Input
            type="number"
            placeholder="e.g. 120"
            value={m3Y}
            onChange={(e) => setM3Y(e.target.value)}
            className="font-mono"
          />
        </div>
        <div className="pt-4 border-t border-border mt-4">
          <Label className="text-xs text-muted-foreground">
            {isM3Valid && m3Result > 0 ? 'Increase (%)' : isM3Valid && m3Result < 0 ? 'Decrease (%)' : 'Result (%)'}
          </Label>
          <div className="flex items-center justify-between mt-1">
            <div className={`text-2xl font-mono font-bold truncate ${isM3Valid ? (m3Result > 0 ? 'text-green-500' : m3Result < 0 ? 'text-destructive' : 'text-foreground') : 'text-foreground'}`}>
              {isM3Valid ? `${m3Result > 0 ? '+' : ''}${m3Result.toLocaleString(undefined, { maximumFractionDigits: 2 })}%` : '-'}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(m3Result.toString(), 'm3')}
              disabled={!isM3Valid}
              className="h-8 gap-1.5 text-muted-foreground"
            >
              {copiedType === 'm3' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
        </div>
      </ToolCard>
    </div>
  );
}
