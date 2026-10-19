"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Preferences = { collapsed: boolean; toggleSidebar: () => void; motion: boolean; toggleMotion: () => void };
const Context = createContext<Preferences>({ collapsed: false, toggleSidebar: () => {}, motion: true, toggleMotion: () => {} });
export function InterfacePreferences({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false), [motion, setMotion] = useState(true);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => { try { setCollapsed(localStorage.getItem("mayan.sidebar") === "collapsed"); setMotion(!media.matches && localStorage.getItem("mayan.motion") !== "off"); } catch { setMotion(!media.matches); } };
    sync(); media.addEventListener("change", sync); window.addEventListener("storage", sync);
    return () => { media.removeEventListener("change", sync); window.removeEventListener("storage", sync); };
  }, []);
  useEffect(() => { document.documentElement.dataset.sidebar = collapsed ? "collapsed" : "expanded"; }, [collapsed]);
  useEffect(() => { document.documentElement.dataset.motion = motion ? "on" : "off"; }, [motion]);
  const toggleSidebar = () => { setCollapsed((previous) => { try { localStorage.setItem("mayan.sidebar", previous ? "expanded" : "collapsed"); } catch {} return !previous; }); };
  const toggleMotion = () => { setMotion((previous) => { try { localStorage.setItem("mayan.motion", previous ? "off" : "on"); } catch {} return !previous; }); };
  return <Context.Provider value={{ collapsed, toggleSidebar, motion, toggleMotion }}>{children}</Context.Provider>;
}
export const useInterface = () => useContext(Context);
