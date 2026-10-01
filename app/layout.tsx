import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "MTU Training Platform",
  description: "Accessible, audio-first training platform for visually impaired medical tactile examiners. Prototype.",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1 };

/**
 * Runs before first paint: applies the saved language and display settings to <html>, so screen
 * readers pick the right voice from the very first line and the page never flashes the wrong
 * theme or text size. Must stay in sync with the storage key in lib/persistence.ts.
 */
const EARLY_SETTINGS = `try{var s=JSON.parse(localStorage.getItem("mtu-prototype-v1")||"null");if(s){var e=document.documentElement,c=s.settings||{};if(s.language)e.lang=s.language;if(c.theme)e.dataset.theme=c.theme;if(c.contrast)e.dataset.contrast=c.contrast;if(c.textSize)e.dataset.textSize=c.textSize;if(c.reduceMotion!==undefined)e.dataset.reduceMotion=String(c.reduceMotion)}}catch(_){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" data-contrast="standard" data-text-size="standard" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: EARLY_SETTINGS }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
