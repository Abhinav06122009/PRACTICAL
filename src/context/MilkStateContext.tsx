import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { playClickSound, playPourSound } from '../utils/audio';

export interface MilkObservationLog {
  trialNo: number;
  milkSource: string;
  milkVolume: number;
  caseinYield: number; // in grams
  caseinPercentage: number;
  wheyProteinTest: string; // e.g. "Coagulated on Boiling"
}

interface MilkState {
  step: number;
  setStep: (step: number) => void;

  // Configuration state
  milkSource: 'cow' | 'buffalo' | 'goat';
  setMilkSource: (source: 'cow' | 'buffalo' | 'goat') => void;
  milkVolume: number; // in ml, default 20ml
  setMilkVolume: (vol: number) => void;
  
  // Phase 1/2: Coagulation
  reagent: 'none' | 'acid' | 'rennin';
  setReagent: (reagent: 'none' | 'acid' | 'rennin') => void;
  renninAdded: boolean; // mapped to reagent !== 'none'
  addRennin: () => void; // legacy handler (adds rennin)
  addAcid: () => void; // adds acetic acid
  temperature: number; // room temp ~25C, heats to ~50C
  isBurnerOn: boolean;
  setIsBurnerOn: (on: boolean) => void;
  coagulationProgress: number; // 0 to 100%
  
  // Phase 3: Filtration
  isFiltering: boolean;
  filtrationProgress: number; // 0 to 100%
  startFiltration: () => void;
  wheyVolume: number; // collected whey in ml
  
  // Phase 4: Whey Heat Coagulation (was Millon's Test)
  pipettedWhey: boolean; // has pipetted whey into test tube
  pipetteWheyToTube: () => void;
  millonsDrops: number; // mapped to whether test tube is ready for heat
  addMillonsReagent: () => void; // legacy handler
  testTubeTemp: number; // room temp ~25C, heats to ~95C (boiling)
  isTestTubeBurnerOn: boolean;
  setIsTestTubeBurnerOn: (on: boolean) => void;
  testProgress: number; // coagulation of whey protein: 0 to 100%
  proteinTestColor: string; // visual opacity representation
  
  // Log / Observation
  logs: MilkObservationLog[];
  addLog: () => void;
  clearLogs: () => void;
  
  // Student inputs for verification
  studentCaseinWt: string;
  setStudentCaseinWt: (val: string) => void;
  studentCaseinPct: string;
  setStudentCaseinPct: (val: string) => void;
  isCalculationCorrect: boolean | null;
  verifyCalculation: () => void;
  errorMessage: string | null;

  // Quiz state
  isQuizActive: boolean;
  setIsQuizActive: (active: boolean) => void;
  quizSubmitted: boolean;
  quizScore: number | null;
  submitQuiz: (answers: Record<number, string>) => void;
  
  resetLab: () => void;
}

const MilkStateContext = createContext<MilkState | undefined>(undefined);

export const MilkStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [step, setStep] = useState<number>(1);
  const [milkSource, setMilkSource] = useState<'cow' | 'buffalo' | 'goat'>('cow');
  const [milkVolume, setMilkVolume] = useState<number>(20);
  
  const [reagent, setReagent] = useState<'none' | 'acid' | 'rennin'>('none');
  const [temperature, setTemperature] = useState<number>(25.0);
  const [isBurnerOn, setIsBurnerOn] = useState<boolean>(false);
  const [coagulationProgress, setCoagulationProgress] = useState<number>(0);
  
  const [isFiltering, setIsFiltering] = useState<boolean>(false);
  const [filtrationProgress, setFiltrationProgress] = useState<number>(0);
  const [wheyVolume, setWheyVolume] = useState<number>(0);
  
  const [pipettedWhey, setPipettedWhey] = useState<boolean>(false);
  const [millonsDrops, setMillonsDrops] = useState<number>(0); // will use to step-gate
  const [testTubeTemp, setTestTubeTemp] = useState<number>(25.0);
  const [isTestTubeBurnerOn, setIsTestTubeBurnerOn] = useState<boolean>(false);
  const [testProgress, setTestProgress] = useState<number>(0);
  
  const [logs, setLogs] = useState<MilkObservationLog[]>([]);
  
  // Student Inputs
  const [studentCaseinWt, setStudentCaseinWt] = useState<string>('');
  const [studentCaseinPct, setStudentCaseinPct] = useState<string>('');
  const [isCalculationCorrect, setIsCalculationCorrect] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Quiz
  const [isQuizActive, setIsQuizActive] = useState<boolean>(false);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  
  const burnerTimerRef = useRef<number | null>(null);
  const filtrationTimerRef = useRef<number | null>(null);
  const tubeBurnerTimerRef = useRef<number | null>(null);

  const tempRef = useRef<number>(25.0);
  const testTubeTempRef = useRef<number>(25.0);

  useEffect(() => {
    tempRef.current = temperature;
  }, [temperature]);

  useEffect(() => {
    testTubeTempRef.current = testTubeTemp;
  }, [testTubeTemp]);

  // Expected values based on chemistry formulas
  const getExpectedCaseinWt = (source: 'cow' | 'buffalo' | 'goat', vol: number): number => {
    if (source === 'cow') return parseFloat((vol * 0.025).toFixed(2));
    if (source === 'buffalo') return parseFloat((vol * 0.038).toFixed(2));
    return parseFloat((vol * 0.030).toFixed(2)); // goat
  };
  
  const getExpectedCaseinPct = (source: 'cow' | 'buffalo' | 'goat'): number => {
    if (source === 'cow') return 2.5;
    if (source === 'buffalo') return 3.8;
    return 3.0; // goat
  };

  // Coagulation heating kinetics (main beaker)
  useEffect(() => {
    if (isBurnerOn && step === 2) {
      burnerTimerRef.current = window.setInterval(() => {
        setTemperature(prev => {
          // Heat up to 85°C limit
          const nextTemp = Math.min(85.0, prev + 1.2);
          if (nextTemp >= 85.0) {
            setIsBurnerOn(false);
          }
          return parseFloat(nextTemp.toFixed(1));
        });
      }, 100);
    } else {
      if (burnerTimerRef.current) {
        clearInterval(burnerTimerRef.current);
      }
    }
    return () => {
      if (burnerTimerRef.current) clearInterval(burnerTimerRef.current);
    };
  }, [isBurnerOn, step]);

  // Coagulation visual progress
  useEffect(() => {
    if (step === 2 && reagent !== 'none') {
      const interval = setInterval(() => {
        const currentTemp = tempRef.current;
        const isTempValid = reagent === 'acid' || (currentTemp >= 35.0 && currentTemp <= 50.0);
        
        if (isTempValid) {
          setCoagulationProgress(prev => {
            const next = Math.min(100, prev + 10);
            if (next >= 100) {
              clearInterval(interval);
            }
            return next;
          });
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [step, reagent]);

  // Beaker cooling kinetics
  useEffect(() => {
    if (!isBurnerOn && temperature > 25.0 && step === 2) {
      const interval = setInterval(() => {
        setTemperature(prev => {
          const next = Math.max(25.0, prev - 1.5);
          return parseFloat(next.toFixed(1));
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isBurnerOn, step, temperature]);

  // Filtration kinetics
  useEffect(() => {
    if (isFiltering && step === 3) {
      filtrationTimerRef.current = window.setInterval(() => {
        setFiltrationProgress(prev => {
          const next = Math.min(100, prev + 2.5);
          if (next >= 100) {
            setIsFiltering(false);
            setWheyVolume(parseFloat((milkVolume * 0.75).toFixed(1))); // ~75% volume collected as whey
            if (filtrationTimerRef.current) clearInterval(filtrationTimerRef.current);
          }
          return next;
        });
      }, 100);
    }
    return () => {
      if (filtrationTimerRef.current) clearInterval(filtrationTimerRef.current);
    };
  }, [isFiltering, step, milkVolume]);

  // Test tube boiling kinetics (Whey Heat Coagulation)
  useEffect(() => {
    if (isTestTubeBurnerOn && step === 4) {
      tubeBurnerTimerRef.current = window.setInterval(() => {
        setTestTubeTemp(prev => {
          const nextTemp = Math.min(95.0, prev + 1.8);
          if (nextTemp >= 95.0) {
            setIsTestTubeBurnerOn(false);
          }
          return parseFloat(nextTemp.toFixed(1));
        });
      }, 100);
    } else {
      if (tubeBurnerTimerRef.current) clearInterval(tubeBurnerTimerRef.current);
    }
    return () => {
      if (tubeBurnerTimerRef.current) clearInterval(tubeBurnerTimerRef.current);
    };
  }, [isTestTubeBurnerOn, step]);

  // Test tube cooling kinetics
  useEffect(() => {
    if (!isTestTubeBurnerOn && testTubeTemp > 25.0 && step === 4) {
      const interval = setInterval(() => {
        setTestTubeTemp(prev => {
          const next = Math.max(25.0, prev - 2.0);
          return parseFloat(next.toFixed(1));
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isTestTubeBurnerOn, step, testTubeTemp]);

  // Whey denaturation (cloudiness) on boiling (>70°C)
  useEffect(() => {
    if (step === 4 && pipettedWhey) {
      const interval = setInterval(() => {
        if (testTubeTempRef.current >= 70.0) {
          setTestProgress(prev => {
            const next = Math.min(100, prev + 4.0);
            if (next >= 100) {
              clearInterval(interval);
            }
            return next;
          });
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [step, pipettedWhey]);

  const addRennin = () => {
    playClickSound();
    setReagent('rennin');
  };

  const addAcid = () => {
    playClickSound();
    setReagent('acid');
  };

  const startFiltration = () => {
    playPourSound();
    setIsFiltering(true);
  };

  const pipetteWheyToTube = () => {
    playPourSound();
    setPipettedWhey(true);
    setMillonsDrops(1); // Set to 1 to gate the step UI
  };

  const addMillonsReagent = () => {
    // Legacy handler, just plays sound
    playClickSound();
  };

  const addLog = () => {
    playClickSound();
    const parsedWt = parseFloat(studentCaseinWt);
    const parsedPct = parseFloat(studentCaseinPct);
    const caseinWt = !isNaN(parsedWt) ? parsedWt : getExpectedCaseinWt(milkSource, milkVolume);
    const caseinPct = !isNaN(parsedPct) ? parsedPct : getExpectedCaseinPct(milkSource);
    const sourceName = milkSource.toUpperCase() + ' MILK';

    const newLog: MilkObservationLog = {
      trialNo: logs.length + 1,
      milkSource: sourceName,
      milkVolume,
      caseinYield: caseinWt,
      caseinPercentage: caseinPct,
      wheyProteinTest: 'Coagulated on Boiling'
    };
    setLogs(prev => [...prev, newLog]);
  };

  const clearLogs = () => {
    playClickSound();
    setLogs([]);
  };

  const verifyCalculation = () => {
    playClickSound();
    const parsedWt = parseFloat(studentCaseinWt);
    const parsedPct = parseFloat(studentCaseinPct);
    
    if (isNaN(parsedWt) || isNaN(parsedPct)) {
      setErrorMessage("Please enter valid numeric values for both fields.");
      setIsCalculationCorrect(false);
      return;
    }

    const expectedWt = getExpectedCaseinWt(milkSource, milkVolume);
    const expectedPct = getExpectedCaseinPct(milkSource);

    const wtCorrect = Math.abs(parsedWt - expectedWt) < 0.05;
    const pctCorrect = Math.abs(parsedPct - expectedPct) < 0.1;

    if (wtCorrect && pctCorrect) {
      setIsCalculationCorrect(true);
      setErrorMessage(null);
    } else {
      setIsCalculationCorrect(false);
      if (!wtCorrect) {
        setErrorMessage(`Incorrect weight. Casein content is calculated as: Volume (${milkVolume} ml) × caseous protein percentage (${expectedPct}%). Hint: ${expectedWt}g`);
      } else {
        setErrorMessage(`Incorrect percentage. Casein percentage is weight of casein divided by volume of milk × 100. Hint: ${expectedPct}%`);
      }
    }
  };

  // Get color for test tube liquid (whey becomes cloudy white upon boiling)
  const getProteinTestColor = () => {
    if (!pipettedWhey) return 'rgba(255,255,255,0)'; // empty
    
    // As temperature rises above 70°C, the liquid transitions from a pale yellow-blue whey to a thick cloudy white precipitate
    const mixFactor = testProgress / 100; // 0 to 1
    
    // Pale translucent yellow: rgba(245, 240, 220, 0.4)
    // Cloudy white precipitate: rgba(245, 245, 245, 0.95)
    const r = Math.round(245 + (245 - 245) * mixFactor);
    const g = Math.round(240 + (245 - 240) * mixFactor);
    const b = Math.round(220 + (245 - 220) * mixFactor);
    const a = 0.4 + (0.55 * mixFactor);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };

  const submitQuiz = (answers: Record<number, string>) => {
    const answersKey: Record<number, string> = {
      1: 'a', // Casein
      2: 'c', // Rennin
      3: 'b', // Lactalbumin and lactoglobulin
      4: 'b', // Cloudy precipitate on boiling
      5: 'a'  // Phosphoprotein
    };

    let score = 0;
    Object.keys(answersKey).forEach(qKey => {
      const qNum = parseInt(qKey);
      if (answers[qNum] === answersKey[qNum]) {
        score++;
      }
    });

    setQuizScore(score);
    setQuizSubmitted(true);
  };

  const resetLab = () => {
    setStep(1);
    setReagent('none');
    setTemperature(25.0);
    setIsBurnerOn(false);
    setCoagulationProgress(0);
    setIsFiltering(false);
    setFiltrationProgress(0);
    setWheyVolume(0);
    setPipettedWhey(false);
    setMillonsDrops(0);
    setTestTubeTemp(25.0);
    setIsTestTubeBurnerOn(false);
    setTestProgress(0);
    setStudentCaseinWt('');
    setStudentCaseinPct('');
    setIsCalculationCorrect(null);
    setErrorMessage(null);
    setQuizSubmitted(false);
    setQuizScore(null);
  };

  return (
    <MilkStateContext.Provider
      value={{
        step, setStep,
        milkSource, setMilkSource,
        milkVolume, setMilkVolume,
        reagent, setReagent,
        renninAdded: reagent !== 'none',
        addRennin,
        addAcid,
        temperature,
        isBurnerOn, setIsBurnerOn,
        coagulationProgress,
        isFiltering,
        filtrationProgress, startFiltration,
        wheyVolume,
        pipettedWhey, pipetteWheyToTube,
        millonsDrops, addMillonsReagent,
        testTubeTemp,
        isTestTubeBurnerOn, setIsTestTubeBurnerOn,
        testProgress,
        proteinTestColor: getProteinTestColor(),
        logs, addLog, clearLogs,
        studentCaseinWt, setStudentCaseinWt,
        studentCaseinPct, setStudentCaseinPct,
        isCalculationCorrect, verifyCalculation,
        errorMessage,
        isQuizActive, setIsQuizActive,
        quizSubmitted, quizScore, submitQuiz,
        resetLab
      }}
    >
      {children}
    </MilkStateContext.Provider>
  );
};

export const useMilkState = () => {
  const context = useContext(MilkStateContext);
  if (!context) throw new Error("useMilkState must be used within a MilkStateProvider");
  return context;
};
