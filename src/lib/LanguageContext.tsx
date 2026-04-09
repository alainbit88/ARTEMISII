import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'es';

interface Translations {
  mission: string;
  artemisII: string;
  distEarth: string;
  distMoon: string;
  velocity: string;
  status: string;
  initializing: string;
  lastUpdate: string;
  clickToUpdate: string;
  nasaMissionControl: string;
  currentMissionPhase: string;
  transLunarInjection: string;
  spacecraftVisual: string;
  orionCapsule: string;
  externalView: string;
  earthRelative: string;
  lunarRelative: string;
  signalLatency: string;
  gravitationalPull: string;
  telemetry: string;
  safety: string;
  privacy: string;
  operator: string;
  logout: string;
  signInGoogle: string;
  accessMissionControl: string;
  secureAccess: string;
  liveTrajectoryMap: string;
}

const translations: Record<Language, Translations> = {
  en: {
    mission: "Mission",
    artemisII: "Artemis II",
    distEarth: "Distance from Earth",
    distMoon: "Distance from Moon",
    velocity: "Velocity",
    status: "Status",
    initializing: "Initializing...",
    lastUpdate: "Last Update",
    clickToUpdate: "Click to update",
    nasaMissionControl: "NASA Mission Control",
    currentMissionPhase: "Current Mission Phase",
    transLunarInjection: "Trans-Lunar Injection",
    spacecraftVisual: "Spacecraft Visual",
    orionCapsule: "ORION CAPSULE",
    externalView: "External View Cam 01",
    earthRelative: "Earth Relative",
    lunarRelative: "Lunar Relative",
    signalLatency: "Signal Latency",
    gravitationalPull: "Gravitational Pull",
    telemetry: "Telemetry",
    safety: "Safety",
    privacy: "Privacy",
    operator: "Operator",
    logout: "Logout",
    signInGoogle: "Sign in with Google",
    accessMissionControl: "Sign in with Google to access the mission control dashboard and track Orion's journey.",
    secureAccess: "Secure Mission Control Access",
    liveTrajectoryMap: "Live Trajectory Map"
  },
  es: {
    mission: "Misión",
    artemisII: "Artemis II",
    distEarth: "Distancia desde la Tierra",
    distMoon: "Distancia desde la Luna",
    velocity: "Velocidad",
    status: "Estado",
    initializing: "Inicializando...",
    lastUpdate: "Última actualización",
    clickToUpdate: "Clic para actualizar",
    nasaMissionControl: "Control de Misión NASA",
    currentMissionPhase: "Fase Actual de la Misión",
    transLunarInjection: "Inyección Trans-Lunar",
    spacecraftVisual: "Visual de la Nave",
    orionCapsule: "CÁPSULA ORION",
    externalView: "Vista Externa Cam 01",
    earthRelative: "Relativo a la Tierra",
    lunarRelative: "Relativo a la Luna",
    signalLatency: "Latencia de Señal",
    gravitationalPull: "Atracción Gravitacional",
    telemetry: "Telemetría",
    safety: "Seguridad",
    privacy: "Privacidad",
    operator: "Operador",
    logout: "Cerrar sesión",
    signInGoogle: "Iniciar sesión con Google",
    accessMissionControl: "Inicia sesión con Google para acceder al panel de control de la misión y rastrear el viaje de Orion.",
    secureAccess: "Acceso Seguro a Control de Misión",
    liveTrajectoryMap: "Mapa de Trayectoria en Vivo"
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
