"use client"

import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Settings2, ArrowRightLeft, Volume2 } from 'lucide-react';
import { toast } from 'sonner';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, ToolActions, InfoBox, CodeTextarea } from '@/components/common';

const MORSE: Record<string, string> = { a:'.-',b:'-...',c:'-.-.',d:'-..',e:'.',f:'..-.',g:'--.',h:'....',i:'..',j:'.---',k:'-.-',l:'.-..',m:'--',n:'-.',o:'---',p:'.--.',q:'--.-',r:'.-.',s:'...',t:'-',u:'..-',v:'...-',w:'.--',x:'-..-',y:'-.--',z:'--..',1:'.----',2:'..---',3:'...--',4:'....-',5:'.....',6:'-....',7:'--...',8:'---..',9:'----.',0:'-----',' ':'/'};
const REVERSE: Record<string, string> = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]));

export function MorseConverterClient() {
  const t = useTranslations('tools.morse-converter');
  const commonT = useTranslations('common');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const processData = useCallback(() => {
    if (!input.trim()) { setOutput(''); return; }
    if (mode === 'encode') {
      setOutput(input.toLowerCase().split('').map(c => MORSE[c] || c).join(' '));
    } else {
      setOutput(input.split(' ').map(code => (code === '/' || code === '|') ? ' ' : (REVERSE[code] || code)).join(''));
    }
  }, [input, mode]);

  useEffect(() => { processData(); }, [processData]);

  const loadSample = () => { setInput(mode === 'encode' ? 'SOS' : '... --- ...'); toast.success(commonT('success')); };

  const playMorse = async () => {
    if (isPlaying) return;
    const morse = mode === 'encode' ? output : input;
    if (!morse) return;
    setIsPlaying(true);
    if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    const ctx = audioCtxRef.current;
    const dot = 0.08; let time = ctx.currentTime;
    for (const c of morse) {
      if (c === '.' || c === '-') {
        const osc = ctx.createOscillator(); const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = 600; const dur = c === '.' ? dot : dot * 3;
        gain.gain.setValueAtTime(0, time); gain.gain.linearRampToValueAtTime(1, time + 0.01);
        gain.gain.setValueAtTime(1, time + dur - 0.01); gain.gain.linearRampToValueAtTime(0, time + dur);
        osc.start(time); osc.stop(time + dur); time += dur + dot;
      } else if (c === ' ') { time += dot * 3 - dot; } else if (c === '/') { time += dot * 7 - dot * 3; }
    }
    setTimeout(() => setIsPlaying(false), (time - ctx.currentTime) * 1000);
  };

  return (
    <div className="grid gap-6 md:grid-cols-3 items-start">
      <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">
        <ToolCard
          title={commonT('input')}
          action={<ToolActions onSample={loadSample} onClear={() => setInput('')} />}
          contentClassName="p-0 flex flex-col h-[300px]"
        >
          <CodeTextarea placeholder={mode === 'encode' ? 'Type text to convert to Morse...' : 'Type Morse code (e.g., ... --- ...)'} value={input} onChange={setInput} />
        </ToolCard>

        <ToolCard
          title={commonT('ui.result')}
          action={<CopyButton text={output} type="morse" />}
          contentClassName="p-0 flex flex-col h-[300px] bg-muted/20"
        >
          <CodeTextarea value={output} onChange={() => {}} placeholder="Result..." disabled className="text-[#e06c75]" />
        </ToolCard>
      </div>

      <div className="md:col-span-1 space-y-4">
        <ToolCard title={commonT('ui.customization')} icon={Settings2} contentClassName="p-4 space-y-6">
          <div className="flex flex-col gap-2">
            {(['encode', 'decode'] as const).map(m => (
              <Button key={m} variant={mode === m ? 'default' : 'outline'} className="w-full justify-start h-9 text-xs" onClick={() => { setMode(m); setInput(''); }}>
                <ArrowRightLeft className="h-4 w-4 mr-2" />{t(m)}
              </Button>
            ))}
          </div>
          <Button variant="secondary" className="w-full h-9 text-xs font-medium" onClick={playMorse} disabled={isPlaying || !output}>
            <Volume2 className={`h-4 w-4 mr-2 ${isPlaying ? 'animate-pulse text-primary' : ''}`} />{t('play_audio')}
          </Button>
          <InfoBox title="Info" variant="default">{t('info')}</InfoBox>
        </ToolCard>
      </div>
    </div>
  );
}
