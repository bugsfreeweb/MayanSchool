"use client";
import { RotateCcw, Sprout } from "lucide-react";
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="not-found"><Sprout size={60} color="#9baa88" strokeWidth={1.4}/><h1>একটু বিরতি, তারপর আবার শেখা!</h1><p>পৃষ্ঠাটি খুলতে সমস্যা হয়েছে। একটু পরে আবার চেষ্টা করি।</p><button className="primary-button" onClick={reset}><RotateCcw size={17}/>আবার চেষ্টা করি</button></main>;
}
