import React, { useState } from 'react';
import { PaperTunnel } from './PaperTunnel';
import {
  Layers,
  Sliders,
  RotateCcw,
  Copy,
  Check,
  Sun,
  Moon,
  ShieldCheck,
  Zap,
  MousePointer,
  Sparkles,
} from 'lucide-react';

interface PaperTunnelStudioProps {
  isGlobalBackgroundActive?: boolean;
  onToggleGlobalBackground?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const PaperTunnelStudio: React.FC<PaperTunnelStudioProps> = ({
  isGlobalBackgroundActive = false,
  onToggleGlobalBackground,
  isDarkMode = false,
  onToggleDarkMode,
}) => {
  // Chosen settings from specification
  const DEFAULT_SETTINGS = {
    color1: '#f4e1c1',
    color2: '#787364',
    color3: '#5a564e',
    speed: 3.0,
    density: 2.0,
    opacity: 1.0,
    bgColor: '#05060a',
  };

  const [color1, setColor1] = useState(DEFAULT_SETTINGS.color1);
  const [color2, setColor2] = useState(DEFAULT_SETTINGS.color2);
  const [color3, setColor3] = useState(DEFAULT_SETTINGS.color3);
  const [speed, setSpeed] = useState(DEFAULT_SETTINGS.speed);
  const [density, setDensity] = useState(DEFAULT_SETTINGS.density);
  const [opacity, setOpacity] = useState(DEFAULT_SETTINGS.opacity);
  const [bgColor, setBgColor] = useState(DEFAULT_SETTINGS.bgColor);

  const [copiedCode, setCopiedCode] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [activePreset, setActivePreset] = useState<string>('Chosen Paper Cut');

  const presets = [
    {
      name: 'Chosen Paper Cut',
      c1: '#f4e1c1',
      c2: '#787364',
      c3: '#5a564e',
      speed: 3.0,
      density: 2.0,
      opacity: 1.0,
      bg: '#05060a',
    },
    {
      name: 'Deep Parchment',
      c1: '#e8d5b5',
      c2: '#8c7b64',
      c3: '#3d372e',
      speed: 2.5,
      density: 1.8,
      opacity: 1.0,
      bg: '#070605',
    },
    {
      name: 'Warm Desert Sand',
      c1: '#faebd7',
      c2: '#a08d71',
      c3: '#544634',
      speed: 3.0,
      density: 2.0,
      opacity: 0.95,
      bg: '#0c0a08',
    },
    {
      name: 'Obsidian Editorial',
      c1: '#d1d5db',
      c2: '#64748b',
      c3: '#1e293b',
      speed: 2.2,
      density: 1.6,
      opacity: 1.0,
      bg: '#020408',
    },
  ];

  const handleApplyPreset = (preset: typeof presets[0]) => {
    setActivePreset(preset.name);
    setColor1(preset.c1);
    setColor2(preset.c2);
    setColor3(preset.c3);
    setSpeed(preset.speed);
    setDensity(preset.density);
    setOpacity(preset.opacity);
    setBgColor(preset.bg);
  };

  const handleReset = () => {
    handleApplyPreset(presets[0]);
  };

  const codeSnippet = `<PaperTunnel
  color1="${color1}"
  color2="${color2}"
  color3="${color3}"
  speed={${speed}}
  density={${density}}
  opacity={${opacity}}
  bgColor="${bgColor}"
/>`;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(codeSnippet);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2200);
    } catch {
      // fallback
    }
  };

  return (
    <section
      aria-labelledby="paper-tunnel-heading"
      className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-sm space-y-6 transition-all"
    >
      {/* Header with Title and Mode Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-900/10 dark:bg-amber-100/10 text-amber-800 dark:text-amber-300 shadow-2xs border border-amber-300/40 dark:border-amber-700/40">
              <Layers className="w-4 h-4" />
            </span>
            <h2
              id="paper-tunnel-heading"
              className="text-lg sm:text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100"
            >
              Layered Paper Cut Tunnel Block (AIMRAN Library)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
            Nine sheets of paper with wavy cutout contours turn slowly and spread apart in depth as the pointer moves.
          </p>
        </div>

        {/* Action Controls (All touch targets >= 44px) */}
        <div className="flex flex-wrap items-center gap-2.5">
          {onToggleGlobalBackground && (
            <button
              type="button"
              onClick={onToggleGlobalBackground}
              className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 ${
                isGlobalBackgroundActive
                  ? 'bg-amber-700 hover:bg-amber-800 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-750 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700'
              }`}
              title={
                isGlobalBackgroundActive
                  ? 'Switch back to gentle academic manuscript background'
                  : 'Apply paper cut tunnel texture across the full page background'
              }
            >
              <Sparkles className="w-4 h-4 shrink-0 text-amber-300" />
              <span>{isGlobalBackgroundActive ? 'Full Backdrop: ON' : 'Set as Full Backdrop'}</span>
            </button>
          )}

          {onToggleDarkMode && (
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="min-h-[44px] min-w-[44px] px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-600" />}
              <span className="hidden sm:inline">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowControls(!showControls)}
            className="min-h-[44px] min-w-[44px] px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
            aria-expanded={showControls}
            aria-label="Toggle parameter controls drawer"
          >
            <Sliders className="w-4 h-4" />
            <span className="hidden sm:inline">{showControls ? 'Hide Controls' : 'Edit Props'}</span>
          </button>
        </div>
      </div>

      {/* Main Preview Container with Layered Paper Cut Tunnel */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-stone-300 dark:border-stone-700/80 shadow-md min-h-[300px] sm:min-h-[380px] flex flex-col justify-between p-6 sm:p-8 cursor-crosshair">
        {/* The Live Paper Tunnel Component */}
        <PaperTunnel
          color1={color1}
          color2={color2}
          color3={color3}
          speed={speed}
          density={density}
          opacity={opacity}
          bgColor={bgColor}
          className="absolute inset-0 w-full h-full"
          asBackground={false}
          interactiveParallax={true}
        />

        {/* Foreground Content Showcase */}
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pointer-events-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/45 backdrop-blur-md border border-white/20 text-white text-xs font-mono shadow-xs">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Preset: {activePreset}</span>
            <span className="text-white/40">·</span>
            <span>Speed: {speed}x</span>
            <span className="text-white/40">·</span>
            <span>Density: {density}x</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyCode}
              className="min-h-[44px] px-3.5 py-2 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-semibold border border-white/25 shadow-xs flex items-center gap-2 transition-all cursor-pointer active:scale-95"
              title="Copy JSX Component Code"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedCode ? 'Copied to Clipboard!' : 'Copy Code'}</span>
            </button>
          </div>
        </div>

        {/* Center Card Demonstrating Clean Contrast & Depth */}
        <div className="relative z-10 max-w-lg mx-auto w-full my-6 p-5 sm:p-6 rounded-2xl bg-black/70 dark:bg-black/80 backdrop-blur-md border border-white/25 text-white shadow-2xl space-y-3 pointer-events-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MousePointer className="w-4 h-4 text-amber-300 animate-bounce" />
              <span className="text-xs font-bold tracking-wide uppercase text-amber-200">
                Move Pointer for 3D Parallax
              </span>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30">
              9 Paper Layers
            </span>
          </div>

          <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
            Move your cursor or finger across the tunnel. Each deeper sheet responds with greater translation
            depth (<span className="font-mono text-amber-300">calc(var(--mx) * var(--i) * -9px)</span>) to create an organic paper relief.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] font-mono text-stone-300">
            <span className="px-2 py-0.5 rounded bg-white/10">--c1: {color1}</span>
            <span className="px-2 py-0.5 rounded bg-white/10">--c2: {color2}</span>
            <span className="px-2 py-0.5 rounded bg-white/10">--c3: {color3}</span>
          </div>
        </div>

        {/* Bottom Status Ribbon */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-white/90 drop-shadow-sm pointer-events-auto">
          <span>Speed: {speed}x · Density: {density}x · Opacity: {opacity}</span>
          <span>prefers-reduced-motion: Supported</span>
        </div>
      </div>

      {/* Interactive Settings & Props Customizer (Collapsible) */}
      {showControls && (
        <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-750 space-y-5">
          {/* Preset Chips */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Paper Cut Presets
              </label>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 flex items-center gap-1 cursor-pointer font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Defaults</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                    activePreset === preset.name
                      ? 'bg-amber-900 text-white dark:bg-amber-100 dark:text-amber-950 border-amber-900 dark:border-amber-100 shadow-2xs'
                      : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Color Pickers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-stone-200 dark:border-stone-700">
            {/* Color 1: Top paper sheet highlight */}
            <div className="space-y-1.5">
              <label
                htmlFor="tunnel-color-1"
                className="block text-xs font-semibold text-stone-700 dark:text-stone-300"
              >
                Color 1 (Paper Sheet Highlight):
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="tunnel-color-1"
                  type="color"
                  value={color1}
                  onChange={(e) => {
                    setColor1(e.target.value);
                    setActivePreset('Custom');
                  }}
                  className="w-11 h-11 rounded-lg border border-stone-300 dark:border-stone-600 cursor-pointer bg-transparent"
                  aria-label="Color 1 Top paper sheet highlight tint"
                />
                <input
                  type="text"
                  value={color1}
                  onChange={(e) => {
                    setColor1(e.target.value);
                    setActivePreset('Custom');
                  }}
                  className="min-h-[44px] flex-1 px-3 text-xs font-mono rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>

            {/* Color 2: Intermediate paper sheet mid-tone */}
            <div className="space-y-1.5">
              <label
                htmlFor="tunnel-color-2"
                className="block text-xs font-semibold text-stone-700 dark:text-stone-300"
              >
                Color 2 (Paper Mid-Tone):
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="tunnel-color-2"
                  type="color"
                  value={color2}
                  onChange={(e) => {
                    setColor2(e.target.value);
                    setActivePreset('Custom');
                  }}
                  className="w-11 h-11 rounded-lg border border-stone-300 dark:border-stone-600 cursor-pointer bg-transparent"
                  aria-label="Color 2 Intermediate paper sheet mid-tone"
                />
                <input
                  type="text"
                  value={color2}
                  onChange={(e) => {
                    setColor2(e.target.value);
                    setActivePreset('Custom');
                  }}
                  className="min-h-[44px] flex-1 px-3 text-xs font-mono rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>

            {/* Color 3: Deepest tunnel center glow */}
            <div className="space-y-1.5">
              <label
                htmlFor="tunnel-color-3"
                className="block text-xs font-semibold text-stone-700 dark:text-stone-300"
              >
                Color 3 (Deep Tunnel Glow):
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="tunnel-color-3"
                  type="color"
                  value={color3}
                  onChange={(e) => {
                    setColor3(e.target.value);
                    setActivePreset('Custom');
                  }}
                  className="w-11 h-11 rounded-lg border border-stone-300 dark:border-stone-600 cursor-pointer bg-transparent"
                  aria-label="Color 3 Deepest tunnel center glow tint"
                />
                <input
                  type="text"
                  value={color3}
                  onChange={(e) => {
                    setColor3(e.target.value);
                    setActivePreset('Custom');
                  }}
                  className="min-h-[44px] flex-1 px-3 text-xs font-mono rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>
          </div>

          {/* Sliders Grid: Speed, Density, Opacity (Touch targets >= 44px) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-3 border-t border-stone-200 dark:border-stone-700">
            {/* Speed Slider (0.2x to 3.0x, chosen default: 3.0x) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-700 dark:text-stone-300">
                <label htmlFor="tunnel-speed">Speed Multiplier</label>
                <span className="font-mono text-amber-600 dark:text-amber-400">{speed.toFixed(1)}x</span>
              </div>
              <div className="h-11 flex items-center">
                <input
                  id="tunnel-speed"
                  type="range"
                  min="0.2"
                  max="3.0"
                  step="0.1"
                  value={speed}
                  onChange={(e) => {
                    setSpeed(parseFloat(e.target.value));
                    setActivePreset('Custom');
                  }}
                  className="w-full h-2 rounded-lg bg-stone-300 dark:bg-stone-700 accent-amber-600 cursor-pointer"
                  aria-label="Speed multiplier (0.2x to 3x)"
                />
              </div>
              <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                <span>0.2x (Slow)</span>
                <span>3.0x (Chosen 3x)</span>
              </div>
            </div>

            {/* Density / Scale Slider (0.5x to 2.0x, chosen default: 2.0x) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-700 dark:text-stone-300">
                <label htmlFor="tunnel-density">Density / Scale</label>
                <span className="font-mono text-amber-600 dark:text-amber-400">{density.toFixed(1)}x</span>
              </div>
              <div className="h-11 flex items-center">
                <input
                  id="tunnel-density"
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={density}
                  onChange={(e) => {
                    setDensity(parseFloat(e.target.value));
                    setActivePreset('Custom');
                  }}
                  className="w-full h-2 rounded-lg bg-stone-300 dark:bg-stone-700 accent-amber-600 cursor-pointer"
                  aria-label="Density and scale multiplier (0.5x to 2x)"
                />
              </div>
              <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                <span>0.5x (Compact)</span>
                <span>2.0x (Chosen 2x)</span>
              </div>
            </div>

            {/* Opacity Slider (0.2 to 1.0, chosen default: 1.0) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-700 dark:text-stone-300">
                <label htmlFor="tunnel-opacity">Opacity</label>
                <span className="font-mono text-amber-600 dark:text-amber-400">{Math.round(opacity * 100)}%</span>
              </div>
              <div className="h-11 flex items-center">
                <input
                  id="tunnel-opacity"
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.05"
                  value={opacity}
                  onChange={(e) => {
                    setOpacity(parseFloat(e.target.value));
                    setActivePreset('Custom');
                  }}
                  className="w-full h-2 rounded-lg bg-stone-300 dark:bg-stone-700 accent-amber-600 cursor-pointer"
                  aria-label="Opacity of paper tunnel layers (0.2 to 1)"
                />
              </div>
              <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                <span>20% (Subtle)</span>
                <span>100% (Full)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
