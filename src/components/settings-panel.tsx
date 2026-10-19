"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Eye, Languages, MonitorSmartphone, Palette, ShieldCheck, Sparkles, Volume2 } from "lucide-react";
import { useInterface, themes } from "@/components/preferences";
import { speak, speechSupported } from "@/lib/voice";

export function SettingsPanel() {
  const { theme, setTheme, motion, toggleMotion, voice, setVoice, collapsed, toggleSidebar } = useInterface();
  const [sample] = useState(() => ["অ", "আ", "ক", "কা", "২ × ৩ = ৬"]);
  const [preview, setPreview] = useState<string | null>(null);
  const speakSample = (text: string) => { setPreview(text); if (speechSupported()) speak({ text, lang: "bn-BD" }); };
  return <>
    <div className="page-heading"><span className="eyebrow purple-text"><Sparkles size={15}/>নিজের মতো সাজিয়ে নিই</span><h1>সেটিংস</h1><p>থিম, কণ্ঠ, অ্যানিমেশন আর ভাষা—তোমার পছন্দমতো ঠিক করো।</p></div>
    <div className="settings-layout">
      <section className="white-panel settings-section">
        <header><span className="mini-subject-icon creativity"><Palette size={20}/></span><div><h2>থিম</h2><p>চোখের আরাম আর আনন্দ—যেকোনো থিম বেছে নাও।</p></div></header>
        <div className="theme-grid" role="radiogroup" aria-label="থিম">{themes.map(({ id, name, english, description, swatches }) => <button key={id} type="button" role="radio" aria-checked={theme === id} className={`theme-option ${theme === id ? "active" : ""}`} onClick={() => setTheme(id)}><span className="theme-swatches" aria-hidden="true">{swatches.map((color) => <i key={color} style={{ background: color }}/>)}</span><b>{name} · {english}</b><small>{description}</small>{theme === id && <Check size={14}/>}</button>)}</div>
      </section>
      <section className="white-panel settings-section">
        <header><span className="mini-subject-icon science"><Volume2 size={20}/></span><div><h2>কণ্ঠ ও শব্দ</h2><p>বর্ণ, শব্দ, শেষে ফিডব্যাক—সব শোনা যাবে কি না।</p></div></header>
        <div className="settings-row"><div className="settings-label"><b>কণ্ঠ ও এফেক্ট চালু</b><small>বন্ধ রাখলে কোনো শব্দ বা উচ্চারণ বাজবে না।</small></div><button type="button" role="switch" aria-checked={voice} aria-label="কণ্ঠ ও শব্দ চালু করো" className={`switch-button ${voice ? "on" : ""}`} onClick={() => setVoice(!voice)}><i/></button></div>
        <div className="settings-row"><div className="settings-label"><b>উচ্চারণ পরীক্ষা করি</b><small>কণ্ঠ চালু থাকলে নমুনা শুনে দেখো।</small></div><div className="voice-sample-grid">{sample.map((text) => <button key={text} type="button" className={`secondary-button ${preview === text ? "selected" : ""}`} disabled={!voice} onClick={() => speakSample(text)}>{text}<Volume2 size={14}/></button>)}</div></div>
        {!speechSupported() && <p className="voice-note"><Volume2 size={14}/>এই ডিভাইসে ব্রাউজার-কণ্ঠ নেই। প্রি-রেকর্ড করা অডিও থাকলে সেটি বাজবে।</p>}
      </section>
      <section className="white-panel settings-section">
        <header><span className="mini-subject-icon math"><Sparkles size={20}/></span><div><h2>গতি ও অ্যানিমেশন</h2><p>শেখার ছন্দ নিজের মতো ঠিক করো।</p></div></header>
        <div className="settings-row"><div className="settings-label"><b>অ্যানিমেশন</b><small>গতি কমাতে চাইলে বন্ধ করে রাখো।</small></div><button type="button" role="switch" aria-checked={motion} aria-label="অ্যানিমেশন টগল" className={`switch-button ${motion ? "on" : ""}`} onClick={toggleMotion}><i/></button></div>
        <div className="settings-row"><div className="settings-label"><b>সাইডবার ছোট রাখি</b><small>শেখার জায়গা বড় করতে সাইডবার সংকুচিত হয়।</small></div><button type="button" role="switch" aria-checked={collapsed} aria-label="সাইডবার টগল" className={`switch-button ${collapsed ? "on" : ""}`} onClick={toggleSidebar}><i/></button></div>
      </section>
      <section className="white-panel settings-section">
        <header><span className="mini-subject-icon english"><Languages size={20}/></span><div><h2>অন্যান্য</h2><p>ভাষা ও অগ্রগতির তথ্য।</p></div></header>
        <div className="settings-row"><div className="settings-label"><b>প্রধান ভাষা</b><small>বাংলা (প্রাথমিক) · English (গৌণ)</small></div><span className="count-badge">বাংলা</span></div>
        <div className="settings-row"><div className="settings-label"><b>অগ্রগতি ও প্রোফাইল</b><small>নাম, বয়স ও দৈনিক লক্ষ্য বদলাও।</small></div><Link className="secondary-button" href="/parents">প্রোফাইল <ArrowRight size={15}/></Link></div>
        <div className="settings-row"><div className="settings-label"><b>গোপনীয়তা</b><small>বিজ্ঞাপনমুক্ত, নিরাপদ ও শিশুবান্ধব।</small></div><ShieldCheck size={20}/></div>
        <div className="settings-row"><div className="settings-label"><b>ভবিষ্যতে</b><small>ডেস্কটপ ও মোবাইল অ্যাপের জন্য প্রস্তুত।</small></div><MonitorSmartphone size={20}/></div>
      </section>
    </div>
    <div className="encouragement"><Eye size={20}/><p>তোমার পছন্দ শুধু এই ব্রাউজারে সংরক্ষিত থাকে—কোনো ব্যক্তিগত তথ্য নয়।</p></div>
  </>;
}
