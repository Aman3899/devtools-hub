'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Copy, Smile, Info, Settings2 } from 'lucide-react';
import { toast } from 'sonner';
import { ToolNavigation } from '@/components/tool-navigation';

const EMOJI_DATA = [
  { category: 'Smileys', emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖'] },
  { category: 'Animals', emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷', '🕸', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🐐', '🦌', '🐕', '🐩', '🦮', '🐈', '🐈‍⬛', '🐓', ' turkey', '🦚', '🦜', '🦢', '🦩', '🕊', '🐇', '🦝', '🦨', '🦡', '🦦', '🦥', '🐁', '🐀', '🐿', '🦔'] },
  { category: 'Food', emojis: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', ' avocado', '🥦', '🥬', '🥒', '🌽', '🥕', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', 'bread', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', ' waffle', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🥪', '🥙', '🧆', '🌮', '🌯', '🥗', '🥘', ' spaghetti', '🍜', '🍲', '🍛', '🍣', '🍱', ' dumplings', '🦪', '🍤', '🍙', '🍚', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯', '🥛', '🍼', '☕️', '🍵', '🥤', '🍶', '🍺', '🍻', '🥂', '🍷', '🥃', '🍸', '🍹', '🧉', '🧊', '🥢', '🍽', '🍴', '🥄'] },
  { category: 'Objects', emojis: ['⌚️', '📱', '📲', '💻', '⌨️', '🖱', '🖲', '🕹', '🗜', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽', '🎞', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙', '🎚', '🎛', '🧭', '⏱', '⏲', '⏰', '🕰', '⏳', '⌛️', '📡', '🔋', '🔌', '💡', '🔦', '🕯', '🪔', '🧯', '🛢', '💸', '💵', '💴', '💶', '💷', '💰', '💳', '💎', '⚖️', '🧰', '🔧', '🔨', '⚒', '🛠', '⛏', '🔩', '⚙️', '🧱', '⛓', '🧲', '🔫', '💣', '🧨', '🪓', '🔪', '🗡', '⚔️', '🛡', '🚬', '⚰️', '⚱️', '🏺', '🔮', '📿', '🧿', '💈', '⚗️', '🔭', '🔬', '🕳', '🩹', '🩺', '💊', '💉', '🩸', '🧬', '🔬', '🔭', '📡', '💉', '💊', '🩹', '🩺', '🚪', '🛏', '🛋', '🪑', '🚽', '🚿', '🛀', '🪒', '🧴', '🧷', '🧹', '🧺', '🧻', ' soap', '🧽', '🧯', '🛒', '🚬', '⚰️', '⚱️', '🏺'] }
];

export function EmojiPickerClient() {
  const t = useTranslations('tools.emoji-picker');
  const commonT = useTranslations('common');
  const [search, setSearch] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

  const handleCopy = (emoji: string) => {
    navigator.clipboard.writeText(emoji);
    setSelectedEmoji(emoji);
    toast.success(`${emoji} ${commonT('copied')}`);
  };

  const filteredData = EMOJI_DATA.map(cat => ({
    ...cat,
    emojis: cat.emojis.filter(e => e.includes(search) || search === '')
  })).filter(cat => cat.emojis.length > 0);

  return (
    <div className="space-y-12">
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <div className="lg:col-span-9 flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t('title')}</Label>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
              <Input
                placeholder={t('placeholder')}
                className="pl-8 h-7 text-[10px] bg-muted/20 border-border focus-visible:ring-0"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          
          <Card className="min-h-[500px] border border-border shadow-none rounded-md bg-background overflow-hidden">
            <Tabs defaultValue="Smileys" className="w-full h-full flex flex-col">
              <div className="px-4 py-2 border-b bg-muted/10 flex items-center justify-between">
                <TabsList className="h-8 bg-transparent p-0 gap-1">
                  {EMOJI_DATA.map(cat => (
                    <TabsTrigger 
                      key={cat.category} 
                      value={cat.category} 
                      className="h-7 px-3 text-[10px] data-[state=active]:bg-background data-[state=active]:shadow-none border border-transparent data-[state=active]:border-border rounded-sm"
                    >
                      {cat.category}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {selectedEmoji && (
                  <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
                    <span className="text-[10px] text-muted-foreground uppercase font-semibold">Selected:</span>
                    <div className="h-7 w-7 flex items-center justify-center bg-muted/30 rounded border border-border text-lg">
                      {selectedEmoji}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1 p-4 overflow-auto custom-scrollbar">
                {EMOJI_DATA.map(cat => (
                  <TabsContent key={cat.category} value={cat.category} className="mt-0 focus-visible:outline-none">
                    <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-14 gap-1">
                      {cat.emojis.filter(e => search === '' || e.includes(search)).map((emoji, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleCopy(emoji)}
                          className="aspect-square flex items-center justify-center text-xl hover:bg-muted/50 rounded transition-all border border-transparent hover:border-border active:scale-90"
                          title="Click to copy"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </TabsContent>
                ))}

                {filteredData.length === 0 && (
                  <div className="h-[400px] flex flex-col items-center justify-center text-muted-foreground opacity-30 space-y-2">
                    <Smile className="h-10 w-10" />
                    <p className="text-[11px] font-medium">{commonT('noMatches.title')}</p>
                  </div>
                )}
              </div>
            </Tabs>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <Card className="border border-border shadow-none rounded-md bg-background">
            <CardHeader className="py-3 px-4 border-b">
              <CardTitle className="text-xs font-semibold flex items-center gap-2">
                <Smile className="h-3.5 w-3.5" />
                {commonT('ui.info')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="p-3 rounded-md bg-muted/50 border border-border space-y-1.5">
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  {t('article').split('.')[0]}.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">Features</Label>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <div className="h-1 w-1 rounded-full bg-green-500" />
                    One-click copy
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <div className="h-1 w-1 rounded-full bg-green-500" />
                    Unicode support
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <div className="h-1 w-1 rounded-full bg-green-500" />
                    Fast search
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="p-3 rounded-md bg-muted/30 border border-border flex gap-2.5 items-start">
            <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-[10px] text-muted-foreground leading-normal">
              Click any emoji to instantly copy it to your clipboard.
            </p>
          </div>
        </div>
      </div>
      <ToolNavigation currentToolId="emoji-picker" />
    </div>
  );
}
