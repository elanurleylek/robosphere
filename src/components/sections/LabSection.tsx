// src/components/sections/LabSection.tsx
'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import RobotSimulation from '@/components/RobotSimulation';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Play, Square, Maximize, Minimize, Loader2 } from 'lucide-react';


const LabSection: React.FC = () => {
  const [leftShoulderAngle, setLeftShoulderAngle] = useState(0);
  const [rightShoulderAngle, setRightShoulderAngle] = useState(0);
  const [leftArmAngle, setLeftArmAngle] = useState(0);
  const [animationCommand, setAnimationCommand] = useState<string | null>(null);
  const [animationNames, setAnimationNames] = useState<string[]>([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const simulationContainerRef = useRef<HTMLDivElement>(null);
  const [isSimulationLoading, setIsSimulationLoading] = useState(true);

  const handleAnimationsLoaded = useCallback((names: string[]) => {
    setAnimationNames(names);
    setIsSimulationLoading(false);
  }, []);

  const handlePlayAnimation = (animationName: string) => { setAnimationCommand(animationName); setTimeout(() => setAnimationCommand(null), 100); };
  const handleStopAnimations = () => { setAnimationCommand("STOP_ALL"); setTimeout(() => setAnimationCommand(null), 100); };

  const renderAngleControl = useCallback((
    id: string, label: string, value: number, setValue: (newValue: number) => void,
    min: number = -Math.PI / 2, max: number = Math.PI / 2, step: number = 0.01
  ) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</Label>
        <span className="text-xs text-gray-500 dark:text-gray-400">{ (value * 180 / Math.PI).toFixed(0) }°</span>
      </div>
      <Slider id={id} value={[value]} onValueChange={(val) => setValue(val[0])} min={min} max={max} step={step} />
    </div>
  ), []);

  const toggleFullScreen = () => {
    const elem = simulationContainerRef.current; if (!elem) return;
    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) { elem.requestFullscreen().catch(err => { alert(`Tam ekran hatası: ${err.message}`); }); }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      else if ((elem as any).mozRequestFullScreen) { (elem as any).mozRequestFullScreen(); }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      else if ((elem as any).webkitRequestFullscreen) { (elem as any).webkitRequestFullscreen(); }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      else if ((elem as any).msRequestFullscreen) { (elem as any).msRequestFullscreen(); }
    } else { if (document.exitFullscreen) { document.exitFullscreen(); } }
  };

  useEffect(() => {
    const handleFullScreenChange = () => { setIsFullScreen(!!document.fullscreenElement); };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
    document.addEventListener('mozfullscreenchange', handleFullScreenChange);
    document.addEventListener('MSFullscreenChange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullScreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullScreenChange);
    };
  }, []);

  useEffect(() => {
    // Simülasyonun yüklendiğini varsayalım veya RobotSimulation'dan loading state'i alın.
    // handleAnimationsLoaded zaten loading'i false yapıyor. İlk başta true başlatmıştık.
  }, []);


  return (
    <section id="lab-section" className="py-12 bg-gray-50 dark:bg-gray-900">
       <div className="container mx-auto flex flex-col items-center px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 text-center mb-6">Robotik Lab Ortamı</h2>
            <p className="text-md text-gray-600 dark:text-gray-300 text-center mb-10">Sanal robotları kontrol edin ve deneyler yapın!</p>

            <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8">
                <div
                ref={simulationContainerRef}
                className={`lg:flex-grow lg:w-2/3 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden relative
                            ${isFullScreen ? 'fixed inset-0 z-[9999] w-screen h-screen !max-w-none !rounded-none' : ''}`}
                >
                    {isSimulationLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-gray-800/80 z-10">
                            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                            <p className="text-gray-700 dark:text-gray-300">Simülasyon Yükleniyor...</p>
                        </div>
                    )}
                    <RobotSimulation
                        leftShoulderAngle={leftShoulderAngle}
                        rightShoulderAngle={rightShoulderAngle}
                        leftArmAngle={leftArmAngle}
                        animationCommand={animationCommand}
                        onAnimationsLoaded={handleAnimationsLoaded}
                    />
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={toggleFullScreen}
                        className={`absolute top-2 right-2 z-[10000] bg-background/70 hover:bg-background/90`}
                        title={isFullScreen ? "Tam Ekrandan Çık" : "Tam Ekran"}
                    >
                        {isFullScreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                    </Button>
                </div>

                <div
                className={`lg:w-1/3 lg:max-w-xs w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg
                            ${isFullScreen ? 'hidden' : ''}`}
                >
                    <h3 className="text-xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-100">Kontroller</h3>
                    <div className="space-y-6">
                        {renderAngleControl( "left-shoulder", "Sol Omuz (Y Ekseni)", leftShoulderAngle, setLeftShoulderAngle )}
                        {renderAngleControl( "right-shoulder", "Sağ Omuz (Y Ekseni)", rightShoulderAngle, setRightShoulderAngle )}
                        {renderAngleControl( "left-arm", "Sol Kol/Dirsek (X Ekseni)", leftArmAngle, setLeftArmAngle, 0, Math.PI * 0.75 )}

                        {animationNames.length > 0 && (
                            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                <h4 className="text-md font-semibold mb-3 text-gray-700 dark:text-gray-300">Animasyonlar</h4>
                                <div className="space-y-2">
                                    {animationNames.map((name) => (
                                        <Button
                                            key={name}
                                            variant="outline"
                                            className="w-full justify-start gap-2"
                                            onClick={() => handlePlayAnimation(name)}
                                            disabled={isSimulationLoading}
                                        >
                                            <Play className="h-4 w-4" /> {name || "Adsız Animasyon"}
                                        </Button>
                                    ))}
                                    <Button
                                        variant="destructive"
                                        className="w-full justify-start gap-2"
                                        onClick={handleStopAnimations}
                                        disabled={isSimulationLoading}
                                    >
                                        <Square className="h-4 w-4" /> Tümünü Durdur
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};

export default LabSection;