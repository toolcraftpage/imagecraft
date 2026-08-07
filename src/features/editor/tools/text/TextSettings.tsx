import { useToolSettingsStore } from '../../store/toolSettingsStore';
import Input from '@/shared/components/ui/Input';
import Button from '@/shared/components/ui/Button';

export default function TextSettingsPanel() {
  const { text, setText } = useToolSettingsStore();

  return (
    <div className="flex flex-col gap-3 p-4">
      <h4 className="text-sm font-semibold">Text</h4>
      <Input
        label="Font Size"
        type="number"
        value={text.fontSize}
        onChange={(e) => setText({ fontSize: Number(e.target.value) })}
      />
      <select
        value={text.fontFamily}
        onChange={(e) => setText({ fontFamily: e.target.value })}
        className="rounded border border-gray-300 bg-white px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-800 dark:text-white"
      >
        {['Inter','Arial','Times New Roman','Courier New','Verdana','Georgia'].map(f => (
          <option key={f} value={f}>{f}</option>
        ))}
      </select>
      <div>
        <label className="mb-1 block text-xs">Color</label>
        <input
          type="color"
          value={text.color}
          onChange={(e) => setText({ color: e.target.value })}
          className="h-8 w-full cursor-pointer rounded border"
        />
      </div>
      <div className="flex gap-1">
        <Button size="sm" variant={text.bold ? 'primary' : 'secondary'} onClick={() => setText({ bold: !text.bold })}>B</Button>
        <Button size="sm" variant={text.italic ? 'primary' : 'secondary'} onClick={() => setText({ italic: !text.italic })}>I</Button>
        <Button size="sm" variant={text.underline ? 'primary' : 'secondary'} onClick={() => setText({ underline: !text.underline })}>U</Button>
      </div>
      <div className="flex gap-1">
        {(['left','center','right'] as const).map(align => (
          <Button
            key={align}
            size="sm"
            variant={text.textAlign === align ? 'primary' : 'secondary'}
            onClick={() => setText({ textAlign: align })}
          >
            {align}
          </Button>
        ))}
      </div>
    </div>
  );
}