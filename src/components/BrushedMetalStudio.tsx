import React, { useState } from 'react';
import { BrushedMetal } from './BrushedMetal';
import {
  Sparkles,
  Sliders,
  RotateCcw,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Layers,
  Palette,
  Gauge,
  Sun,
  Moon,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface BrushedMetalStudioProps {
  isGlobalBackgroundActive?: boolean;
  onToggleGlobalBackground?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const BrushedMetalStudio: React.FC<BrushedMetalStudioProps> = ({
  isGlobalBackgroundActive = false,
  onToggleGlobalBackground,
  isDarkMode = false,
  onToggleDarkMode,
}) => {
  // Chosen settings from specification
  const DEFAULT_SETTINGS = {
    color1: '#9aa4b2',
    color2: '#d7dde5',
    color3: '#8ec5ff',
    speed: 1.0,
    density: 1.0,
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
  const [activePreset, setActivePreset] = useState<string>('Chosen Aluminum');

  const presets = [
    {
      name: 'Chosen Aluminum',
      c1: '#9aa4b2',
      c2: '#d7dde5',
      c3: '#8ec5ff',
      speed: 1.0,
      density: 1.0,
      opacity: 1.0,
      bg: '#05060a',
    },
    {
      name: 'Titanium Aerospace',
      c1: '#64748b',
      c2: '#cbd5e1',
      c3: '#38bdf8',
      speed: 1.2,
      density: 1.2,
      opacity: 1.0,
      bg: '#090d16',
    },
    {
      name: 'Platinum Mirror',
      c1: '#a1a1aa',
      c2: '#f4f4f5',
      c3: '#bae6fd',
      speed: 0.8,
      density: 0.9,
      opacity: 1.0,
      bg: '#0a0a0c',
    },
    {
      name: 'Dark Gunmetal',
      c1: '#475569',
      c2: '#94a3b8',
      c3: '#60a5fa',
      speed: 1.5,
      density: 1.4,
      opacity: 0.95,
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

  const codeSnippet = `<BrushedMetal
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
      aria-labelledby="brushed-metal-heading"
      className="p-5 sm:p-7 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/90 dark:border-stone-800 shadow-sm space-y-6 transition-all"
    >
      {/* Header with Title and Mode Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-2xs">
              <Zap className="w-4 h-4" />
            </span>
            <h2
              id="brushed-metal-heading"
              className="text-lg sm:text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100"
            >
              Brushed Metal Background Block (AIMRAN Library)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
            Brushed aluminum texture with a specular streak of light sliding across every few seconds.
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
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-750 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700'
              }`}
              title={
                isGlobalBackgroundActive
                  ? 'Switch back to gentle academic manuscript background'
                  : 'Apply brushed metal texture across the full page background'
              }
            >
              <Layers className="w-4 h-4 shrink-0" />
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

      {/* Main Preview Container with Brushed Metal */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-stone-300 dark:border-stone-700/80 shadow-md min-h-[280px] sm:min-h-[340px] flex flex-col justify-between p-6 sm:p-8">
        {/* The Live Brushed Metal Component */}
        <BrushedMetal
          color1={color1}
          color2={color2}
          color3={color3}
          speed={speed}
          density={density}
          opacity={opacity}
          bgColor={bgColor}
          className="absolute inset-0 w-full h-full"
          asBackground
        />

        {/* Foreground Content Showcase */}
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/20 text-white text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span>Preset: {activePreset}</span>
            <span className="text-white/40">·</span>
            <span>Speed: {speed}x</span>
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

        {/* Center Card Demonstrating Clean Visual Contrast On Brushed Metal */}
        <div className="relative z-10 max-w-lg mx-auto w-full my-6 p-5 sm:p-6 rounded-2xl bg-slate-900/80 dark:bg-black/75 backdrop-blur-md border border-white/20 text-white shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
              <span className="text-xs font-bold tracking-wide uppercase text-slate-300">
                Precision Aluminum Sheen
              </span>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
              AIMRAN Block
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            The specular streak glides across the brushed hairline ridges every{' '}
            <strong className="text-blue-300 font-mono">{(5 / speed).toFixed(1)}s</strong>, creating an authentic
            aerospace-grade titanium finish.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-300">
            <span className="px-2 py-0.5 rounded bg-white/10">--c1: {color1}</span>
            <span className="px-2 py-0.5 rounded bg-white/10">--c2: {color2}</span>
            <span className="px-2 py-0.5 rounded bg-white/10">--c3: {color3}</span>
          </div>
        </div>

        {/* Bottom Status Ribbon */}
        <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-white/80">
          <span>Density: {density}x · Opacity: {opacity}</span>
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
                Metallic Presets
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
                      ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 border-stone-900 dark:border-stone-100 shadow-2xs'
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
            {/* Color 1: Base shadow tint */}
            <div className="space-y-1.5">
              <label
                htmlFor="metal-color-1"
                className="block text-xs font-semibold text-stone-700 dark:text-stone-300"
              >
                Color 1 (Shadow Tint):
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="metal-color-1"
                  type="color"
                  value={color1}
                  onChange={(e) => {
                    setColor1(e.target.value);
                    setActivePreset('Custom');
                  }}
                  className="w-11 h-11 rounded-lg border border-stone-300 dark:border-stone-600 cursor-pointer bg-transparent"
                  aria-label="Color 1 Base metallic shadow tint"
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

            {/* Color 2: Specular Mid-tone */}
            <div className="space-y-1.5">
              <label
                htmlFor="metal-color-2"
                className="block text-xs font-semibold text-stone-700 dark:text-stone-300"
              >
                Color 2 (Mid-Tone):
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="metal-color-2"
                  type="color"
                  value={color2}
                  onChange={(e) => {
                    setColor2(e.target.value);
                    setActivePreset('Custom');
                  }}
                  className="w-11 h-11 rounded-lg border border-stone-300 dark:border-stone-600 cursor-pointer bg-transparent"
                  aria-label="Color 2 Highlight specular mid-tone"
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

            {/* Color 3: Light Streak Tint */}
            <div className="space-y-1.5">
              <label
                htmlFor="metal-color-3"
                className="block text-xs font-semibold text-stone-700 dark:text-stone-300"
              >
                Color 3 (Light Streak):
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="metal-color-3"
                  type="color"
                  value={color3}
                  onChange={(e) => {
                    setColor3(e.target.value);
                    setActivePreset('Custom');
                  }}
                  className="w-11 h-11 rounded-lg border border-stone-300 dark:border-stone-600 cursor-pointer bg-transparent"
                  aria-label="Color 3 Streak of light tint"
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
            {/* Speed Slider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-700 dark:text-stone-300">
                <label htmlFor="metal-speed">Speed Multiplier</label>
                <span className="font-mono text-blue-600 dark:text-blue-400">{speed.toFixed(1)}x</span>
              </div>
              <div className="h-11 flex items-center">
                <input
                  id="metal-speed"
                  type="range"
                  min="0.2"
                  max="3.0"
                  step="0.1"
                  value={speed}
                  onChange={(e) => {
                    setSpeed(parseFloat(e.target.value));
                    setActivePreset('Custom');
                  }}
                  className="w-full h-2 rounded-lg bg-stone-300 dark:bg-stone-700 accent-blue-600 cursor-pointer"
                  aria-label="Speed multiplier (0.2x to 3x)"
                />
              </div>
              <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                <span>0.2x (Calm)</span>
                <span>3.0x (Fast)</span>
              </div>
            </div>

            {/* Density / Scale Slider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-700 dark:text-stone-300">
                <label htmlFor="metal-density">Density / Scale</label>
                <span className="font-mono text-blue-600 dark:text-blue-400">{density.toFixed(1)}x</span>
              </div>
              <div className="h-11 flex items-center">
                <input
                  id="metal-density"
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={density}
                  onChange={(e) => {
                    setDensity(parseFloat(e.target.value));
                    setActivePreset('Custom');
                  }}
                  className="w-full h-2 rounded-lg bg-stone-300 dark:bg-stone-700 accent-blue-600 cursor-pointer"
                  aria-label="Density and grain scale multiplier (0.5x to 2x)"
                />
              </div>
              <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                <span>0.5x (Fine)</span>
                <span>2.0x (Coarse)</span>
              </div>
            </div>

            {/* Opacity Slider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-700 dark:text-stone-300">
                <label htmlFor="metal-opacity">Opacity</label>
                <span className="font-mono text-blue-600 dark:text-blue-400">{Math.round(opacity * 100)}%</span>
              </div>
              <div className="h-11 flex items-center">
                <input
                  id="metal-opacity"
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.05"
                  value={opacity}
                  onChange={(e) => {
                    setOpacity(parseFloat(e.target.value));
                    setActivePreset('Custom');
                  }}
                  className="w-full h-2 rounded-lg bg-stone-300 dark:bg-stone-700 accent-blue-600 cursor-pointer"
                  aria-label="Opacity of metallic texture and streak (0.2 to 1)"
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
