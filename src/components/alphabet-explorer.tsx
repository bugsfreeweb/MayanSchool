"use client";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { ArrowRight, BookOpen, Eraser, PencilLine, Volume2 } from "lucide-react";
import Link from "next/link";
import { vowels, consonants } from "@/lib/bangla";
import { bn } from "@/lib/content";
import { Modal } from "@/components/ui";
export function AlphabetExplorer() {
  const [tab, setTab] = useState<"vowels" | "consonants">("vowels"), [index, setIndex] = useState(0), [write, setWrite] = useState(false);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const list = tab === "vowels" ? vowels : consonants;
  const [letter, word, emoji] = list[index];
  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    const update = () => setVoice(window.speechSynthesis.getVoices().find((v) => v.lang.startsWith("bn")) ?? null);
    update(); window.speechSynthesis.addEventListener("voiceschanged", update);
    return () => { window.speechSynthesis.removeEventListener("voiceschanged", update); window.speechSynthesis.cancel(); };
  }, []);
  const speak = () => { if (!voice) return; const utterance = new SpeechSynthesisUtterance(`${letter}। ${word}।`); utterance.lang = "bn-BD"; utterance.voice = voice; utterance.rate = .75; window.speechSynthesis.cancel(); window.speechSynthesis.speak(utterance); };
  return <section className="alphabet-explorer" id="alphabet"><div className="section-heading"><div><h2><span className="bangla-letter-icon">অ</span>বর্ণমালার খেলাঘর</h2><p>একটি বর্ণে চাপ দাও। দেখো, বলো, নিজের হাতে লিখে দেখো।</p></div><Link className="text-link" href="/lessons"><BookOpen size={15}/>বাংলার পাঠ<ArrowRight size={15}/></Link></div><div className="alphabet-body"><div className="alphabet-left"><div className="alphabet-tabs" role="group" aria-label="বর্ণের ধরন"><button aria-pressed={tab === "vowels"} className={tab === "vowels" ? "active" : ""} onClick={() => { setTab("vowels"); setIndex(0); }}>স্বরবর্ণ <span>১১টি</span></button><button aria-pressed={tab === "consonants"} className={tab === "consonants" ? "active" : ""} onClick={() => { setTab("consonants"); setIndex(0); }}>ব্যঞ্জনবর্ণ <span>৩৯টি</span></button></div><div className="alphabet-grid">{list.map(([character, example], i) => <button key={character} className={i === index ? "selected" : ""} aria-pressed={i === index} aria-label={`${character}, ${example}`} onClick={() => setIndex(i)}>{character}</button>)}</div><p className="alphabet-count">{bn(index + 1)} / {bn(list.length)} বর্ণ · একেকটি বর্ণ, একেকটি নতুন গল্প।</p></div><div className="alphabet-preview"><div className="letter-discovery" key={`${tab}-${index}`} aria-live="polite"><span className="letter-emoji" aria-hidden="true">{emoji}</span><span className="discovery-character">{letter}</span><h3>{word.startsWith(letter) ? <>{letter} দিয়ে <b>{word}</b></> : <><b>{word}</b> শব্দে {letter}</>}</h3></div><div className="alphabet-actions"><button className="secondary-button" onClick={speak} disabled={!voice} aria-label="বর্ণের উচ্চারণ শোনো" title={voice ? "উচ্চারণ শোনো" : "এই ডিভাইসে বাংলা কণ্ঠ পাওয়া যায়নি"}><Volume2 size={16}/>শুনে দেখি</button><button className="primary-button" onClick={() => setWrite(true)}><PencilLine size={16}/>লিখে দেখি</button></div>{!voice && <p className="voice-note">ডিভাইসে বাংলা কণ্ঠ নেই? বর্ণটি দেখে নিজে পড়ে বলি।</p>}</div></div>{write && <WritingPad letter={letter} onClose={() => setWrite(false)}/>}</section>;
}
function WritingPad({ letter, onClose }: { letter: string; onClose: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null), drawing = useRef(false), last = useRef<{ x: number; y: number } | null>(null);
  const [hasInk, setHasInk] = useState(false);
  useEffect(() => { const node = canvas.current; if (!node) return; const ratio = Math.min(window.devicePixelRatio || 1, 2); node.width = 600 * ratio; node.height = 440 * ratio; const context = node.getContext("2d"); context?.scale(ratio, ratio); if (context) { context.strokeStyle = "#4f8b76"; context.lineWidth = 10; context.lineCap = "round"; context.lineJoin = "round"; } }, []);
  const point = (event: PointerEvent<HTMLCanvasElement>) => { const box = event.currentTarget.getBoundingClientRect(); return { x: (event.clientX - box.left) / box.width * 600, y: (event.clientY - box.top) / box.height * 440 }; };
  const move = (event: PointerEvent<HTMLCanvasElement>) => { if (!drawing.current || !last.current) return; const p = point(event), context = canvas.current?.getContext("2d"); context?.beginPath(); context?.moveTo(last.current.x, last.current.y); context?.lineTo(p.x, p.y); context?.stroke(); last.current = p; setHasInk(true); };
  const stop = () => { drawing.current = false; last.current = null; };
  return <Modal title={`${letter} — নিজের হাতে লিখে দেখি`} onClose={onClose}><div className="writing-pad-body"><p>আঙুল বা মাউস দিয়ে হালকা বর্ণটির ওপর লিখে দেখো।</p><div className="tracing-surface"><span aria-hidden="true">{letter}</span><canvas ref={canvas} onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); drawing.current = true; last.current = point(event); }} onPointerMove={move} onPointerUp={stop} onPointerCancel={stop} aria-label={`${letter} বর্ণ অনুশীলনের লেখার জায়গা`}/></div><div className="writing-actions"><button className="secondary-button" disabled={!hasInk} onClick={() => { canvas.current?.getContext("2d")?.clearRect(0, 0, 600, 440); setHasInk(false); }}><Eraser size={17}/>মুছে আবার লিখি</button><button className="primary-button" onClick={onClose}>শেষ করেছি<ArrowRight size={17}/></button></div><small>এটি মুক্ত অনুশীলন—লেখার নম্বর দেওয়া বা সংরক্ষণ করা হয় না।</small></div></Modal>;
}
