import React, { useRef, useState, useEffect } from 'react';
import { Eraser, RotateCcw, Sparkles, Pencil, Image as ImageIcon, Check } from 'lucide-react';

interface WhiteboardCanvasProps {
  onAnalyzeImage: (base64Image: string) => void;
  isAnalyzing: boolean;
}

export const WhiteboardCanvas: React.FC<WhiteboardCanvasProps> = ({
  onAnalyzeImage,
  isAnalyzing,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#c084fc'); // Default purple accent
  const [lineWidth, setLineWidth] = useState(3);
  const [mode, setMode] = useState<'draw' | 'erase'>('draw');
  const [history, setHistory] = useState<ImageData[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill dark background on initial mount
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Save initial blank state
    setHistory([ctx.getImageData(0, 0, canvas.width, canvas.height)]);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.lineWidth = mode === 'erase' ? lineWidth * 6 : lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = mode === 'erase' ? '#0f172a' : color;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save history state for undo
    setHistory((prev) => [...prev.slice(-10), ctx.getImageData(0, 0, canvas.width, canvas.height)]);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHistory([ctx.getImageData(0, 0, canvas.width, canvas.height)]);
  };

  const undo = () => {
    if (history.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const newHistory = [...history];
    newHistory.pop(); // Remove current
    const previousState = newHistory[newHistory.length - 1];
    ctx.putImageData(previousState, 0, 0);
    setHistory(newHistory);
  };

  const handleScanSolution = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onAnalyzeImage(dataUrl);
  };

  return (
    <div className="glass-card rounded-2xl p-4 border border-purple-500/20 shadow-xl flex flex-col space-y-3">
      {/* Canvas Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          {/* Draw / Erase Mode */}
          <button
            onClick={() => setMode('draw')}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-all ${
              mode === 'draw' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Draw</span>
          </button>

          <button
            onClick={() => setMode('erase')}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-all ${
              mode === 'erase' ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-800/80 text-slate-400 hover:text-white'
            }`}
          >
            <Eraser className="w-3.5 h-3.5" />
            <span>Erase</span>
          </button>

          {/* Color Palettes */}
          {mode === 'draw' && (
            <div className="flex items-center space-x-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
              {['#c084fc', '#38bdf8', '#4ade80', '#facc15', '#ffffff'].map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-5 h-5 rounded-full border transition-transform ${
                    color === c ? 'scale-125 border-white ring-2 ring-purple-500' : 'border-transparent hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={undo}
            disabled={history.length <= 1}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white disabled:opacity-40 transition-all"
            title="Undo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={clearCanvas}
            className="px-2.5 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-xs font-medium border border-rose-500/30 transition-all"
          >
            Clear
          </button>

          <button
            onClick={handleScanSolution}
            disabled={isAnalyzing}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-purple-500/20 flex items-center space-x-1.5 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow text-amber-300" />
            <span>{isAnalyzing ? 'Analyzing Canvas...' : 'OCR & Solve with AI'}</span>
          </button>
        </div>
      </div>

      {/* HTML5 Canvas */}
      <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex justify-center items-center">
        <canvas
          ref={canvasRef}
          width={700}
          height={320}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-80 touch-none cursor-crosshair"
        />
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-slate-900/80 text-[10px] text-slate-400 font-mono border border-slate-800 pointer-events-none">
          Digital Canvas Active • 2(x + 3) = 10
        </div>
      </div>
    </div>
  );
};
