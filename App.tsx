
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
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-white flex items-center justify-center rounded-full overflow-hidden">
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-black translate-y-[-1px]"></div>
              </div>
              <div className="h-6 w-px bg-[#333]"></div>
              <h1 className="text-[14px] font-semibold tracking-tight">AppForge <span className="text-blue-500">FullStack</span></h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 bg-[#111] border border-[#333] px-3 py-1.5 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0070f3] shadow-[0_0_8px_rgba(0,112,243,0.5)]"></div>
                <span className="text-[11px] font-medium text-gray-300">HTML + Node.js Engine</span>
             </div>
             <button className="bg-white text-black text-[12px] font-medium px-4 py-1.5 rounded-md hover:bg-[#eaeaea] transition-colors">
                Feedback
             </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col max-w-7xl mx-auto w-full p-6 gap-8">
        {/* Command Input */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-gray-400">
            <Layers className="w-4 h-4 text-blue-500" />
            <h2 className="text-[13px] font-medium uppercase tracking-widest">Generate Full-Stack Application</h2>
          </div>
          
          <div className="vercel-card p-1 shadow-2xl bg-[#111]/50">
            <form onSubmit={handleGenerate} className="flex flex-col">
              <div className="flex flex-col gap-0 border-b border-[#333]">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your full-stack app (e.g. A real-time chat with HTML frontend and Node.js backend API)..."
                  className="w-full bg-transparent p-6 outline-none text-[15px] leading-relaxed resize-none min-h-[140px] placeholder:text-gray-600 font-normal"
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-black rounded-b-lg">
                <div className="flex items-center gap-2">
                   <button 
                    type="button"
                    onClick={() => setPrompt("A full-stack Guestbook app: HTML5 frontend, Node.js API to save messages, and basic CSS styling.")}
                    className="text-[11px] px-3 py-1.5 rounded-md border border-[#333] text-gray-400 hover:text-white hover:border-gray-500 transition-all"
                   >
                     Guestbook API
                   </button>
                   <button 
                    type="button"
                    onClick={() => setPrompt("A Weather Dashboard that fetches live data from a Node.js backend proxy.")}
                    className="text-[11px] px-3 py-1.5 rounded-md border border-[#333] text-gray-400 hover:text-white hover:border-gray-500 transition-all"
                   >
                     Weather Proxy
                   </button>
                </div>
                <button
                  type="submit"
                  disabled={status === GenerationStatus.THINKING || !prompt.trim()}
                  className="bg-white text-black text-[13px] font-bold px-5 py-2 rounded-md hover:bg-gray-200 disabled:bg-[#333] disabled:text-gray-500 transition-all flex items-center gap-2 group"
                >
                  {status === GenerationStatus.THINKING ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Forging Full-Stack...</span>
                    </>
                  ) : (
                    <>
                      <span>Deploy Full-Stack</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Project Explorer & Editor Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[600px]">
          {/* File System */}
          <aside className="md:col-span-3 flex flex-col gap-4">
            <div className="vercel-card flex-1 flex flex-col overflow-hidden">
               <div className="px-4 py-3 border-b border-[#333] flex items-center justify-between bg-[#050505]">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                    <FolderTree className="w-3.5 h-3.5" /> Project Files
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
                    <div className="w-10 h-10 border border-[#333] rounded-lg flex items-center justify-center">
                      <Server className="w-5 h-5 text-gray-700" />
                    </div>
                    <p className="text-[12px] text-gray-600">Enter requirements to architect the stack.</p>
                  </div>
                )}
                
                {generatedApp && generatedApp.files.map((file, idx) => {
                  const isActive = activeFileIndex === idx;
                  const isBackend = file.path.startsWith('api/') || file.path.includes('server');
                  const isConfig = file.path.includes('.json');
                  return (
                    <button
                      key={file.path}
                      onClick={() => setActiveFileIndex(idx)}
                      className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between transition-all group ${
                        isActive 
                          ? 'bg-[#111] text-white border border-[#333]' 
                          : 'text-gray-500 hover:text-gray-300 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <FileCode className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : isBackend ? 'text-amber-500' : isConfig ? 'text-blue-500' : 'text-gray-700'}`} />
                        <span className="text-[13px] font-medium truncate">{file.path.split('/').pop()}</span>
                      </div>
                      {isBackend && !isActive && <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50"></div>}
                    </button>
                  );
                })}
               </div>
            </div>
          </aside>

          {/* Code Viewer */}
          <section className="md:col-span-9 vercel-card overflow-hidden flex flex-col bg-[#050505]">
            {status === GenerationStatus.IDLE && (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-10 animate-pulse"></div>
                  <div className="w-32 h-32 border border-[#333] rounded-full flex items-center justify-center bg-black relative z-10">
                    <Server className="w-12 h-12 text-white" />
                  </div>
                </div>
                <h2 className="text-[20px] font-bold tracking-tight mb-2">Frontend Meets Backend.</h2>
                <p className="text-[14px] text-gray-500 max-w-sm mb-8 leading-relaxed">
                  Generate interconnected HTML5 apps with Node.js serverless functions. Ready for production deployment on Vercel.
                </p>
                <div className="flex items-center gap-6">
                   <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Frontend</span>
                      <span className="text-[13px] font-medium">HTML5 / JS / CSS</span>
                   </div>
                   <div className="w-px h-8 bg-[#333]"></div>
                   <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Backend</span>
                      <span className="text-[13px] font-medium">Node.js Serverless</span>
                   </div>
                   <div className="w-px h-8 bg-[#333]"></div>
                   <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Stack</span>
                      <span className="text-[13px] font-medium">Full-Stack Vercel</span>
                   </div>
                </div>
              </div>
            )}

            {status === GenerationStatus.THINKING && (
              <div className="flex-1 flex flex-col items-center justify-center p-12 gap-10">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 border-t-2 border-blue-500 rounded-full animate-spin"></div>
                  <div className="mt-4 flex flex-col items-center gap-2">
                    <p className="text-[18px] font-bold text-white transition-all duration-500">{loadingSteps[loadingStep]}</p>
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {generatedApp && activeFile && (
              <>
                <div className="h-14 border-b border-[#333] flex items-center justify-between px-6 bg-black">
                   <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(0,112,243,0.5)] ${activeFile.path.startsWith('api/') ? 'bg-amber-500' : 'bg-blue-500'}`}></span>
                        <span className="text-[13px] font-medium text-gray-200">{activeFile.path}</span>
                      </div>
                      <div className="h-4 w-px bg-[#333]"></div>
                      <span className="text-[11px] font-bold text-gray-600 uppercase tracking-widest">{activeFile.language}</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center gap-2 text-[12px] font-medium text-gray-400 hover:text-white transition-all bg-[#111] hover:bg-[#222] px-3 py-1.5 rounded-md border border-[#333] active:scale-95"
                      >
                        {copied ? (
                          <><Check className="w-3.5 h-3.5 text-green-500" /> Copied</>
                        ) : (
                          <><Copy className="w-3.5 h-3.5" /> Copy Code</>
                        )}
                      </button>
                   </div>
                </div>
                
                <div className="flex-1 overflow-auto bg-black relative custom-scrollbar" ref={scrollRef}>
                   <div className="absolute top-0 left-0 w-12 h-full bg-[#050505] border-r border-[#111] flex flex-col items-center pt-6 select-none">
                      {activeFile.content.split('\n').map((_, i) => (
                        <span key={i} className="text-[11px] font-mono text-[#333] leading-[1.6] mb-0.5">{i + 1}</span>
                      ))}
                   </div>
                   <pre className="pl-16 pr-6 py-6 code-font text-[14px] leading-[1.6] text-[#eaeaea] selection:bg-blue-600">
                     <code>{activeFile.content}</code>
                   </pre>
                </div>

                <div className="p-4 border-t border-[#333] bg-black flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 border border-[#333] rounded-lg flex items-center justify-center bg-[#111]">
                        <Layers className="w-5 h-5 text-gray-500" />
                      </div>
                      <div className="flex flex-col">
                        <h4 className="text-[13px] font-bold text-white">{generatedApp.name}</h4>
                        <p className="text-[11px] text-gray-500 truncate max-w-[400px]">Connected Full-Stack Architecture Ready.</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-6 text-[11px] text-gray-600">
                      <div className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5" />
                        <span>Frontend: HTML/JS</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Server className="w-3.5 h-3.5" />
                        <span>Backend: Node.js</span>
                      </div>
                   </div>
                </div>
              </>
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#333] py-8 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-gray-500">
            <span className="text-[12px] font-medium tracking-tight">&copy; {new Date().getFullYear()} AppForge Full-Stack Edition.</span>
          </div>
          <div className="flex items-center gap-8">
            <a href="#" className="text-[12px] text-gray-500 hover:text-white transition-colors">Vercel Backend Docs</a>
            <a href="#" className="text-[12px] text-gray-500 hover:text-white transition-colors">Serverless Functions</a>
            <a href="#" className="text-[12px] text-gray-500 hover:text-white transition-colors">API Guide</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
