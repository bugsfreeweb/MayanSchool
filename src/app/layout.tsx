import type { Metadata } from "next";
import type { ReactNode } from "react";
import { InterfacePreferences } from "@/components/preferences";
import "./globals.css";
import "./school.css";
import "./theme.css";
export const metadata: Metadata = {
  title: { default: "Mayan School — খেলতে খেলতে শেখা", template: "%s | Mayan School" },
  description: "Bugsfree Studio-এর Mayan School: ৪–১০ বছরের শিশুদের বাংলা, গণিত, ইংরেজি, বিজ্ঞান ও সৃজনশীলতা শেখার আনন্দময় প্ল্যাটফর্ম।",
  applicationName: "Mayan School", authors: [{ name: "Bugsfree Studio", url: "https://github.com/bugsfreeweb/MayanSchool" }],
};
const themeInit = `try{var t=localStorage.getItem('mayan.theme');var v=t==='light'||t==='dark'||t==='kids'||t==='contrast'?t:(matchMedia('(prefers-reduced-motion: reduce)').matches?'contrast':'light');document.documentElement.dataset.theme=v;document.documentElement.dataset.motion=(matchMedia('(prefers-reduced-motion: reduce)').matches||localStorage.getItem('mayan.motion')==='off')?'off':'on';document.documentElement.dataset.voice=localStorage.getItem('mayan.voice')==='off'?'off':'on';document.documentElement.dataset.sidebar=localStorage.getItem('mayan.sidebar')==='collapsed'?'collapsed':'expanded';}catch(e){}`;
export default function RootLayout({ children }: { children: ReactNode }) { return <html lang="bn" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeInit }}/></head><body><InterfacePreferences>{children}</InterfacePreferences></body></html>; }
