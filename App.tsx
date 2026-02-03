
import React, { useState, useEffect, useRef } from 'react';
import { 
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
  Zap,
  Globe,
  Rocket,
  Plus,
  ArrowRight,
  MoreVertical,
  Github,
  Server,
  Layers
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
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadingSteps = [
    "Analyzing full-stack requirements",
    "Architecting Frontend (HTML/JS/CSS)",
    "Designing API endpoints (Serverless Node.js)",
    "Configuring Vercel deployment bridges",
    "Optimizing data communication patterns",
    "Finalizing full-stack bundle"
  ];

  useEffect(() => {
    let interval: any;
    if (status === GenerationStatus.THINKING) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingSteps.length);
      }, 2500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleGenerate = async (e?: React.FormEvent) => {
    e?.preventDefault();
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
    a.download = `${generatedApp.name.toLowerCase().replace(/\s+/g, '-')}-fullstack.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeFile = generatedApp?.files[activeFileIndex];

  return (
    <div className="min-h-screen flex flex-col bg-black text-white selection:bg-blue-500 selection:text-white">
      {/* Vercel-style Header */}
      <header className="glass-header sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-white flex items-center justify-center rounded-full overflow-hidden">
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-black translate-y-[-1px]"></div>
              </div>
              <div className="hidden sm:block h-6 w-px bg-[#333]"></div>
              <h1 className="text-[13px] md:text-[14px] font-semibold tracking-tight">AppForge <span className="text-blue-500">FullStack</span></h1>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
             <div className="hidden sm:flex items-center gap-2 bg-[#111] border border-[#333] px-3 py-1.5 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0070f3] shadow-[0_0_8px_rgba(0,112,243,0.5)]"></div>
                <span className="text-[10px] md:text-[11px] font-medium text-gray-300 uppercase tracking-tight">Node.js Engine</span>
             </div>
             <button className="bg-white text-black text-[11px] md:text-[12px] font-medium px-3 md:px-4 py-1.5 rounded-md hover:bg-[#eaeaea] transition-colors">
                Feedback
             </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col max-w-7xl mx-auto w-full p-4 md:p-6 gap-6 md:gap-8">
        {/* Command Input */}
        <section className="flex flex-col gap-3 md:gap-4">
          <div className="flex items-center gap-2 text-gray-400">
            <Layers className="w-4 h-4 text-blue-500" />
            <h2 className="text-[11px] md:text-[13px] font-medium uppercase tracking-widest">Full-Stack Deployment</h2>
          </div>
          
          <div className="vercel-card p-1 shadow-2xl bg-[#111]/50 overflow-hidden">
            <form onSubmit={handleGenerate} className="flex flex-col">
              <div className="flex flex-col gap-0 border-b border-[#333]">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your full-stack app (e.g. A real-time chat with HTML frontend and Node.js backend API)..."
                  className="w-full bg-transparent p-4 md:p-6 outline-none text-[14px] md:text-[15px] leading-relaxed resize-none min-h-[120px] md:min-h-[140px] placeholder:text-gray-600 font-normal"
                />
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between p-3 bg-black rounded-b-lg gap-3">
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                   <button 
                    type="button"
                    onClick={() => setPrompt("A full-stack Guestbook app: HTML5 frontend, Node.js API to save messages, and basic CSS styling.")}
                    className="text-[10px] px-2 py-1 rounded-md border border-[#333] text-gray-400 hover:text-white transition-all"
                   >
                     Guestbook
                   </button>
                   <button 
                    type="button"
                    onClick={() => setPrompt("A Weather Dashboard that fetches live data from a Node.js backend proxy.")}
                    className="text-[10px] px-2 py-1 rounded-md border border-[#333] text-gray-400 hover:text-white transition-all"
                   >
                     Weather Proxy
                   </button>
                </div>
                <button
                  type="submit"
                  disabled={status === GenerationStatus.THINKING || !prompt.trim()}
                  className="w-full sm:w-auto bg-white text-black text-[12px] md:text-[13px] font-bold px-5 py-2 rounded-md hover:bg-gray-200 disabled:bg-[#333] disabled:text-gray-500 transition-all flex items-center justify-center gap-2 group"
                >
                  {status === GenerationStatus.THINKING ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /><span>Processing...</span></>
                  ) : (
                    <><span>Deploy App</span><ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Project Explorer & Editor Grid */}
        <div className="flex-1 flex flex-col md:grid md:grid-cols-12 gap-6 min-h-0">
          {/* File System */}
          <aside className="md:col-span-3 flex flex-col gap-4">
            <div className="vercel-card flex-1 flex flex-col overflow-hidden max-h-[300px] md:max-h-none">
               <div className="px-4 py-3 border-b border-[#333] flex items-center justify-between bg-[#050505]">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                    <FolderTree className="w-3.5 h-3.5" /> Project
                  </span>
                  {generatedApp && (
                    <button onClick={downloadProject} className="text-gray-500 hover:text-white transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  )}
               </div>
               
               <div className="flex-1 overflow-y-auto p-2 space-y-0.5 custom-scrollbar">
                {!generatedApp && status !== GenerationStatus.THINKING && (
                  <div className="h-full flex flex-col items-center justify-center p-8 text-center gap-4">
                    <Server className="w-5 h-5 text-gray-700" />
                    <p className="text-[11px] text-gray-600">Enter requirements above.</p>
                  </div>
                )}
                
                {generatedApp && generatedApp.files.map((file, idx) => {
                  const isActive = activeFileIndex === idx;
                  const isBackend = file.path.startsWith('api/');
                  return (
                    <button
                      key={file.path}
                      onClick={() => setActiveFileIndex(idx)}
                      className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between transition-all group ${
                        isActive ? 'bg-[#111] text-white border border-[#333]' : 'text-gray-500 hover:text-gray-300 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <FileCode className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : isBackend ? 'text-amber-500' : 'text-gray-700'}`} />
                        <span className="text-[12px] font-medium truncate">{file.path.split('/').pop()}</span>
                      </div>
                      {isBackend && !isActive && <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50"></div>}
                    </button>
                  );
                })}
               </div>
            </div>
          </aside>

          {/* Code Viewer */}
          <section className="md:col-span-9 vercel-card overflow-hidden flex flex-col bg-[#050505] min-h-[400px]">
            {status === GenerationStatus.IDLE && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 text-center">
                <div className="relative mb-6 md:mb-8">
                  <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-10 animate-pulse"></div>
                  <div className="w-24 h-24 md:w-32 md:h-32 border border-[#333] rounded-full flex items-center justify-center bg-black relative z-10">
                    <Server className="w-10 h-10 md:w-12 md:h-12 text-white" />
                  </div>
                </div>
                <h2 className="text-[18px] md:text-[20px] font-bold tracking-tight mb-2">Build The Full-Stack.</h2>
                <p className="text-[13px] md:text-[14px] text-gray-500 max-w-sm mb-6 md:mb-8 leading-relaxed">
                  Generate interconnected HTML5 apps with Node.js serverless functions.
                </p>
              </div>
            )}

            {status === GenerationStatus.THINKING && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 gap-6 text-center">
                <div className="w-12 h-12 border-t-2 border-blue-500 rounded-full animate-spin"></div>
                <p className="text-[16px] font-medium text-white">{loadingSteps[loadingStep]}</p>
              </div>
            )}

            {generatedApp && activeFile && (
              <>
                <div className="h-12 md:h-14 border-b border-[#333] flex items-center justify-between px-4 md:px-6 bg-black">
                   <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className={`w-2 h-2 rounded-full ${activeFile.path.startsWith('api/') ? 'bg-amber-500' : 'bg-blue-500'}`}></span>
                        <span className="text-[12px] md:text-[13px] font-medium text-gray-200 truncate max-w-[120px] sm:max-w-none">{activeFile.path}</span>
                      </div>
                   </div>
                   <button
                    onClick={copyToClipboard}
                    className="flex-shrink-0 flex items-center gap-2 text-[11px] md:text-[12px] font-medium text-gray-400 hover:text-white bg-[#111] px-3 py-1.5 rounded-md border border-[#333]"
                   >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
                   </button>
                </div>
                
                <div className="flex-1 overflow-auto bg-black relative custom-scrollbar" ref={scrollRef}>
                   <pre className="p-4 md:p-6 code-font text-[13px] md:text-[14px] leading-relaxed text-[#eaeaea] overflow-x-auto">
                     <code>{activeFile.content}</code>
                   </pre>
                </div>
              </>
            )}
          </section>
        </div>
      </main>

      <footer className="border-t border-[#333] py-6 bg-[#050505] px-6 text-center">
        <span className="text-[11px] md:text-[12px] text-gray-600">&copy; {new Date().getFullYear()} AppForge Full-Stack. Vercel-Ready Engine.</span>
      </footer>
    </div>
  );
};

export default App;
