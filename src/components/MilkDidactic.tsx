// Found this chemistry logic on some old forum
import React, { useState } from 'react';
import { useMilkState } from '../context/MilkStateContext';

export const MilkDidactic: React.FC = () => {
  const { step, setStep, milkSource, coagulationProgress, filtrationProgress, testProgress, resetLab } = useMilkState();
  const [activeTab, setActiveTab] = useState<'procedure' | 'theory' | 'safety'>('procedure');

  const isNextReady =
    (step === 1) ||
    (step === 2 && coagulationProgress >= 100) ||
    (step === 3 && filtrationProgress >= 100) ||
    (step === 4 && testProgress >= 100);

  const stepsList = [
    {
      id: 1,
      title: "Material Preparation",
      description: "Choose a milk sample and adjust volume:",
      actions: [
        "Select the milk source (Cow, Buffalo, or Goat milk) from the panel.",
        "Set the volume of milk sample (default is 20 ml).",
        "Note the composition: Cow's milk contains ~2.5% casein (coagulable phosphoprotein).",
        "Click the 'Next Stage' button to proceed to Coagulation."
      ]
    },
    {
      id: 2,
      title: "Casein Coagulation (The Coagulable Protein)",
      description: "Coagulate the casein using Acetic Acid or Rennin:",
      actions: [
        "Select either 1% Acetic Acid or Rennin Extract from the dropdown.",
        "If you added Acetic Acid: it curdles instantly at room temperature.",
        "If you added Rennin: turn on the burner to warm it around 37°C - 40°C.",
        "Caution: Keep it around 40°C. Do not boil, or both proteins will mix and precipitate together.",
        "Once curdling is 100% complete, click 'Next Stage' to filter."
      ]
    },
    {
      id: 3,
      title: "Filtration & Separation",
      description: "Separate coagulated Casein from liquid Whey (filtrate):",
      actions: [
        "Click 'Start Filtration' to pour the curdled mixture into the funnel.",
        "Solid Casein curd remains on the filter paper as residue.",
        "The liquid whey containing soluble proteins (filtrate) collects in the flask below.",
        "Once filtration is complete, proceed to the Whey test."
      ]
    },
    {
      id: 4,
      title: "The Whey Test (Non-Coagulable Protein)",
      description: "Coagulate soluble whey proteins (Lactalbumin & Lactoglobulin) by heating:",
      actions: [
        "Click 'Pipette Whey' to transfer the liquid filtrate into the test tube.",
        "Turn on the Bunsen burner under the test tube.",
        "Boil/heat the filtrate liquid above 70°C.",
        "Observe the formation of a cloudy white precipitate. This confirms the presence of non-coagulable proteins.",
        "Click 'Log Observation' to save your trial."
      ]
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
        <button
          onClick={() => setActiveTab('safety')}
          className={`flex-1 py-1.5 px-2 text-xs font-bold border border-black cursor-pointer ${
            activeTab === 'safety' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-250'
          }`}
        >
          Precautions
        </button>
      </div>

      {/* Main Content Area */}
      <div className="p-4 space-y-4 text-xs">
        {activeTab === 'procedure' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-black pb-1.5">
              <span className="font-bold uppercase text-[10px] text-gray-700">Step {step} of 4</span>
              <span className="font-bold text-[10px] uppercase bg-black text-white px-2 py-0.5">
                {milkSource} sample
              </span>
            </div>

            <div className="p-2.5 border border-dashed border-gray-600 bg-gray-50 space-y-1">
              <h4 className="font-bold text-xs uppercase">{stepsList[step - 1].title}</h4>
              <p className="text-[11px] font-medium text-gray-700">{stepsList[step - 1].description}</p>
            </div>

            <ol className="space-y-2">
              {stepsList[step - 1].actions.map((act, idx) => (
                <li key={idx} className="flex gap-2 items-start leading-relaxed text-gray-900">
                  <span className="font-bold text-[10px] text-blue-700 shrink-0 mt-0.5">
                    {idx + 1}.
                  </span>
                  <span>{act}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {activeTab === 'theory' && (
          <div className="space-y-3 text-xs leading-relaxed font-sans">
            <h4 className="font-bold border-b border-black pb-0.5 mb-2 uppercase text-[11px]">Aim & Theory</h4>
            <p className="mb-2">
              <strong>Aim:</strong> To study the presence of coagulable and non-coagulable proteins in milk.
            </p>
            <p className="mb-2">
              <strong>Theory:</strong> Milk contains two main types of proteins:
            </p>
            <ul className="list-disc pl-4 space-y-1.5 text-[11px]">
              <li>
                <strong>Casein (Coagulable):</strong> Precipitates when milk is made acidic or treated with the enzyme rennin.
              </li>
              <li>
                <strong>Whey Proteins (Lactalbumin/Lactoglobulin):</strong> These are non-coagulable by acid but get denatured and coagulate upon heating.
              </li>
            </ul>
          </div>
        )}

        {activeTab === 'safety' && (
          <div className="space-y-3 text-xs leading-relaxed">
            <div className="p-3 border border-black bg-yellow-50 text-black">
              <h4 className="font-bold text-[11px] uppercase text-red-700">🚨 Laboratory Precautions</h4>
              <ul className="list-disc pl-4 space-y-1 text-[11px] mt-1.5">
                <li>Add acetic acid strictly drop by drop; excess acid can dissolve the precipitated proteins.</li>
                <li>Do not boil the milk in the first step (keep it around 40°C), otherwise both proteins will mix and precipitate together.</li>
                <li>Ensure Bunsen burners are turned off when not in use.</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Footer / Navigation */}
      <div className="border-t border-black bg-gray-150 p-3 flex items-center justify-between">
        <button
          disabled={step === 1}
          onClick={() => setStep(step - 1)}
          className="py-1 px-3 border border-black font-bold text-xs bg-white text-black hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          Previous
        </button>

        {step < 4 ? (
          <button
            disabled={!isNextReady}
            onClick={() => setStep(step + 1)}
            className="py-1 px-3 border border-black font-bold text-xs bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed cursor-pointer"
          >
            Next Stage
          </button>
        ) : (
          <button
            onClick={resetLab}
            className="py-1 px-3 border border-black font-bold text-xs bg-green-650 hover:bg-green-700 text-white cursor-pointer uppercase"
          >
            Run New Trial ↻
          </button>
        )}
      </div>
    </div>
  );
};
