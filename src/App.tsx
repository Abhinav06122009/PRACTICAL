import { useState } from 'react';
import { MilkStateProvider } from './context/MilkStateContext';
import { MilkDidactic } from './components/MilkDidactic';
import { MilkCanvas } from './components/MilkCanvas';
import { MilkDashboard } from './components/MilkDashboard';
import { MilkQuiz } from './components/MilkQuiz';
import GlobalFooter from './components/GlobalFooter';
import './App.css';

interface MilkLabProps {
  onBackToHome?: () => void;
}

function MilkLab({ onBackToHome }: MilkLabProps) {
  const [showPrecautions, setShowPrecautions] = useState<boolean>(true);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans select-none text-black relative">
      
      {/* Precautions Modal Overlay */}
      {showPrecautions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-white border-2 border-black p-6 space-y-4 rounded-none">
            <h2 className="text-lg font-bold border-b border-black pb-2 text-black">
              Laboratory Safety & Precautions
            </h2>
            <div className="space-y-3 text-xs font-bold leading-relaxed text-gray-800">
              <div className="flex gap-2 items-start">
                <span>⚠️</span>
                <p>
                  <strong>Acid Control:</strong> Add acetic acid strictly drop by drop; excess acid can dissolve the precipitated proteins.
                </p>
              </div>
              <div className="flex gap-2 items-start">
                <span>⚠️</span>
                <p>
                  <strong>Thermal Limit:</strong> Do not boil the milk in the first step (keep it around 40°C), otherwise both proteins will mix and precipitate together.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowPrecautions(false)}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold border border-black rounded-none uppercase transition-colors cursor-pointer"
            >
              Start Simulator
            </button>
          </div>
        </div>
      )}

      {/* 1. Header Bar */}
      <header className="bg-white py-3 px-4 border-b-2 border-black sticky top-0 z-30 font-sans text-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <a href="https://margdarshak.live" target="_blank" rel="noopener noreferrer" className="mr-3 flex items-center">
              <img 
                src="/logo.png" 
                alt="Logo" 
                style={{ height: '60px', width: 'auto', display: 'block', objectFit: 'contain', imageRendering: '-webkit-optimize-contrast' as any, transform: 'translateZ(0)', backfaceVisibility: 'hidden' as any }}
                className="cursor-pointer transition-transform duration-300 hover:scale-105" 
              />
            </a>
            <div>
              <h1 className="text-base font-bold text-black m-0 leading-tight">
                Study of Coagulable and Non-coagulable Milk Proteins
              </h1>
              <p className="text-[10px] text-gray-700 font-bold uppercase tracking-wider mt-0.5">
                Class 12 Chemistry Investigatory Project
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold py-1 px-2 border border-black bg-gray-100 text-black uppercase">
              CBSE SYLLABUS
            </span>
            {onBackToHome && (
              <button 
                onClick={onBackToHome}
                className="text-[10px] font-bold py-1 px-2 border-2 border-black bg-red-100 hover:bg-red-200 text-black uppercase cursor-pointer transition-colors"
              >
                Back to Dashboard
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. Interactive Canvas Split Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-4 font-sans text-black bg-white">
        {/* Left column: Didactic Panel */}
        <div className="lg:col-span-1">
          <MilkDidactic />
        </div>

        {/* Center column: Simulation Canvas */}
        <div className="lg:col-span-2">
          <MilkCanvas />
        </div>

        {/* Right column: Analytical Dashboard */}
        <div className="lg:col-span-1">
          <MilkDashboard />
        </div>
      </main>

      <MilkQuiz />
      <GlobalFooter />
    </div>
  );
}

function App({ onBackToHome }: MilkLabProps) {
  return (
    <MilkStateProvider>
      <MilkLab onBackToHome={onBackToHome} />
    </MilkStateProvider>
  );
}

export default App;

