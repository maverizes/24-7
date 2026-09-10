import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "./icon";

/** Bosh sahifa va landing sahifalar uchun yagona bo'lim sarlavhasi. */
export function Section({
  title,
  subtitle,
  action,
  children,
  tone = "default",
  id,
}: {
  title: string;
  subtitle?: string;
  action?: { href: string; label: string };
  children: ReactNode;
  tone?: "default" | "alert";
  id?: string;
}) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-4 py-5" aria-labelledby={id}>
      <div className="mb-3 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h2
            className={`text-base font-semibold sm:text-lg ${
              tone === "alert" ? "text-alert" : "text-ink"
            }`}
          >
            {title}
          </h2>
          {subtitle ? <p className="mt-0.5 text-sm text-ink-muted">{subtitle}</p> : null}
        </div>
        {action ? (
          <Link
            href={action.href}
            className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-brand hover:underline"
          >
            {action.label}
            <Icon name="chevron-right" className="size-4" />
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}
