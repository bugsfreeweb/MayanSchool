import Link from "next/link";
import { ArrowLeft } from "lucide-react";
export default function NotFound() {
  return <main className="not-found"><img src="/images/learning-hero.png" alt="শেখার জগতে দুই ছোট্ট অভিযাত্রী"/><h1>মনে হচ্ছে একটু পথ হারিয়ে ফেলেছি!</h1><p>এই পৃষ্ঠাটি নেই। চলো, আবার আমাদের শেখার জগতে ফিরে যাই।</p><Link href="/" className="primary-button"><ArrowLeft size={17}/>হোমে ফিরে যাই</Link></main>;
}
