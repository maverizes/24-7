import { Icon } from "./icon";

/**
 * Obyekt fotosi.
 *
 * Haqiqiy rasm URL'i bo'lsa — `next/image` orqali (lazy, responsive, WebP).
 * Hozircha seed'da URL yo'q, shuning uchun nom asosida deterministik
 * gradient placeholder chiziladi: SSR va klientda bir xil natija beradi.
 */

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

export function Photo({
  name,
  icon,
  className = "",
  iconClassName = "size-7",
  label,
}: {
  name: string;
  icon: string;
  className?: string;
  iconClassName?: string;
  label?: string;
}) {
  const seed = hash(name);
  const hue = seed % 360;
  const second = (hue + 38) % 360;

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-canvas ${className}`}
      style={{
        backgroundImage: `linear-gradient(135deg, hsl(${hue} 32% 88%), hsl(${second} 28% 78%))`,
      }}
      role="img"
      aria-label={label ?? name}
    >
      <Icon name={icon} className={`${iconClassName} text-ink/35`} strokeWidth={1.5} />
    </div>
  );
}
