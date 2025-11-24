import React from 'react';
import { WandIcon, ChevronDownIcon } from './Icons';
import { PresetPrompt, AspectRatioType } from '../types';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  hasImage: boolean;
  aspectRatio: AspectRatioType;
  setAspectRatio: (ratio: AspectRatioType) => void;
  width: number;
  setWidth: (w: number) => void;
  height: number;
  setHeight: (h: number) => void;
}

const SUGGESTIONS: PresetPrompt[] = [
  { id: '1', label: 'Minimal Studio', text: 'Place this product on a clean white podium with soft studio lighting.', icon: '⚪' },
  { id: '2', label: 'Luxury Dark', text: 'Professional product photography, dark luxury aesthetic, silk background, dramatic lighting.', icon: '🌑' },
  { id: '3', label: 'Nature Vibe', text: 'Place the product on a wooden table outdoors with blurred forest background and sunlight.', icon: '🌿' },
  { id: '4', label: 'Cyberpunk', text: 'Neon lighting, futuristic tech background, cyberpunk style product shot.', icon: '🌆' },
];

const PRESET_CATEGORIES = {
  "Studio & Professional": [
    { label: "Clean White Studio", text: "Place the product on a seamless white background with soft, diffuse studio lighting." },
    { label: "Luxury Dark", text: "Professional product photography, dark luxury aesthetic, black silk background, dramatic rim lighting." },
    { label: "Pastel Minimal", text: "Minimalist composition with a soft pastel pink geometric background and hard shadows." },
    { label: "Wooden Podium", text: "Displayed on a round wooden podium with a neutral beige wall in the background." },
    { label: "Marble Counter", text: "Sitting on a white marble countertop with bright, airy natural lighting." }
  ],
  "Lifestyle & Interior": [
    { label: "Modern Kitchen", text: "On a granite kitchen island with a blurred modern kitchen in the background." },
    { label: "Cozy Living Room", text: "On a rustic coffee table in a cozy living room with warm evening lighting." },
    { label: "Bright Office", text: "On a clean white desk next to a laptop and a small succulent plant." },
    { label: "Bathroom Vanity", text: "On a bathroom sink counter with a mirror and soft daylight reflection." },
    { label: "Bedroom Nightstand", text: "On a wooden nightstand next to a lamp with cozy, warm lighting." }
  ],
  "Nature & Outdoors": [
    { label: "Sunlit Forest", text: "Placed on a mossy rock in a forest with dappled sunlight filtering through trees." },
    { label: "Beach Sunset", text: "On the sand at a tropical beach during golden hour with the ocean in the background." },
    { label: "Snowy Mountain", text: "On a stone surface with a majestic snowy mountain range in the background." },
    { label: "Flower Garden", text: "Surrounded by colorful blooming flowers in a sunny garden." },
    { label: "Desert Dunes", text: "On a sand dune in a desert with a clear blue sky." }
  ],
  "Creative & Artistic": [
    { label: "Cyberpunk Neon", text: "Futuristic cyberpunk style, wet street reflection, neon blue and pink lighting." },
    { label: "Floating in Space", text: "Floating in deep space with stars and a nebula in the background." },
    { label: "Underwater", text: "Submerged underwater with bubbles and light rays piercing from above." },
    { label: "Splash Photography", text: "High-speed photography style with dynamic water splashes around the product." },
    { label: "Vaporwave", text: "Vaporwave aesthetic with retro grid background and purple hues." }
  ]
};

export const PromptInput: React.FC<PromptInputProps> = ({ 
  prompt, 
  setPrompt, 
  onGenerate, 
  isGenerating,
  hasImage,
  aspectRatio,
  setAspectRatio,
  width,
  setWidth,
  height,
  setHeight
}) => {
  return (
    <div className="flex flex-col gap-6">
      
      {/* Aspect Ratio Selector */}
      <div>
        <label className="text-sm font-semibold text-slate-700 mb-3 block">
          Output Size
        </label>
        <div className="flex flex-wrap gap-2">
          {(['1:1', '16:9', '9:16', 'custom'] as AspectRatioType[]).map((ratio) => (
            <button
              key={ratio}
              onClick={() => setAspectRatio(ratio)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium border transition-all
                ${aspectRatio === ratio 
                  ? 'bg-slate-800 text-white border-slate-800 shadow-md' 
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }
              `}
            >
              {ratio === 'custom' ? 'Custom' : ratio}
            </button>
          ))}
        </div>

        {/* Custom Dimensions Inputs */}
        {aspectRatio === 'custom' && (
          <div className="flex items-center gap-3 mt-3 animate-fade-in">
             <div className="flex-1">
               <label className="text-xs text-slate-500 mb-1 block">Width (px)</label>
               <input 
                 type="number" 
                 value={width}
                 onChange={(e) => setWidth(parseInt(e.target.value) || 0)}
                 className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none"
                 placeholder="1024"
               />
             </div>
             <span className="text-slate-400 pt-5">×</span>
             <div className="flex-1">
               <label className="text-xs text-slate-500 mb-1 block">Height (px)</label>
               <input 
                 type="number" 
                 value={height}
                 onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
                 className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none"
                 placeholder="1024"
               />
             </div>
          </div>
        )}
      </div>

      {/* Prompt Text Area */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-slate-700">
            Instruction / Prompt
          </label>
          
          <div className="relative group">
             <select
                onChange={(e) => {
                   if(e.target.value) setPrompt(e.target.value);
                   e.target.value = ''; // Reset selection
                }}
                className="appearance-none pl-3 pr-8 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer shadow-sm"
                defaultValue=""
             >
                <option value="" disabled>✨ Load a Preset...</option>
                {Object.entries(PRESET_CATEGORIES).map(([category, items]) => (
                   <optgroup label={category} key={category} className="font-semibold text-slate-900">
                      {items.map(item => (
                         <option key={item.label} value={item.text} className="text-slate-600 font-normal">{item.label}</option>
                      ))}
                   </optgroup>
                ))}
             </select>
             <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none group-hover:text-indigo-500" />
          </div>
        </div>

        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Remove background and place on a marble counter..."
            className="w-full h-32 p-4 rounded-xl bg-slate-100 border-2 border-transparent focus:bg-white focus:border-indigo-500 outline-none resize-none text-slate-900 placeholder:text-slate-400 shadow-sm transition-all text-base"
            disabled={isGenerating}
          />
        </div>
      </div>

      {/* Quick Presets */}
      <div>
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 block">
          Quick Access
        </span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setPrompt(s.text)}
              disabled={isGenerating}
              className="flex flex-col items-start p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-left group bg-white"
            >
              <span className="text-lg mb-1">{s.icon}</span>
              <span className="text-xs font-medium text-slate-700 group-hover:text-indigo-700">
                {s.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onGenerate}
        disabled={isGenerating || !hasImage || !prompt.trim()}
        className={`
          mt-2 w-full py-4 px-6 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]
          ${isGenerating 
            ? 'bg-slate-400 cursor-not-allowed' 
            : (!hasImage || !prompt.trim()) 
              ? 'bg-slate-300 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/30'
          }
        `}
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          <>
            <WandIcon className="w-5 h-5" />
            Generate Edit
          </>
        )}
      </button>
    </div>
  );
};
