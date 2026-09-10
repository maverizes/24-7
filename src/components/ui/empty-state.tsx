import Link from "next/link";
import { Icon } from "./icon";

/** Bo'sh holat (TZ 44) — har doim tushuntirish va keyingi qadam bilan. */
export function EmptyState({
  title,
  description,
  action,
  secondaryAction,
  icon = "search",
}: {
  title: string;
  description: string;
  action?: { href: string; label: string };
  secondaryAction?: { href: string; label: string };
  icon?: string;
}) {
  return (
    <div className="rounded-card border border-dashed border-line-strong bg-surface px-6 py-10 text-center">
      <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-canvas text-ink-subtle">
        <Icon name={icon} className="size-5" />
      </span>
      <h3 className="mt-3 font-semibold text-ink">{title}</h3>
      <p className="mx-auto mt-1 max-w-md text-sm text-ink-muted">{description}</p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {secondaryAction ? (
          <Link
            href={secondaryAction.href}
            className="inline-flex h-10 items-center rounded bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            {secondaryAction.label}
          </Link>
        ) : null}
        {action ? (
          <Link
            href={action.href}
            className={`inline-flex h-10 items-center rounded px-4 text-sm font-semibold ${
              secondaryAction
                ? "border border-line text-ink-muted hover:border-line-strong"
                : "bg-brand text-white hover:bg-brand-dark"
            }`}
          >
            {action.label}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
