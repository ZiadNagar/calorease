"use client";

import { cn } from "@/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface InfoTooltipProps {
  content: string;
  className?: string;
  side?: "top" | "bottom" | "left" | "right";
  size?: "sm" | "default";
  ariaLabel?: string;
}

const SIZE_STYLES = {
  sm: {
    button: "w-9 h-9 ml-0.5",
    icon: "w-2.5 h-2.5",
  },
  default: {
    button: "w-10 h-10 ml-1",
    icon: "w-3 h-3",
  },
} as const;

/**
 * InfoTooltip - An info icon that shows a tooltip on hover
 * Use this to explain technical terms like BMR, TDEE, BMI
 */
export const InfoTooltip = ({
  content,
  className,
  side = "top",
  size = "default",
  ariaLabel = "More information",
}: InfoTooltipProps) => {
  const sizeStyle = SIZE_STYLES[size];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
            sizeStyle.button,
            className
          )}
          aria-label={ariaLabel}
        >
          <svg
            className={sizeStyle.icon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
        </button>
      </TooltipTrigger>
      <TooltipContent side={side} className="max-w-70">
        <p className="text-sm leading-relaxed">{content}</p>
      </TooltipContent>
    </Tooltip>
  );
};
