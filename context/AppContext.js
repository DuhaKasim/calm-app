import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  // Accessibility settings
  const [dyslexiaMode, setDyslexiaMode] = useState(false);
  const [textSize, setTextSize] = useState("medium"); // small | medium | large
  const [readAloud, setReadAloud] = useState(true);
  const [autoCaptions, setAutoCaptions] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [visualSafetyFilter, setVisualSafetyFilter] = useState(false);

  // Session state
  const [currentSession, setCurrentSession] = useState(null);
  // currentSession: { intention, tag, duration, postCount }

  const textSizeMap = {
    small: 13,
    medium: 15,
    large: 18,
  };

  const fontSize = textSizeMap[textSize];
  const fontFamily = dyslexiaMode ? "OpenDyslexic" : undefined;

  return (
    <AppContext.Provider
      value={{
        dyslexiaMode,
        setDyslexiaMode,
        textSize,
        setTextSize,
        readAloud,
        setReadAloud,
        autoCaptions,
        setAutoCaptions,
        reduceMotion,
        setReduceMotion,
        playbackSpeed,
        setPlaybackSpeed,
        visualSafetyFilter,
        setVisualSafetyFilter,
        currentSession,
        setCurrentSession,
        fontSize,
        fontFamily,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
