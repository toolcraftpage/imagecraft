import { useState } from 'react';
import { Sticker } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';

const stickerOptions = ['✨', '🔥', '⭐', '✅', '💡', '🎉', '❤️', '🎯', '📌', '🌟'];

export default function StickerTool() {
  const { addTextObject } = useEditorStore();
  const [selected, setSelected] = useState('✨');

  const addSticker = (value: string) => {
    addTextObject({
      type: 'sticker',
      name: 'Sticker layer',
      text: value,
      x: 160,
      y: 160,
      width: 72,
      height: 72,
      rotation: 0,
      color: '#111827',
      fill: '#ffffff',
      stroke: '#111827',
      strokeWidth: 0,
      opacity: 100,
      fontFamily: 'Inter, Arial, sans-serif',
      fontSize: 42,
      fontWeight: 700,
      italic: false,
      underline: false,
      textAlign: 'center',
      letterSpacing: 0,
      lineHeight: 1,
      visible: true,
      locked: false,
    });
  };

  return (
    <div className="space-y-5 p-5">
      <div className="rounded-xl border border-green-200/40 bg-gradient-to-br from-green-50/10 to-teal-50/10 p-4 shadow-sm">
        <div className="flex items-center gap-3 text-foreground">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-green-500/20 to-teal-500/20">
            <Sticker className="h-5 w-5 text-green-600" />
          </div>
          <span className="text-base font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">Stickers & Emojis</span>
        </div>
      </div>

      <div className="rounded-xl border border-green-200/40 bg-gradient-to-br from-green-50/10 to-teal-50/10 p-5 shadow-sm">
        <div className="mb-3">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-green-600 mb-3">Click to add</p>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {stickerOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                setSelected(option);
                addSticker(option);
              }}
              className={`flex h-14 items-center justify-center rounded-xl border transition hover:scale-110 active:scale-95 text-2xl font-bold shadow-sm ${selected === option ? 'border-green-400/60 bg-gradient-to-br from-green-500/20 to-teal-600/10 ring-2 ring-green-500/30' : 'border-green-300/40 bg-gradient-to-br from-green-50/40 to-teal-50/30 hover:border-green-400/60 hover:from-green-100/40'}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-yellow-300/40 bg-gradient-to-br from-yellow-50/20 to-amber-50/20 p-4">
        <p className="text-xs text-center text-yellow-700 font-semibold">✨ Drag to position and resize stickers on your canvas</p>
      </div>
    </div>
  );
}
