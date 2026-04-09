import { useState, useEffect } from 'react';
import SpaceBackground from './components/SpaceBackground';
import MissionDashboard from './components/MissionDashboard';
import TrajectoryMap from './components/TrajectoryMap';
import AuthOverlay from './components/AuthOverlay';
import { fetchArtemisData, ArtemisData } from './services/geminiService';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from './lib/AuthContext';
import { db, handleFirestoreError, OperationType } from './lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useLanguage } from './lib/LanguageContext';
import { Languages } from 'lucide-react';

export default function App() {
  const [data, setData] = useState<ArtemisData | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading, login, logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();

  const handleUpdate = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const newData = await fetchArtemisData();
      setData(newData);
      
      const telemetryPath = 'telemetry';
      try {
        await addDoc(collection(db, telemetryPath), {
          userId: user.uid,
          distanceFromEarth: newData.distanceFromEarth,
          distanceFromMoon: newData.distanceFromMoon,
          velocity: newData.velocity,
          status: newData.status,
          timestamp: serverTimestamp(),
          coordinates: newData.coordinates,
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, telemetryPath);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && !data) {
      handleUpdate();
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white selection:bg-orange-500/30">
      <SpaceBackground />
      
      <AnimatePresence>
        {!user && (
          <AuthOverlay onLogin={login} />
        )}
      </AnimatePresence>

      <main className="relative z-10 max-w-7xl mx-auto p-6 lg:p-12 min-h-screen flex flex-col">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 mb-2"
            >
              <span className="w-8 h-[1px] bg-orange-500" />
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-orange-500">{t.nasaMissionControl}</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-bold tracking-tighter"
            >
              ARTEMIS <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">II</span>
            </motion.h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 md:gap-6">
            {/* Language Selector */}
            <div className="flex items-center gap-2 bg-white/5 p-1 rounded-full border border-white/10">
              <div className="p-2 text-white/40">
                <Languages className="w-4 h-4" />
              </div>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all ${language === 'en' ? 'bg-orange-500 text-white' : 'text-white/40 hover:text-white'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('es')}
                className={`px-3 py-1 text-[10px] font-bold rounded-full transition-all ${language === 'es' ? 'bg-orange-500 text-white' : 'text-white/40 hover:text-white'}`}
              >
                ES
              </button>
            </div>

            {user && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-4 bg-white/5 p-2 pr-4 rounded-full border border-white/10"
              >
                <img src={user.photoURL || ''} alt={user.displayName || ''} className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{t.operator}</span>
                  <span className="text-xs font-bold">{user.displayName}</span>
                </div>
                <button onClick={logout} className="ml-2 text-[10px] font-mono text-orange-500 hover:text-orange-400 uppercase tracking-widest">{t.logout}</button>
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-right hidden xl:block"
            >
              <p className="text-[10px] font-mono uppercase tracking-widest text-white/30">{t.currentMissionPhase}</p>
              <p className="text-sm font-bold text-white/80">{t.transLunarInjection}</p>
            </motion.div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
          <div className="lg:col-span-1">
            <MissionDashboard data={data} loading={loading} onUpdate={handleUpdate} />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 p-6 bg-white/5 border border-white/5 rounded-3xl"
            >
              <h3 className="text-xs font-mono uppercase tracking-widest text-white/40 mb-4">{t.spacecraftVisual}</h3>
              <div className="aspect-video rounded-2xl overflow-hidden bg-black/40 border border-white/10 relative group">
                <img
                  src="/orion.svg"
                  alt="Orion Spacecraft"
                  className="w-full h-full object-contain p-8 opacity-60 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-white/5 to-transparent"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-xs font-bold">{t.orionCapsule}</p>
                  <p className="text-[10px] text-white/40">{t.externalView}</p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-8">
            <TrajectoryMap data={data} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-white/5 border border-white/5 rounded-3xl">
                <h3 className="text-xs font-mono uppercase tracking-widest text-white/40 mb-2">{t.earthRelative}</h3>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold">1.2s</span>
                  <span className="text-[10px] text-white/20 mb-1">{t.signalLatency}</span>
                </div>
              </div>
              <div className="p-6 bg-white/5 border border-white/5 rounded-3xl">
                <h3 className="text-xs font-mono uppercase tracking-widest text-white/40 mb-2">{t.lunarRelative}</h3>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold">0.8g</span>
                  <span className="text-[10px] text-white/20 mb-1">{t.gravitationalPull}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">
          <p>© 2026 NASA ARTEMIS PROGRAM</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">{t.telemetry}</a>
            <a href="#" className="hover:text-white transition-colors">{t.safety}</a>
            <a href="#" className="hover:text-white transition-colors">{t.privacy}</a>
          </div>
        </footer>
      </main>
    </div>
  );
}
