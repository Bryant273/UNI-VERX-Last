import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 font-semibold", className)}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
      >
        <path
          d="M4 4H20V8C20 10.2091 18.2091 12 16 12H8C5.79086 12 4 10.2091 4 8V4Z"
          className="fill-current text-primary/80"
          fillOpacity="0.8"
        />
        <path
          d="M4 12V20H20V12L12 16L4 12Z"
          className="fill-current"
        />
      </svg>
      <span className="text-xl font-bold">UNI-VERX</span>
    </div>
  );
}
