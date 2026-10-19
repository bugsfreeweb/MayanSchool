/*
  Mayan School — Voice & audio utilities (platform-independent)
  ---------------------------------------------------------------
  Provides Bangla/English speech helpers and small UI tones.
  These are plain browser APIs with no framework or hosting coupling,
  so the same utilities can back web, desktop and mobile builds later.
*/

export type SpeakOptions = {
  text: string;
  lang?: "bn-BD" | "en-US";
  rate?: number;
  pitch?: number;
};

export function speechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function pickVoice(lang: "bn-BD" | "en-US"): SpeechSynthesisVoice | null {
  if (!speechSupported()) return null;
  const voices = window.speechSynthesis.getVoices();
  const prefix = lang.slice(0, 2);
  return voices.find((voice) => voice.lang === lang) ?? voices.find((voice) => voice.lang.startsWith(prefix)) ?? null;
}

export function speak({ text, lang = "bn-BD", rate = 0.78, pitch = 1 }: SpeakOptions): boolean {
  if (!speechSupported()) return false;
  const voice = pickVoice(lang);
  if (!voice) return false;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.voice = voice;
  utterance.rate = rate;
  utterance.pitch = pitch;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking(): void {
  if (speechSupported()) window.speechSynthesis.cancel();
}

/* Lightweight success/retry tones shared by games. Created lazily. */
let context: AudioContext | null = null;
export function playTone(correct: boolean): void {
  if (typeof window === "undefined") return;
  try {
    type AudioContextCtor = typeof AudioContext;
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: AudioContextCtor }).webkitAudioContext;
    if (!Ctor) return;
    context ??= new Ctor();
    void context.resume();
    const oscillator = context.createOscillator(), gain = context.createGain();
    oscillator.connect(gain); gain.connect(context.destination);
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(correct ? 660 : 280, context.currentTime);
    if (correct) oscillator.frequency.setValueAtTime(880, context.currentTime + 0.13);
    gain.gain.setValueAtTime(0.07, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.3);
    oscillator.start(); oscillator.stop(context.currentTime + 0.3);
  } catch { /* Audio is optional when the browser blocks it. */ }
}

export function closeToneContext(): void {
  if (context) { void context.close(); context = null; }
}
