import type { ObjectListItem } from "@/types/api";
import { ObjectCard, ObjectCardSkeleton } from "./object-card";

/** Kartochkalar to'ri — ro'yxat sahifasi va landing bloklari uchun. */
export function ObjectGrid({
  items,
  columns = 2,
  showDistance = true,
}: {
  items: ObjectListItem[];
  columns?: 1 | 2;
  showDistance?: boolean;
}) {
  return (
    <ul className={`grid gap-2 ${columns === 2 ? "lg:grid-cols-2" : ""}`}>
      {items.map((item) => (
        <li key={item.id}>
          <ObjectCard item={item} showDistance={showDistance} />
        </li>
      ))}
    </ul>
  );
}

export function ObjectGridSkeleton({ count = 6, columns = 2 }: { count?: number; columns?: 1 | 2 }) {
  return (
    <div className={`grid gap-2 ${columns === 2 ? "lg:grid-cols-2" : ""}`} aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <ObjectCardSkeleton key={index} />
      ))}
    </div>
  );
}
