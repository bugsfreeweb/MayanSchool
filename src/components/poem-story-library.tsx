"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Bookmark, Heart, Pause, Play, Sparkles, Volume2 } from "lucide-react";
import { Modal, VoiceToggle } from "@/components/ui";
import { useInterface } from "@/components/preferences";
import { bn } from "@/lib/content";
import { poems, stories, type Poem, type Story } from "@/lib/general";
import { speak, stopSpeaking, speechSupported } from "@/lib/voice";

type Props = { kind: "poems" | "stories" };

export function PoemStoryLibrary({ kind }: Props) {
  const [openPoem, setOpenPoem] = useState<Poem | null>(null), [openStory, setOpenStory] = useState<Story | null>(null);
  const isPoem = kind === "poems";
  const items = isPoem ? poems : stories;
  const title = isPoem ? "কবিতা ও ছড়া" : "গল্পের ঝুলি";
  const eyebrow = isPoem ? "ছন্দে ছন্দে শেখা" : "কল্পনার জগৎ";
  const description = isPoem ? "মিষ্টি ছড়া শুনি, নিজেও বলি—ছন্দ শেখা হোক আনন্দের।" : "ছোট্ট গল্প শুনি, ছবি দেখি, আর শেখার কথা মনে রাখি।";
  return <>
    <section className="page-heading"><div><span className="eyebrow purple-text"><BookOpen size={15}/>{eyebrow}</span><h1>{title}</h1><p>{description}</p></div><Link className="secondary-button" href="/games"><Sparkles size={16}/>গেমে যাই<ArrowRight size={15}/></Link></section>
    <div className="story-grid">
      {items.map((item) => <article className="story-card" key={item.id}><span className="story-tag">{item.tag}</span><h3>{item.title}</h3>{isPoem ? <div className="poem-lines">{(item as Poem).lines.slice(0, 2).map((line, i) => <p key={i}>{line}</p>)}</div> : <p>{(item as Story).summary}</p>}<button className="primary-button" onClick={() => isPoem ? setOpenPoem(item as Poem) : setOpenStory(item as Story)}><Play size={14} fill="currentColor"/>{isPoem ? "ছড়া শুনি ও পড়ি" : "গল্প পড়ি"}</button></article>)}
    </div>
    {openPoem && <PoemReader poem={openPoem} onClose={() => setOpenPoem(null)}/>}
    {openStory && <StoryReader story={openStory} onClose={() => setOpenStory(null)}/>}
  </>;
}

function PoemReader({ poem, onClose }: { poem: Poem; onClose: () => void }) {
  const { voice } = useInterface();
  const [playing, setPlaying] = useState(false), [activeLine, setActiveLine] = useState(-1);
  const [supported] = useState(() => speechSupported());
  const playLine = (index: number) => {
    setActiveLine(index);
    if (!voice || !supported) return;
    speak({ text: poem.lines[index], lang: "bn-BD", rate: 0.72 });
  };
  const playAll = () => {
    if (!supported) return;
    if (playing) { stopSpeaking(); setPlaying(false); setActiveLine(-1); return; }
    setPlaying(true);
    let line = 0;
    const next = () => {
      if (line >= poem.lines.length) { setPlaying(false); setActiveLine(-1); return; }
      playLine(line); line++;
      window.setTimeout(next, 3200);
    };
    next();
  };
  const stop = () => { stopSpeaking(); setPlaying(false); setActiveLine(-1); };
  return <Modal title={poem.title} onClose={() => { stop(); onClose(); }}><div className="lesson-reader-body"><div className="lesson-reader-meta"><span className="story-tag">{poem.tag}</span><span>{bn(poem.lines.length)} লাইন</span></div><div className="poem-lines">{poem.lines.map((line, i) => <p key={i} className={i === activeLine ? "active" : ""} onClick={() => playLine(i)}>{line}</p>)}</div><div className="reader-toolbar">{supported ? <button className="secondary-button" onClick={playAll}>{playing ? <Pause size={16}/> : <Play size={15} fill="currentColor"/>}{playing ? "থামাই" : "পুরো ছড়া শুনি"}</button> : <span className="voice-note"><Volume2 size={15}/>এই ডিভাইসে বাংলা কণ্ঠ নেই—নিজে পড়ে শোনাও।</span>}<VoiceToggle/></div><p className="reader-note">যেকোনো লাইনে চাপ দিয়ে সেই লাইনটি আবার শুনতে পারো।</p></div></Modal>;
}

function StoryReader({ story, onClose }: { story: Story; onClose: () => void }) {
  const { voice } = useInterface();
  const [shown, setShown] = useState(1);
  const [supported] = useState(() => speechSupported());
  const readFrom = (index: number) => { if (voice && supported) speak({ text: story.paragraphs.slice(index).join(" "), lang: "bn-BD", rate: 0.76 }); };
  return <Modal title={story.title} onClose={() => { stopSpeaking(); onClose(); }}><div className="lesson-reader-body"><div className="lesson-reader-meta"><span className="story-tag">{story.tag}</span><span>{bn(story.paragraphs.length)} অনুচ্ছেদ</span></div><div className="story-body">{story.paragraphs.slice(0, shown).map((paragraph, i) => <p key={i}>{paragraph}</p>)}</div><div className="reader-toolbar">{supported && <button className="secondary-button" onClick={() => readFrom(shown - 1)}><Volume2 size={16}/>শুনে দেখি</button>}<VoiceToggle/></div><div className="reader-actions">{shown < story.paragraphs.length ? <button className="primary-button" onClick={() => setShown(shown + 1)}>পরের অংশ<ArrowRight size={16}/></button> : <button className="primary-button" onClick={() => { stopSpeaking(); onClose(); }}><Heart size={16}/>গল্প শেষ<span className="sr-only">গল্প শেষ করুন</span></button>}</div>{shown === story.paragraphs.length && <p className="reader-note"><Bookmark size={14}/>গল্পটি পড়া শেষ। আবার পড়তে পারো, অথবা অন্য গল্প বেছে নাও।</p>}</div></Modal>;
}
