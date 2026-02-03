
import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Cpu, 
  Layout as LayoutIcon, 
  FileCode, 
  Copy, 
  Check,
  AlertCircle,
  Loader2,
  Download,
  Zap,
  Globe,
  Rocket,
  Plus,
  ArrowRight,
  Github,
  Server,
  Layers,
  ChevronRight,
  Box,
  BrainCircuit
} from 'lucide-react';
import { generateAppCode } from './services/geminiService';
import { GeneratedApp, GeneratedFile, GenerationStatus } from './types';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [generatedApp, setGeneratedApp] = useState<GeneratedApp | null>(null);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [showTree, setShowTree] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingSteps = [
    "Waking DeepSeek-R1 Architect...",
    "Deep Reasoning in progress...",
    "Planning File Hierarchy...",
    "Synthesizing API endpoints...",
    "Drafting HTML/JS Frontend...",
    "Injecting Vercel deployment bridges...",
    "Compiling Architecture Tree..."
  ];

  useEffect(() => {
    let interval: any;
    if (status === GenerationStatus.THINKING) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingSteps.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleGenerate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!prompt.trim()) return;

    setStatus(GenerationStatus.THINKING);
    setError(null);
    setGeneratedApp(null);
    setShowTree(false);
    
    try {
      const result = await generateAppCode(prompt);
      setGeneratedApp(result);
      setStatus(GenerationStatus.SUCCESS);
      setActiveFileIndex(0);
    } catch (err: any) {
      setError(err.message);
      setStatus(GenerationStatus.ERROR);
    }
  };

  const copyToClipboard = () => {
    if (!generatedApp) return;
    navigator.clipboard.writeText(generatedApp.files[activeFileIndex].content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeFile = generatedApp?.files[activeFileIndex];

  return (
    <div className="min-h-screen flex flex-col bg-[#000] text-[#fff] selection:bg-blue-600 selection:text-white font-sans">
      {/* Vercel-Style Header */}
      <header className="border-b border-[#333] bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[8px] border-b-black translate-y-[-0.5px]"></div>
              </div>
              <span className="text-[14px] font-bold tracking-tight">AppForge <span className="text-blue-500 font-medium">DeepSeek</span></span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 bg-[#111] border border-[#333] px-3 py-1 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
              <span className="text-[10px] text-gray-400 font-mono uppercase">DeepSeek-R1 Active</span>
            </div>
            <button className="bg-white text-black text-[12px] font-bold px-4 py-1.5 rounded-md hover:opacity-90">Feedback</button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col max-w-7xl mx-auto w-full p-4 md:p-8 gap-8">
        {/* Architect Input Area */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-400">
              <BrainCircuit className="w-4 h-4 text-blue-500" />
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em]">OpenRouter Reasoning Architect</h2>
            </div>
          </div>
          
          <div className="border border-[#333] rounded-lg overflow-hidden bg-[#111]/30">
            <form onSubmit={handleGenerate} className="flex flex-col">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your full-stack app requirements... (e.g. A multi-step form with Node.js backend validation)"
                className="w-full bg-transparent p-6 outline-none text-[15px] leading-relaxed resize-none min-h-[120px] placeholder:text-gray-600"
              />
              <div className="flex items-center justify-between p-3 bg-black border-t border-[#333]">
                <div className="flex gap-2">
                  <button type="button" onClick={() => setPrompt("A real-time analytics hub: HTML frontend and a Node.js API to process user events.")} className="text-[10px] text-gray-500 hover:text-white border border-[#333] px-2 py-1 rounded">Analytics Hub</button>
                  <button type="button" onClick={() => setPrompt("A simple CRUD app for managing notes with a serverless backend.")} className="text-[10px] text-gray-500 hover:text-white border border-[#333] px-2 py-1 rounded">Notes API</button>
                </div>
                <button
                  type="submit"
                  disabled={status === GenerationStatus.THINKING || !prompt.trim()}
                  className="bg-white text-black text-[12px] font-bold px-6 py-2 rounded flex items-center gap-2 hover:bg-gray-200 disabled:opacity-30 transition-all"
                >
                  {status === GenerationStatus.THINKING ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /><span>Reasoning...</span></>
                  ) : (
                    <><span>Deploy Stack</span><ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Workspace Display */}
        <div className="flex-1 flex flex-col md:grid md:grid-cols-12 gap-6 min-h-0">
          {/* File Explorer & Architecture Tree */}
          <aside className="md:col-span-3 flex flex-col gap-4 min-w-0">
            <div className="border border-[#333] rounded-lg bg-black flex flex-col h-full max-h-[500px] md:max-h-none">
              <div className="px-4 py-3 border-b border-[#333] flex items-center justify-between">
                <div className="flex gap-4">
                  <button onClick={() => setShowTree(false)} className={`text-[11px] font-bold uppercase tracking-widest ${!showTree ? 'text-white' : 'text-gray-600'}`}>Files</button>
                  <button onClick={() => setShowTree(true)} className={`text-[11px] font-bold uppercase tracking-widest ${showTree ? 'text-white' : 'text-gray-600'}`}>Architecture</button>
                </div>
                <Box className="w-3.5 h-3.5 text-gray-600" />
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-0.5 custom-scrollbar">
                {status === GenerationStatus.THINKING && (
                   <div className="p-4 space-y-3">
                     {[1,2,3,4].map(i => <div key={i} className="h-4 bg-[#111] rounded animate-pulse w-full"></div>)}
                   </div>
                )}

                {generatedApp && !showTree && generatedApp.files.map((file, idx) => (
                  <button
                    key={file.path}
                    onClick={() => setActiveFileIndex(idx)}
                    className={`w-full text-left px-3 py-2 rounded text-[13px] flex items-center gap-3 transition-all ${
                      activeFileIndex === idx ? 'bg-[#111] text-white border border-[#333]' : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    <FileCode className={`w-4 h-4 ${file.path.startsWith('api/') ? 'text-amber-500' : 'text-blue-500'}`} />
                    <span className="truncate">{file.path.split('/').pop()}</span>
                  </button>
                ))}

                {generatedApp && showTree && (
                  <div className="p-4 font-mono text-[11px] text-blue-400 whitespace-pre leading-relaxed animate-in fade-in duration-500">
                    {generatedApp.tree}
                  </div>
                )}

                {!generatedApp && status === GenerationStatus.IDLE && (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center text-gray-700">
                    <Terminal className="w-8 h-8 mb-2 opacity-20" />
                    <p className="text-[10px] uppercase font-bold">Waiting for Reasoning</p>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Code Viewer Section */}
          <section className="md:col-span-9 border border-[#333] rounded-lg bg-black flex flex-col overflow-hidden min-h-[500px]">
            {error && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-4">
                <AlertCircle className="w-12 h-12 text-red-500" />
                <h3 className="text-xl font-bold">Architect Error</h3>
                <p className="text-gray-500 max-w-sm">{error}</p>
                <button onClick={() => handleGenerate()} className="px-6 py-2 bg-white text-black rounded font-bold">Retry Reasoning</button>
              </div>
            )}

            {generatedApp && activeFile ? (
              <>
                <div className="h-12 border-b border-[#333] flex items-center justify-between px-6 bg-[#050505]">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${activeFile.path.startsWith('api/') ? 'bg-amber-500' : 'bg-blue-500'}`}></span>
                    <span className="text-[12px] font-mono text-gray-400">{activeFile.path}</span>
                  </div>
                  <button onClick={copyToClipboard} className="text-gray-500 hover:text-white transition-colors">
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex-1 overflow-auto bg-black p-6 custom-scrollbar relative">
                   <div className="absolute top-0 left-0 w-12 h-full bg-[#050505] border-r border-[#111] flex flex-col items-center pt-6 text-[#222] text-[10px] font-mono">
                      {activeFile.content.split('\n').map((_, i) => <span key={i} className="mb-1">{i+1}</span>)}
                   </div>
                   <pre className="pl-12 code-font text-[13px] text-gray-300 leading-relaxed overflow-x-auto">
                     <code>{activeFile.content}</code>
                   </pre>
                </div>
              </>
            ) : status === GenerationStatus.THINKING ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                 <div className="space-y-6">
                    <div className="relative">
                      <div className="w-20 h-20 border-2 border-blue-500/20 rounded-full animate-ping absolute inset-0"></div>
                      <div className="w-20 h-20 border-t-2 border-blue-500 rounded-full animate-spin relative"></div>
                    </div>
                    <p className="text-[18px] font-bold tracking-tight text-white animate-pulse">{loadingSteps[loadingStep]}</p>
                  </div>
              </div>
            ) : !error && (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <div className="max-w-md space-y-4">
                  <div className="w-16 h-16 bg-[#111] border border-[#333] rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <BrainCircuit className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">DeepSeek Engine Enabled.</h2>
                  <p className="text-gray-500 text-[14px] leading-relaxed">
                    Powered by OpenRouter. DeepSeek-R1 provides superior logic for full-stack architecture generation.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="border-t border-[#333] py-6 bg-black">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-[11px] text-gray-600 font-mono">
          <span>&copy; {new Date().getFullYear()} APPFORGE ARCHITECT</span>
          <div className="flex gap-6">
            <span className="flex items-center gap-1.5"><Layers className="w-3 h-3" /> Reasoning Stack</span>
            <span className="flex items-center gap-1.5 text-blue-500"><Zap className="w-3 h-3" /> DeepSeek-R1 Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
