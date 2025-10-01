import { cn } from "@/lib/utils";

// HSL colors from globals.css
const primaryColor = "hsl(241 68% 61%)";
const primaryColor80 = "hsl(241 68% 61% / 0.8)";

export function getLogoSvg() {
  // Using hardcoded colors instead of CSS classes for jsPDF compatibility
  return `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4H20V8C20 10.2091 18.2091 12 16 12H8C5.79086 12 4 10.2091 4 8V4Z" fill="${primaryColor80}" />
    <path d="M4 12V20H20V12L12 16L4 12Z" fill="${primaryColor}" />
  </svg>`;
}

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 font-semibold", className)}>
      <div dangerouslySetInnerHTML={{ __html: getLogoSvg() }} />
      <span className="text-xl font-bold">UNI-VERX</span>
    </div>
  );
}
