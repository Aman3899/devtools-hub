'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Settings2, Info, Copy, RefreshCw, Check, ArrowRightLeft, Volume2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ToolNavigation } from '@/components/tool-navigation';

const MORSE_MAP: Record<string, string> = {
  'a': '.-',    'b': '-...',  'c': '-.-.',  'd': '-..',   'e': '.',     'f': '..-.',  'g': '--.',   'h': '....',  'i': '..',    'j': '.---',
  'k': '-.-',   'l': '.-..',  'm': '--',    'n': '-.',    'o': '---',   'p': '.--.',  'q': '--.-',  'r': '.-.',   's': '...',   't': '-',
  'u': '..-',   'v': '...-',  'w': '.--',   'x': '-..-',  'y': '-.--',  'z': '--..',  '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----', ' ': '/',     '.': '.-.-.-',',': '--..--','?': '..--..',
  "'": '.----.', '!': '-.-.--','/': '-..-.', '(': '-.--.', ')': '-.--.-','&': '.-...', ':': '---...',';': '-.-.-.','=': '-...-','+': '.-.-.',
  '-': '-....-', '_': '..--.-','"': '.-..-.','$': '...-..-','@': '.--.-.',
};
const REVERSE_MORSE_MAP: Record<string, string> = Object.fromEntries(Object.entries(MORSE_MAP).map(([k, v]) => [v, k]));

export function MorseConverterClient() {
  const t = useTranslations('tools.morse-converter');
  const commonT = useTranslations('common');
  
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const audioCtxRef = useRef<AudioContext | null>(null);

  const processData = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    if (mode === 'encode') {
      const result = input.toLowerCase().split('').map(char => MORSE_MAP[char] || char).join(' ');
      setOutput(result);
    } else {
      const result = input.split(' ').map(code => {
        if (code === '/' || code === '|') return ' '; // standard word separators
        return REVERSE_MORSE_MAP[code] || code;
      }).join('');
      setOutput(result);
    }
  }, [input, mode]);

  useEffect(() => {
    processData();
  }, [processData]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success(commonT('copied'));
  };

  const loadSample = () => {
    if (mode === 'encode') {
      setInput('SOS Help me!');
    } else {
      setInput('... --- ... / .... . .-.. .--. / -- . -.-.--');
    }
    toast.success(commonT('success'));
  };

  const playMorseCode = async () => {
    if (isPlaying) return;
    
    const morseText = mode === 'encode' ? output : input;
    if (!morseText || !morseText.match(/^[.\- /|]+$/)) {
      toast.error('No valid morse code to play');
      return;
    }

    setIsPlaying(true);
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    
    const dotDuration = 0.08; // 80ms
    const dashDuration = dotDuration * 3;
    const symbolSpace = dotDuration;
    const letterSpace = dotDuration * 3;
    const wordSpace = dotDuration * 7;

    let time = ctx.currentTime;

    for (const char of morseText) {
      if (char === '.' || char === '-') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.value = 600; // 600Hz tone
        
        const duration = char === '.' ? dotDuration : dashDuration;
        
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(1, time + 0.01);
        gain.gain.setValueAtTime(1, time + duration - 0.01);
        gain.gain.linearRampToValueAtTime(0, time + duration);
        
        osc.start(time);
        osc.stop(time + duration);
        
        time += duration + symbolSpace;
      } else if (char === ' ') {
        time += letterSpace - symbolSpace;
      } else if (char === '/' || char === '|') {
        time += wordSpace - letterSpace;
      }
    }

    setTimeout(() => {
      setIsPlaying(false);
    }, (time - ctx.currentTime) * 1000);
  };

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 grid gap-4 md:grid-cols-2">
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{commonT('input')}</Label>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={loadSample} className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground">
                  <RefreshCw className="h-3 w-3" />
                  {commonT('ui.sample')}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setInput('')} title={commonT('clear')} className="h-6 w-6 text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <Card className="flex flex-col h-[300px] border border-border shadow-none rounded-md overflow-hidden bg-background focus-within:border-foreground/20 transition-colors">
              <Textarea
                placeholder={mode === 'encode' ? 'Type text to convert to Morse...' : 'Type Morse code (e.g., ... --- ...)'}
                className="flex-1 font-mono text-sm resize-none border-none focus-visible:ring-0 p-4 bg-transparent leading-relaxed"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </Card>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{commonT('ui.result')}</Label>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={copyToClipboard} 
                disabled={!output}
                className="h-6 px-2 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                {commonT('copy')}
              </Button>
            </div>
            <Card className="flex flex-col h-[300px] border border-border shadow-none rounded-md overflow-hidden bg-muted/20">
              <Textarea
                readOnly
                className="flex-1 font-mono text-sm resize-none border-none focus-visible:ring-0 p-4 bg-transparent leading-relaxed text-[#e06c75]"
                value={output}
                placeholder="Result..."
              />
            </Card>
          </div>
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
              
              <div className="flex flex-col gap-2">
                <Button 
                  variant={mode === 'encode' ? 'default' : 'outline'} 
                  className="w-full justify-start h-9 text-xs"
                  onClick={() => { setMode('encode'); setInput(''); }}
                >
                  <ArrowRightLeft className="h-4 w-4 mr-2" />
                  {t('encode')}
                </Button>
                <Button 
                  variant={mode === 'decode' ? 'default' : 'outline'} 
                  className="w-full justify-start h-9 text-xs"
                  onClick={() => { setMode('decode'); setInput(''); }}
                >
                  <ArrowRightLeft className="h-4 w-4 mr-2" />
                  {t('decode')}
                </Button>
              </div>

              <div className="pt-2">
                <Button 
                  variant="secondary" 
                  className="w-full h-9 text-xs font-medium"
                  onClick={playMorseCode}
                  disabled={isPlaying || (!output && mode === 'encode') || (!input && mode === 'decode')}
                >
                  <Volume2 className={`h-4 w-4 mr-2 ${isPlaying ? 'animate-pulse text-primary' : ''}`} />
                  {t('play_audio')}
                </Button>
              </div>

              <div className="p-3 rounded-md bg-muted/50 border border-border space-y-1.5 mt-4">
                <div className="flex items-center gap-2 text-[10px] font-semibold text-foreground uppercase tracking-tight">
                  <Info className="h-3 w-3" />
                  Info
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  {t('info')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <ToolNavigation currentToolId="morse-converter" />
    </div>
  );
}
