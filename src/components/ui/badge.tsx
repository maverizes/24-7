import type { ReactNode } from "react";
import { Icon } from "./icon";

/**
 * Holat belgisi. Ma'no faqat rang orqali emas, matn (va ikonka) orqali ham
 * ifodalanadi — TZ 29 (accessibility) talabi.
 */

export type BadgeTone =
  | "open"
  | "closed"
  | "night"
  | "alert"
  | "award"
  | "brand"
  | "neutral"
  | "warn";

const TONE_CLASS: Record<BadgeTone, string> = {
  open: "bg-open-soft text-open",
  closed: "bg-closed-soft text-closed",
  night: "bg-night-soft text-night",
  alert: "bg-alert-soft text-alert",
  award: "bg-award-soft text-award",
  brand: "bg-brand-soft text-brand",
  neutral: "bg-canvas text-ink-muted",
  warn: "bg-award-soft text-award",
};

const SIZE_CLASS = {
  sm: "text-[11px] px-1.5 py-0.5 gap-1",
  md: "text-xs px-2 py-1 gap-1.5",
} as const;

export function Badge({
  tone = "neutral",
  icon,
  children,
  size = "md",
  className = "",
}: {
  tone?: BadgeTone;
  icon?: string;
  children: ReactNode;
  size?: keyof typeof SIZE_CLASS;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded font-medium whitespace-nowrap ${TONE_CLASS[tone]} ${SIZE_CLASS[size]} ${className}`}
    >
      {icon ? <Icon name={icon} className="size-3.5 shrink-0" /> : null}
      {children}
    </span>
  );
}
