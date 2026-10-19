"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, BookOpen, BookOpenCheck, ChevronRight, Feather, Gamepad2, Home, LayoutDashboard, PanelLeftClose, PanelLeftOpen, Settings, ShieldCheck, Sparkles, TrendingUp, Trophy, X } from "lucide-react";
import { Logo, ThemeSwitcher, VoiceToggle } from "@/components/ui";
import { useInterface } from "@/components/preferences";

export function Sidebar({ view, open, onClose }: { view: string; subject?: string; open: boolean; onClose: () => void }) {
  const { collapsed, toggleSidebar, motion, toggleMotion } = useInterface();
  const [mobile, setMobile] = useState(false);
  const ref = useRef<HTMLElement>(null), close = useRef(onClose);
  useEffect(() => { close.current = onClose; }, [onClose]);
  useEffect(() => { const media = matchMedia("(max-width: 760px)"); const update = () => setMobile(media.matches); update(); media.addEventListener("change", update); return () => media.removeEventListener("change", update); }, []);
  useEffect(() => {
    if (!open || !mobile) return;
    const previous = document.activeElement as HTMLElement, old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.querySelector<HTMLElement>(".mobile-menu-close")?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close.current();
      if (event.key !== "Tab") return;
      const elements = Array.from(ref.current?.querySelectorAll<HTMLElement>("a[href],button:not(:disabled)") ?? []).filter((el) => el.offsetWidth && getComputedStyle(el).visibility !== "hidden");
      const first = elements[0], last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", keydown);
    return () => { document.body.style.overflow = old; document.removeEventListener("keydown", keydown); previous?.focus(); };
  }, [open, mobile]);
  const [admin, setAdmin] = useState(false);
  useEffect(() => { let active = true; fetch("/api/admin/session").then((r) => r.json()).then((data) => { if (active && data?.authenticated) setAdmin(true); }).catch(() => {}); return () => { active = false; }; }, []);
  const navigation = [
    { id: "home", label: "হোম", icon: Home, href: "/", caption: "আমার শেখার জগৎ" },
    { id: "lessons", label: "শেখা", icon: BookOpen, href: "/lessons", caption: "পাঠ ও অধ্যায়" },
    { id: "games", label: "গেম", icon: Gamepad2, href: "/games", caption: "খেলতে খেলতে শিখি" },
    { id: "poems", label: "কবিতা", icon: Feather, href: "/poems", caption: "ছড়া ও ছন্দ" },
    { id: "stories", label: "গল্প", icon: BookOpenCheck, href: "/stories", caption: "গল্পের ঝুলি" },
    { id: "learning", label: "অগ্রগতি", icon: TrendingUp, href: "/progress", caption: "একটু একটু এগিয়ে যাই" },
    { id: "achievements", label: "পুরস্কার", icon: Trophy, href: "/rewards", caption: "ব্যাজ ও তারা" },
    { id: "settings", label: "সেটিংস", icon: Settings, href: "/settings", caption: "নিজের মতো সাজাই" },
    ...(admin ? [{ id: "admin", label: "অ্যাডমিন", icon: LayoutDashboard, href: "/admin", caption: "গেম ও কনটেন্ট" }] : []),
  ];
  const active = view === "subject" ? "games" : view;
  return <>
    {open && <button className="sidebar-scrim" onClick={onClose} aria-label="মেনুর বাইরে বন্ধ করো" tabIndex={-1}/>}
    <aside id="school-sidebar" ref={ref} className={`sidebar school-sidebar ${collapsed ? "is-collapsed" : ""} ${open ? "is-open" : ""}`} inert={mobile && !open} aria-label="Mayan School নেভিগেশন">
      <div className="school-brand-row"><Logo/><button className="mobile-menu-close icon-button" onClick={onClose} aria-label="মেনু বন্ধ করো"><X size={19}/></button></div>
      <div className="sidebar-intro"><span className="online-dot"/>খেলতে খেলতে শেখা</div>
      <div className="sidebar-nav-label"><span>শেখার জগৎ</span><button className="collapse-toggle" aria-label={collapsed ? "সাইডবার বড় করো" : "সাইডবার ছোট করো"} title={collapsed ? "সাইডবার বড় করো" : "সাইডবার ছোট করো"} aria-expanded={!collapsed} aria-controls="school-sidebar" onClick={toggleSidebar}>{collapsed ? <PanelLeftOpen size={18}/> : <PanelLeftClose size={18}/>}</button></div>
      <nav className="primary-nav" aria-label="প্রধান নেভিগেশন">{navigation.map(({ id, label, icon: Icon, href, caption }) => <Link href={href} key={id} className={`nav-item ${active === id ? "active" : ""}`} onClick={onClose} aria-label={label} aria-current={active === id ? "page" : undefined} title={collapsed ? label : undefined}><span className="nav-icon"><Icon size={21} strokeWidth={1.8}/></span><span className="nav-label">{label}<small>{caption}</small></span>{active === id && <span className="nav-active-dot"/>}</Link>)}</nav>
      <div className="sidebar-cozy-note" aria-hidden="true"><div className="little-book"><span/><span/><Sparkles size={15}/></div><p>একটু একটু শিখি,<br/><strong>অনেকটা এগিয়ে যাই।</strong></p><span>তোমার গতিতে, তোমার মতো।</span></div>
      <div className="school-sidebar-bottom"><Link href="/parents" className={`nav-item utility-nav ${view === "parents" ? "active" : ""}`} title="অভিভাবক কর্নার" onClick={onClose}><ShieldCheck size={19}/><span className="nav-label">অভিভাবক কর্নার</span><ChevronRight size={14}/></Link><div className="sidebar-tools"><button className="motion-toggle" onClick={toggleMotion} aria-pressed={motion} aria-label={motion ? "অ্যানিমেশন বন্ধ করো" : "অ্যানিমেশন চালু করো"} title={motion ? "অ্যানিমেশন বন্ধ করো" : "অ্যানিমেশন চালু করো"}><Sparkles size={17}/><span className="nav-label">অ্যানিমেশন</span><span className={`mini-toggle ${motion ? "on" : ""}`} aria-hidden="true"><i/></span></button><div className="sidebar-theme-row"><span className="nav-label">থিম</span><ThemeSwitcher compact/></div><VoiceToggle/><Link href="/admin" className={`studio-shortcut ${view === "admin" ? "active" : ""}`} onClick={onClose} aria-label="অ্যাডমিন প্যানেল" title="অ্যাডমিন প্যানেল"><LayoutDashboard size={17}/></Link></div><a href="https://github.com/bugsfreeweb/MayanSchool" target="_blank" rel="noreferrer" className="studio-credit" title="Mayan School · Bugsfree Studio"><span>সযত্নে তৈরি <b>Bugsfree Studio</b></span><ArrowUpRight size={13}/></a></div>
    </aside>
  </>;
}
