import React, { useState } from 'react';
import { useLabState } from '../context/LabStateContext';

export const DidacticPanel: React.FC = () => {
  const { step, setStep, selectedSampleId, waterSamples, logs, isFlaskStoppered, reactionTimerActive, isFiltratePrepared } = useLabState();
  const [activeTab, setActiveTab] = useState<'theory' | 'procedure'>('procedure');

  const selectedSample = waterSamples.find(s => s.id === selectedSampleId);



  const stepsList = [
    {
      id: 1,
      title: "Reagent Preparation",
      description: "Prepare the 1% bleaching powder suspension and filter it to get a clear filtrate. Each 1 ml of filtrate will correspond to exactly 0.01 g of bleaching powder."
    },
    {
      id: 2,
      title: "Blank Titration (V1)",
      description: "Measure available chlorine in 20 ml bleaching powder solution. Add KI and Acetic Acid. Titrate with Hypo until pale yellow, THEN add Starch and titrate until colorless. Log V1."
    },
    {
      id: 3,
      title: "Sample Disinfection",
      description: "Select a water sample. Add 20 ml bleaching powder solution, stopper the flask, and let the chlorine react with the organic impurities for 30 minutes in dark."
    },
    {
      id: 4,
      title: "Sample Titration (V2)",
      description: "Add KI and Acetic Acid to the reacted flask. Titrate with Hypo until pale yellow, THEN add Starch indicator and titrate until colorless. Log V2."
    },
    {
      id: 5,
      title: "Calculations & Assessment",
      description: "Use your V1 and V2 values to calculate the grams of bleaching powder required to disinfect 1 Liter of the sample. Complete the final Viva Voce assessment."
    }
  ];

  return (
    <div className="flex flex-col border border-black bg-white font-sans text-black rounded-none">
      
      {/* Sidebar Header Tabs */}
      <div className="flex border-b border-black bg-gray-100 p-1 gap-1">
        <button
          onClick={() => setActiveTab('procedure')}
          className={`flex-1 py-1.5 px-2 text-xs font-bold border border-black cursor-pointer ${
            activeTab === 'procedure' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-250'
          }`}
        >
          Procedure
        </button>
        <button
          onClick={() => setActiveTab('theory')}
          className={`flex-1 py-1.5 px-2 text-xs font-bold border border-black cursor-pointer ${
            activeTab === 'theory' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-250'
          }`}
        >
          Theory
        </button>
      </div>

      {/* Main Content Area */}
      <div className="p-4 space-y-4 text-xs">
        {activeTab === 'theory' ? (
          <div className="space-y-4 text-xs leading-relaxed">
            <div>
              <h4 className="font-bold border-b border-black pb-0.5 mb-1 uppercase text-[11px]">Aim</h4>
              <p className="text-[11px]">
                To estimate the quantity of bleaching powder required for sterilization of different samples of water.
              </p>
            </div>

            <div>
              <h4 className="font-bold border-b border-black pb-0.5 mb-1 uppercase text-[11px]">Theoretical Chemistry</h4>
              <p className="text-[11px] mb-2">
                Bleaching powder is Ca(OCl)2. Under atmospheric conditions, it releases chlorine gas which sterilizes water:
              </p>
              <div className="my-2 p-2 bg-gray-50 border border-black text-center font-mono text-[10px]">
                CaOCl2 + H2O &rarr; Ca(OH)2 + Cl2
              </div>
              <p className="text-[11px] mb-2">
                Available chlorine is estimated using iodometric titration. Acidified bleaching powder oxidizes iodide to iodine:
              </p>
              <div className="my-2 p-2 bg-gray-50 border border-black text-center font-mono text-[10px]">
                Cl2 + 2KI &rarr; 2KCl + I2
              </div>
              <p className="text-[11px]">
                The iodine is titrated against standard sodium thiosulfate using starch indicator:
              </p>
              <div className="my-2 p-2 bg-gray-50 border border-black text-center font-mono text-[10px]">
                I2 + 2Na2S2O3 &rarr; Na2S4O6 + 2NaI
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-black pb-1.5">
              <span className="font-bold uppercase text-[10px] text-gray-700">Step {step} of 5</span>
              <span className="font-bold text-[10px] uppercase bg-black text-white px-2 py-0.5">
                {step <= 2 ? "Standardization" : selectedSample?.name || "Sample"}
              </span>
            </div>

            <div className="space-y-3">
              {stepsList.map((s) => {
                const isActive = step === s.id;
                const isCompleted = step > s.id;

                return (
                  <div
                    key={s.id}
                    className={`p-3 border ${
                      isActive
                        ? 'border-2 border-black bg-yellow-50'
                        : isCompleted
                        ? 'border-black bg-gray-150 opacity-70'
                        : 'border-gray-300 opacity-40'
                    }`}
                  >
                    <div className="space-y-1">
                      <h4 className="font-bold text-xs uppercase text-black">
                        {s.id}. {s.title}
                      </h4>
                      <p className="text-[11px] text-gray-800 leading-normal">
                        {s.description}
                      </p>
                    </div>

                    {/* Step warnings/tips */}
                    {isActive && s.id === 1 && (
                      <div className="mt-2 p-2 bg-white border border-dashed border-black text-[10px] font-bold text-blue-700">
                        * Action: Click "Filter Suspension" in the visual panel to get the clear filtrate.
                      </div>
                    )}
                    {isActive && s.id === 2 && (
                      <div className="mt-2 p-2 bg-white border border-dashed border-black text-[10px] font-bold text-blue-700">
                        * Action: Pour solution, add KI, Acetic Acid, and Starch. Titrate and click "Log Reading".
                      </div>
                    )}
                    {isActive && s.id === 3 && (
                      <div className="mt-2 p-2 bg-white border border-dashed border-black text-[10px] font-bold text-blue-700">
                        * Action: Select sample. Dilute if DF &gt; 1, then click "Add 20ml Bleach" and start the 30-min reaction.
                      </div>
                    )}
                    {isActive && s.id === 4 && (
                      <div className="mt-2 p-2 bg-white border border-dashed border-black text-[10px] font-bold text-blue-700">
                        * Action: Add KI, Acetic Acid, and Starch. Titrate and click "Log Reading".
                      </div>
                    )}
                    {isActive && s.id === 5 && (
                      <div className="mt-2 p-2 bg-white border border-dashed border-black text-[10px] font-bold text-blue-700">
                        * Action: Enter calculations in the right panel and verify.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Next Stage Footer */}
      {activeTab === 'procedure' && step < 5 && (
        <div className="border-t border-black bg-gray-150 p-3 flex items-center justify-between">
          <button
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
            className="py-1 px-3 border border-black font-bold text-xs bg-white text-black hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Previous
          </button>

          <button
            disabled={
              (step === 1 && !isFiltratePrepared) ||
              (step === 2 && logs.filter(l => l.sampleName === 'Blank Standardization').length < 3) ||
              (step === 3 && (!isFlaskStoppered || reactionTimerActive)) ||
              (step === 4 && logs.filter(l => l.sampleName === selectedSample?.name).length < 3)
            }
            onClick={() => setStep(step + 1)}
            className="py-1 px-3 border border-black font-bold text-xs bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed cursor-pointer"
          >
            Next Stage
          </button>
        </div>
      )}
    </div>
  );
};
