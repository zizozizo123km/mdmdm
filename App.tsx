
import React, { useState, useEffect } from 'react';
import { 
  Code2, 
  Terminal, 
  Cpu, 
  Layout as LayoutIcon, 
  Send, 
  FileCode, 
  Copy, 
  Check,
  AlertCircle,
  Loader2,
  ExternalLink,
  Sparkles,
  FolderTree,
  Download,
  Box,
  Zap,
  Globe,
  Rocket
} from 'lucide-react';
import { generateAppCode } from './services/geminiService';
import { GeneratedApp, GeneratedFile, GenerationStatus } from './types';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [generatedApp, setGeneratedApp] = useState<GeneratedApp | null>(null);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingSteps = [
    "Analyzing Vercel environment requirements...",
    "Architecting high-performance components...",
    "Generating vercel.json and package.json...",
    "Implementing UI logic and state management...",
    "Optimizing for Vercel Edge Runtime...",
    "Finalizing deployment-ready bundle..."
  ];

  useEffect(() => {
    let interval: any;
    if (status === GenerationStatus.THINKING) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingSteps.length);
      }, 3000);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setStatus(GenerationStatus.THINKING);
    setError(null);
    setGeneratedApp(null);
    
    try {
      const result = await generateAppCode(prompt);
      setGeneratedApp(result);
      setStatus(GenerationStatus.SUCCESS);
      setActiveFileIndex(0);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred during generation.');
      setStatus(GenerationStatus.ERROR);
    }
  };

  const copyToClipboard = () => {
    if (!generatedApp) return;
    const content = generatedApp.files[activeFileIndex].content;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadProject = () => {
    if (!generatedApp) return;
    const projectContent = generatedApp.files.map(f => `// --- ${f.path} ---\n${f.content}`).join('\n\n');
    const blob = new Blob([projectContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedApp.name.toLowerCase().replace(/\s+/g, '-')}-vercel-ready.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeFile = generatedApp?.files[activeFileIndex];

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-200">
      {/* Dynamic Background Effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px] animate-pulse delay-700"></div>
      </div>

      <header className="border-b border-white/5 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">AppForge <span className="text-indigo-400">Vercel</span></h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Deployment Ready Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-900 rounded-full border border-white/5">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-slate-400 text-xs flex items-center gap-1.5">
                <Globe className="w-3 h-3" /> Vercel Optimized Output
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col max-w-screen-2xl mx-auto w-full p-6 gap-6 relative z-10">
        {/* Main Input Field */}
        <section className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 backdrop-blur-sm shadow-2xl">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <label htmlFor="prompt" className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <Box className="w-4 h-4 text-indigo-400" /> Vercel-Ready App Requirements
                </label>
                <div className="flex gap-2">
                   <button type="button" onClick={() => setPrompt("A professional dashboard with vercel analytic integrations, a sleek sidebar, and dark mode.")} className="text-[10px] bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-slate-400">Vercel Dashboard</button>
                   <button type="button" onClick={() => setPrompt("A landing page for a startup with high-performance animations and contact form handling.")} className="text-[10px] bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-slate-400">Landing Page</button>
                </div>
              </div>
              <div className="relative group">
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your Vercel-ready app (e.g., A blog with Next.js features, vercel.json, and API routes)..."
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl p-5 pr-16 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all min-h-[120px] text-slate-100 placeholder:text-slate-600 text-base"
                />
                <button
                  type="submit"
                  disabled={status === GenerationStatus.THINKING || !prompt.trim()}
                  className="absolute bottom-4 right-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:cursor-not-allowed text-white px-4 py-2 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20"
                >
                  {status === GenerationStatus.THINKING ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm font-medium">Architecting...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span className="text-sm font-medium">Forge Vercel App</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* Project View */}
        <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0 min-h-[500px]">
          {/* File Explorer */}
          <div className="w-full md:w-72 flex flex-col gap-4">
            {generatedApp ? (
              <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 flex flex-col h-full overflow-hidden shadow-xl">
                <div className="flex items-center justify-between mb-4 px-2 text-slate-400">
                  <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <FolderTree className="w-3.5 h-3.5" /> File Explorer
                  </h3>
                  <div className="flex gap-2">
                    <button onClick={downloadProject} title="Download Source Code" className="hover:text-indigo-400 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto space-y-1 pr-2 custom-scrollbar">
                  {generatedApp.files.map((file, idx) => {
                    const isVercelConfig = file.path.includes('vercel.json') || file.path.includes('package.json');
                    return (
                      <button
                        key={file.path}
                        onClick={() => setActiveFileIndex(idx)}
                        className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 transition-all group ${
                          activeFileIndex === idx 
                            ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 shadow-sm' 
                            : 'text-slate-500 hover:bg-slate-800/50 border border-transparent hover:text-slate-300'
                        }`}
                      >
                        <FileCode className={`w-4 h-4 flex-shrink-0 ${activeFileIndex === idx ? 'text-indigo-400' : isVercelConfig ? 'text-blue-400' : 'text-slate-600'}`} />
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-medium truncate flex items-center gap-1.5">
                            {file.path.split('/').pop()}
                            {isVercelConfig && <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>}
                          </span>
                          <span className="text-[10px] opacity-50 truncate">{file.path.includes('/') ? file.path.split('/').slice(0, -1).join('/') : './'}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-xl">
                   <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest mb-1">Vercel Deployment Tips</p>
                   <p className="text-[10px] text-slate-500 leading-relaxed">
                     Connect your GitHub repo to Vercel. Our generated vercel.json handles routing automatically.
                   </p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900/40 border border-white/5 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-3">
                <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center">
                  <FolderTree className="w-6 h-6 text-slate-600" />
                </div>
                <p className="text-xs text-slate-500">Architecture output pending...</p>
              </div>
            )}
          </div>

          {/* Main Display Area */}
          <div className="flex-1 bg-slate-950 border border-white/5 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            {status === GenerationStatus.IDLE && !error && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12 gap-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/5 via-transparent to-transparent">
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-10 animate-pulse"></div>
                  <div className="w-24 h-24 bg-slate-900 border border-white/10 rounded-3xl flex items-center justify-center shadow-inner relative">
                    <Rocket className="w-10 h-10 text-indigo-500" />
                  </div>
                </div>
                <div className="max-w-md">
                  <h2 className="text-2xl font-bold text-white mb-2">Build Vercel Apps Fast</h2>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    AppForge AI now includes Vercel-optimized configurations. Every app generated is ready to be pushed to production on the world's most powerful frontend platform.
                  </p>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">New: Vercel.json Auto-Generation</span>
                </div>
              </div>
            )}

            {status === GenerationStatus.THINKING && (
              <div className="flex-1 flex flex-col items-center justify-center p-12 gap-8">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-40 h-40 border-2 border-indigo-500/20 rounded-full animate-[ping_3s_ease-in-out_infinite]"></div>
                  <div className="absolute w-32 h-32 border border-blue-500/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-600/40 relative z-10 animate-bounce">
                    <Cpu className="w-10 h-10 text-white" />
                  </div>
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-bold text-white mb-1">{loadingSteps[loadingStep]}</h2>
                  <p className="text-slate-500 text-sm font-mono tracking-tight">Vercel Architecture Engine Active...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="flex-1 flex flex-col items-center justify-center p-12 gap-6 text-center">
                <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center">
                  <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <div className="max-w-sm">
                  <h2 className="text-xl font-bold text-white mb-2">Generation Failed</h2>
                  <p className="text-slate-400 text-sm leading-relaxed">{error}</p>
                </div>
                <button 
                  onClick={handleGenerate}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 border border-white/10 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95"
                >
                  Retry Forge
                </button>
              </div>
            )}

            {generatedApp && activeFile && (
              <>
                {/* Code Viewer Header */}
                <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-slate-950/50 backdrop-blur-md">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                       <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                       <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                    </div>
                    <div className="h-4 w-px bg-slate-800"></div>
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${
                        activeFile.path.includes('vercel') ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                      }`}>
                        {activeFile.language}
                      </span>
                      <span className="text-xs font-mono text-slate-400 truncate max-w-[150px] md:max-w-none">{activeFile.path}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition-all bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/5 active:scale-95"
                    >
                      {copied ? (
                        <><Check className="w-3.5 h-3.5 text-green-500" /> Copied!</>
                      ) : (
                        <><Copy className="w-3.5 h-3.5" /> Copy Code</>
                      )}
                    </button>
                  </div>
                </div>

                {/* Code Content Editor Area */}
                <div className="flex-1 overflow-auto p-0 bg-[#020617] relative">
                  <div className="absolute top-0 left-0 w-12 h-full bg-slate-950/50 border-r border-white/5 flex flex-col items-center pt-6 pointer-events-none">
                    {activeFile.content.split('\n').map((_, i) => (
                      <span key={i} className="text-[10px] font-mono text-slate-700 leading-relaxed mb-1">{i + 1}</span>
                    ))}
                  </div>
                  <pre className="pl-16 pr-6 py-6 code-font text-indigo-100 text-sm leading-relaxed overflow-visible">
                    <code>{activeFile.content}</code>
                  </pre>
                </div>

                {/* Info Bar */}
                <div className="px-6 py-4 bg-slate-900/50 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-600/10 p-2 rounded-xl">
                      <Rocket className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white leading-none">{generatedApp.name}</h4>
                      <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-tight truncate max-w-[200px] md:max-w-none">
                        Vercel Ready • {generatedApp.description.substring(0, 100)}...
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-3">
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] text-slate-600 uppercase font-bold">Optimized for</span>
                      <span className="text-[10px] text-white font-mono">vercel.com</span>
                    </div>
                    <div className="h-6 w-px bg-slate-800"></div>
                    <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <footer className="py-6 border-t border-white/5 text-center px-6">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} AppForge Vercel AI • High Performance Component Generator
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-slate-500 hover:text-white transition-colors">Vercel Docs</a>
            <a href="#" className="text-xs text-slate-500 hover:text-white transition-colors flex items-center gap-1">
              Help Center <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
