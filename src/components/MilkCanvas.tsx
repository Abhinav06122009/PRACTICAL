// TODO: Fix the layout later, it breaks on mobile.
// Adding 1% acetic acid here based on NCERT page 42
// temp constraint: 37C is needed for rennet to work properly (sir told this in class)
// console.log("State updated"); // removing this for final build

import React, { useState } from 'react';
import { useMilkState } from '../context/MilkStateContext';

export const MilkCanvas: React.FC = () => {
  const {
    step,
    milkSource, setMilkSource,
    milkVolume, setMilkVolume,
    reagent, setReagent,
    addRennin,
    addAcid,
    temperature,
    isBurnerOn, setIsBurnerOn,
    isFiltering,
    filtrationProgress, startFiltration,
    pipettedWhey, pipetteWheyToTube,
    testTubeTemp,
    isTestTubeBurnerOn, setIsTestTubeBurnerOn,
    testProgress,
    addLog,
    studentCaseinWt, setStudentCaseinWt,
    studentCaseinPct, setStudentCaseinPct,
    isCalculationCorrect, verifyCalculation,
    errorMessage,
    resetLab
  } = useMilkState();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelectReagent = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'acid') {
      addAcid();
      showToast("Added Acetic Acid.");
    } else if (val === 'rennin') {
      addRennin();
      showToast("Added Rennin Extract.");
    } else {
      setReagent('none');
    }
  };

  const handleLogClick = () => {
    addLog();
    showToast(`Logged measurements for ${milkSource.toUpperCase()} MILK.`);
  };

  const handleVerify = () => {
    verifyCalculation();
    const expectedWt = milkSource === 'cow' ? (milkVolume * 0.025) : milkSource === 'buffalo' ? (milkVolume * 0.038) : (milkVolume * 0.030);
    const expectedPct = milkSource === 'cow' ? 2.5 : milkSource === 'buffalo' ? 3.8 : 3.0;
    const sWt = parseFloat(studentCaseinWt);
    const sPct = parseFloat(studentCaseinPct);
    if (!isNaN(sWt) && !isNaN(sPct)) {
      if (Math.abs(sWt - expectedWt) < 0.05 && Math.abs(sPct - expectedPct) < 0.1) {
        import('canvas-confetti').then((confettiModule) => {
          confettiModule.default({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        });
      }
    }
  };

  return (
    <div className="p-3 border-2 border-black font-sans bg-white text-black rounded-none">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="border border-black p-1.5 mb-2 bg-yellow-100 text-xs font-bold font-mono">
          System: {toastMessage}
        </div>
      )}

      {/* Lab Guide Info */}
      <div className="bg-gray-200 p-2 border border-black text-xs font-bold mb-4">
        {step === 1 && "Prepare Milk: Select milk type and quantity below."}
        {step === 2 && "Coagulation: Select reagent to curdle Casein protein."}
        {step === 3 && "Filtration: Filter curdled milk to isolate Casein."}
        {step === 4 && "Whey Test: Heat filtrate to precipitate non-coagulable proteins."}
      </div>

      {/* Basic Canvas Box */}
      <div className="border-2 border-black p-4 bg-white text-center rounded-none">
        <h4 className="font-bold border-b border-black pb-1 mb-4 text-sm uppercase font-mono">
          Simulation Visual Area
        </h4>

        {/* Step 1 & 2: Main Beaker View */}
        {(step === 1 || step === 2) && (
          <div className="py-6">
            <p className="text-xs font-bold text-gray-500 font-mono">[Beaker Station]</p>
            
            {/* Simple Beaker SVG Sketch */}
            <div className="h-40 w-32 bg-gray-100 mx-auto mt-4 border-2 border-black relative">
              
              {/* Milk Liquid Content */}
              {reagent === 'none' ? (
                // Normal Milk (Opaque light cream)
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-[#fbf9f0] border-t border-black text-center text-[10px] font-bold py-4 text-black" 
                  style={{ height: `${milkVolume * 3}px` }}
                >
                  Raw {milkSource} Milk
                </div>
              ) : (
                // Curdling / Curdled Milk (Chunky visual pattern - instantly switched, no transitions)
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-[#e4dfd0] border-t border-black text-center text-[9px] font-bold py-2 text-red-900"
                  style={{ height: `${milkVolume * 3}px` }}
                >
                  <div className="border-b border-dashed border-black mb-1">=== CURDS ===</div>
                  <div>Casein Precipitated</div>
                </div>
              )}
            </div>

            {/* Milk Type and Volume Selector Controls for Step 1 */}
            {step === 1 && (
              <div className="mt-4 p-2 border border-black bg-gray-50 max-w-xs mx-auto text-left space-y-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase mb-1">1. Select Milk Sample:</label>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { id: 'cow', name: 'Cow' },
                      { id: 'buffalo', name: 'Buffalo' },
                      { id: 'goat', name: 'Goat' }
                    ].map(milk => (
                      <button
                        key={milk.id}
                        onClick={() => setMilkSource(milk.id as any)}
                        className={`py-1 border border-black text-[10px] font-bold cursor-pointer uppercase ${
                          milkSource === milk.id ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-250'
                        }`}
                      >
                        {milk.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase mb-1">
                    2. Volume: <span className="text-blue-750 font-extrabold">{milkVolume} ml</span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="30"
                    step="5"
                    value={milkVolume}
                    onChange={(e) => setMilkVolume(parseInt(e.target.value))}
                    className="w-full cursor-pointer accent-black"
                  />
                </div>
              </div>
            )}

            {/* Simple Burner Console */}
            {step === 2 && (
              <div className="mt-4 p-2 border border-black bg-gray-50 max-w-xs mx-auto text-left space-y-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase mb-1">Select Reagent:</label>
                  <select
                    value={reagent}
                    onChange={handleSelectReagent}
                    disabled={reagent !== 'none'}
                    className="w-full border border-black p-1 text-xs bg-white cursor-pointer font-bold"
                  >
                    <option value="none">-- Select Reagent --</option>
                    <option value="acid">1% Acetic Acid</option>
                    <option value="rennin">Rennin Extract</option>
                  </select>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span>Temp: {temperature}°C</span>
                  {isBurnerOn && <span className="text-red-650 animate-pulse font-mono">🔥 HEATING</span>}
                </div>
                <button
                  onClick={() => setIsBurnerOn(!isBurnerOn)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 border border-black text-xs cursor-pointer"
                >
                  {isBurnerOn ? "Turn Off Burner" : "Turn On Burner"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Filtration Setup */}
        {step === 3 && (
          <div className="py-6 space-y-4">
            <p className="text-xs font-bold text-gray-500 font-mono">[Filter Station]</p>
            
            {/* Simple Funnel & Flask Sketch */}
            <div className="w-48 mx-auto border border-black p-3 bg-gray-50 text-left text-xs space-y-2">
              <div className="border border-black bg-white p-1 text-center font-bold">
                {filtrationProgress >= 100 ? "Residue: Casein Isolated" : "Filtering Milk curds..."}
              </div>
              <div className="text-[10px]">
                <div>• Filter Paper: Solid Casein</div>
                <div>• Flask below: Whey liquid ({filtrationProgress >= 100 ? "Ready" : "Collecting"})</div>
              </div>
            </div>

            <button
              onClick={startFiltration}
              disabled={isFiltering || filtrationProgress >= 100}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-4 border border-black text-xs cursor-pointer disabled:bg-gray-300 disabled:text-gray-600"
            >
              {filtrationProgress >= 100 ? "Filtration Done" : isFiltering ? "Filtering..." : "Start Filtration"}
            </button>
          </div>
        )}

        {/* Step 4: Whey Heat Coagulation Test */}
        {step === 4 && (
          <div className="py-6">
            <p className="text-xs font-bold text-gray-500 font-mono">[Test Tube Station]</p>
            
            {/* Simple Test Tube representation */}
            <div className="h-40 w-12 border-2 border-black mx-auto mt-4 relative bg-gray-50">
              {pipettedWhey && (
                <div 
                  className={`absolute bottom-0 left-0 right-0 border-t border-black text-[8px] font-bold text-center py-4 ${
                    testProgress >= 100 
                      ? "bg-[#fafafa] text-black font-extrabold" // Cloudy White
                      : "bg-[#fffdeb]/60 text-gray-700"          // Clear Yellow Whey
                  }`}
                  style={{ height: "60px" }}
                >
                  {testProgress >= 100 ? "Cloudy Ppt" : "Whey Liquid"}
                </div>
              )}
            </div>

            {/* Test Tube controls */}
            <div className="mt-4 p-2 border border-black bg-gray-50 max-w-xs mx-auto text-left space-y-2 text-xs">
              {!pipettedWhey ? (
                <button
                  onClick={pipetteWheyToTube}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 border border-black cursor-pointer"
                >
                  Pipette Whey to Tube
                </button>
              ) : (
                <>
                  <div className="flex justify-between items-center font-bold">
                    <span>Temp: {testTubeTemp}°C</span>
                    {isTestTubeBurnerOn && <span className="text-red-650 animate-pulse font-mono">🔥 BOILING</span>}
                  </div>
                  <button
                    onClick={() => setIsTestTubeBurnerOn(!isTestTubeBurnerOn)}
                    disabled={testProgress >= 100}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 border border-black cursor-pointer disabled:bg-gray-300 disabled:text-gray-650"
                  >
                    {isTestTubeBurnerOn ? "Turn Off Burner" : "Turn On Burner"}
                  </button>
                </>
              )}

              {testProgress >= 100 && (
                <div className="space-y-3 pt-2 border-t border-black">
                  <div className="bg-white p-2 border border-black space-y-2 text-xs">
                    <div className="font-bold uppercase text-[10px]">NCERT Yield Practice:</div>
                    <div className="grid grid-cols-2 gap-2 text-left">
                      <div>
                        <label className="block text-[9px] font-bold">Casein (g):</label>
                        <input
                          type="text"
                          value={studentCaseinWt}
                          onChange={(e) => setStudentCaseinWt(e.target.value)}
                          placeholder="e.g. 0.50"
                          className="w-full border border-black p-1 bg-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold">Percentage (%):</label>
                        <input
                          type="text"
                          value={studentCaseinPct}
                          onChange={(e) => setStudentCaseinPct(e.target.value)}
                          placeholder="e.g. 2.5"
                          className="w-full border border-black p-1 bg-white text-xs"
                        />
                      </div>
                    </div>

                    {errorMessage && (
                      <div className="p-1 bg-red-100 text-red-900 border border-red-500 text-[9px] font-mono text-left">
                        {errorMessage}
                      </div>
                    )}

                    {isCalculationCorrect === true && (
                      <div className="p-1 bg-green-100 text-green-900 border border-green-500 text-[9px] font-bold text-left">
                        ✓ Correct! Confetti Fired.
                      </div>
                    )}

                    <div className="flex gap-1 pt-1">
                      <button
                        onClick={handleVerify}
                        disabled={!studentCaseinWt || !studentCaseinPct || isCalculationCorrect === true}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 border border-black text-[10px] cursor-pointer disabled:bg-gray-300 disabled:text-gray-650"
                      >
                        Verify
                      </button>
                      <button
                        onClick={() => {
                          const expectedWt = milkSource === 'cow' ? (milkVolume * 0.025) : milkSource === 'buffalo' ? (milkVolume * 0.038) : (milkVolume * 0.030);
                          const expectedPct = milkSource === 'cow' ? 2.5 : milkSource === 'buffalo' ? 3.8 : 3.0;
                          setStudentCaseinWt(expectedWt.toFixed(2));
                          setStudentCaseinPct(expectedPct.toFixed(1));
                        }}
                        className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-1 px-2 border border-black text-[10px] cursor-pointer"
                      >
                        Auto Calc
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleLogClick}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-1.5 border border-black cursor-pointer text-xs uppercase"
                  >
                    Log Result
                  </button>

                  <button
                    onClick={resetLab}
                    className="w-full bg-black hover:bg-gray-900 text-white font-bold py-1.5 border border-black cursor-pointer text-xs uppercase"
                  >
                    Run New Trial ↻
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
