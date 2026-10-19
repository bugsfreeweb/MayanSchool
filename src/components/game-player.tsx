"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, ChevronDown, Check, CheckCircle2, Clock3, Flower2, Heart, Leaf, Lightbulb, LoaderCircle, Play, RotateCcw, ShieldCheck, Sparkles, Star, Sun, Target, Trophy, Users, Sprout, Volume2, VolumeX, Droplets } from "lucide-react";
import { Modal, api, SubjectIcon, BanglaCover } from "@/components/ui";
import { useInterface } from "@/components/preferences";
import { bn, getQuestions, subjectName, type Game } from "@/lib/content";
import { playTone, closeToneContext } from "@/lib/voice";

type Result = { correct: number; total: number; stars: number; passed: boolean };
export function GamePlayer({ game, onClose, onSaved }: { game: Game; onClose: () => void; onSaved: () => void }) {
  const { voice } = useInterface();
  const [phase, setPhase] = useState<"intro" | "playing" | "done">("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [sound, setSound] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [run, setRun] = useState(0);
  const startTime = useRef(0);
  const inFlight = useRef(false);
  const questions = getQuestions(game.id);
  const question = questions[index];
  const passed = result ? result.passed ?? result.correct / result.total >= .6 : false;
  const questionHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { if (phase === "playing") questionHeading.current?.focus({ preventScroll: true }); }, [phase, index]);
  useEffect(() => {
    if (phase !== "playing" || game.kind !== "upload") return;
    const timer = setInterval(() => setElapsed(Math.floor((Date.now() - startTime.current) / 1000)), 1000);
    return () => clearInterval(timer);
  }, [phase, game.kind]);
  useEffect(() => () => { closeToneContext(); }, []);
  const start = () => { setIndex(0); setAnswers([]); setSelected(null); setResult(null); setError(""); setElapsed(0); setRun((n) => n + 1); startTime.current = Date.now(); setPhase("playing"); };
  const tone = (correct: boolean) => {
    if (!sound || !voice) return;
    playTone(correct);
  };
  const finish = useCallback(async (moves?: number, finalAnswers?: number[]) => {
    if (inFlight.current) return;
    inFlight.current = true; setSaving(true); setError("");
    try {
      const data = await api<Result>("/api/progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ gameId: game.id, answers: finalAnswers, moves, duration: Math.max(1, Math.min(3600, Math.round((Date.now() - startTime.current) / 1000))) }) });
      setResult(data); setPhase("done"); onSaved();
    } catch (err) { setError(err instanceof Error ? err.message : "আবার চেষ্টা করো।"); }
    finally { setSaving(false); inFlight.current = false; }
  }, [game.id, onSaved]);
  const choose = (choice: number) => { if (selected !== null) return; setSelected(choice); setAnswers((previous) => [...previous, choice]); tone(choice === question.answer); };
  const next = () => { if (index + 1 === questions.length) void finish(undefined, answers); else { setIndex(index + 1); setSelected(null); } };
  const goals = game.subject === "bangla" ? ["বাংলা বর্ণ, শব্দ ও বাক্য চিনতে শেখা", "নিজের ভাষায় পড়ার আত্মবিশ্বাস বাড়ানো"] : game.subject === "math" ? ["সংখ্যা ও গাণিতিক ধারণা বুঝতে শেখা", "মনোযোগ দিয়ে সমস্যা সমাধান করা"] : game.subject === "english" ? ["নতুন অক্ষর ও শব্দ চিনতে শেখা", "ইংরেজি শেখার আত্মবিশ্বাস বাড়ানো"] : game.subject === "science" ? ["চারপাশের পৃথিবীকে নতুনভাবে চেনা", "পর্যবেক্ষণ ও কৌতূহল তৈরি করা"] : game.subject === "general" ? ["নিজের দেশ, সংস্কৃতি ও জীবনদক্ষতা জানা", "ভালো মানুষ হওয়ার ছোট্ট পাঠ শেখা"] : ["মনোযোগ ও স্মৃতিশক্তি বাড়ানো", "রং ও আকৃতির সাথে বন্ধুত্ব করা"];
  return <Modal title={game.title} onClose={onClose} wide={phase === "playing" || game.kind === "upload"} className={`game-modal phase-${phase} subject-${game.subject}`}>
    <div className="game-stepper" aria-label="শেখার ধাপ">{["দেখি", "খেলি", "শিখি"].map((label, i) => { const current = ["intro", "playing", "done"].indexOf(phase); return <span key={label} className={`${i === current ? "active" : i < current ? "complete" : ""}`} aria-current={i === current ? "step" : undefined}><i>{i < current ? <Check size={12}/> : bn(i + 1)}</i>{label}{i < 2 && <b/>}</span>; })}</div>
    {phase === "intro" && <><div className={`game-detail-cover ${game.subject}`}><img src={game.thumbnail} alt={game.title}/>{game.subject === "bangla" && <BanglaCover words={game.thumbnail.includes("words")}/>}<span className={`subject-badge ${game.subject}`}><SubjectIcon subject={game.subject} size={15}/>{subjectName(game.subject)}</span></div><div className="game-detail-body"><div className="eyebrow purple-text"><Sparkles size={14}/> ছোট্ট এক নতুন অভিযান</div><h3>আজ খেলি, নতুন কিছু শিখি!</h3><p className="muted">{game.description}</p><div className="game-detail-facts"><span><Users size={19}/><b>{bn(game.minAge)}–{bn(game.maxAge)} বছর</b><small>বয়স উপযোগী</small></span><span><Clock3 size={19}/><b>{bn(game.duration)} মিনিট</b><small>খেলার সময়</small></span><span><Target size={19}/><b>{game.difficulty}</b><small>শেখার স্তর</small></span></div><div className="learning-objectives"><h4>এই গেমে যা শিখব</h4>{goals.map((goal) => <p key={goal}><CheckCircle2 size={16}/>{goal}</p>)}</div>{game.kind === "upload" && <p className="safe-note"><ShieldCheck size={15}/> এই গেম আলাদা নিরাপদ স্যান্ডবক্সে চলবে।</p>}<button className="primary-button full-button" onClick={start}><Play size={17} fill="currentColor"/>চলো, শুরু করি!<ArrowRight size={18}/></button><p className="game-reassurance">ভুল হলেও সমস্যা নেই। চেষ্টা করতে করতেই শিখব!</p></div></>}
    {phase === "playing" && <div className="play-area"><div className="play-toolbar"><button className="text-button" onClick={() => setPhase("intro")}><ArrowLeft size={17}/> ফিরে যাই</button><span className={`subject-badge ${game.subject}`}>{subjectName(game.subject)}</span><button className="icon-button" onClick={() => setSound(!sound)} aria-label={sound ? "শব্দ বন্ধ করো" : "শব্দ চালু করো"}>{sound ? <Volume2 size={20}/> : <VolumeX size={20}/>}</button></div>
      {game.kind === "quiz" && <><div className="quiz-progress-label"><span>প্রশ্ন {bn(index + 1)} / {bn(questions.length)}</span><span><Star size={14}/> প্রতিটি চেষ্টাই শেখা</span></div><div className="quiz-progress">{questions.map((_, i) => <span key={i} className={i < index ? "done" : i === index ? "current" : ""}/>)}</div><div className="question-content" key={index}><QuestionVisual visual={question.visual}/><h3 ref={questionHeading} tabIndex={-1}>{question.prompt}</h3><div className="answer-grid">{question.options.map((option, i) => <button key={i} onClick={() => choose(i)} disabled={selected !== null} className={`answer-option ${selected !== null && i === question.answer ? "correct" : selected === i ? "incorrect" : ""}`}><span className="answer-letter">{["ক", "খ", "গ", "ঘ"][i]}</span><span>{option}</span>{selected !== null && i === question.answer && <Check size={19}/>}</button>)}</div></div>{selected !== null && <div role="status" className={`answer-feedback ${selected === question.answer ? "success" : "try-again"}`}><div>{selected === question.answer ? <CheckCircle2 size={23}/> : <Lightbulb size={23}/>}<span><b>{selected === question.answer ? "একদম ঠিক! দারুণ করেছ।" : "ভালো চেষ্টা! চলো, একসাথে শিখি।"}</b><small>{question.explanation}</small></span></div><button className="primary-button" onClick={next} disabled={saving}>{saving ? <LoaderCircle size={17} className="spin"/> : index + 1 === questions.length ? "ফলাফল দেখি" : "পরের প্রশ্ন"}<ArrowRight size={16}/></button></div>}</>}
      {game.kind === "memory" && <MemoryGame key={run} onFinish={(moves) => void finish(moves)} saving={saving}/>}
      {game.kind === "upload" && <><iframe className="uploaded-game-frame" title={game.title} src={`/api/game-files/${game.id}/${game.entryPath?.split("/").map(encodeURIComponent).join("/")}`} sandbox="allow-scripts allow-pointer-lock" allow="fullscreen"/><div className="upload-game-footer"><span><ShieldCheck size={16}/>খেলা শেষ হলে অগ্রগতি সংরক্ষণ করো</span><button className="primary-button" onClick={() => void finish()} disabled={elapsed < 10 || saving}>{saving ? "সংরক্ষণ হচ্ছে…" : elapsed < 10 ? `আর ${bn(10 - elapsed)} সেকেন্ড` : "অভিযান শেষ করেছি"}<Check size={17}/></button></div></>}
      {error && <div className="form-error" role="alert">{error}{game.kind === "memory" && <button className="text-button" onClick={start}>আবার শুরু করি</button>}</div>}
    </div>}
    {phase === "done" && result && <div className={`result-screen ${passed ? "passed" : "needs-practice"}`} role="status">{passed && <div className="result-confetti" aria-hidden="true">{Array.from({ length: 16 }, (_, i) => <i key={i} style={{ "--particle": i } as React.CSSProperties}/>)}</div>}<div className="result-trophy">{passed ? <Trophy size={56} strokeWidth={1.5}/> : <Sprout size={56} strokeWidth={1.5}/>}<span className="result-status-check">{passed ? <Check size={18}/> : <RotateCcw size={17}/>}</span></div><div className="result-stars">{[1, 2, 3].map((star) => <Star key={star} size={37} className={star <= result.stars ? "earned" : ""} fill="currentColor"/>)}</div><p className="eyebrow purple-text">{passed ? "পাঠ সম্পূর্ণ · ছোট্ট একটি বড় অর্জন" : "আরেকটু অনুশীলন · তুমিই পারবে"}</p><h3>{game.kind === "upload" ? "অভিযান সম্পূর্ণ!" : passed ? "দারুণ! তুমি পেরেছ!" : "চেষ্টা মানেই এগিয়ে যাওয়া!"}</h3><p>{game.kind === "upload" ? "আজকের শেখার সময় তোমার প্রোফাইলে যুক্ত হয়েছে।" : `${bn(result.total)}টির মধ্যে ${bn(result.correct)}টি সঠিক হয়েছে। ${passed ? "নতুন পাঠের জন্য তুমি প্রস্তুত!" : "ভুলগুলো একসাথে দেখি, তারপর আবার খেলি।"}`}</p><div className="earned-reward"><Star size={20} fill="currentColor"/>তুমি পেয়েছ {bn(result.stars)}টি শেখার তারা</div>{game.kind === "quiz" && answers.some((answer, i) => answer !== questions[i].answer) && <details className="result-review"><summary><BookOpen size={16}/>যেগুলো আবার দেখে নেব<ChevronDown size={16}/></summary>{questions.map((q, i) => answers[i] !== q.answer && <div key={i}><b>{q.prompt}</b><p><CheckCircle2 size={14}/>সঠিক উত্তর: {q.options[q.answer]}</p><small>{q.explanation}</small></div>)}</details>}<div className="result-actions"><button className="secondary-button" onClick={start}><RotateCcw size={17}/>আবার খেলি</button><button className="primary-button" onClick={onClose}>আরও শিখতে যাই<ArrowRight size={17}/></button></div><p className="saved-result"><CheckCircle2 size={14}/>তোমার অগ্রগতি সংরক্ষিত হয়েছে</p></div>}
  </Modal>;
}
function QuestionVisual({ visual }: { visual: string }) {
  const colon = visual.indexOf(":"), kind = visual.slice(0, colon), value = visual.slice(colon + 1);
  return <div className={`question-visual ${kind}`} role="img" aria-label={kind === "flowers" ? `${bn(value)}টি ফুল` : kind === "stars" ? `${bn(value)}টি তারা` : value}>{kind === "number" || kind === "letter" || kind === "sentence" ? <span>{value}</span> : kind === "emoji" ? <span>{value}</span> : kind === "flowers" ? Array.from({ length: Number(value) }, (_, i) => <Flower2 key={i} size={48} fill="#efbd61" stroke="#b98036" strokeWidth={1.4}/>) : kind === "stars" ? Array.from({ length: Number(value) }, (_, i) => <Star key={i} size={47} fill="#efc35e" stroke="#d2a345" strokeWidth={1.3}/>) : kind === "color" ? <i style={{ background: value }}/> : kind === "colors" ? value.split(",").map((color, i) => <i key={color} style={{ background: color, marginLeft: i ? -12 : 0 }}/>) : kind === "shape" ? <svg viewBox="0 0 160 110" width="160" height="110">{value === "circle" ? <circle cx="80" cy="55" r="44" fill="#8da97b"/> : value === "triangle" ? <path d="M80 8L138 102H22Z" fill="#e6ae54"/> : value === "square" ? <rect x="35" y="10" width="90" height="90" rx="7" fill="#9478bf"/> : <rect x="15" y="20" width="130" height="70" rx="7" fill="#6a9eb4"/>}</svg> : <Sparkles size={65}/>}</div>;
}
function MemoryGame({ onFinish, saving }: { onFinish: (moves: number) => void; saving: boolean }) {
  const [cards] = useState(() => Array.from({ length: 12 }, (_, i) => ({ id: i, value: i % 6, sort: Math.random() })).sort((a, b) => a.sort - b.sort));
  const [flipped, setFlipped] = useState<number[]>([]), [matched, setMatched] = useState<number[]>([]), [moves, setMoves] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const icons = [Sun, Flower2, Leaf, Star, Heart, Droplets];
  const names = ["সূর্য", "ফুল", "পাতা", "তারা", "হৃদয়", "পানি"];
  const flip = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(cards[index].value) || saving) return;
    if (flipped.length === 0) { setFlipped([index]); return; }
    const first = flipped[0], nextMoves = moves + 1;
    setMoves(nextMoves); setFlipped([first, index]);
    if (cards[first].value === cards[index].value) {
      const nextMatched = [...matched, cards[index].value]; setMatched(nextMatched);
      timer.current = setTimeout(() => { setFlipped([]); if (nextMatched.length === 6) onFinish(nextMoves); }, 500);
    } else timer.current = setTimeout(() => setFlipped([]), 900);
  };
  return <div className="memory-game"><div className="memory-heading"><h3>মিলিয়ে ফেলি ছবির জোড়া!</h3><p>একই ছবির দুটি কার্ড খুঁজে বের করো।</p></div><div className="memory-stats"><span><CheckCircle2 size={16}/>{bn(matched.length)} / ৬ জোড়া</span><span><RotateCcw size={15}/>{bn(moves)} বার চেষ্টা</span></div><div className="memory-grid">{cards.map((card, index) => { const shown = flipped.includes(index) || matched.includes(card.value); const Icon = icons[card.value]; return <button key={card.id} className={`memory-card color-${card.value} ${shown ? "flipped" : ""} ${matched.includes(card.value) ? "matched" : ""}`} onClick={() => flip(index)} aria-label={shown ? names[card.value] : `কার্ড ${bn(index + 1)} উল্টে দেখো`} disabled={matched.includes(card.value) || saving}>{shown ? <Icon size={38} strokeWidth={1.7}/> : <span>?</span>}</button>; })}</div>{saving && <p className="saving-message"><LoaderCircle className="spin" size={18}/>ফলাফল সংরক্ষণ হচ্ছে…</p>}</div>;
}
