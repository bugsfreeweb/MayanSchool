import type { Metadata } from "next";
import type { ReactNode } from "react";
import { InterfacePreferences } from "@/components/preferences";
import "./globals.css";
import "./school.css";
export const metadata: Metadata = {
  title: { default: "Mayan School — খেলতে খেলতে শেখা", template: "%s | Mayan School" },
  description: "Bugsfree Studio-এর Mayan School: ৪–১০ বছরের শিশুদের বাংলা, গণিত, ইংরেজি, বিজ্ঞান ও সৃজনশীলতা শেখার আনন্দময় প্ল্যাটফর্ম।",
  applicationName: "Mayan School", authors: [{ name: "Bugsfree Studio", url: "https://github.com/bugsfreeweb/MayanSchool" }],
};
export default function RootLayout({ children }: { children: ReactNode }) { return <html lang="bn" suppressHydrationWarning><body><InterfacePreferences>{children}</InterfacePreferences></body></html>; }
