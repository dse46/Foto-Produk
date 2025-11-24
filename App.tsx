import React, { useState } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { PromptInput } from './components/PromptInput';
import { ResultDisplay } from './components/ResultDisplay';
import { generateProductImage } from './services/geminiService';
import { AppState, AspectRatioType } from './types';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // New State for Dimensions
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>('1:1');
  const [width, setWidth] = useState<number>(1024);
  const [height, setHeight] = useState<number>(1024);

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    // Create object URL for preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setGeneratedImage(null);
    setErrorMessage(null);
    setAppState(AppState.IDLE);
  };

  // Helper to map custom dimensions or selection to Gemini supported string
  const getEffectiveAspectRatio = (): string => {
    if (aspectRatio !== 'custom') return aspectRatio;
    
    // Calculate ratio from custom dimensions and find closest supported neighbor
    // Supported: 1:1 (1.0), 3:4 (0.75), 4:3 (1.33), 9:16 (0.56), 16:9 (1.77)
    if (width <= 0 || height <= 0) return '1:1';
    
    const ratio = width / height;
    const supported = [
      { id: '1:1', val: 1.0 },
      { id: '3:4', val: 0.75 },
      { id: '4:3', val: 1.3333 },
      { id: '9:16', val: 0.5625 },
      { id: '16:9', val: 1.7778 }
    ];
    
    const closest = supported.reduce((prev, curr) => {
      return (Math.abs(curr.val - ratio) < Math.abs(prev.val - ratio) ? curr : prev);
    });
    
    return closest.id;
  };

  const handleGenerate = async () => {
    if (!imageFile || !prompt) return;

    setAppState(AppState.GENERATING);
    setErrorMessage(null);
    setGeneratedImage(null);

    const effectiveRatio = getEffectiveAspectRatio();

    try {
      const result = await generateProductImage(imageFile, prompt, effectiveRatio);
      
      if (result.image) {
        setGeneratedImage(result.image);
        setAppState(AppState.SUCCESS);
      } else {
        // Fallback if no image returned (unlikely with flash-image if successful)
        throw new Error("The model did not return an image. Try a different prompt.");
      }
    } catch (error: any) {
      console.error(error);
      setAppState(AppState.ERROR);
      setErrorMessage(error.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
              P
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              ProProduct <span className="text-indigo-600">AI</span>
            </h1>
          </div>
          <div className="text-xs font-medium bg-slate-100 text-slate-600 px-3 py-1 rounded-full border border-slate-200">
             Powered by Gemini Nano Banana
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Professional Product Photos in Seconds
          </h2>
          <p className="text-slate-600 text-lg">
            Upload your raw product shot, describe the scene, and let AI handle the lighting, background, and aesthetics.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Inputs */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            
            {/* Step 1: Upload */}
            <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">1</div>
                <h3 className="font-semibold text-lg">Upload Source</h3>
              </div>
              <ImageUploader 
                onImageSelect={handleImageSelect} 
                selectedImage={imageFile}
                previewUrl={previewUrl}
              />
            </section>

            {/* Step 2: Prompt & Settings */}
            <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
               <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">2</div>
                <h3 className="font-semibold text-lg">Customize</h3>
              </div>
              <PromptInput 
                prompt={prompt} 
                setPrompt={setPrompt} 
                onGenerate={handleGenerate}
                isGenerating={appState === AppState.GENERATING}
                hasImage={!!imageFile}
                aspectRatio={aspectRatio}
                setAspectRatio={setAspectRatio}
                width={width}
                setWidth={setWidth}
                height={height}
                setHeight={setHeight}
              />
            </section>
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-7 h-full">
             <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-full min-h-[500px] flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">3</div>
                <h3 className="font-semibold text-lg">Result</h3>
              </div>
              <div className="flex-1">
                <ResultDisplay 
                  generatedImage={generatedImage} 
                  isGenerating={appState === AppState.GENERATING}
                  error={errorMessage}
                />
              </div>
            </section>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;