"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Bookmark, Calculator, Check, Clock3, FlaskConical, Moon, Palette, Play, Search, Sparkles, Sun, Volume2, VolumeX, X, Zap } from "lucide-react";
import { bn, subjectName, type Game, type Subject } from "@/lib/content";
import { useInterface, themes, type ThemeName } from "@/components/preferences";

export function Logo() {
  return <Link href="/" className="brand mayan-brand" aria-label="Mayan School হোম" title="Mayan School"><svg className="brand-emblem" viewBox="0 0 52 54" width="43" height="45" aria-hidden="true"><g className="brand-sun"><circle cx="26" cy="12" r="7" fill="#eeb656"/><path d="M26 1v2M12 6l2 2M40 6l-2 2" stroke="#eeb656" strokeWidth="2" strokeLinecap="round"/></g><g className="brand-pages"><path d="M4 17c9-2 15 2 22 9v25C17 43 11 40 4 41Z" fill="#357d70"/><path d="M48 17c-9-2-15 2-22 9v25c9-8 15-11 22-10Z" fill="#66a791"/><path d="M10 11c8 1 12 5 16 13v21c-4-8-9-12-16-14Z" fill="#a3c6a3"/><path d="M42 11c-8 1-12 5-16 13v21c4-8 9-12 16-14Z" fill="#daead6"/><path d="M26 25v24" stroke="#fff9ee" strokeWidth="2" strokeLinecap="round"/></g></svg><span className="brand-wordmark">Mayan<span>SCHOOL</span></span></Link>;
}
export function Avatar({ large = false }: { large?: boolean }) {
  return <svg className={`avatar ${large ? "large" : ""}`} viewBox="0 0 64 64" role="img" aria-label="শিক্ষার্থীর অ্যাভাটার"><circle cx="32" cy="32" r="32" fill="#eee7f7"/><path d="M14 62c0-17 7-22 18-22s18 5 18 22" fill="#9176c1"/><ellipse cx="17" cy="30" rx="7" ry="12" fill="#3e3033"/><ellipse cx="47" cy="30" rx="7" ry="12" fill="#3e3033"/><circle cx="14" cy="26" r="4" fill="#eaa54e"/><circle cx="50" cy="26" r="4" fill="#eaa54e"/><path d="M18 25c0-20 29-23 29 0v11c0 9-8 15-15 15s-14-6-14-15z" fill="#c88c65"/><path d="M17 30c-4-25 29-28 32-6-6-1-13-5-16-10-2 9-9 12-16 16" fill="#3e3033"/><ellipse cx="26" cy="32" rx="2" ry="2.7" fill="#352a30"/><ellipse cx="39" cy="32" rx="2" ry="2.7" fill="#352a30"/><path d="M27 40q5 6 11-1" fill="none" stroke="#713e35" strokeWidth="2.2" strokeLinecap="round"/><circle cx="22" cy="38" r="3" fill="#d99378"/><circle cx="43" cy="38" r="3" fill="#d99378"/></svg>;
}
export function SubjectIcon({ subject, size = 23 }: { subject: Subject; size?: number }) {
  return subject === "bangla" ? <span className="bangla-letter-icon" style={{ fontSize: size + 4 }}>অ</span> : subject === "math" ? <Calculator size={size}/> : subject === "english" ? <span className="letter-icon" style={{ fontSize: size + 2 }}>Aa</span> : subject === "science" ? <FlaskConical size={size}/> : subject === "general" ? <GlobeIcon size={size}/> : <Palette size={size}/>;
}
export function GlobeIcon({ size = 23 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z"/></svg>;
}
const themeIcons: Record<ThemeName, typeof Sun> = { light: Sun, dark: Moon, kids: Sparkles, contrast: Zap };
export function ThemeSwitcher({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useInterface();
  return <div className={`theme-switcher ${compact ? "compact" : ""}`} role="group" aria-label="থিম নির্বাচন">{themes.map(({ id, name, english }) => { const Icon = themeIcons[id]; return <button key={id} type="button" className={theme === id ? "active" : ""} aria-pressed={theme === id} aria-label={`${name} থিম`} title={`${name} থিম`} onClick={() => setTheme(id)}><Icon size={15}/><span className="theme-label">{name}</span></button>; })}</div>;
}
export function ThemePicker() {
  const { theme, setTheme } = useInterface();
  return <div className="theme-grid" role="radiogroup" aria-label="থিম">{themes.map(({ id, name, english, description, swatches }) => { const Icon = themeIcons[id]; return <button key={id} type="button" role="radio" aria-checked={theme === id} className={`theme-option ${theme === id ? "active" : ""}`} onClick={() => setTheme(id)}><span className="theme-swatches" aria-hidden="true">{swatches.map((color) => <i key={color} style={{ background: color }}/>)}</span><b><Icon size={14} style={{ verticalAlign: "-2px", marginRight: 5 }}/>{name} · {english}</b><small>{description}</small></button>; })}</div>;
}
export function VoiceToggle({ showLabel = true }: { showLabel?: boolean }) {
  const { voice, toggleVoice } = useInterface();
  return <button type="button" className={`voice-toggle ${voice ? "on" : "off"}`} onClick={toggleVoice} aria-pressed={voice} aria-label={voice ? "কণ্ঠ ও শব্দ বন্ধ করো" : "কণ্ঠ ও শব্দ চালু করো"} title={voice ? "কণ্ঠ ও শব্দ চালু আছে" : "কণ্ঠ ও শব্দ বন্ধ আছে"}>{voice ? <Volume2 size={18}/> : <VolumeX size={18}/>}{showLabel && <span>{voice ? "কণ্ঠ চালু" : "কণ্ঠ বন্ধ"}</span>}</button>;
}
export function BanglaCover({ words = false }: { words?: boolean }) { return <div className={`bangla-cover-letters ${words ? "words" : ""}`} aria-hidden="true">{(words ? ["মা", "বই", "আম"] : ["অ", "আ", "ক"]).map((letter, index) => <span key={letter} style={{ "--letter-index": index } as React.CSSProperties}>{letter}</span>)}</div>; }
export function GameCard({ game, saved, completed, onPlay, onSave }: { game: Game; saved: boolean; completed?: boolean; onPlay: (game: Game) => void; onSave: (id: string) => void }) {
  return <article className={`game-card ${game.subject}`}>
    <div className="game-cover">
      <button className="cover-button" onClick={() => onPlay(game)} aria-label={`${game.title} সম্পর্কে জানি`}><img src={game.thumbnail} alt={game.title} loading="lazy"/>{game.subject === "bangla" && <BanglaCover words={game.thumbnail.includes("words")}/>}<span className="cover-play"><Play size={25} fill="currentColor"/></span></button>
      <button aria-pressed={saved} className={`save-button ${saved ? "saved" : ""}`} onClick={() => onSave(game.id)} aria-label={saved ? `${game.title} পছন্দ থেকে সরাও` : `${game.title} পছন্দের তালিকায় রাখো`} title={saved ? "সংরক্ষিত" : "পরে খেলার জন্য রাখো"}><Bookmark size={16} fill={saved ? "currentColor" : "none"}/></button>
      {completed && <span className="completed-tag"><Check size={12}/> শেখা হয়েছে</span>}
    </div>
    <div className="game-info"><div className="game-category-row"><span className={`subject-badge ${game.subject}`}>{subjectName(game.subject)}</span><span className="age-label">{bn(game.minAge)}–{bn(game.maxAge)} বছর</span></div>
      <button className="game-title" onClick={() => onPlay(game)}>{game.title}</button><p>{game.description}</p>
      <div className="game-meta"><span><i className={`difficulty-dot ${game.difficulty === "সহজ" ? "" : "medium"}`}/>{game.difficulty}</span><span className="meta-dot">·</span><span><Clock3 size={12}/>{bn(game.duration)} মিনিট</span></div>
      <button className="game-play-button" onClick={() => onPlay(game)}><Play size={13} fill="currentColor"/>খেলি ও শিখি<ArrowRight size={16}/></button>
    </div>
  </article>;
}
export function Modal({ title, children, onClose, wide = false, className = "" }: { title: string; children: ReactNode; onClose: () => void; wide?: boolean; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; }, [onClose]);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => ref.current?.querySelector<HTMLElement>("button, input, select, textarea, [tabindex='0']")?.focus());
    const keydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
      if (e.key !== "Tab" || !ref.current) return;
      const items = Array.from(ref.current.querySelectorAll<HTMLElement>("button:not([disabled]), a[href], input, select, textarea, [tabindex='0']")).filter((el) => el.offsetParent !== null);
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", keydown);
    return () => { cancelAnimationFrame(frame); document.body.style.overflow = overflow; document.removeEventListener("keydown", keydown); previous?.focus(); };
  }, []);
  return <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}><div ref={ref} className={`modal ${wide ? "wide" : ""} ${className}`} role="dialog" aria-modal="true" aria-labelledby={titleId}><header className="modal-header"><h2 id={titleId}>{title}</h2><button className="icon-button" onClick={onClose} aria-label="বন্ধ করো"><X size={21}/></button></header>{children}</div></div>;
}
export function EmptyState({ title, description, action, onAction }: { title: string; description: string; action?: string; onAction?: () => void }) {
  return <div className="empty-state"><span className="empty-icon"><Search size={30}/></span><h3>{title}</h3><p>{description}</p>{action && <button className="primary-button" onClick={onAction}>{action}<ArrowRight size={17}/></button>}</div>;
}
export async function api<T = Record<string, unknown>>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  const body = await response.json().catch(() => ({ error: response.status === 413 ? "ফাইলটি খুব বড়। ছোট ফাইল দিয়ে আবার চেষ্টা করুন।" : "সার্ভারের সঙ্গে যোগাযোগ হয়নি। আবার চেষ্টা করুন।" }));
  if (!response.ok) throw new Error(body.error || "কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।");
  return body as T;
}
