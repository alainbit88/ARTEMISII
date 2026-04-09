import { motion } from 'motion/react';
import { LogIn, Rocket } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

interface AuthOverlayProps {
  onLogin: () => void;
}

export default function AuthOverlay({ onLogin }: AuthOverlayProps) {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-black/40 border border-white/10 p-8 rounded-3xl text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-orange-500/20 rounded-full">
            <Rocket className="w-12 h-12 text-orange-500" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">{t.artemisII} Tracker</h1>
        <p className="text-white/40 mb-8">{t.accessMissionControl}</p>
        
        <button
          onClick={onLogin}
          className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-4 rounded-2xl hover:bg-white/90 transition-all active:scale-95"
        >
          <LogIn className="w-5 h-5" />
          {t.signInGoogle}
        </button>
        
        <p className="mt-6 text-[10px] font-mono text-white/20 uppercase tracking-widest">
          {t.secureAccess}
        </p>
      </motion.div>
    </div>
  );
}
