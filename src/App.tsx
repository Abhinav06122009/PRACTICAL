import { LabStateProvider } from './context/LabStateContext';
import { DidacticPanel } from './components/DidacticPanel';
import { LaboratoryCanvas } from './components/LaboratoryCanvas';
import { AnalyticalDashboard } from './components/AnalyticalDashboard';
import { QuizModal } from './components/QuizModal';
import './App.css';
import GlobalFooter from './components/GlobalFooter';

function BleachingPowderLab() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans select-none text-black relative">
      
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
                Water Sterilization using Bleaching Powder
              </h1>
              <p className="text-[10px] text-gray-700 font-bold uppercase tracking-wider mt-0.5">
                Class 12 Chemistry Investigatory Practical &bull; CBSE Volumetric Analysis
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold py-1 px-2 border border-black bg-gray-100 text-black uppercase">
              CBSE SYLLABUS
            </span>
          </div>
        </div>
      </header>

      {/* 2. Interactive Canvas Split Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-4 font-sans text-black bg-white">
        {/* Left column: Didactic / Instruction Panel */}
        <div className="lg:col-span-1">
          <DidacticPanel />
        </div>

        {/* Center column: Simulation Canvas */}
        <div className="lg:col-span-2">
          <LaboratoryCanvas />
        </div>

        {/* Right column: Analytical Dashboard */}
        <div className="lg:col-span-1">
          <AnalyticalDashboard />
        </div>
      </main>

      {/* 4. Viva Voce Quiz Dialog Overlay */}
      <QuizModal />
      <GlobalFooter />
    </div>
  );
}

function App() {
  return (
    <LabStateProvider>
      <BleachingPowderLab />
    </LabStateProvider>
  );
}

export default App;
