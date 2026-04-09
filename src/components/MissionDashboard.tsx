import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Rocket, Globe, Moon, Zap, RefreshCw, AlertCircle } from 'lucide-react';
import { ArtemisData } from '../services/geminiService';
import { cn } from '../lib/utils';
import { useLanguage } from '../lib/LanguageContext';

interface MissionDashboardProps {
  data: ArtemisData | null;
  loading: boolean;
  onUpdate: () => void;
}

export default function MissionDashboard({ data, loading, onUpdate }: MissionDashboardProps) {
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex flex-col gap-6 p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl w-full max-w-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/20 rounded-lg">
            <Rocket className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h2 className="text-sm font-mono uppercase tracking-widest text-white/50">{t.mission}</h2>
            <h1 className="text-xl font-bold text-white">{t.artemisII}</h1>
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={onUpdate}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            disabled={loading}
            className={cn(
              "p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all active:scale-95 relative z-10",
              loading && "animate-spin"
            )}
          >
            <RefreshCw className="w-5 h-5 text-white" />
          </button>

          <AnimatePresence>
            {!loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 10 }}
                className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap"
              >
                <div className="bg-orange-500 text-white px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-orange-500/20">
                  {isHovered ? (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {t.clickToUpdate}
                    </motion.span>
                  ) : (
                    <AlertCircle className="w-3 h-3" />
                  )}
                </div>
                {/* Tooltip arrow */}
                <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-orange-500 rotate-45" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <StatCard
          icon={<Globe className="w-4 h-4" />}
          label={t.distEarth}
          value={data ? `${data.distanceFromEarth.toLocaleString()} km` : '---'}
          color="text-blue-400"
        />
        <StatCard
          icon={<Moon className="w-4 h-4" />}
          label={t.distMoon}
          value={data ? `${data.distanceFromMoon.toLocaleString()} km` : '---'}
          color="text-gray-400"
        />
        <StatCard
          icon={<Zap className="w-4 h-4" />}
          label={t.velocity}
          value={data ? `${data.velocity.toLocaleString()} km/h` : '---'}
          color="text-orange-400"
        />
      </div>

      <div className="pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider">
          <span className="text-white/40">{t.status}</span>
          <span className={cn(
            "px-2 py-0.5 rounded bg-white/5",
            data?.status.toLowerCase().includes('active') ? "text-green-400" : "text-orange-400"
          )}>
            {data?.status || t.initializing}
          </span>
        </div>
        <div className="mt-2 text-[10px] font-mono text-white/20 text-right">
          {t.lastUpdate}: {data ? new Date(data.timestamp).toLocaleString(undefined, {
            dateStyle: 'short',
            timeStyle: 'short'
          }) : '---'}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4"
    >
      <div className={cn("p-2 rounded-xl bg-white/5", color)}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-mono uppercase tracking-wider text-white/40">{label}</p>
        <p className="text-lg font-bold text-white">{value}</p>
      </div>
    </motion.div>
  );
}
