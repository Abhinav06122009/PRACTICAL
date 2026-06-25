import React, { useState } from 'react';
import { useMilkState } from '../context/MilkStateContext';
import { Check, X, Award, RefreshCw, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Question {
  id: number;
  question: string;
  options: { key: string; text: string }[];
  correctAnswer: string;
  explanation: string;
}

export const MilkQuiz: React.FC = () => {
  const {
    isQuizActive,
    setIsQuizActive,
    quizScore,
    submitQuiz,
    resetLab
  } = useMilkState();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState<boolean>(false);

  const quizQuestions: Question[] = [
    {
      id: 1,
      question: "What is the major coagulable protein present in milk?",
      options: [
        { key: "a", text: "Casein (makes up about 80% of total milk protein, precipitated by acids/rennin)" },
        { key: "b", text: "Lactalbumin (remains soluble in whey after coagulation)" },
        { key: "c", text: "Lactoglobulin (remains soluble in whey after coagulation)" },
        { key: "d", text: "Albumin (general serum protein)" }
      ],
      correctAnswer: "a",
      explanation: "Casein is the primary protein in milk, existing as a calcium-caseinate complex. It is classified as coagulable because it easily precipitates out under acidic conditions or by the action of rennin enzyme."
    },
    {
      id: 2,
      question: "Which enzyme is responsible for the coagulation of casein in this investigatory project?",
      options: [
        { key: "a", text: "Amylase" },
        { key: "b", text: "Pepsin" },
        { key: "c", text: "Rennin (Chymosin)" },
        { key: "d", text: "Lipase" }
      ],
      correctAnswer: "c",
      explanation: "Rennin (or chymosin) is a proteolytic enzyme that specifically cleaves kappa-casein, destabilizing the calcium-caseinate micelle structure and causing curdling/coagulation at warm temperatures (~40°C - 50°C)."
    },
    {
      id: 3,
      question: "Which of the following are non-coagulable milk proteins present in whey?",
      options: [
        { key: "a", text: "Casein and mucin" },
        { key: "b", text: "Lactalbumin and lactoglobulin" },
        { key: "c", text: "Rennin and pepsin" },
        { key: "d", text: "Lactose and calcium caseinate" }
      ],
      correctAnswer: "b",
      explanation: "Lactalbumin and lactoglobulin are the two primary whey proteins. They do not coagulate under rennin or acid treatment and remain in the liquid whey (filtrate), but can be detected via Millon's reagent."
    },
    {
      id: 4,
      question: "What visual confirmation indicates a positive test for proteins using Millon's reagent?",
      options: [
        { key: "a", text: "A clear blue solution turning violet" },
        { key: "b", text: "A yellow solution turning dark blue-black" },
        { key: "c", text: "A bright green effervescent gas release" },
        { key: "d", text: "A white precipitate that turns brick-red on heating" }
      ],
      correctAnswer: "d",
      explanation: "Millon's test yields a white precipitate when added to tyrosine-containing proteins. Upon warming/heating, this precipitate undergoes a chemical complexation shift, turning brick-red."
    },
    {
      id: 5,
      question: "Which specific amino acid residue in milk proteins reacts with Millon's reagent to produce the red color?",
      options: [
        { key: "a", text: "Tyrosine (due to its phenolic hydroxyl group)" },
        { key: "b", text: "Glycine" },
        { key: "c", text: "Alanine" },
        { key: "d", text: "Lysine" }
      ],
      correctAnswer: "a",
      explanation: "Millon's reagent is highly specific for the phenolic hydroxyl group. Tyrosine is the amino acid containing this phenolic ring, which coordinates with the mercury ions in the reagent to form a red complex."
    }
  ];

  if (!isQuizActive) return null;

  const handleSelectOption = (optionKey: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [quizQuestions[currentQuestionIndex].id]: optionKey
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Calculate grade
      submitQuiz(selectedAnswers);
      setShowResults(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleClose = () => {
    setIsQuizActive(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
  };

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const userSelection = selectedAnswers[currentQuestion.id];  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-[#FCFCFC] border-[0.5px] border-slate-300 rounded-sm shadow-none overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white py-4 px-6 shrink-0">
          <div className="flex items-center gap-2">
            <Award className="text-[#111111]" size={20} />
            <div>
              <h2 className="text-sm font-serif font-black text-[#111111] uppercase tracking-wider">Viva Voce Assessment</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Investigatory project 14</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-slate-100 rounded-sm text-slate-400 hover:text-[#111111] transition-all cursor-pointer"
          >
            <XCircle size={20} />
          </button>
        </div>

        {/* Quiz Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {!showResults ? (
            <div className="space-y-6">
              {/* Progress Indicator */}
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 tracking-wider">
                <span>QUESTION {currentQuestionIndex + 1} OF {quizQuestions.length}</span>
                <span className="text-slate-600 uppercase">CLASS 12 CBSE</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-[3px] bg-slate-100 rounded-none overflow-hidden">
                <div
                  className="h-full bg-[#111111] transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              <h3 className="text-sm md:text-base font-serif font-bold text-[#111111] leading-relaxed">
                {currentQuestion.question}
              </h3>

              {/* Options */}
              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options.map((opt) => {
                  const isSelected = userSelection === opt.key;
                  return (
                    <button
                      key={opt.key}
                      onClick={() => handleSelectOption(opt.key)}
                      className={`w-full p-4 text-left rounded-sm border-[0.5px] text-xs font-semibold transition-all cursor-pointer flex gap-3 items-center ${
                        isSelected
                          ? 'bg-[#111111] border-transparent text-[#FCFCFC] shadow-none'
                          : 'bg-white border-slate-200 text-[#1A1A1A] hover:bg-slate-50'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-sm flex items-center justify-center font-black text-[10px] border-[0.5px] uppercase shrink-0 ${
                        isSelected
                          ? 'bg-[#FCFCFC] text-[#111111] border-transparent'
                          : 'bg-[#FAFAFA] text-slate-500 border-slate-200'
                      }`}>
                        {opt.key}
                      </span>
                      <span>{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Score summary */}
              <div className="text-center py-8 bg-[#FAFAFA] rounded-sm border-[0.5px] border-slate-200 space-y-3">
                <div className="inline-flex p-3 bg-white border-[0.5px] border-slate-200 text-[#111111] rounded-sm">
                  <Award size={36} />
                </div>
                <h3 className="text-base md:text-lg font-serif font-black text-[#111111] uppercase tracking-wider">Evaluation Completed</h3>
                <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">
                  You scored <span className="text-[#111111] text-sm font-black">{quizScore}</span> out of {quizQuestions.length}
                </p>
                <div className="text-[10px] text-slate-500 font-bold uppercase">
                  {quizScore === quizQuestions.length ? 'Excellent Work! 100% Correct' : quizScore && quizScore >= 3 ? 'Good job, Viva Voce Cleared!' : 'Review the explanations below and try again.'}
                </div>
              </div>

              {/* Explanations review scroll */}
              <div className="space-y-4">
                <h4 className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Review Answers</h4>
                
                {quizQuestions.map((q, idx) => {
                  const userAns = selectedAnswers[q.id];
                  const isCorrect = userAns === q.correctAnswer;
                  
                  return (
                    <div key={q.id} className="p-5 bg-white border-[0.5px] border-slate-250 rounded-sm space-y-3">
                      <div className="flex justify-between items-start gap-3">
                        <div className="text-xs font-serif font-bold text-[#111111] leading-relaxed">
                          {idx + 1}. {q.question}
                        </div>
                        {isCorrect ? (
                          <span className="flex items-center gap-1 py-0.5 px-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-sm font-black text-[9px] uppercase shrink-0">
                            <Check size={10} /> Correct
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 py-0.5 px-2 bg-rose-50 text-rose-800 border border-rose-200 rounded-sm font-black text-[9px] uppercase shrink-0">
                            <X size={10} /> Incorrect
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-[#1A1A1A] font-medium leading-relaxed">
                        • <span className="font-bold text-slate-550">Your answer:</span> {q.options.find(o => o.key === userAns)?.text || 'No answer'} <br/>
                        • <span className="font-bold text-emerald-700">Correct answer:</span> {q.options.find(o => o.key === q.correctAnswer)?.text}
                      </div>

                      <div className="p-3 bg-[#FAFAFA] rounded-sm text-[10px] text-slate-600 leading-normal border-[0.5px] border-slate-200">
                        <span className="font-bold text-[#111111] uppercase tracking-wider text-[8px] block mb-0.5">Explanation</span>
                        {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="border-t border-slate-200 bg-white p-6 flex items-center justify-between shrink-0">
          {!showResults ? (
            <>
              <button
                disabled={currentQuestionIndex === 0}
                onClick={handlePrev}
                className="py-2 px-4 border-[0.5px] border-slate-300 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent text-slate-600 hover:text-[#111111] rounded-sm text-xs font-bold transition-all cursor-pointer"
              >
                Back
              </button>

              <button
                disabled={!userSelection}
                onClick={handleNext}
                className={`py-2 px-5 rounded-sm text-xs font-bold text-white transition-all cursor-pointer ${
                  userSelection
                    ? 'bg-[#111111] hover:bg-[#222222]'
                    : 'bg-slate-100 text-slate-400 border-[0.5px] border-slate-200 cursor-not-allowed'
                }`}
              >
                {currentQuestionIndex === quizQuestions.length - 1 ? 'Finish & Grade' : 'Next Question'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setSelectedAnswers({});
                  setCurrentQuestionIndex(0);
                  setShowResults(false);
                  resetLab();
                }}
                className="flex items-center gap-1.5 py-2 px-4 border-[0.5px] border-slate-350 hover:bg-slate-50 text-[#111111] rounded-sm text-xs font-bold transition-all cursor-pointer"
              >
                <RefreshCw size={13} />
                Retake Assessment
              </button>

              <button
                onClick={handleClose}
                className="py-2 px-6 bg-[#111111] hover:bg-[#222222] text-[#FCFCFC] text-xs font-bold rounded-sm transition-all cursor-pointer"
              >
                Close
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
