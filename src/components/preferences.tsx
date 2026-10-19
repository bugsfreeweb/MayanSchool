"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type ThemeName = "light" | "dark" | "kids" | "contrast";

export const themes: { id: ThemeName; name: string; english: string; description: string; swatches: string[] }[] = [
  { id: "light", name: "হালকা", english: "Light", description: "উজ্জ্বল, পরিচ্ছন্ন ও শান্ত পরিবেশ", swatches: ["#ffffff", "#7955b2", "#fafbf8"] },
  { id: "dark", name: "গাঢ়", english: "Dark", description: "সন্ধ্যায় চোখের আরামের জন্য", swatches: ["#171a1f", "#a98ad6", "#1e222a"] },
  { id: "kids", name: "শিশুদের", english: "Kids", description: "প্রাণবন্ত রঙে ভরা আনন্দময় থিম", swatches: ["#ffe9a8", "#f08b3a", "#8a4fd1"] },
  { id: "contrast", name: "উচ্চ-কনট্রাস্ট", english: "Contrast", description: "স্পষ্ট পড়ার সুবিধার্থে সর্বোচ্চ কনট্রাস্ট", swatches: ["#ffffff", "#000000", "#5a2ea6"] },
];

type Preferences = {
  collapsed: boolean; toggleSidebar: () => void;
  motion: boolean; toggleMotion: () => void;
  theme: ThemeName; setTheme: (theme: ThemeName) => void;
  voice: boolean; toggleVoice: () => void; setVoice: (on: boolean) => void;
};
const Context = createContext<Preferences>({ collapsed: false, toggleSidebar: () => {}, motion: true, toggleMotion: () => {}, theme: "light", setTheme: () => {}, voice: true, toggleVoice: () => {}, setVoice: () => {} });

const isTheme = (value: string | null): value is ThemeName => value === "light" || value === "dark" || value === "kids" || value === "contrast";

export function InterfacePreferences({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false), [motion, setMotion] = useState(true);
  const [theme, setThemeState] = useState<ThemeName>("light");
  const [voice, setVoiceState] = useState(true);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      try {
        setCollapsed(localStorage.getItem("mayan.sidebar") === "collapsed");
        setMotion(!media.matches && localStorage.getItem("mayan.motion") !== "off");
        const saved = localStorage.getItem("mayan.theme");
        setThemeState(isTheme(saved) ? saved : media.matches ? "contrast" : "light");
        setVoiceState(localStorage.getItem("mayan.voice") !== "off");
      } catch { setMotion(!media.matches); }
    };
    sync(); media.addEventListener("change", sync); window.addEventListener("storage", sync);
    return () => { media.removeEventListener("change", sync); window.removeEventListener("storage", sync); };
  }, []);
  useEffect(() => { document.documentElement.dataset.sidebar = collapsed ? "collapsed" : "expanded"; }, [collapsed]);
  useEffect(() => { document.documentElement.dataset.motion = motion ? "on" : "off"; }, [motion]);
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  useEffect(() => { document.documentElement.dataset.voice = voice ? "on" : "off"; }, [voice]);
  const toggleSidebar = () => { setCollapsed((previous) => { try { localStorage.setItem("mayan.sidebar", previous ? "expanded" : "collapsed"); } catch {} return !previous; }); };
  const toggleMotion = () => { setMotion((previous) => { try { localStorage.setItem("mayan.motion", previous ? "off" : "on"); } catch {} return !previous; }); };
  const setTheme = (next: ThemeName) => { setThemeState(next); try { localStorage.setItem("mayan.theme", next); } catch {} };
  const setVoice = (next: boolean) => { setVoiceState(next); try { localStorage.setItem("mayan.voice", next ? "on" : "off"); } catch {} };
  const toggleVoice = () => setVoice(!voice);
  return <Context.Provider value={{ collapsed, toggleSidebar, motion, toggleMotion, theme, setTheme, voice, toggleVoice, setVoice }}>{children}</Context.Provider>;
}
export const useInterface = () => useContext(Context);
