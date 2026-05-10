'use client';

import { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings2, Info, Copy, RefreshCw, Hash, Check, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ToolNavigation } from '@/components/tool-navigation';

export function BaseConverterClient() {
  const t = useTranslations('tools.base-converter');
  const commonT = useTranslations('common');
  
  const [values, setValues] = useState({
    binary: '',
    octal: '',
    decimal: '',
    hex: ''
  });
  
  const [error, setError] = useState('');
  const [copiedStates, setCopiedStates] = useState({ binary: false, octal: false, decimal: false, hex: false });

  const isEnglish = commonT('hero.searchPlaceholder' as any) === 'Find a tool...';

  const updateFromBase = useCallback((value: string, base: number) => {
    if (!value.trim()) {
      setValues({ binary: '', octal: '', decimal: '', hex: '' });
      setError('');
      return;
    }

    try {
      // Basic validation
      const val = value.replace(/\s+/g, ''); // Remove spaces
      
      let decimalValue: bigint;
      
      if (base === 2 && !/^[01]+$/.test(val)) throw new Error('Invalid binary');
      if (base === 8 && !/^[0-7]+$/.test(val)) throw new Error('Invalid octal');
      if (base === 10 && !/^\d+$/.test(val)) throw new Error('Invalid decimal');
      if (base === 16 && !/^[0-9A-Fa-f]+$/.test(val)) throw new Error('Invalid hexadecimal');

      // Use BigInt to support large numbers (beyond Number.MAX_SAFE_INTEGER)
      if (base === 16) {
        decimalValue = BigInt('0x' + val);
      } else if (base === 2) {
        decimalValue = BigInt('0b' + val);
      } else if (base === 8) {
        decimalValue = BigInt('0o' + val);
      } else {
        decimalValue = BigInt(val);
      }

      setValues({
        binary: decimalValue.toString(2),
        octal: decimalValue.toString(8),
        decimal: decimalValue.toString(10),
        hex: decimalValue.toString(16).toUpperCase()
      });
      setError('');
    } catch (err) {
      setError(isEnglish ? 'Invalid character for the selected base' : 'غلط حرف درج کیا گیا ہے');
    }
  }, [isEnglish]);

  const copyToClipboard = (type: 'binary' | 'octal' | 'decimal' | 'hex') => {
    navigator.clipboard.writeText(values[type]);
    setCopiedStates(prev => ({ ...prev, [type]: true }));
    setTimeout(() => setCopiedStates(prev => ({ ...prev, [type]: false })), 2000);
    toast.success(commonT('copied'));
  };

  const loadSample = () => {
    updateFromBase('255', 10);
    toast.success(commonT('success'));
  };

  const clear = () => {
    setValues({ binary: '', octal: '', decimal: '', hex: '' });
    setError('');
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 space-y-4">
          <div className="flex items-center justify-between px-1">
            <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{isEnglish ? 'Instant Converter Table' : 'فوری کنورٹر'}</Label>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={loadSample} className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground">
                <RefreshCw className="h-3 w-3" />
                {isEnglish ? 'Sample' : 'مثال'}
              </Button>
              <Button variant="ghost" size="icon" onClick={clear} title={commonT('clear')} className="h-6 w-6 text-muted-foreground hover:text-destructive">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <Card className="flex flex-col border border-border shadow-none rounded-md overflow-hidden bg-background">
            <div className="p-6 space-y-6">
              {error && (
                <div className="p-3 bg-destructive/10 text-destructive text-xs rounded-md border border-destructive/20 font-medium text-center">
                  {error}
                </div>
              )}
              
              {/* Decimal */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold">Decimal (Base 10)</Label>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard('decimal')} disabled={!values.decimal}>
                    {copiedStates.decimal ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
                <Input 
                  type="text" 
                  value={values.decimal} 
                  onChange={(e) => { setValues(prev => ({...prev, decimal: e.target.value})); updateFromBase(e.target.value, 10); }}
                  className="font-mono bg-muted/20 focus-visible:ring-1 border-border"
                  placeholder="e.g. 255"
                />
              </div>

              {/* Binary */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold">Binary (Base 2)</Label>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard('binary')} disabled={!values.binary}>
                    {copiedStates.binary ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
                <Input 
                  type="text" 
                  value={values.binary} 
                  onChange={(e) => { setValues(prev => ({...prev, binary: e.target.value})); updateFromBase(e.target.value, 2); }}
                  className="font-mono bg-muted/20 focus-visible:ring-1 border-border"
                  placeholder="e.g. 11111111"
                />
              </div>

              {/* Hexadecimal */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold">Hexadecimal (Base 16)</Label>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard('hex')} disabled={!values.hex}>
                    {copiedStates.hex ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
                <Input 
                  type="text" 
                  value={values.hex} 
                  onChange={(e) => { setValues(prev => ({...prev, hex: e.target.value})); updateFromBase(e.target.value, 16); }}
                  className="font-mono bg-muted/20 focus-visible:ring-1 border-border"
                  placeholder="e.g. FF"
                />
              </div>

              {/* Octal */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold">Octal (Base 8)</Label>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard('octal')} disabled={!values.octal}>
                    {copiedStates.octal ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>
                <Input 
                  type="text" 
                  value={values.octal} 
                  onChange={(e) => { setValues(prev => ({...prev, octal: e.target.value})); updateFromBase(e.target.value, 8); }}
                  className="font-mono bg-muted/20 focus-visible:ring-1 border-border"
                  placeholder="e.g. 377"
                />
              </div>

            </div>
          </Card>
        </div>

        {/* Sidebar Settings */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="border border-border shadow-none rounded-md bg-background">
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-xs font-semibold flex items-center gap-2">
                <Settings2 className="h-3.5 w-3.5" />
                {commonT('ui.customization')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-6">
              <div className="p-3 rounded-md bg-muted/50 border border-border space-y-1.5">
                <div className="flex items-center gap-2 text-[10px] font-semibold text-foreground uppercase tracking-tight">
                  <Hash className="h-3 w-3" />
                  {isEnglish ? 'BigInt Support' : 'BigInt سپورٹ'}
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  {isEnglish ? 'This converter uses BigInt, allowing you to convert extremely large numbers safely without losing precision.' : 'یہ کنورٹر بڑی تعداد کے لیے BigInt استعمال کرتا ہے۔'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ToolNavigation currentToolId="base-converter" />
    </div>
  );
}
