import type { Canvas } from 'fabric';

export function saveProjectToFile(canvas: Canvas | null) {
  if (!canvas) return;
  const json = canvas.toJSON();
  const blob = new Blob([JSON.stringify(json)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'project.json';
  a.click();
  URL.revokeObjectURL(url);
}

export function loadProjectFromFile(canvas: Canvas | null, pushHistory: (state: string) => void) {
  if (!canvas) return;
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const json = JSON.parse(ev.target?.result as string);
        canvas.loadFromJSON(json, () => {
          canvas.renderAll();
          pushHistory(JSON.stringify(canvas.toJSON()));
        });
      } catch (err) {
        alert('Invalid project file');
      }
    };
    reader.readAsText(file);
  };
  input.click();
}