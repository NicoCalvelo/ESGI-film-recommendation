"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface SpoilerWrapperProps {
  title: string;
  accentTextClass: string;
  accentButtonBg: string;
  children: React.ReactNode;
}

export default function SpoilerWrapper({
  title,
  accentTextClass,
  accentButtonBg,
  children,
}: SpoilerWrapperProps) {
  const [isSpoilerFree, setIsSpoilerFree] = useState(false);
  const [isTemporarilyRevealed, setIsTemporarilyRevealed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("app_spoiler_free");
    // Default to true (spoiler-free mode ON by default to protect users)
    setIsSpoilerFree(saved === null ? true : saved === "true");
    setIsMounted(true);

    // Listen to storage changes in case of multi-tabs or other updates
    const handleStorage = () => {
      const updated = localStorage.getItem("app_spoiler_free");
      setIsSpoilerFree(updated === "true");
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const toggleGlobalSpoilerFree = () => {
    const nextVal = !isSpoilerFree;
    setIsSpoilerFree(nextVal);
    localStorage.setItem("app_spoiler_free", String(nextVal));
    // Dispatch a local storage event so other components on the page sync up
    window.dispatchEvent(new Event("storage"));
  };

  // Prevent hydration mismatch by rendering a placeholder layout if not mounted yet
  if (!isMounted) {
    return (
      <div className="mt-10">
        <h2 className={`${accentTextClass} text-xl font-semibold mb-3`}>{title}</h2>
        <div className="animate-pulse bg-gray-800/40 rounded-xl h-24" />
      </div>
    );
  }

  const showContent = !isSpoilerFree || isTemporarilyRevealed;

  return (
    <div className="mt-10 border border-white/5 bg-gray-900/40 rounded-2xl p-6 backdrop-blur-sm transition-all duration-300">
      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
        <h2 className={`${accentTextClass} text-xl font-semibold`}>{title}</h2>
        
        {/* Global Toggle Button */}
        <button
          onClick={toggleGlobalSpoilerFree}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
          title={isSpoilerFree ? "Désactiver le mode anti-spoilers" : "Activer le mode anti-spoilers"}
        >
          {isSpoilerFree ? (
            <>
              <EyeOff size={14} className="text-red-400" />
              <span>Anti-spoilers : Activé</span>
            </>
          ) : (
            <>
              <Eye size={14} className="text-gray-400" />
              <span>Anti-spoilers : Désactivé</span>
            </>
          )}
        </button>
      </div>

      {showContent ? (
        <div className="relative animate-fadeIn text-gray-300 text-sm leading-relaxed">
          {children}
          {isTemporarilyRevealed && isSpoilerFree && (
            <button
              onClick={() => setIsTemporarilyRevealed(false)}
              className="mt-3 text-xs text-gray-500 hover:text-gray-300 underline cursor-pointer"
            >
              Masquer à nouveau
            </button>
          )}
        </div>
      ) : (
        <div 
          onClick={() => setIsTemporarilyRevealed(true)}
          className="relative group cursor-pointer bg-gray-950/40 hover:bg-gray-950/60 border border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center gap-2 overflow-hidden transition-all duration-300 min-h-[100px]"
        >
          {/* Blurred preview of the text shape */}
          <div className="absolute inset-0 filter blur-md select-none opacity-20 p-6 flex flex-col gap-2 pointer-events-none">
            <div className="h-4 bg-gray-500 rounded w-full" />
            <div className="h-4 bg-gray-500 rounded w-11/12" />
            <div className="h-4 bg-gray-500 rounded w-10/12" />
          </div>

          <div className="relative z-10 flex flex-col items-center gap-2 text-center">
            <EyeOff size={24} className="text-gray-400 group-hover:scale-110 transition-transform duration-300" />
            <span className="text-sm font-semibold text-gray-200">
              Contenu masqué pour éviter les spoilers
            </span>
            <span className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
              Cliquer pour révéler le texte
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
